"""Regenerate white-logo favicons with cache-bust filenames."""
from __future__ import annotations

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "logo-light.png"
PUBLIC = ROOT / "public"
APP = ROOT / "src" / "app"
ICONS = PUBLIC / "icons"


def content_bbox(im: Image.Image, white_thresh: int = 245):
    rgb = im.convert("RGB")
    px = rgb.load()
    w, h = rgb.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if r <= white_thresh or g <= white_thresh or b <= white_thresh:
                found = True
                min_x, min_y = min(min_x, x), min(min_y, y)
                max_x, max_y = max(max_x, x), max(max_y, y)
    if not found:
        raise RuntimeError("empty logo")
    return min_x, min_y, max_x, max_y


def extract_emblem(im: Image.Image) -> Image.Image:
    left, top, right, bottom = content_bbox(im)
    width = right - left + 1
    height = bottom - top + 1
    emblem_h = int(height * 0.58)
    cx = left + width // 2
    cy = top + emblem_h // 2
    side = int(max(emblem_h, int(width * 0.62)) * 1.08)
    half = side // 2
    box = (
        max(0, cx - half),
        max(0, cy - half),
        min(im.width, cx + half),
        min(im.height, cy + half),
    )
    return im.crop(box).convert("RGBA")


def on_white_square(emblem: Image.Image, size: int, pad_ratio: float = 0.08) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    inner = max(1, int(size * (1 - pad_ratio * 2)))
    logo = emblem.resize((inner, inner), Image.Resampling.LANCZOS)
    # composite onto white (drop transparency to white)
    base = Image.new("RGBA", logo.size, (255, 255, 255, 255))
    base = Image.alpha_composite(base, logo)
    ox = (size - inner) // 2
    canvas.paste(base, (ox, ox))
    return canvas.convert("RGBA")


def save_png(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, format="PNG", optimize=True)
    print(f"wrote {path.relative_to(ROOT)} {im.size} {path.stat().st_size}b")


def save_ico(im512: Image.Image, path: Path) -> None:
    sizes = [(16, 16), (32, 32), (48, 48)]
    # Build each size from white-square source
    frames = [im512.resize(s, Image.Resampling.LANCZOS) for s in sizes]
    path.parent.mkdir(parents=True, exist_ok=True)
    frames[-1].save(path, format="ICO", sizes=sizes, append_images=frames[:-1])
    print(f"wrote {path.relative_to(ROOT)} {path.stat().st_size}b")


def main() -> None:
    emblem = extract_emblem(Image.open(SRC))
    master = on_white_square(emblem, 512, pad_ratio=0.06)

    # Cache-busted public assets
    save_png(master, PUBLIC / "brand-favicon.png")
    save_png(on_white_square(emblem, 32), PUBLIC / "brand-favicon-32.png")
    save_png(on_white_square(emblem, 48), PUBLIC / "brand-favicon-48.png")
    save_ico(master, PUBLIC / "brand-favicon.ico")

    # Keep classic paths updated too
    save_ico(master, PUBLIC / "favicon.ico")
    save_png(on_white_square(emblem, 32), PUBLIC / "favicon-32.png")
    save_png(on_white_square(emblem, 48), PUBLIC / "favicon-48.png")

    # App router icons (Next.js auto-serves these)
    save_ico(master, APP / "favicon.ico")
    save_png(on_white_square(emblem, 32), APP / "icon.png")
    save_png(on_white_square(emblem, 180), APP / "apple-icon.png")

    save_png(on_white_square(emblem, 180), ICONS / "apple-touch-icon.png")
    save_png(on_white_square(emblem, 192), ICONS / "icon-192.png")
    save_png(master, ICONS / "icon-512.png")
    save_png(on_white_square(emblem, 180), ICONS / "brand-apple-touch-icon.png")
    save_png(on_white_square(emblem, 192), ICONS / "brand-icon-192.png")
    save_png(master, ICONS / "brand-icon-512.png")


if __name__ == "__main__":
    main()
