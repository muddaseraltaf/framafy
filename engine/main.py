from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os

from puzzle.utils import generate_job_id, get_output_dir
from puzzle.generator import process_image

app = FastAPI(title="Reveal Your Photo Puzzle API")

# Configure CORS
allowed_origins_str = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount outputs directory for static file serving
output_dir = get_output_dir()
os.makedirs(output_dir, exist_ok=True)
app.mount("/outputs", StaticFiles(directory=output_dir), name="outputs")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/generate")
async def generate_puzzle(
    image: UploadFile = File(...),

    title: str = Form("Reveal Your Photo Puzzle"),
    subtitle: str = Form(""),
    orientation: str = Form("portrait")
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        
    try:
        # Read image data
        image_bytes = await image.read()
        
        # Initialize job
        job_id = generate_job_id()
        
        # Process image and generate assets
        from PIL import UnidentifiedImageError
        try:
            result = process_image(
                job_id=job_id,
                image_bytes=image_bytes,
                title=title,
                subtitle=subtitle,
                orientation=orientation
            )
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Unsupported image format. Please upload a standard JPG, PNG, or WEBP file.")
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during puzzle generation.")

import stripe
from fastapi import Request, BackgroundTasks
from email_sender import send_puzzle_email

@app.post("/api/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks):
    from dotenv import load_dotenv
    load_dotenv()
    
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    stripe.api_key = os.getenv("STRIPE_API_KEY")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    if not webhook_secret or not stripe.api_key:
        print("Webhook called but Stripe keys are missing from .env")
        return {"status": "unconfigured"}
        
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        print("Invalid webhook payload")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        print("Invalid webhook signature")
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        job_id = session.get("metadata", {}).get("job_id")
        customer_email = session.get("customer_details", {}).get("email")
        customer_name = session.get("customer_details", {}).get("name")
        
        print(f"Payment successful for job {job_id} ({customer_email})")
        
        if job_id and customer_email:
            background_tasks.add_task(
                send_puzzle_email,
                job_id=job_id,
                customer_email=customer_email,
                customer_name=customer_name
            )
            
    return {"status": "success"}

from pydantic import BaseModel

class EmailRequest(BaseModel):
    job_id: str
    email: str

@app.post("/api/resend_email")
async def manual_send_email(req: EmailRequest):
    """ Developer endpoint to test email delivery synchronously without Stripe payment """
    import logging
    from email_sender import send_puzzle_email
    
    success = await send_puzzle_email(
        job_id=req.job_id,
        customer_email=req.email,
        customer_name="Test User"
    )
    
    if success:
        return {"status": "success"}
    else:
        raise HTTPException(status_code=500, detail="SMTP Connection Failed - Check server logs")


# ==========================================
# AR Balloon Feature API Endpoints
# ==========================================
import qrcode
from typing import List

@app.post("/api/ar/upload")
async def ar_upload(
    photos: List[UploadFile] = File(...),
    frontend_url: str = Form("https://pictoru.com")
):
    """
    Accepts 1-10 photos, saves them to a public output directory,
    and intelligently generates a QR code redirecting the physical mobile client
    to the 3D WebAR viewer experience.
    """
    try:
        from puzzle.utils import generate_job_id
        ar_id = f"ar_{generate_job_id()}"
        ar_dir = os.path.join(output_dir, ar_id)
        os.makedirs(ar_dir, exist_ok=True)
        
        photo_urls = []
        for i, photo in enumerate(photos):
            if not photo.content_type.startswith("image/"):
                continue
            ext = photo.filename.split('.')[-1]
            safe_name = f"photo_{i}.{ext}"
            file_path = os.path.join(ar_dir, safe_name)
            
            with open(file_path, "wb") as f:
                f.write(await photo.read())
            
            photo_urls.append(f"/outputs/{ar_id}/{safe_name}")
            
        if not photo_urls:
            raise HTTPException(status_code=400, detail="No valid images uploaded.")
            
        # Create precisely targeted physical trigger marker
        target_link = f"{frontend_url.rstrip('/')}/ar/view/{ar_id}"
        
        qr = qrcode.QRCode(version=2, box_size=12, border=2)
        qr.add_data(target_link)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        qr_path = os.path.join(ar_dir, "qrcode.png")
        img.save(qr_path)
        
        # Manifest for the A-Frame Client
        import json
        with open(os.path.join(ar_dir, "manifest.json"), "w") as f:
            json.dump({
                "photos": photo_urls, 
                "qr_url": f"/outputs/{ar_id}/qrcode.png", 
                "target_link": target_link
            }, f)
            
        return {
            "ar_id": ar_id, 
            "qr_url": f"/outputs/{ar_id}/qrcode.png", 
            "photos": photo_urls,
            "target_link": target_link
        }
        
    except Exception as e:
        print(f"Error in AR upload mapping: {e}")
        raise HTTPException(status_code=500, detail="Error generating AR artifact mappings.")
