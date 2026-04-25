---
name: micsa-docs
description: >
  Genera cualquier tipo de documento Word (.docx), Excel (.xlsx) o PDF con
  calidad profesional: manuales, políticas, cartas, reportes, contratos,
  planes, tablas, formularios, listas, actas, presupuestos, o cualquier
  entregable escrito. Cuando el documento es para GRUPO MICSA o Synergy
  International Group aplica branding corporativo completo (logo, colores
  navy/gold/teal, banners de sección). Para otras empresas o documentos
  genéricos adapta la identidad visual al contexto. Activa este skill siempre
  que el usuario pida "hazme un documento", "necesito un word", "crea un excel",
  "genera una carta", "haz un manual", "dame el formato de", "redacta un
  contrato", "arma un reporte" o cualquier solicitud de entregable escrito,
  independientemente del tema. También activa cuando el usuario suba un PDF o
  imagen de un documento y diga "hazlo igual", "mejóralo", "ponlo en word" o
  "actualiza los datos".
---

# MICSA Docs Skill

Genera documentos profesionales de cualquier tipo — con o sin branding MICSA.
Produce archivos .docx, .xlsx listos para imprimir, firmar o presentar.

---

## PASO 0: Determinar el contexto del documento

Antes de escribir código, identificar:

| Pregunta | Impacto |
|----------|---------|
| ¿Es para MICSA / Synergy? | Usar paleta navy/gold y logo |
| ¿Es para otra empresa? | Adaptar colores al cliente o usar gris profesional |
| ¿Es genérico / sin marca? | Usar negro + gris limpio |
| ¿Hay un ejemplo de referencia (PDF/imagen)? | Replicar su estructura exacta |
| ¿Cuántas páginas? | Determinar si necesita índice y saltos de página |
| ¿Necesita firmas? | Agregar tabla de firmas al final |
| ¿Horizontal o vertical? | Landscape para tablas anchas (listas, cronogramas) |

Si el usuario sube un documento como referencia: revisar su estructura página
por página con `fitz` antes de generar. Replicar jerarquía, secciones y
formato exactos, solo cambiando datos y branding.

---

## Catálogo de documentos — cualquier contexto

### Documentos de gestión empresarial
- **Manual de roles** — propósito, procesos, herramientas, reglas, KPIs
- **Política interna** — marco legal, responsabilidades, procedimientos, sanciones
- **Protocolo operativo** — pasos numerados, diagramas de flujo en tabla, responsables
- **Plan de emergencias** — clasificación, acciones, croquis, directorio de emergencias
- **Reglamento interno** — capítulos, artículos numerados, firmas de acuse
- **Código de ética** — valores, compromisos, conductas prohibidas

### Documentos legales y contractuales
- **Contrato de servicios** — partes, objeto, alcance, precio, condiciones, firmas
- **Convenio de confidencialidad (NDA)** — objeto, obligaciones, vigencia, penalidades
- **Acta constitutiva de comité** — integrantes, cargos, compromisos, firmas
- **Carta de no adeudo / finiquito** — datos del trabajador, declaración, fecha, firma
- **Poder notarial simple** — otorgante, apoderado, facultades, fecha

### Documentos de RR.HH. y seguridad
- **Lista de asistencia** — landscape, header empresa, instructora, tema, 25 filas + firma
- **Control de personal / credenciales** — Excel con semáforo de documentos
- **Programa de capacitación** — cronograma con X por mes, brigadas, actividades
- **Acta de entrega de EPP** — trabajador, equipo entregado, condición, firma
- **Solicitud de empleo** — datos personales, experiencia, referencias, firma

### Documentos comerciales y financieros
- **Cotización / propuesta** — datos cliente, alcance, partidas, precios, condiciones
- **Reporte de costos** — tabla de insumos, matrices, conceptos estilo Neodata
- **Estado de cuenta** — facturas emitidas, pagadas, saldo, vencimientos
- **Carta de presentación empresarial** — quiénes somos, clientes, servicios, contacto

### Documentos de campo y operación
- **Briefing de proyecto** — cliente, alcance, equipo, recursos, Gates del O2C
- **Reporte fotográfico** — tabla de antes/después con espacios para foto + descripción
- **Acta de entrega (F6)** — datos del proyecto, alcance ejecutado, firma cliente
- **Plan de izaje** — carga, equipo, capacidades, análisis de ángulo, firma responsable

