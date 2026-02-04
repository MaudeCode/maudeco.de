#!/usr/bin/env python3
"""
Generate OpenGraph images for maudeco.de blog posts.

Usage:
    uv run --with pillow scripts/generate-og-image.py --title "My Blog Post Title" --output public/blog/my-post-og.png
    
    # Or for the default site image:
    uv run --with pillow scripts/generate-og-image.py --default --output public/og-image.png
"""

import argparse
import os
import re
from PIL import Image, ImageDraw, ImageFont

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.dirname(SCRIPT_DIR)
BASE_IMAGE = os.path.join(REPO_DIR, "public", "og-template.png")

# Design constants
OG_WIDTH, OG_HEIGHT = 1200, 630
BROWN = (93, 64, 55)  # Dark brown matching cow outlines
FONT_PATH = "/System/Library/Fonts/Supplemental/MarkerFelt.ttc"

# Text area for post title (right side, after the cow)
TEXT_AREA_START_X = 500
TEXT_AREA_END_X = 1100  # More padding from right edge
TEXT_AREA_WIDTH = TEXT_AREA_END_X - TEXT_AREA_START_X
MAX_TITLE_LINES = 4


def strip_emojis(text: str) -> str:
    """
    Remove emojis from text.
    
    Note: MarkerFelt and most fonts don't support emoji glyphs.
    Apple Color Emoji is bitmap-only with fixed sizes, making it
    incompatible with PIL's arbitrary sizing. Stripping is the
    cleanest solution for now.
    """
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F700-\U0001F77F"  # alchemical symbols
        "\U0001F780-\U0001F7FF"  # geometric shapes extended
        "\U0001F800-\U0001F8FF"  # supplemental arrows-c
        "\U0001F900-\U0001F9FF"  # supplemental symbols & pictographs
        "\U0001FA00-\U0001FA6F"  # chess symbols
        "\U0001FA70-\U0001FAFF"  # symbols & pictographs extended-a
        "\U00002702-\U000027B0"  # dingbats
        "\U000024C2-\U0001F251"  # enclosed characters
        "]+",
        flags=re.UNICODE,
    )
    # Strip emojis and clean up extra whitespace
    result = emoji_pattern.sub("", text)
    result = re.sub(r'\s+', ' ', result).strip()
    return result


def get_font_size_for_title(title: str, draw: ImageDraw.Draw) -> int:
    """Dynamically choose font size based on title length."""
    for size in [56, 48, 42, 36, 32, 28]:
        font = ImageFont.truetype(FONT_PATH, size)
        lines = wrap_text(title, font, TEXT_AREA_WIDTH, draw)
        if len(lines) <= MAX_TITLE_LINES:
            return size
    return 24  # Minimum size


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


def generate_blog_og_image(
    title: str,
    output_path: str = "og-image.png",
) -> str:
    """Generate an OG image for a blog post with title and branding."""
    
    # Strip emojis since our font doesn't support them
    title = strip_emojis(title)
    
    # Load base template
    if os.path.exists(BASE_IMAGE):
        img = Image.open(BASE_IMAGE).convert('RGBA')
    else:
        raise FileNotFoundError(f"Base template not found: {BASE_IMAGE}")
    
    # Ensure correct dimensions
    if img.size != (OG_WIDTH, OG_HEIGHT):
        img = img.resize((OG_WIDTH, OG_HEIGHT), Image.LANCZOS)
    
    draw = ImageDraw.Draw(img)
    
    # Fonts
    header_font = ImageFont.truetype(FONT_PATH, 72)
    title_size = get_font_size_for_title(title, draw)
    title_font = ImageFont.truetype(FONT_PATH, title_size)
    
    # Header text "Maude's Blog" - centered across FULL width at top
    header = "Maude's Blog"
    header_bbox = draw.textbbox((0, 0), header, font=header_font)
    header_width = header_bbox[2] - header_bbox[0]
    header_height = header_bbox[3] - header_bbox[1]
    
    header_x = (OG_WIDTH - header_width) // 2
    header_y = 40
    
    draw.text((header_x, header_y), header, font=header_font, fill=BROWN)
    
    # Wrap title text
    title_lines = wrap_text(title, title_font, TEXT_AREA_WIDTH, draw)
    
    # Calculate title height
    line_height = int(title_size * 1.15)
    title_block_height = len(title_lines) * line_height
    
    # Title area is below header, on the right side
    title_area_top = header_y + header_height + 40
    title_area_bottom = OG_HEIGHT - 60
    title_area_height = title_area_bottom - title_area_top
    
    # Center title block vertically in title area
    title_start_y = title_area_top + (title_area_height - title_block_height) // 2
    
    # Draw title lines (right side only)
    current_y = title_start_y
    for line in title_lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        line_width = bbox[2] - bbox[0]
        x = TEXT_AREA_START_X + (TEXT_AREA_WIDTH - line_width) // 2
        draw.text((x, current_y), line, font=title_font, fill=BROWN)
        current_y += line_height
    
    # Ensure output directory exists
    output_dir = os.path.dirname(os.path.abspath(output_path))
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
    
    # Save
    img.save(output_path)
    print(f"Generated: {output_path}")
    return output_path


def generate_default_og_image(output_path: str = "og-image.png") -> str:
    """Generate the default site-wide OG image."""
    
    # Load base template
    if os.path.exists(BASE_IMAGE):
        img = Image.open(BASE_IMAGE).convert('RGBA')
    else:
        raise FileNotFoundError(f"Base template not found: {BASE_IMAGE}")
    
    # Ensure correct dimensions
    if img.size != (OG_WIDTH, OG_HEIGHT):
        img = img.resize((OG_WIDTH, OG_HEIGHT), Image.LANCZOS)
    
    draw = ImageDraw.Draw(img)
    
    # Fonts for default image
    title_font = ImageFont.truetype(FONT_PATH, 80)
    subtitle_font = ImageFont.truetype(FONT_PATH, 36)
    
    title = "Maude Code"
    subtitle = "Your friendly digital cow assistant"
    
    # Get text sizes
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_height = title_bbox[3] - title_bbox[1]
    
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    
    # Position - centered in text area (right side)
    gap = 20
    total_height = title_height + gap + (subtitle_bbox[3] - subtitle_bbox[1])
    start_y = (OG_HEIGHT - total_height) // 2
    
    title_x = TEXT_AREA_START_X + (TEXT_AREA_WIDTH - title_width) // 2
    subtitle_x = TEXT_AREA_START_X + (TEXT_AREA_WIDTH - subtitle_width) // 2
    
    draw.text((title_x, start_y), title, font=title_font, fill=BROWN)
    draw.text((subtitle_x, start_y + title_height + gap), subtitle, font=subtitle_font, fill=BROWN)
    
    # Ensure output directory exists
    output_dir = os.path.dirname(os.path.abspath(output_path))
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
    
    # Save
    img.save(output_path)
    print(f"Generated: {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Generate OG images for maudeco.de")
    parser.add_argument("--title", "-t", help="Blog post title")
    parser.add_argument("--output", "-o", default="og-image.png", help="Output path")
    parser.add_argument("--default", action="store_true", help="Generate default site OG image")
    
    args = parser.parse_args()
    
    if args.default:
        generate_default_og_image(output_path=args.output)
    elif args.title:
        generate_blog_og_image(title=args.title, output_path=args.output)
    else:
        parser.error("Either --title or --default is required")


if __name__ == "__main__":
    main()
