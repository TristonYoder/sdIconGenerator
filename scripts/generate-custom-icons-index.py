#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ICON_DIR = ROOT / "assets" / "custom-icons"
INDEX_PATH = ICON_DIR / "index.json"

ICON_DIR.mkdir(parents=True, exist_ok=True)

icons = []
for ext in ("*.svg", "*.png"):
    for path in sorted(ICON_DIR.glob(ext)):
        name = path.stem
        icons.append({
            "file": path.name,
            "name": name,
            "keywords": name.replace("-", " ")
        })

INDEX_PATH.write_text(json.dumps(icons, indent=2) + "\n")
print(f"Wrote {INDEX_PATH} with {len(icons)} entries")
