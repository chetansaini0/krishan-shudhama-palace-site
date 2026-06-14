"""Generate PDF from TECHNICAL_DOCUMENTATION.md"""
from pathlib import Path
import markdown
from xhtml2pdf import pisa

ROOT = Path(__file__).resolve().parents[1]
MD_FILE = ROOT / "TECHNICAL_DOCUMENTATION.md"
PDF_FILE = ROOT / "TECHNICAL_DOCUMENTATION.pdf"

CSS = """
@page {
  size: A4;
  margin: 1.8cm 1.5cm 2cm 1.5cm;
  @frame footer {
    -pdf-frame-content: footerContent;
    bottom: 0.6cm;
    margin-left: 1.5cm;
    margin-right: 1.5cm;
    height: 1cm;
  }
}
body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 10pt;
  line-height: 1.45;
  color: #1a1a1a;
}
h1 {
  font-size: 20pt;
  color: #0a1628;
  border-bottom: 2px solid #c9a84c;
  padding-bottom: 6px;
  margin-top: 18px;
}
h2 {
  font-size: 14pt;
  color: #0a1628;
  margin-top: 16px;
  border-bottom: 1px solid #e8d5a3;
  padding-bottom: 4px;
}
h3 {
  font-size: 11pt;
  color: #132240;
  margin-top: 12px;
}
h4 { font-size: 10pt; color: #1a2d4a; margin-top: 10px; }
p { margin: 6px 0; }
ul, ol { margin: 6px 0 6px 18px; }
li { margin: 3px 0; }
code, pre {
  font-family: Courier, monospace;
  font-size: 8.5pt;
  background: #f5f2eb;
}
pre {
  padding: 8px;
  border: 1px solid #e8d5a3;
  white-space: pre-wrap;
  word-wrap: break-word;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 9pt;
}
th {
  background: #0a1628;
  color: #faf8f4;
  padding: 6px 8px;
  text-align: left;
}
td {
  border: 1px solid #ddd;
  padding: 5px 8px;
  vertical-align: top;
}
tr:nth-child(even) td { background: #faf8f4; }
hr { border: none; border-top: 1px solid #e8d5a3; margin: 14px 0; }
a { color: #a08838; text-decoration: none; }
blockquote {
  border-left: 3px solid #c9a84c;
  margin: 8px 0;
  padding: 4px 12px;
  color: #444;
  background: #faf8f4;
}
#footerContent {
  font-size: 8pt;
  color: #888;
  text-align: center;
}
.cover-title {
  font-size: 24pt;
  color: #0a1628;
  margin-top: 120px;
  text-align: center;
}
.cover-sub {
  font-size: 12pt;
  color: #666;
  text-align: center;
  margin-top: 12px;
}
"""

def main() -> None:
    md_text = MD_FILE.read_text(encoding="utf-8")
    html_body = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "toc", "nl2br"],
    )
    html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>{CSS}</style>
</head>
<body>
  <div class="cover-title">Krishan Shudhama Palace</div>
  <div class="cover-sub">Complete Technical Documentation</div>
  <pdf:nextpage />
  {html_body}
  <div id="footerContent">Krishan Shudhama Palace — Technical Documentation — May 2026</div>
</body>
</html>"""

    with PDF_FILE.open("wb") as pdf:
        status = pisa.CreatePDF(html, dest=pdf, encoding="utf-8")

    if status.err:
        raise SystemExit(f"PDF generation failed with {status.err} errors")
    print(f"Created: {PDF_FILE}")


if __name__ == "__main__":
    main()
