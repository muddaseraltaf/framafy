import cv2
import numpy as np
from PIL import Image
import os

from puzzle.utils import get_job_dir
from puzzle.pattern_renderer import render_pattern_cell, render_guide, render_circle_cell, render_circle_guide
from puzzle.pdf_export import create_puzzle_pdf

GRID_SIZES = {
    "easy": (30, 40),     # Tripled easy from 15x20
    "medium": (45, 60),   # 50% larger than old detailed
    "detailed": (75, 100) # Highly detailed, requires thin markers
}

def get_level_from_brightness(brightness: float) -> int:
    # Skewed token mapping to preserve light details.
    # Level 1 (Blank) is reserved strictly for very bright/pure white areas.
    if brightness < 60: return 6  # Solid block
    if brightness < 110: return 5 # Star
    if brightness < 160: return 4 # X cross
    if brightness < 200: return 3 # Diagonal
    if brightness < 240: return 2 # Dot
    return 1                      # White

def process_image(job_id: str, image_bytes: bytes, grid_size: str, title: str, subtitle: str, orientation: str = "portrait", style: str = "pattern") -> dict:
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
            
    # Apply light Gaussian Blur to reduce noise before downsampling
    blurred = cv2.GaussianBlur(gray_cropped, (5, 5), 0)

    # Simple Contrast Stretching (Normalization) to span exactly 0-255 without adding artificial local noise
    enhanced_gray = cv2.normalize(blurred, None, 0, 255, cv2.NORM_MINMAX)
        
    # Helper to generate given modes for a specific resolution
    def generate_grid_images(img_gray, c, r, c_size, make_answer=False, make_puzzle=True, make_empty=False):
        s_gray = cv2.resize(img_gray, (c, r), interpolation=cv2.INTER_AREA)
        lvl_grid = np.zeros_like(s_gray, dtype=np.uint8)
        for y in range(r):
            for x in range(c):
                lvl_grid[y, x] = get_level_from_brightness(s_gray[y, x])
                
        ans_img = Image.new("L", (c * c_size, r * c_size), color=255) if make_answer else None
        puz_img = Image.new("L", (c * c_size, r * c_size), color=255) if make_puzzle else None
        emp_img = Image.new("L", (c * c_size, r * c_size), color=255) if make_empty else None
        
        if style == "circles":
            a_cache = {l: render_circle_cell(l, c_size, outline_only=False) for l in range(1, 7)}
            p_cache = {l: render_circle_cell(l, c_size, outline_only=True) for l in range(1, 7)}
            e_cache = {l: render_circle_cell(1, c_size, outline_only=False) for l in range(1, 7)}
        else:
            a_cache = {l: render_pattern_cell(l, c_size, show_number=False) for l in range(1, 7)}
            p_cache = {l: render_pattern_cell(1, c_size, show_number=True, number=l) for l in range(1, 7)}
            e_cache = {l: render_pattern_cell(1, c_size, show_number=False) for l in range(1, 7)}
        
        for y in range(r):
            for x in range(c):
                val = lvl_grid[y, x]
                if make_answer: ans_img.paste(a_cache[val], (x * c_size, y * c_size))
                if make_puzzle: puz_img.paste(p_cache[val], (x * c_size, y * c_size))
                if make_empty: emp_img.paste(e_cache[val], (x * c_size, y * c_size))
                
        return ans_img, puz_img, emp_img

    cell_size = 20 if grid_size == "easy" else (15 if grid_size == "medium" else 10)
    
    # 1. Main Grid (Answer, Puzzle, Empty)
    ans_img, puz_main_img, puz_empty_img = generate_grid_images(
        enhanced_gray, cols, rows, cell_size, 
        make_answer=True, make_puzzle=True, make_empty=True
    )
    
    # 2. Half Grid (Puzzle only)
    half_cell_size = cell_size * 2
    half_cols, half_rows = max(1, cols // 2), max(1, rows // 2)
    _, puz_half_img, _ = generate_grid_images(
        enhanced_gray, half_cols, half_rows, half_cell_size,
        make_answer=False, make_puzzle=True, make_empty=False
    )
    
    # 3. Apply Watermarks to Previews to prevent free download
    from PIL import ImageDraw
    def apply_watermark(img):
        watermarked = img.copy()
        draw = ImageDraw.Draw(watermarked)
        w_img, h_img = img.size
        for i in range(-h_img, w_img, 250):
            draw.line([(i, 0), (i+h_img, h_img)], fill=230, width=5)
            draw.line([(i, h_img), (i+h_img, 0)], fill=230, width=5)
        return watermarked

    puz_main_img = apply_watermark(puz_main_img)
    puz_half_img = apply_watermark(puz_half_img)
    
    # Save PNGs
    answer_path = os.path.join(job_dir, "answer.png")
    puzzle_main_path = os.path.join(job_dir, "preview.png")
    puzzle_half_path = os.path.join(job_dir, "preview_half.png")
    puzzle_empty_path = os.path.join(job_dir, "preview_empty.png")
    
    ans_img.save(answer_path)
    puz_main_img.save(puzzle_main_path)
    puz_half_img.save(puzzle_half_path)
    puz_empty_img.save(puzzle_empty_path)
    
    # Generate Guide Image
    guide_img = render_circle_guide() if style == "circles" else render_guide()
    guide_path = os.path.join(job_dir, "guide.png")
    guide_img.save(guide_path)
    
    # Generate 4-Page PDF
    pdf_path = os.path.join(job_dir, "puzzle.pdf")
    create_puzzle_pdf(
        pdf_path=pdf_path,
        title=title,
        subtitle=subtitle,
        guide_img_path=guide_path,
        puzzle_main_path=puzzle_main_path,
        puzzle_half_path=puzzle_half_path,
        puzzle_empty_path=puzzle_empty_path
    )
    
    # Make URLs relative to outputs directory mounted in server
    return {
        "job_id": job_id,
        "preview_url": f"/outputs/{job_id}/preview.png",
        "answer_url": f"/outputs/{job_id}/answer.png",
        "pdf_url": f"/outputs/{job_id}/puzzle.pdf"
    }
