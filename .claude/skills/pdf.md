---
name: pdf
description: Utilice esta habilidad siempre que el usuario desee realizar alguna acción con archivos PDF. Esto incluye leer o extraer texto/tablas de archivos PDF, combinar o fusionar varios archivos PDF en uno solo, dividir archivos PDF, rotar páginas, agregar marcas de agua, crear nuevos archivos PDF, completar formularios PDF, cifrar/descifrar archivos PDF, extraer imágenes y aplicar OCR a archivos PDF escaneados para que sean buscables. Si el usuario menciona un archivo .pdf o solicita generar uno, utilice esta habilidad.
license: Propiedad exclusiva. El archivo LICENSE.txt contiene los términos completos.
---

# Guía de procesamiento de PDF

## Descripción general

Esta guía abarca las operaciones esenciales de procesamiento de PDF mediante bibliotecas de Python y herramientas de línea de comandos. Para funciones avanzadas, bibliotecas de JavaScript y ejemplos detallados, consulte REFERENCE.md. Si necesita completar un formulario PDF, lea FORMS.md y siga sus instrucciones.

## Inicio rápido

```python
from pypdf import PdfReader, PdfWriter

# Read a PDF
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

# Extract text
text = ""
for page in reader.pages:
    text += page.extract_text()
```

## Bibliotecas de Python

### pypdf - Operaciones básicas

**Combinar archivos PDF**
```python
from pypdf import PdfWriter, PdfReader

writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged.pdf", "wb") as output:
    writer.write(output)
```

**PDF dividido**
```python
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as output:
        writer.write(output)
```

**Extraer metadatos**
```python
reader = PdfReader("document.pdf")
meta = reader.metadata
print(f"Title: {meta.title}")
print(f"Author: {meta.author}")
print(f"Subject: {meta.subject}")
print(f"Creator: {meta.creator}")
```

**Rotar páginas**
```python
reader = PdfReader("input.pdf")
writer = PdfWriter()

page = reader.pages[0]
page.rotate(90)  # Rotate 90 degrees clockwise
writer.add_page(page)

with open("rotated.pdf", "wb") as output:
    writer.write(output)
```

### pdfplumber - Extracción de texto y tablas

**Extraer texto con diseño**
```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        print(text)
```

**Extraer tablas**
```python
with pdfplumber.open("document.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        for j, table in enumerate(tables):
            print(f"Table {j+1} on page {i+1}:")
            for row in table:
                print(row)
```

**Extracción de tablas avanzada**
```python
import pandas as pd

with pdfplumber.open("document.pdf") as pdf:
    all_tables = []
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table:
                df = pd.DataFrame(table[1:], columns=table[0])
                all_tables.append(df)

if all_tables:
    combined_df = pd.concat(all_tables, ignore_index=True)
    combined_df.to_excel("extracted_tables.xlsx", index=False)
```

### reportlab - Crear archivos PDF

**Creación básica de PDF**
```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("hello.pdf", pagesize=letter)
width, height = letter

c.drawString(100, height - 100, "Hello World!")
c.line(100, height - 140, 400, height - 140)
c.save()
```

**Crear PDF con varias páginas**
```python
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet

doc = SimpleDocTemplate("report.pdf", pagesize=letter)
styles = getSampleStyleSheet()
story = []

story.append(Paragraph("Report Title", styles['Title']))
story.append(Spacer(1, 12))
story.append(Paragraph("Body text " * 20, styles['Normal']))
story.append(PageBreak())
story.append(Paragraph("Page 2", styles['Heading1']))

doc.build(story)
```

**IMPORTANTE — Subíndices y superíndices:**
Nunca utilice caracteres Unicode de subíndice/superíndice (₀₁₂₃, ⁰¹²³) en ReportLab. Las fuentes integradas no incluyen estos glifos → cuadros negros. Usar etiquetas XML:

```python
from reportlab.platypus import Paragraph
chemical = Paragraph("H<sub>2</sub>O", styles['Normal'])
squared = Paragraph("x<super>2</super>", styles['Normal'])
```

## Herramientas de línea de comandos

### pdftotext (poppler-utils)
```bash
pdftotext input.pdf output.txt
pdftotext -layout input.pdf output.txt   # preservar layout
pdftotext -f 1 -l 5 input.pdf output.txt # páginas 1-5
```

### qpdf
```bash
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf
qpdf input.pdf --pages . 1-5 -- pages1-5.pdf
qpdf input.pdf output.pdf --rotate=+90:1
qpdf --password=mypassword --decrypt encrypted.pdf decrypted.pdf
```

### pdftk
```bash
pdftk file1.pdf file2.pdf cat output merged.pdf
pdftk input.pdf burst
pdftk input.pdf rotate 1east output rotated.pdf
```

## Tareas comunes

**OCR en PDFs escaneados**
```python
import pytesseract
from pdf2image import convert_from_path

images = convert_from_path('scanned.pdf')
text = ""
for i, image in enumerate(images):
    text += f"Page {i+1}:\n"
    text += pytesseract.image_to_string(image)
    text += "\n\n"
```

**Agregar marca de agua**
```python
from pypdf import PdfReader, PdfWriter

watermark = PdfReader("watermark.pdf").pages[0]
reader = PdfReader("document.pdf")
writer = PdfWriter()

for page in reader.pages:
    page.merge_page(watermark)
    writer.add_page(page)

with open("watermarked.pdf", "wb") as output:
    writer.write(output)
```

**Protección con contraseña**
```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()

for page in reader.pages:
    writer.add_page(page)

writer.encrypt("userpassword", "ownerpassword")
with open("encrypted.pdf", "wb") as output:
    writer.write(output)
```

**Extraer imágenes**
```bash
pdfimages -j input.pdf output_prefix
```

## Referencia rápida

| Tarea | Herramienta | Método |
|---|---|---|
| Combinar PDFs | pypdf | `writer.add_page(page)` |
| Dividir PDF | pypdf | Una página por archivo |
| Extraer texto | pdfplumber | `page.extract_text()` |
| Extraer tablas | pdfplumber | `page.extract_tables()` |
| Crear PDF | reportlab | Canvas o SimpleDocTemplate |
| Fusión CLI | qpdf | `qpdf --empty --pages ...` |
| OCR | pytesseract | Convertir a imagen primero |
| Rellenar formularios | pdf-lib / pypdf | Ver FORMS.md |

## JavaScript (pdf-lib)

Para generación de PDF en Node.js/Next.js, consultar REFERENCE.md — incluye pdf-lib para operaciones del lado del servidor y cliente.