### Cartas y comunicaciones
- **Carta de reconocimiento** — estructura tipo Sainte Marie: logo, fecha, destinatario, cuerpo, 2 firmas
- **Carta de presentación** — empresa, servicios, clientes, contacto
- **Carta de recomendación laboral** — datos del empleado, desempeño, periodo, firma
- **Oficio formal** — número de oficio, asunto, destinatario, cuerpo, firma y sello

---

---

## Sistema de diseño universal

Estos principios aplican a CUALQUIER documento, no solo MICSA:

### Jerarquía visual — siempre 3 niveles
```
NIVEL 1 — Banner/Header de sección: color de fondo sólido + texto blanco o dorado
NIVEL 2 — H1: texto grande + línea de separación de color
NIVEL 3 — H2/H3: texto mediano en color de acento
```

### Regla de las tarjetas de color
Cuando haya categorías (tipos de riesgo, tipos de brigada, estados de documentos):
usar tarjetas de color codificado en lugar de listas de texto plano.

```
🔴 Rojo  = Crítico / Prohibido / Falta documento
🟠 Naranja = Advertencia / Pendiente / Atención
🟢 Verde = OK / Aprobado / Completo
🔵 Azul/Navy = Información / Encabezado
⚫ Gris  = Neutral / Metadata
```

### Tablas — siempre con encabezado coloreado + filas alternas
Nunca generar tablas sin color en el encabezado. El encabezado mínimo lleva
fondo oscuro + texto blanco. Las filas alternan entre blanco y gris muy claro.

### Firmas — siempre tabla 2 columnas al final
Nunca firmas en línea de texto. Siempre:
```
| ___________________ | ___________________ |
| Nombre Firmante 1   | Nombre Firmante 2   |
| Cargo               | Cargo               |
```

### Números de emergencia / contactos — siempre tarjetas 4 columnas
Nunca lista de bullets para contactos críticos. Tarjetas visuales con el
número grande y el servicio en negrita arriba.

---

## Identidad corporativa MICSA

```
Razón social : MONTAJES E IZAJES DEL CENTRO INDUSTRIAL CONTRACTOR S.A. DE C.V.
RFC          : MIC2301268S5
REPSE        : 282364
Sede         : Ciudad Frontera, Coahuila, México
Logo         : /mnt/user-data/uploads/logo_grupo.PNG  (JPEG real — usar type:'jpg')
```

### Paleta de colores
| Token  | Hex     | Uso principal                        |
|--------|---------|--------------------------------------|
| NAVY   | 0A1628  | Encabezados, fondos principales      |
| GOLD   | C9A84C  | Acentos, texto sobre navy            |
| TEAL   | 1A7B8A  | H2, subtítulos                       |
| STEEL  | 2A3F5F  | H3, texto secundario                 |
| RED    | C0392B  | Alertas, prohibiciones               |
| GREEN  | 1A7A3C  | Confirmaciones, aprobados            |
| ORANGE | E67E22  | Advertencias medias                  |
| GRAY   | 8B9BB4  | Metadata, pies de página             |

---

## Stack de generación

### Word (.docx) — Node.js `docx` library

```bash
# Verificar disponibilidad
node -e "require('docx'); console.log('OK')"
```

**Helpers base** (copiar al script de build):

