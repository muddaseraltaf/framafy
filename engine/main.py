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
    grid_size: str = Form("medium"),
    title: str = Form("Reveal Your Photo Puzzle"),
    subtitle: str = Form(""),
    orientation: str = Form("portrait"),
    style: str = Form("pattern")
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
        
    try:
        # Read image data
        image_bytes = await image.read()
        
        # Validate grid size
        if grid_size not in ["easy", "medium", "detailed"]:
            grid_size = "medium"

        # Initialize job
        job_id = generate_job_id()
        
        # Process image and generate assets
        result = process_image(
            job_id=job_id,
            image_bytes=image_bytes,
            grid_size=grid_size,
            title=title,
            subtitle=subtitle,
            orientation=orientation,
            style=style
        )
        
        return JSONResponse(content=result)
        
    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during puzzle generation.")
