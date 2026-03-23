import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

async def send_puzzle_email(
    job_id: str,
    customer_email: str,
    customer_name: str = None
) -> bool:
    """
    Sends an email to the customer with their puzzle files attached via standard SMTP protocol.
    """
    load_dotenv()
    
    # We repurpose the .env token as the SMTP password
    smtp_password = os.getenv("BREVO_API_KEY")
    smtp_login = "a42c5f001@smtp-brevo.com"
    smtp_server = "smtp-relay.brevo.com"
    smtp_port = 587
    
    if not smtp_password:
        logger.error("BREVO_API_KEY (SMTP Password) is not set. Cannot send email.")
        return False
        
    job_dir = os.path.join(os.getenv("OUTPUT_DIR", "outputs"), job_id)
    pdf_path = os.path.join(job_dir, "puzzle.pdf")
    answer_path = os.path.join(job_dir, "answer_key.png")
    
    if not os.path.exists(pdf_path) or not os.path.exists(answer_path):
        logger.error(f"Cannot send email. Files missing for job: {job_id}")
        return False
        
    msg = MIMEMultipart()
    
    # It is recommended to include the display name alongside the email address
    msg['From'] = "Pictoru <hello@pictoru.com>"
    msg['To'] = f"{customer_name} <{customer_email}>" if customer_name else customer_email
    msg['Subject'] = "Your Custom Photo Puzzle is Ready! 🧩"

    download_link = f"https://www.pictoru.com/result/{job_id}?success=true"
    name_greeting = f"Hi {customer_name}," if customer_name else "Hi there,"

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #000;">Your Custom Photo Puzzle is Ready! 🧩</h2>
            <p>{name_greeting}</p>
            <p>Thank you for your purchase! We've successfully generated your custom 2-in-1 blueprint package.</p>
            <p>You will find your 5-page printable PDF and your Master Answer Key attached directly to this email for safekeeping.</p>
            
            <div style="margin: 30px 0; text-align: center;">
                <a href="{download_link}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    View on Web Dashboard
                </a>
            </div>
            
            <p style="font-size: 13px; color: #666; margin-top: 40px;">
                If you have any questions or need help printing, just reply to this email!<br>
                — The Pictoru Team
            </p>
        </div>
      </body>
    </html>
    """
    
    msg.attach(MIMEText(html_content, 'html'))
    
    try:
        # Construct PDF Attachment
        with open(pdf_path, "rb") as f:
            pdf_attach = MIMEApplication(f.read(), _subtype="pdf")
            pdf_attach.add_header('Content-Disposition', 'attachment', filename="Pictoru_Blueprint.pdf")
            msg.attach(pdf_attach)
            
        # Construct Answer Key Attachment
        with open(answer_path, "rb") as f:
            ans_attach = MIMEApplication(f.read(), _subtype="png")
            ans_attach.add_header('Content-Disposition', 'attachment', filename="Pictoru_AnswerKey.png")
            msg.attach(ans_attach)
            
    except Exception as e:
        logger.error(f"Failed to read attachment files for job {job_id}: {e}")
        return False

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_login, smtp_password)
        server.send_message(msg)
        server.quit()
        logger.info(f"Email successfully dispatched via SMTP to {customer_email} for job {job_id}")
        return True
    except Exception as e:
        logger.error(f"SMTP verification/transmission error transmitting to {customer_email}: {e}")
        return False