```js
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,
       AlignmentType,BorderStyle,WidthType,ShadingType,LevelFormat,
       ImageRun,VerticalAlign} = require('docx');
const fs = require('fs');
const logo = fs.readFileSync('/mnt/user-data/uploads/logo_grupo.PNG');

// Bordes
const bb  = (c='CCCCCC',sz=1) => ({style:BorderStyle.SINGLE,size:sz,color:c});
const brd = (c='CCCCCC',sz=1) => ({top:bb(c,sz),bottom:bb(c,sz),left:bb(c,sz),right:bb(c,sz)});
const nb  = {style:BorderStyle.NONE,size:0,color:'FFFFFF'};
const nob = {top:nb,bottom:nb,left:nb,right:nb};

// Propiedades de página carta
const pp = {page:{size:{width:12240,height:15840},margin:{top:1080,right:1080,bottom:1080,left:1260}}};

// Texto
const tx = (s,o={}) => new TextRun({text:s,font:'Arial',size:o.sz||21,
  bold:o.b,italics:o.i,color:o.c||'2D3748',characterSpacing:o.cs});

// Párrafos comunes
const sp  = (n=1) => Array.from({length:n},()=>
  new Paragraph({spacing:{before:20,after:20},children:[tx('')]}));
const bod = s => new Paragraph({spacing:{before:50,after:70},
  alignment:AlignmentType.JUSTIFIED,children:[tx(s,{sz:21})]});
const cen = (ch,o={}) => new Paragraph({alignment:AlignmentType.CENTER,
  spacing:{before:o.sb||60,after:o.sa||80},
  children:Array.isArray(ch)?ch:[ch]});
const h1  = s => new Paragraph({spacing:{before:360,after:160},
  border:{bottom:{style:BorderStyle.SINGLE,size:12,color:'C9A84C',space:6}},
  children:[tx(s,{sz:28,b:true,c:'0A1628'})]});
const h2  = s => new Paragraph({spacing:{before:240,after:100},
  children:[tx(s,{sz:22,b:true,c:'1A7B8A'})]});
const bl  = s => new Paragraph({numbering:{reference:'bl',level:0},
  spacing:{before:40,after:40},children:[tx(s,{sz:20})]});
const nl  = s => new Paragraph({numbering:{reference:'nl',level:0},
  spacing:{before:40,after:40},alignment:AlignmentType.JUSTIFIED,
  children:[tx(s,{sz:20})]});

// Numeración
const numbering = {config:[
  {reference:'bl',levels:[{level:0,format:LevelFormat.BULLET,text:'\u2022',
    alignment:AlignmentType.LEFT,
    style:{paragraph:{indent:{left:720,hanging:360},spacing:{before:40,after:40}}}}]},
  {reference:'nl',levels:[{level:0,format:LevelFormat.DECIMAL,text:'%1.',
    alignment:AlignmentType.LEFT,
    style:{paragraph:{indent:{left:720,hanging:360},spacing:{before:40,after:40}}}}]},
]};
```

**Banner de sección** (patrón estándar MICSA):

```js
function secBanner(num, title, sub) {
  return new Table({width:{size:9900,type:WidthType.DXA},columnWidths:[1500,8400],
    rows:[new TableRow({children:[
      new TableCell({borders:nob,shading:{fill:'C9A84C',type:ShadingType.CLEAR},
        margins:{top:160,bottom:160,left:140,right:140},verticalAlign:'center',
        children:[new Paragraph({alignment:AlignmentType.CENTER,
          children:[tx(num,{sz:38,b:true,c:'0A1628'})]})]}),
      new TableCell({borders:nob,shading:{fill:'0A1628',type:ShadingType.CLEAR},
        margins:{top:120,bottom:120,left:220,right:140},children:[
          new Paragraph({spacing:{after:30},children:[tx('SECCION',{sz:14,b:true,c:'C9A84C',characterSpacing:400})]}),
          new Paragraph({spacing:{after:40},children:[tx(title,{sz:24,b:true,c:'FFFFFF'})]}),
          sub ? new Paragraph({children:[tx(sub,{sz:15,i:true,c:'C9A84C'})]})
              : new Paragraph({children:[tx('')]}),
        ]}),
    ]})]}); 
}
```

**Tabla estilizada**:

```js
function tbl(headers, rows, widths) {
  const w = widths || headers.map(() => Math.floor(9900/headers.length));
  const headerRow = new TableRow({children: headers.map((h,i) =>
    new TableCell({borders:brd(),shading:{fill:'0A1628',type:ShadingType.CLEAR},
      margins:{top:70,bottom:70,left:100,right:100},
      width:{size:w[i],type:WidthType.DXA},
      children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},
        children:[tx(h,{sz:16,b:true,c:'C9A84C'})]})]}))});
  const dataRows = rows.map((row,ri) => new TableRow({children: row.map((cell,ci) =>
    new TableCell({borders:brd(),margins:{top:60,bottom:60,left:100,right:100},
      width:{size:w[ci],type:WidthType.DXA},
      shading:{fill:ri%2===0?'F8F9FA':'FFFFFF',type:ShadingType.CLEAR},
      children:[new Paragraph({spacing:{before:0,after:0},
        children:[tx(cell,{sz:17})]})]}))
  }));
  return new Table({width:{size:9900,type:WidthType.DXA},columnWidths:w,
    rows:[headerRow,...dataRows]});
}
```

