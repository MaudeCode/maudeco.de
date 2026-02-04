#!/usr/bin/env python3
"""
Generate OpenGraph images for maudeco.de blog posts.

Usage:
    uv run scripts/generate-og-image.py --title "My Blog Post Title" --output public/blog/my-post-og.png
    
    # Or for the default site image:
    uv run scripts/generate-og-image.py --default --output public/og-image.png
"""

import argparse
import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.dirname(SCRIPT_DIR)
BASE_IMAGE = os.path.join(REPO_DIR, "public", "og-template.png")

# Design constants
OG_WIDTH, OG_HEIGHT = 1200, 630
BROWN = (93, 64, 55)  # Dark brown matching cow outlines
FONT_PATH = "/System/Library/Fonts/Supplemental/MarkerFelt.ttc"

# Text area (right side, after the cow)
TEXT_AREA_START_X = 450
TEXT_AREA_END_X = 1150
TEXT_AREA_WIDTH = TEXT_AREA_END_X - TEXT_AREA_START_X


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int, draw: ImageDraw.Draw) -> list[str]:
    """Wrap text to fit within max_width."""
    words = text.split()
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    
    if current_line:
        lines.append(' '.join(current_line))
    
    return lines


def generate_og_image(
    title: str,
    subtitle: str | None = None,
    output_path: str = "og-image.png",
) -> str:
    """Generate an OG image with the given title and optional subtitle."""
    
    # Load base template
    if os.path.exists(BASE_IMAGE):
        img = Image.open(BASE_IMAGE).convert('RGBA')
    else:
        raise FileNotFoundError(f"Base template not found: {BASE_IMAGE}")
    
    # Ensure correct dimensions
    if img.size != (OG_WIDTH, OG_HEIGHT):
        img = img.resize((OG_WIDTH, OG_HEIGHT), Image.LANCZOS)
    
    draw = ImageDraw.Draw(img)
    
    # Load fonts
    title_font = ImageFont.truetype(FONT_PATH, 64)
    subtitle_font = ImageFont.truetype(FONT_PATH, 32)
    
    # Wrap title text
    title_lines = wrap_text(title, title_font, TEXT_AREA_WIDTH, draw)
    
    # Calculate title height
    line_height = 70  # Approximate line height for title
    title_block_height = len(title_lines) * line_height
    
    # Calculate vertical positioning (center in image)
    total_height = title_block_height
    if subtitle:
        total_height += 50 + 40  # Gap + subtitle height
    
    start_y = (OG_HEIGHT - total_height) // 2
    
    # Draw title lines
    current_y = start_y
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        line_width = bbox[2] - bbox[0]
        x = TEXT_AREA_START_X + (TEXT_AREA_WIDTH - line_width) // 2
        draw.text((x, current_y), line, font=title_font, fill=BROWN)
        current_y += line_height
    
    # Draw subtitle if provided
    if subtitle:
        current_y += 20  # Gap between title and subtitle
        bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        subtitle_width = bbox[2] - bbox[0]
        x = TEXT_AREA_START_X + (TEXT_AREA_WIDTH - subtitle_width) // 2
        draw.text((x, current_y), subtitle, font=subtitle_font, fill=BROWN)
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    # Save
    img.save(output_path)
    print(f"Generated: {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Generate OG images for maudeco.de")
    parser.add_argument("--title", "-t", help="Blog post title")
    parser.add_argument("--subtitle", "-s", help="Optional subtitle")
    parser.add_argument("--output", "-o", default="og-image.png", help="Output path")
    parser.add_argument("--default", action="store_true", help="Generate default site OG image")
    
    args = parser.parse_args()
    
    if args.default:
        generate_og_image(
            title="Maude Code",
            subtitle="Your friendly digital cow assistant",
            output_path=args.output,
        )
    elif args.title:
        generate_og_image(
            title=args.title,
            subtitle=args.subtitle,
            output_path=args.output,
        )
    else:
        parser.error("Either --title or --default is required")


if __name__ == "__main__":
    main()
