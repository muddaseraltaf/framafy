from PIL import Image, ImageDraw, ImageFont
import os

def render_pattern_cell(level: int, cell_size: int, show_number: bool = False, number: int = None, is_blueprint: bool = False) -> Image.Image:
    """
    Renders a single cell based on the pattern level (1-6).
    1 = blank
    2 = dots (single dot in center)
    3 = diagonal lines /
    4 = cross hatch X
    5 = dense star/asterisk (X + +)
    6 = solid fill
    """
    img = Image.new("L", (cell_size, cell_size), color=255)
    draw = ImageDraw.Draw(img)
    
    # Define line thickness
    thickness = max(1, int(cell_size * 0.15)) # Thicker lines for crisp print
    
    if level == 6:
        # Solid fill
        draw.rectangle([0, 0, cell_size, cell_size], fill=0)
    elif level == 5:
        # Asterisk (X cross + Plus cross)
        draw.line([(0, 0), (cell_size, cell_size)], fill=0, width=thickness)
        draw.line([(0, cell_size), (cell_size, 0)], fill=0, width=thickness)
        draw.line([(cell_size // 2, 0), (cell_size // 2, cell_size)], fill=0, width=thickness)
        draw.line([(0, cell_size // 2), (cell_size, cell_size // 2)], fill=0, width=thickness)
    elif level == 4:
        # Single clean X cross
        draw.line([(0, 0), (cell_size, cell_size)], fill=0, width=thickness)
        draw.line([(0, cell_size), (cell_size, 0)], fill=0, width=thickness)
    elif level == 3:
        # Single clean diagonal line
        draw.line([(0, cell_size), (cell_size, 0)], fill=0, width=thickness)
    elif level == 2:
        # Very small, crisp dot in the center
        dot_radius = max(1, int(cell_size * 0.1)) # Small radius
        cx, cy = cell_size // 2, cell_size // 2
        dot_color = 210 if is_blueprint else 0
        draw.ellipse([cx - dot_radius, cy - dot_radius, cx + dot_radius, cy + dot_radius], fill=dot_color)
    elif level == 1:
        # Blank
        pass
        
    # Draw a thin border on all cells so the grid is visible on paper
    draw.rectangle([0, 0, cell_size - 1, cell_size - 1], outline=180, width=1)
    
    if show_number and number is not None:
        text_color = 255 if level == 6 else 210
        
        # Dynamically scale font to 60% of the cell height
        font_size = max(10, int(cell_size * 0.6))
        try:
            # Try loading a standard Ubuntu scalable font (for the VPS)
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except IOError:
            try:
                # Try loading standard Windows/Mac Arial font (for local dev)
                font = ImageFont.truetype("Arial.ttf", font_size)
            except IOError:
                # Absolute fallback (will be tiny, but prevents crashing)
                font = ImageFont.load_default()
                
        # Draw number slightly offset to fit within cell geometry
        offset = int(cell_size * 0.1)
        draw.text((offset, offset), str(number), fill=text_color, font=font)
        
    return img

def render_guide(cell_size: int = 40) -> Image.Image:
    """Renders the pattern guide showing the 4 complex patterns mapped to 1-4, plus the pre-printed dot."""
    width = cell_size * 5 + 60 # 5 cells + spacing
    height = cell_size + 30
    img = Image.new("RGB", (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    x_offset = 10
    y_offset = 10
    
    # Setup scalable TTF font for guide labels
    font_size = max(10, int(cell_size * 0.4))
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except IOError:
        try:
            font = ImageFont.truetype("Arial.ttf", font_size)
        except IOError:
            font = ImageFont.load_default()
            
    # 1. Draw the Target 'Dot' example first (Answer format, so it is black)
    dot_cell = render_pattern_cell(2, cell_size, is_blueprint=False)
    img.paste(dot_cell, (x_offset, y_offset))
    draw.text((x_offset + cell_size // 2 - int(font_size*0.3), y_offset + cell_size + 2), "•", fill=(0,0,0), font=font)
    x_offset += cell_size + 10
    
    # 2. Draw the 4 numbered patterns
    # Map printed blueprint number -> rendering pattern level
    mapping = [(1, 3), (2, 4), (3, 5), (4, 6)]
    
    for num, level in mapping:
        cell_img = render_pattern_cell(level, cell_size)
        img.paste(cell_img, (x_offset, y_offset))
        draw.text((x_offset + cell_size // 2 - int(font_size*0.3), y_offset + cell_size + 2), str(num), fill=(0,0,0), font=font)
        x_offset += cell_size + 10
        
    return img

def render_circle_cell(brightness: int, cell_size: int, outline_only: bool = False) -> Image.Image:
    """
    Renders a cell for the Halftone Dotz style.
    Accepts raw brightness (0-255) to map continuous sizes, bypassing rigid 6-tier architecture.
    """
    img = Image.new("L", (cell_size, cell_size), color=255)
    draw = ImageDraw.Draw(img)
    
    # Invert brightness: 0 (black) -> max radius. 255 (white) -> min radius.
    factor = 1.0 - (brightness / 255.0)
    
    # Apply exponential curve to dramatically intensify dark/light separation variance
    factor = factor ** 1.5 
    
    # Only render if enough ink mass is detected
    if factor > 0.05:
        max_radius = (cell_size / 2.0) * 0.95
        # Ensure a minimum footprint of 1 pixel width
        radius = max(1, int(max_radius * factor))
        
        cx, cy = cell_size // 2, cell_size // 2
        
        if outline_only:
            # Draw a faint gray outline for the user to fill in with their marker
            draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], outline=180, width=1)
        else:
            # Draw the solid filled circle
            draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=0)
            
    return img

def render_circle_guide(cell_size: int = 40) -> Image.Image:
    """Renders the pattern guide showing all 6 levels for circles."""
    width = cell_size * 6 + 50
    height = cell_size + 20
    img = Image.new("RGB", (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    x_offset = 10
    y_offset = 10
    
    for level in range(1, 7):
        cell_img = render_circle_cell(level, cell_size)
        img.paste(cell_img, (x_offset, y_offset))
        draw.text((x_offset + cell_size // 2 - 5, y_offset + cell_size + 2), str(level), fill=(0,0,0))
        x_offset += cell_size + 5
        
    return img
