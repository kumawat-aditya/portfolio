#!/usr/bin/env python3
"""
Extract mermaid diagrams from ARCHITECTURE.md files and render them as PNG
using mermaid-cli (mmdc). Outputs to public/projects/<slug>/diagrams/
"""
import os
import re
import subprocess
import json
import sys

RAW_DATA = os.path.join(os.path.dirname(__file__), "raw_data")
OUTPUT_BASE = os.path.join(os.path.dirname(__file__), "public", "projects")

# Dark theme config for mermaid
MERMAID_CONFIG = {
    "theme": "dark",
    "themeVariables": {
        "primaryColor": "#1a1a2a",
        "primaryTextColor": "#e8e6e3",
        "primaryBorderColor": "#3b82f6",
        "lineColor": "#4a4a5a",
        "secondaryColor": "#12121e",
        "tertiaryColor": "#0c0c14",
        "fontFamily": "JetBrains Mono, monospace",
        "fontSize": "14px",
        "nodeBorder": "#3b82f6",
        "mainBkg": "#1a1a2a",
        "clusterBkg": "#12121e",
        "clusterBorder": "#4a4a5a",
        "titleColor": "#e8e6e3",
        "edgeLabelBackground": "#0c0c14",
        "nodeTextColor": "#e8e6e3",
        "actorTextColor": "#e8e6e3",
        "actorBkg": "#1a1a2a",
        "actorBorder": "#3b82f6",
        "actorLineColor": "#4a4a5a",
        "signalColor": "#e8e6e3",
        "signalTextColor": "#e8e6e3",
        "labelBoxBkgColor": "#1a1a2a",
        "labelBoxBorderColor": "#3b82f6",
        "labelTextColor": "#e8e6e3",
        "loopTextColor": "#8a8a9a",
        "noteBkgColor": "#1a1a2a",
        "noteTextColor": "#e8e6e3",
        "noteBorderColor": "#8b5cf6",
        "activationBkgColor": "#12121e",
        "activationBorderColor": "#3b82f6",
        "sequenceNumberColor": "#3b82f6",
    },
}

SLUG_MAP = {
    "project_ant_meta_bots": "ant-meta-bots",
    "project_elastic_dca": "elastic-dca",
    "project_lorentzian_ml_engine": "lorentzian-ml",
    "project_quant-discovery-pipeline": "qubiforge",
    "project_rubix_cube_solver": "rubiks-solver",
    "project_stella": "stella",
    "project_telegram_signal_distributor": "signal-distribution",
}


def extract_mermaid_blocks(md_path: str) -> list[str]:
    """Extract mermaid code blocks from a markdown file."""
    with open(md_path, "r") as f:
        content = f.read()
    blocks = re.findall(r"```mermaid\s*\n(.*?)```", content, re.DOTALL)
    return [b.strip() for b in blocks if b.strip()]


def render_diagram(mermaid_code: str, output_path: str, config_path: str) -> bool:
    """Render a mermaid diagram to PNG using mmdc."""
    # Write temp mermaid file
    tmp = output_path.replace(".png", ".mmd")
    with open(tmp, "w") as f:
        f.write(mermaid_code)

    try:
        result = subprocess.run(
            [
                "npx",
                "-y",
                "@mermaid-js/mermaid-cli@latest",
                "-i", tmp,
                "-o", output_path,
                "-c", config_path,
                "-b", "#08080c",
                "-w", "1600",
                "--scale", "2",
            ],
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode != 0:
            print(f"  ERROR: {result.stderr[:200]}")
            return False
        return True
    except subprocess.TimeoutExpired:
        print(f"  TIMEOUT rendering {output_path}")
        return False
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def main():
    # Write config
    config_path = os.path.join(os.path.dirname(__file__), ".mermaid-config.json")
    with open(config_path, "w") as f:
        json.dump(MERMAID_CONFIG, f)

    total = 0
    success = 0

    for folder in sorted(os.listdir(RAW_DATA)):
        arch_path = os.path.join(RAW_DATA, folder, "ARCHITECTURE.md")
        if not os.path.isfile(arch_path):
            continue

        slug = SLUG_MAP.get(folder)
        if not slug:
            print(f"Skipping {folder} — no slug mapping")
            continue

        blocks = extract_mermaid_blocks(arch_path)
        if not blocks:
            print(f"No mermaid blocks in {folder}")
            continue

        out_dir = os.path.join(OUTPUT_BASE, slug, "diagrams")
        os.makedirs(out_dir, exist_ok=True)

        print(f"\n{folder} ({slug}): {len(blocks)} diagrams")
        for i, block in enumerate(blocks):
            total += 1
            out_file = os.path.join(out_dir, f"diagram-{i+1}.png")
            print(f"  Rendering diagram {i+1}...")
            if render_diagram(block, out_file, config_path):
                success += 1
                print(f"  ✓ {out_file}")
            else:
                print(f"  ✗ Failed")

    # Cleanup
    if os.path.exists(config_path):
        os.remove(config_path)

    print(f"\nDone: {success}/{total} diagrams rendered successfully")


if __name__ == "__main__":
    main()
