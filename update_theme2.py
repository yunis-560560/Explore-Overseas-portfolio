import codecs

with codecs.open('style.css', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Fix root variables - full white theme
old_root = """:root {
    --bg: #080d14;
    --bg2: #0d1520;
    --bg3: #111a27;
    --card: #0f1923;
    --border: rgba(255, 255, 255, 0.07);
    --text: #e2e8f0;
    --muted: #64748b;
    --accent: #3b82f6;
    --accent2: #22d3ee;
    --green: #22c55e;
    --orange: #f97316;
    --purple: #a855f7;
    --font: 'Outfit', sans-serif;
}"""

new_root = """:root {
    --bg: #ffffff;
    --bg2: #f8fafc;
    --bg3: #f1f5f9;
    --card: #ffffff;
    --border: rgba(15, 23, 42, 0.08);
    --text: #0f172a;
    --muted: #64748b;
    --accent: #2563eb;
    --accent2: #06b6d4;
    --green: #059669;
    --orange: #ea580c;
    --purple: #7c3aed;
    --font: 'Outfit', sans-serif;
}"""

content = content.replace(old_root, new_root)

# Fix navbar background
content = content.replace("background: rgba(8, 13, 20, 0.92);", "background: rgba(255, 255, 255, 0.97);")
content = content.replace("background: rgba(255, 255, 255, 0.92);", "background: rgba(255, 255, 255, 0.97);")

# Fix hero overlay - make it light
content = content.replace(
    "background: linear-gradient(180deg, rgba(8, 13, 20, 0.75) 0%, rgba(8, 13, 20, 0.6) 50%, rgba(8, 13, 20, 0.95) 100%);",
    "background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.40) 50%, rgba(255,255,255,0.85) 100%);"
)

# Fix hardcoded dark colors
content = content.replace("background: #0f172a;", "background: #ffffff;")
content = content.replace("background: #0a0f1a;", "background: #0f172a;")
content = content.replace("color: var(--text);", "color: var(--text);")  # keep this

# Fix hero text
content = content.replace("color: #fff;", "color: var(--text);")

# Search bar backgrounds
content = content.replace("background: rgba(255, 255, 255, 0.07);", "background: rgba(15, 23, 42, 0.04);")
content = content.replace("background: rgba(0, 0, 0, 0.04);", "background: rgba(15, 23, 42, 0.04);")
content = content.replace("border: 1px solid rgba(255, 255, 255, 0.15);", "border: 1px solid rgba(15, 23, 42, 0.12);")
content = content.replace("border: 1px solid rgba(0, 0, 0, 0.1);", "border: 1px solid rgba(15, 23, 42, 0.12);")

# Fix hero stats bar
content = content.replace("background: rgba(255, 255, 255, 0.04);", "background: rgba(255,255,255,0.9);")
content = content.replace("border: 1px solid var(--border);", "border: 1px solid rgba(15,23,42,0.1);")

# Fix hero stat text
content = content.replace(".hero-stat span {\n    font-size: 2rem;\n    font-weight: 700;\n    color: #fff;\n}", 
                           ".hero-stat span {\n    font-size: 2rem;\n    font-weight: 700;\n    color: var(--accent);\n}")

# Fix hero tags
content = content.replace("background: rgba(255, 255, 255, 0.07);", "background: rgba(37,99,235,0.07);")

# Fix about card border dark
content = content.replace("border-color: rgba(59, 130, 246, 0.3);", "border-color: rgba(37, 99, 235, 0.35);")

# Fix destinations section
content = content.replace("background: var(--bg);", "background: #ffffff;")
content = content.replace("background: var(--bg2);", "background: #f8fafc;")

with codecs.open('style.css', 'w', encoding='utf-8') as f:
    f.write(content)

print("Theme updated successfully!")
