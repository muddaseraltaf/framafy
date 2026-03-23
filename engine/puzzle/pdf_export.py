from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os

def create_puzzle_pdf(
    pdf_path: str,
    title: str,
    subtitle: str,
    guide_pattern_path: str,
    guide_circle_path: str,
    blueprint_pattern_path: str,
    blueprint_circle_path: str,
    blueprint_half_path: str,
    blueprint_empty_path: str
):
    """
    Creates an A4 PDF containing the ultimate puzzle bundle.
    Page 1: Unified Guide
    Page 2: Pattern Blueprint
    Page 3: Halftone Blueprint
    Page 4: Simpler Pattern Blueprint (Half-Res)
    Page 5: Empty Grid Outline
    """
    width, height = A4
    c = canvas.Canvas(pdf_path, pagesize=A4)
    
    def draw_grid_page(img_path):
        if not os.path.exists(img_path): return
        c.drawImage(
            img_path,
            0.5 * inch, 0.5 * inch,
            width=width - 1 * inch,
            height=height - 1 * inch,
            preserveAspectRatio=True,
            anchor='c'
        )
        c.showPage()
    
    # --- PAGE 1: INSTRUCTIONS & DUAL GUIDE ---
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2.0, height - 1.5 * inch, title)
    
    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2.0, height - 2 * inch, subtitle or "The ultimate custom photo puzzle package.")
    
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2.0, height - 3 * inch, "Choose your favorite style or challenge yourself with the simpler grid!")
    
    # Pattern Guide Image
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2.0, height - 4.5 * inch, "Style 1: Classic Patterns")
    c.setFont("Helvetica", 11)
    c.drawCentredString(width / 2.0, height - 4.8 * inch, "Draw the shape assigned to the number in the grid.")
    c.drawImage(guide_pattern_path, (width - 350) / 2.0, height - 6 * inch, width=350, height=50, preserveAspectRatio=True)
    
    # Circle Guide Image
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2.0, height - 7.5 * inch, "Style 2: Halftone Circles")
    c.setFont("Helvetica", 11)
    c.drawCentredString(width / 2.0, height - 7.8 * inch, "Simply trace or color inside the faint circle outlines.")
    c.drawImage(guide_circle_path, (width - 350) / 2.0, height - 9 * inch, width=350, height=50, preserveAspectRatio=True)
    
    c.showPage()
    
    # --- PAGE 2, 3, 4, 5: BLUEPRINTS ---
    draw_grid_page(blueprint_pattern_path)
    draw_grid_page(blueprint_circle_path)
    draw_grid_page(blueprint_half_path)
    draw_grid_page(blueprint_empty_path)
    
    c.save()
    return pdf_path