**Caja de alerta** (roja):

```js
function warn(s) {
  return new Table({width:{size:9900,type:WidthType.DXA},columnWidths:[9900],
    rows:[new TableRow({children:[new TableCell({
      borders:{top:{style:BorderStyle.SINGLE,size:8,color:'C0392B'},
               bottom:{style:BorderStyle.SINGLE,size:8,color:'C0392B'},
               left:{style:BorderStyle.SINGLE,size:8,color:'C0392B'},
               right:{style:BorderStyle.SINGLE,size:8,color:'C0392B'}},
      shading:{fill:'FFF2F0',type:ShadingType.CLEAR},
      margins:{top:100,bottom:100,left:160,right:160},
      children:[new Paragraph({spacing:{before:0,after:0},
        children:[tx('REGLA: ',{sz:19,b:true,c:'C0392B'}),
                  tx(s,{sz:19,c:'8B0000'})]})]})]})]}); 
}
```

**Inyección de logo** — SIEMPRE ejecutar después de generar el .docx:

```bash
python3 /home/claude/inject_logo_v4.py   # inyecta logo en header
python3 /home/claude/fix_sectpr.py       # conecta headerReference en sectPr
```

Verificar que los scripts existan antes de usarlos. Si no existen, los datos
del logo se incluyen directamente con `ImageRun` en la portada.

**Build y output estándar**:

```js
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/mnt/user-data/outputs/MICSA_NombreDoc.docx', buf);
  console.log('OK', Math.round(buf.length/1024), 'KB');
}).catch(e => { console.error(e.message); process.exit(1); });
```

Siempre escribir el build a un archivo `.js` en `/home/claude/` y ejecutar con
`node /home/claude/build_xxx.js` — nunca usar `node -e` con strings largos
(falla con comillas anidadas).

---

### Excel (.xlsx) — Python openpyxl

```python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

# Helpers
def fill(hex_color): return PatternFill("solid", fgColor=hex_color)
def font(hex="000000", sz=10, bold=False, italic=False):
    return Font(name="Arial", size=sz, bold=bold, italic=italic, color=hex)
def border_thin():
    s = Side(style="thin", color="CCCCCC")
    return Border(left=s, right=s, top=s, bottom=s)
def align(h="center", v="center", wrap=False):
    return Alignment(horizontal=h, vertical=v, wrap_text=wrap)
```

```bash
pip install openpyxl --break-system-packages -q
```

---

## Tipos de documentos y sus patrones

### Manual de Rol (empleado individual)
- Portada: logo centrado + tabla de metadatos (Rol, Nombre, Reporta a, Código, Versión)
- Cita del fundador en cursiva
- Secciones numeradas 01–07 con `secBanner`
- Secciones típicas: Propósito, Sistemas/Herramientas, Procesos Diarios,
  Alertas/Errores, Automatizaciones, Reglas de Hierro, KPIs
- Cierre: tabla 2 columnas con firma Jordan + firma del empleado

### Política / Manual del sistema
- Portada con número de documento (ej. MICSA-SEG-POL-001)
- Índice como tabla
- Capítulos con `h1`, subcapítulos con `h2`/`h3`
- Tablas de referencia, listas con `bl`/`nl`
- Anexos al final
- Pie: firmas Jordan + responsable del área

### Carta formal
- Header: logo derecha + nombre empresa / línea gold horizontal
- Fecha alineada a la derecha
- Destinatario + "A quien corresponda"
- Asunto centrado en negrita
- Cuerpo justificado
- Firmas al centro (2 columnas)
- Pie: RFC, teléfono, ciudad

### Lista de asistencia
- Orientación horizontal (landscape): `width:19800, height:12240`
- Header con logo + "Registro de Asistencia / Consultoría y Capacitación"
- Filas de meta: Instructora, Tema, Empresa, Fecha, Lugar
- Tabla: No. / Nombre / Empresa / Cargo / Teléfono / Correo / Firma
- 25 filas vacías con altura fija `480`
- Pie: firma instructora + coordinador

