from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os

def create_puzzle_pdf(
    pdf_path: str,
    title: str,
    subtitle: str,
    guide_img_path: str,
    puzzle_main_path: str,
    puzzle_half_path: str,
    puzzle_empty_path: str
):
    """
    Creates an A4 PDF containing the puzzle layouts across 4 pages.
    """
    width, height = A4
    c = canvas.Canvas(pdf_path, pagesize=A4)
    
    def draw_grid_page(img_path):
        # The grid images should have maximum real estate since text is removed
        c.drawImage(
            img_path,
            0.5 * inch, 0.5 * inch,
            width=width - 1 * inch,
            height=height - 1 * inch, # Increased height since title is gone
            preserveAspectRatio=True,
            anchor='c' # center
        )
        c.showPage()
    
    # --- PAGE 1: TITLE & MAIN GRID ---
    draw_grid_page(puzzle_main_path)
    
    # --- PAGE 2: HALF SIZE GRID ---
    draw_grid_page(puzzle_half_path)
    
    # --- PAGE 3: INSTRUCTIONS & GUIDE ---
    c.setFont("Helvetica", 14)
    # Print the subtitle acting as instructions here if provided, else fallback
    c.drawCentredString(width / 2.0, height - 2 * inch, subtitle or "Color in the grid using the pattern guide to reveal the picture!")
    
    # Pattern Guide Image
    guide_w, guide_h = 400, 60
    c.drawImage(
        guide_img_path, 
        (width - guide_w) / 2.0, height - 3.5 * inch, 
        width=guide_w, height=guide_h, 
        preserveAspectRatio=True
    )
    
    c.showPage()
    
    # --- PAGE 4: EMPTY GRID ---
    draw_grid_page(puzzle_empty_path)
    
    c.save()
    
    return pdf_path
