import cv2
import numpy as np
from PIL import Image
import os

from puzzle.utils import get_job_dir
from puzzle.pattern_renderer import render_pattern_cell, render_guide, render_circle_cell, render_circle_guide
from puzzle.pdf_export import create_puzzle_pdf

GRID_SIZES = {
    "easy": (60, 80),     # Baseline bumped for minimal facial geometry boundaries
    "medium": (90, 120),  # Standard tier elevated to previous detailed tier
    "detailed": (120, 160) # Premier tier (19,200 elements) to aggressively rival competitor definition
}

def get_level_from_brightness(brightness: float) -> int:
    # Evenly distributed mapping to preserve mid-tone skin details.
    if brightness < 40: return 6  # Solid block (Strictly for pitch black)
    if brightness < 90: return 5  # Star
    if brightness < 140: return 4 # X cross
    if brightness < 190: return 3 # Diagonal
    if brightness < 230: return 2 # Dot
    return 1                      # White

def process_image(job_id: str, image_bytes: bytes, title: str, subtitle: str, orientation: str = "portrait") -> dict:
    grid_size = "detailed"
    job_dir = get_job_dir(job_id)
    
    from io import BytesIO
    from PIL import ImageOps
    
    # Decode image securely using PIL to handle various formats (WebP, RGBA) and EXIF rotations
    try:
        pil_img = Image.open(BytesIO(image_bytes))
        pil_img = ImageOps.exif_transpose(pil_img) # Fix mobile orientation
        
        # Handle transparency by placing a white background behind the image
        if pil_img.mode in ('RGBA', 'LA') or (pil_img.mode == 'P' and 'transparency' in pil_img.info):
            alpha = pil_img.convert('RGBA').split()[-1]
            bg = Image.new("RGBA", pil_img.size, (255, 255, 255, 255))
            bg.paste(pil_img, mask=alpha)
            pil_img = bg.convert('RGB')
            
        pil_img = pil_img.convert("L")             # Convert directly to grayscale
        gray = np.array(pil_img)
    except Exception as e:
        raise ValueError(f"Failed to read image: {str(e)}")
    
    # Determine grid dimensions based on aspect ratio
    cols, rows = GRID_SIZES.get(grid_size, GRID_SIZES["medium"])
    if orientation == "landscape":
        cols, rows = rows, cols
    target_aspect = rows / cols
    
    # Instead of cropping, pad the image to fit the target aspect ratio
    h, w = gray.shape
    current_aspect = h / w
    
    if current_aspect > target_aspect:
        # Image is taller than target, so pad the width (left and right)
        new_w = int(h / target_aspect)
        pad_total = new_w - w
        pad_left = pad_total // 2
        pad_right = pad_total - pad_left
        gray_cropped = cv2.copyMakeBorder(gray, 0, 0, pad_left, pad_right, cv2.BORDER_CONSTANT, value=255)
    elif current_aspect < target_aspect:
        # Image is wider than target, so pad the height (top and bottom)
        new_h = int(w * target_aspect)
        pad_total = new_h - h
        pad_top = pad_total // 2
        pad_bottom = pad_total - pad_top
        gray_cropped = cv2.copyMakeBorder(gray, pad_top, pad_bottom, 0, 0, cv2.BORDER_CONSTANT, value=255)
    else:
        # Already perfectly scaled
        gray_cropped = gray
            
    # Apply light Gaussian Blur to reduce grain noise
    blurred = cv2.GaussianBlur(gray_cropped, (5, 5), 0)

    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to bring out facial mid-tones
    # This prevents dark areas (like beards/hair) from becoming giant solid black blobs
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_gray = clahe.apply(blurred)
    
    # Compress the histogram to eliminate pure white voids.
    # Scales [0, 255] down to [0, 220], forcing pure white backgrounds to hit threshold Level 2 (Dot)
    # instead of Level 1 (Empty), while proportionately darkening the rest of the photo for contrast.
    enhanced_gray = cv2.convertScaleAbs(enhanced_gray, alpha=(220.0/255.0), beta=0)
        
    def generate_grid_images(img_gray, c, r, c_size, mode_style, make_empty=False):
        s_gray = cv2.resize(img_gray, (c, r), interpolation=cv2.INTER_AREA)
        
        if mode_style == "circles":
            # Circles calculate radius continuously from raw brightness (0-255). No quantization needed.
            lvl_grid = np.zeros_like(s_gray, dtype=np.uint8)
        else:
            # Floyd-Steinberg Error Diffusion Dithering for Geometric Pattern blocks
            # Eliminates stark topographic block "banding" between transitions by dispersing quantization error.
            dither_gray = s_gray.copy().astype(float)
            lvl_grid = np.zeros_like(s_gray, dtype=np.uint8)
            
            # The ideal target brightness "centers" mapping to the 1-6 threshold tiers
            allowed_b = [0, 65, 115, 165, 210, 255]
            
            for y in range(r):
                for x in range(c):
                    old_pixel = dither_gray[y, x]
                    new_pixel = min(allowed_b, key=lambda val: abs(val - old_pixel))
                    dither_gray[y, x] = new_pixel
                    quant_error = old_pixel - new_pixel
                    
                    if x + 1 < c:
                        dither_gray[y, x + 1] += quant_error * 7 / 16
                    if y + 1 < r:
                        if x > 0:
                            dither_gray[y + 1, x - 1] += quant_error * 3 / 16
                        dither_gray[y + 1, x] += quant_error * 5 / 16
                        if x + 1 < c:
                            dither_gray[y + 1, x + 1] += quant_error * 1 / 16
                            
                    lvl_grid[y, x] = get_level_from_brightness(new_pixel)
                
        ans_img = Image.new("L", (c * c_size, r * c_size), color=255)
        puz_img = Image.new("L", (c * c_size, r * c_size), color=255)
        emp_img = Image.new("L", (c * c_size, r * c_size), color=255) if make_empty else None
        
        if mode_style == "circles":
            a_cache = {l: render_circle_cell(l, c_size, outline_only=False) for l in range(256)}
            p_cache = {l: render_circle_cell(l, c_size, outline_only=True) for l in range(256)}
        else:
            a_cache = {l: render_pattern_cell(l, c_size, show_number=False) for l in range(1, 7)}
            p_cache = {
                1: render_pattern_cell(1, c_size, show_number=False, is_blueprint=True),
                2: render_pattern_cell(2, c_size, show_number=False, is_blueprint=True),
                3: render_pattern_cell(1, c_size, show_number=True, number=1, is_blueprint=True),
                4: render_pattern_cell(1, c_size, show_number=True, number=2, is_blueprint=True),
                5: render_pattern_cell(1, c_size, show_number=True, number=3, is_blueprint=True),
                6: render_pattern_cell(1, c_size, show_number=True, number=4, is_blueprint=True),
            }
            if make_empty:
                e_cache = {l: render_pattern_cell(1, c_size, show_number=False) for l in range(1, 7)}
        
        for y in range(r):
            for x in range(c):
                # Circle Halftones bypass the rigid 6-step blueprint logic for absolute variance
                val = s_gray[y, x] if mode_style == "circles" else lvl_grid[y, x]
                
                ans_img.paste(a_cache[val], (x * c_size, y * c_size))
                puz_img.paste(p_cache[val], (x * c_size, y * c_size))
                if make_empty and mode_style == "pattern":
                    emp_img.paste(e_cache[val], (x * c_size, y * c_size))
                
        return ans_img, puz_img, emp_img

    # Supersampling Canvas Frame. Legacy sizes were severely bound (20, 15, 10). 
    # Raising to 40px grid baseline forces Python/Pillow to calculate circle radii with 
    # vastly expanded decimal precision, eliminating the 33% area-jump banding flaws.
    cell_size = 80 if grid_size == "easy" else (60 if grid_size == "medium" else 40)
    
    # 1. Main Grids for both styles
    ans_pattern, puz_pattern, puz_empty = generate_grid_images(enhanced_gray, cols, rows, cell_size, "pattern", make_empty=True)
    ans_circle, puz_circle, _ = generate_grid_images(enhanced_gray, cols, rows, cell_size, "circles")
    
    # 2. Half Grid Simpler Puzzle
    half_cell_size = cell_size * 2
    half_cols, half_rows = max(1, cols // 2), max(1, rows // 2)
    _, puz_half, _ = generate_grid_images(enhanced_gray, half_cols, half_rows, half_cell_size, "pattern")
    
    # 3. Save Pristine PNGs 
    puz_pat_path = os.path.join(job_dir, "puzzle_pattern.png")
    puz_cir_path = os.path.join(job_dir, "puzzle_circle.png")
    puz_half_path = os.path.join(job_dir, "puzzle_half.png")
    puz_empty_path = os.path.join(job_dir, "puzzle_empty.png")
    
    puz_pattern.save(puz_pat_path)
    puz_circle.save(puz_cir_path)
    puz_half.save(puz_half_path)
    puz_empty.save(puz_empty_path)
    
    # 3. Generate Guide Images
    guide_pat_path = os.path.join(job_dir, "guide_pattern.png")
    render_guide().save(guide_pat_path)
    guide_cir_path = os.path.join(job_dir, "guide_circle.png")
    render_circle_guide().save(guide_cir_path)
    
    # 5. Generate the Unified 5-Page PDF
    pdf_path = os.path.join(job_dir, "puzzle.pdf")
    create_puzzle_pdf(
        pdf_path=pdf_path,
        title=title,
        subtitle=subtitle,
        guide_pattern_path=guide_pat_path,
        guide_circle_path=guide_cir_path,
        blueprint_pattern_path=puz_pat_path,
        blueprint_circle_path=puz_cir_path,
        blueprint_half_path=puz_half_path,
        blueprint_empty_path=puz_empty_path
    )
    
    # 6. Generate Master Answer Key (Composite)
    w, h = ans_pattern.size
    composite = Image.new("L", (w * 2 + 40, h), color=255)
    composite.paste(ans_pattern, (0, 0))
    composite.paste(ans_circle, (w + 40, 0))
    
    answer_master_path = os.path.join(job_dir, "answer_key.png")
    composite.save(answer_master_path)
    
    from PIL import ImageDraw
    def apply_watermark(img):
        watermarked = img.copy()
        draw = ImageDraw.Draw(watermarked)
        w_img, h_img = img.size
        # Draw huge diagonal slash marks as watermark
        for i in range(-h_img, w_img, 350):
            draw.line([(i, 0), (i+h_img, h_img)], fill=230, width=5)
            draw.line([(i, h_img), (i+h_img, 0)], fill=230, width=5)
        return watermarked

    preview_web_path = os.path.join(job_dir, "preview_web.png")
    apply_watermark(composite).save(preview_web_path)
    
    return {
        "job_id": job_id,
        "preview_url": f"/outputs/{job_id}/preview_web.png",
        "answer_url": f"/outputs/{job_id}/answer_key.png",
        "pdf_url": f"/outputs/{job_id}/puzzle.pdf"
    }