### Plan de Emergencias
- Header navy con logo
- Clasificación de emergencias en tarjetas de color (naranja = aislada, rojo = general)
- Pasos numerados con badge de color
- Referencias del plano en tarjetas 4 columnas
- Croquis simplificado como tabla estilizada
- Números de emergencia en tarjetas de color
- Firmas Director + Coordinador de Seguridad

### Control de credenciales / personal (Excel)
- Header navy con nombre empresa y RFC
- Leyenda de colores (row 4)
- Columnas: No. / Nombre(s) / Paterno / Materno / Nombre Completo / Foto / SUA-IDSE / DC3 / Observaciones
- Verde (`D4EDDA`) = documentos completos
- Rojo claro (`FADBD8`) = falta foto
- Resumen automático al final

---

## Organigrama de MICSA para documentos

```
Jordan Nefthali Contreras González — Director General / CEO
├── Joel Contreras González — Director de Operaciones (COO)
│   ├── José Armando Rivas — Cotizaciones
│   ├── Kevin — Validación
│   ├── Emanuel — Costos
│   ├── Roberto Sifuentes — Supervisor de Campo
│   ├── Hugo — Supervisor de Campo
│   └── Sergio — Logística
├── Francis — CFO / Finanzas
│   └── Arely — Facturación y Alta de Clientes
├── Fernando Contreras González — REPSE / RH
│   ├── María — Administración Documental
│   └── Brayan — Apoyo Documental
└── Alexis — Sistemas y Tecnología
```

*Mayte Vela ya NO está en MICSA. El rol SAT/CFDI/ContabiSAT está sin asignar.*

---

## Adaptar el estilo a otras empresas o contextos

Cuando el documento NO es para MICSA, adaptar la paleta manteniendo la misma
estructura de helpers. Solo cambiar las constantes de color:

```js
// Ejemplo: documento para empresa de salud
const PRIMARY = '1A5276';  // azul hospital
const ACCENT  = 'E74C3C';  // rojo médico
const LIGHT   = 'EBF5FB';  // azul muy claro

// Ejemplo: documento genérico / gobierno
const PRIMARY = '2C3E50';  // gris oscuro profesional
const ACCENT  = '7F8C8D';  // gris medio
const LIGHT   = 'F2F3F4';  // gris muy claro

// Ejemplo: empresa industrial / construcción
const PRIMARY = 'E67E22';  // naranja construcción
const ACCENT  = '2C3E50';  // navy oscuro
const LIGHT   = 'FEF9E7';  // amarillo muy claro
```

El resto de los helpers (`secBanner`, `tbl`, `warn`, `bl`, `nl`) funcionan
igual — solo cambian los colores inyectados.

Para documentos sin logo propio: usar solo texto grande centrado como header,
con una línea de color horizontal debajo. Ejemplo:

```js
new Paragraph({alignment:AlignmentType.CENTER, spacing:{after:8},
  border:{bottom:{style:BorderStyle.SINGLE,size:12,color:PRIMARY,space:8}},
  children:[tx('NOMBRE DE LA EMPRESA',{sz:32,b:true,c:PRIMARY})]}),
cen(tx('Subtítulo o tipo de documento',{sz:17,c:ACCENT,i:true})),
```

---

## Flujo de build estándar

1. Escribir el script en `/home/claude/build_<nombre>.js` (o `.py` para Excel)
2. Ejecutar: `node /home/claude/build_<nombre>.js`
3. Si es .docx: ejecutar `inject_logo_v4.py` y `fix_sectpr.py`
4. Verificar tamaño del output (`ls -lh /mnt/user-data/outputs/`)
5. Llamar a `present_files` con la ruta del output

---

## Errores comunes y soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `SyntaxError` en `node -e` | Comillas anidadas en string largo | Escribir a archivo .js y ejecutar con `node archivo.js` |
| Logo no aparece en header Word | Falta `fix_sectpr.py` | Ejecutar el script después de generar |
| `Expected ','` en JS | Template literal o string multilínea roto | Revisar cierre de backticks y paréntesis |
| Excel sin formato | `openpyxl` no instalado | `pip install openpyxl --break-system-packages -q` |
| Tabla sin columnas correctas | `columnWidths` no suma al ancho total | Verificar que suma = `width` de la tabla |
