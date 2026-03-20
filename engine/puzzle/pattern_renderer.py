from PIL import Image, ImageDraw
import os

def render_pattern_cell(level: int, cell_size: int, show_number: bool = False, number: int = None) -> Image.Image:
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
        draw.ellipse([cx - dot_radius, cy - dot_radius, cx + dot_radius, cy + dot_radius], fill=0)
    elif level == 1:
        # Blank
        pass
        
    # Draw a thin border on all cells so the grid is visible on paper
    draw.rectangle([0, 0, cell_size - 1, cell_size - 1], outline=180, width=1)
    
    if show_number and number is not None:
        text_color = 255 if level == 6 else 210
        # Draw number slightly offset
        draw.text((2, 2), str(number), fill=text_color)
        
    return img

def render_guide(cell_size: int = 40) -> Image.Image:
    """Renders the pattern guide showing all 6 levels."""
    width = cell_size * 6 + 50 # 6 cells + spacing
    height = cell_size + 20
    img = Image.new("RGB", (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    x_offset = 10
    y_offset = 10
    
    for level in range(1, 7):
        cell_img = render_pattern_cell(level, cell_size)
        img.paste(cell_img, (x_offset, y_offset))
        draw.text((x_offset + cell_size // 2 - 5, y_offset + cell_size + 2), str(level), fill=(0,0,0))
        x_offset += cell_size + 5
        
    return img

def render_circle_cell(level: int, cell_size: int, outline_only: bool = False) -> Image.Image:
    """
    Renders a cell for the Halftone Dotz style.
    Level 1 = Blank, Level 2 = Tiny dot, Level 6 = Solid dot
    """
    img = Image.new("L", (cell_size, cell_size), color=255)
    draw = ImageDraw.Draw(img)
    
    if level > 1:
        factor = (level - 1) / 5.0 # 0.2 to 1.0
        max_radius = (cell_size / 2.0) * 0.95
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
