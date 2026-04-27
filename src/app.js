/* =============================================
   MICSA DOC STUDIO — APPLICATION LOGIC
   Version 2.0 | Febrero 2026
   Skywork-inspired design
   ============================================= */

'use strict';

// ==================== PRE-CONFIGURED CREDENTIALS ====================
(function seedCredentials() {
  if (!localStorage.getItem('gdocs_client_id')) {
    localStorage.setItem('gdocs_client_id', '714714887434-gugc0m62djle88h4d5bqeeo4ic6338fb.apps.googleusercontent.com');
  }
  // Always set latest API key (force update)
  localStorage.setItem('gdocs_api_key', '');
  if (!localStorage.getItem('adobe_sign_key')) {
    localStorage.setItem('adobe_sign_key', 'b9f07d2be0374e2ea9296963fe87e040');
  }
  // Gemini API key — get yours free at aistudio.google.com/app/apikey
  // Once obtained, it will be saved automatically via the Chat config panel
  if (!localStorage.getItem('ilove_public_key')) {
    localStorage.setItem('ilove_public_key', 'project_public_4709d3c2d20acb452956fb647c383a0f_ZxhNy7300be4321cc3a4de00a612188799c63');
  }
  if (!localStorage.getItem('ilove_secret_key')) {
    localStorage.setItem('ilove_secret_key', 'secret_key_f4f5a0cdfe4f46ee3325f4c6e78cfc15_RtXqz97b166fbb1c800de8443bcc34a77542f');
  }
})();

// ==================== STATE ====================
const state = {
  currentTemplate: 'blank',
  savedDocs: [],
  isDirty: false,
  autoSaveTimer: null,
};

// ==================== UI LOGIC (Responsive) ====================
window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
};


// ==================== TEMPLATES ====================
const TEMPLATES = {

  cotizacion: {
    title: 'Cotización #001',
    variables: ['numero', 'fecha', 'cliente', 'rfc_cliente', 'contacto', 'vigencia'],
    varLabels: {
      numero: 'Número de cotización',
      fecha: 'Fecha',
      cliente: 'Nombre del cliente',
      rfc_cliente: 'RFC del cliente',
      contacto: 'Persona de contacto',
      vigencia: 'Vigencia (días)',
    },
    defaults: {
      numero: '001',
      fecha: today(),
      cliente: 'Empresa Ejemplo S.A. de C.V.',
      rfc_cliente: 'EEJ201001AB1',
      contacto: 'Ing. Juan López',
      vigencia: '30',
    },
    html: (v) => {
      const content = `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;">
    <p style="font-size:9pt;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;font-weight:600;">Para:</p>
    <p style="font-weight:600;font-size:12pt;color:#0f172a;margin-bottom:2px;">${v.cliente}</p>
    <p style="color:#64748b;font-size:10pt;">RFC: ${v.rfc_cliente}</p>
    <p style="color:#64748b;font-size:10pt;">Attn: ${v.contacto}</p>
  </div>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;">
    <p style="font-size:9pt;color:#64748b;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;font-weight:600;">Información:</p>
    <p style="color:#475569;font-size:10pt;margin-bottom:3px;"><strong>Fecha:</strong> ${v.fecha}</p>
    <p style="color:#475569;font-size:10pt;margin-bottom:3px;"><strong>Vigencia:</strong> ${v.vigencia} días</p>
    <p style="color:#475569;font-size:10pt;"><strong>Moneda:</strong> MXN (Pesos Mexicanos)</p>
  </div>
</div>

<h2 style="font-size:13pt;color:#1e3a5f;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:14px;">Descripción de productos / servicios</h2>

<table class="pdf-table" style="margin-bottom:20px;">
  <thead>
    <tr>
      <th style="width:8%;">Cant.</th>
      <th style="width:46%;text-align:left;">Descripción</th>
      <th style="width:20%;text-align:right;">Precio Unit.</th>
      <th style="width:26%;text-align:right;">Importe</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Descripción del producto o servicio 1</td>
      <td style="text-align:right;">$0.00</td>
      <td style="text-align:right;">$0.00</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Descripción del producto o servicio 2</td>
      <td style="text-align:right;">$0.00</td>
      <td style="text-align:right;">$0.00</td>
    </tr>
    <tr>
      <td>1</td>
      <td>Descripción del producto o servicio 3</td>
      <td style="text-align:right;">$0.00</td>
      <td style="text-align:right;">$0.00</td>
    </tr>
  </tbody>
</table>

<div style="display:flex;justify-content:flex-end;margin-bottom:28px;">
  <table style="width:260px;border-collapse:collapse;">
    <tr>
      <td style="padding:6px 12px;font-size:10pt;color:#64748b;">Subtotal:</td>
      <td style="padding:6px 12px;font-size:10pt;text-align:right;font-weight:500;">$0.00</td>
    </tr>
    <tr style="background:#f8fafc;">
      <td style="padding:6px 12px;font-size:10pt;color:#64748b;">IVA (16%):</td>
      <td style="padding:6px 12px;font-size:10pt;text-align:right;">$0.00</td>
    </tr>
    <tr style="background:#1e3a5f;color:#fff;">
      <td style="padding:9px 12px;font-size:11pt;font-weight:700;">TOTAL:</td>
      <td style="padding:9px 12px;font-size:11pt;font-weight:700;text-align:right;">$0.00 MXN</td>
    </tr>
  </table>
</div>

<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:20px;">
  <p style="font-size:10pt;color:#1e40af;font-weight:600;margin-bottom:4px;">Condiciones de pago:</p>
  <p style="font-size:10pt;color:#1e3a5f;">50% de anticipo para iniciar el trabajo, 50% restante a la entrega.</p>
</div>

<h3 style="font-size:11pt;color:#1e3a5f;margin-bottom:8px;">Observaciones:</h3>
<p style="font-size:10pt;color:#475569;margin-bottom:4px;">• Los precios incluyen IVA según se indica.</p>
<p style="font-size:10pt;color:#475569;margin-bottom:4px;">• Tiempo de entrega estimado: por confirmar.</p>
<p style="font-size:10pt;color:#475569;margin-bottom:24px;">• Cotización válida por ${v.vigencia} días a partir de la fecha de emisión.</p>
`;

      return createPdfTemplate({
        header: {
          docType: 'Cotización',
          date: v.fecha,
          folio: 'COT-' + v.numero
        },
        content: content,
        footer: 'Cotización válida por ' + v.vigencia + ' días'
      });
    }
  },

  carta: {
    title: 'Carta Formal',
    variables: ['fecha', 'destinatario', 'cargo_dest', 'empresa_dest', 'ciudad', 'asunto', 'remitente', 'cargo_rem'],
    varLabels: {
      fecha: 'Fecha',
      destinatario: 'Nombre del destinatario',
      cargo_dest: 'Cargo del destinatario',
      empresa_dest: 'Empresa destinataria',
      ciudad: 'Ciudad',
      asunto: 'Asunto de la carta',
      remitente: 'Nombre del remitente',
      cargo_rem: 'Cargo del remitente',
    },
    defaults: {
      fecha: today(),
      destinatario: 'Lic. María García',
      cargo_dest: 'Gerente de Compras',
      empresa_dest: 'Empresa Ejemplo S.A. de C.V.',
      ciudad: 'Monterrey, N.L.',
      asunto: 'Presentación de servicios industriales',
      remitente: 'Ing. Carlos Hernández',
      cargo_rem: 'Director Comercial',
    },
    html: (v) => {
      const content = `
<div style="margin-bottom:24px;">
  <p style="font-size:11pt;font-weight:600;color:#0f172a;margin-bottom:2px;">${v.destinatario}</p>
  <p style="font-size:10pt;color:#475569;margin-bottom:2px;">${v.cargo_dest}</p>
  <p style="font-size:10pt;color:#475569;">${v.empresa_dest}</p>
</div>

<p style="font-size:10pt;font-weight:600;color:#1e3a5f;margin-bottom:20px;text-transform:uppercase;letter-spacing:.03em;">Asunto: ${v.asunto}</p>

<p style="font-size:10pt;color:#475569;margin-bottom:12px;">Estimado/a ${v.destinatario}:</p>

<p style="font-size:11pt;color:#1e293b;margin-bottom:14px;text-align:justify;">
Por medio de la presente, nos dirigimos a usted de manera muy atenta para [escriba el cuerpo principal de la carta aquí].
</p>

<p style="font-size:11pt;color:#1e293b;margin-bottom:14px;text-align:justify;">
[Párrafo 2: Desarrolle los puntos principales del mensaje. Puede incluir detalles relevantes, propuestas o información adicional.]
</p>

<p style="font-size:11pt;color:#1e293b;margin-bottom:28px;text-align:justify;">
Sin más por el momento y en espera de su respuesta, le extendemos un cordial saludo.
</p>

<div class="pdf-keep-together">
  <p style="font-size:10pt;color:#64748b;margin-bottom:2px;">Atentamente,</p>
  <br style="line-height:3;"/>
  <p style="font-size:11pt;font-weight:700;color:#1e3a5f;margin-bottom:2px;">${v.remitente}</p>
  <p style="font-size:10pt;color:#475569;margin-bottom:2px;">${v.cargo_rem}</p>
  <p style="font-size:10pt;color:#64748b;">MICSA Industrial S.A. de C.V.</p>
</div>
`;

      return createPdfTemplate({
        header: {
          docType: 'Carta Formal',
          date: v.fecha,
          folio: v.ciudad
        },
        content: content,
        footer: 'Comunicación oficial de MICSA Industrial S.A. de C.V.'
      });
    }
  },

  reporte: {
    title: 'Reporte Técnico',
    variables: ['numero', 'fecha', 'titulo', 'elaboro', 'area', 'revision'],
    varLabels: {
      numero: 'Número de reporte',
      fecha: 'Fecha',
      titulo: 'Título del reporte',
      elaboro: 'Elaboró',
      area: 'Área / Departamento',
      revision: 'Revisión',
    },
    defaults: {
      numero: 'RT-001',
      fecha: today(),
      titulo: 'Reporte de Inspección Técnica',
      elaboro: 'Ing. Carlos Hernández',
      area: 'Ingeniería',
      revision: 'A',
    },
    html: (v) => {
      const content = `
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;">
  <div><span style="font-size:8.5pt;color:#64748b;display:block;text-transform:uppercase;">Elaboró</span><span style="font-size:10pt;color:#1e293b;">${v.elaboro}</span></div>
  <div><span style="font-size:8.5pt;color:#64748b;display:block;text-transform:uppercase;">Área</span><span style="font-size:10pt;color:#1e293b;">${v.area}</span></div>
  <div><span style="font-size:8.5pt;color:#64748b;display:block;text-transform:uppercase;">Revisión</span><span style="font-size:10pt;font-weight:600;color:#1e293b;">${v.revision}</span></div>
</div>

<h2 style="font-size:13pt;color:#1e3a5f;border-left:4px solid #3b82f6;padding-left:10px;margin-bottom:10px;">1. Objetivo</h2>
<p style="font-size:11pt;color:#1e293b;margin-bottom:18px;text-align:justify;">[Describa el objetivo del reporte técnico. ¿Qué se inspeccionó, analizó o evaluó?]</p>

<h2 style="font-size:13pt;color:#1e3a5f;border-left:4px solid #3b82f6;padding-left:10px;margin-bottom:10px;">2. Alcance</h2>
<p style="font-size:11pt;color:#1e293b;margin-bottom:18px;text-align:justify;">[Defina el alcance del trabajo realizado: equipos, áreas, sistemas involucrados.]</p>

<h2 style="font-size:13pt;color:#1e3a5f;border-left:4px solid #3b82f6;padding-left:10px;margin-bottom:10px;">3. Hallazgos</h2>
<table class="pdf-table" style="margin-bottom:18px;">
  <thead>
    <tr>
      <th style="width:8%;">#</th>
      <th style="width:40%;">Hallazgo</th>
      <th style="width:22%;">Severidad</th>
      <th>Acción recomendada</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>[Descripción del hallazgo]</td>
      <td style="color:#dc2626;font-weight:600;">Alta</td>
      <td>[Acción a tomar]</td>
    </tr>
    <tr style="background:#f8fafc;">
      <td>2</td>
      <td>[Descripción del hallazgo]</td>
      <td style="color:#f59e0b;font-weight:600;">Media</td>
      <td>[Acción a tomar]</td>
    </tr>
  </tbody>
</table>

<h2 style="font-size:13pt;color:#1e3a5f;border-left:4px solid #3b82f6;padding-left:10px;margin-bottom:10px;">4. Conclusiones y Recomendaciones</h2>
<p style="font-size:11pt;color:#1e293b;margin-bottom:24px;text-align:justify;">[Escriba las conclusiones del análisis y las recomendaciones de acción.]</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;">
  <div style="text-align:center;"><div style="border-top:1px solid #94a3b8;padding-top:8px;font-size:9.5pt;color:#475569;">Elaboró: ${v.elaboro}</div></div>
  <div style="text-align:center;"><div style="border-top:1px solid #94a3b8;padding-top:8px;font-size:9.5pt;color:#475569;">Aprobó: _______________</div></div>
</div>
`;
      return createPdfTemplate({
        header: { docType: 'Reporte Técnico', date: v.fecha, folio: 'RT-' + v.numero },
        content: content,
        footer: 'Reporte Técnico — Área de ' + v.area
      });
    }},

  remision: {
    title: 'Remisión de Entrega',
    variables: ['numero', 'fecha', 'cliente', 'destino', 'elaboro'],
    varLabels: {
      numero: 'Número de remisión',
      fecha: 'Fecha de entrega',
      cliente: 'Cliente',
      destino: 'Dirección de entrega',
      elaboro: 'Elaboró',
    },
    defaults: {
      numero: 'REM-001',
      fecha: today(),
      cliente: 'Empresa Ejemplo S.A. de C.V.',
      destino: 'Calle Industrial #100, Monterrey, N.L.',
      elaboro: 'Almacén MICSA',
    },
    html: (v) => {
      const content = `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:22px;">
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;">
    <p style="font-size:9pt;color:#16a34a;font-weight:600;text-transform:uppercase;margin-bottom:6px;">Cliente:</p>
    <p style="font-weight:600;font-size:12pt;color:#0f172a;margin-bottom:3px;">${v.cliente}</p>
    <p style="color:#64748b;font-size:10pt;">Destino: ${v.destino}</p>
  </div>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;">
    <p style="font-size:9pt;color:#64748b;font-weight:600;text-transform:uppercase;margin-bottom:6px;">Datos:</p>
    <p style="color:#475569;font-size:10pt;margin-bottom:3px;"><strong>Fecha:</strong> ${v.fecha}</p>
    <p style="color:#475569;font-size:10pt;"><strong>Elaboró:</strong> ${v.elaboro}</p>
  </div>
</div>

<h2 style="font-size:12pt;color:#1e3a5f;margin-bottom:12px;">Artículos entregados:</h2>
<table class="pdf-table" style="margin-bottom:24px;">
  <thead><tr>
    <th style="width:8%;">Cant.</th>
    <th style="width:20%;">Código</th>
    <th>Descripción</th>
    <th style="width:20%;">Condición</th>
  </tr></thead>
  <tbody>
    <tr><td>1</td><td>[CÓDIGO]</td><td>[Descripción del artículo]</td><td>Nuevo</td></tr>
    <tr style="background:#f8fafc;"><td>1</td><td>[CÓDIGO]</td><td>[Descripción del artículo]</td><td>Nuevo</td></tr>
  </tbody>
</table>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px;">
  <div style="text-align:center;"><div style="border-top:1px solid #94a3b8;padding-top:8px;font-size:9.5pt;color:#475569;">Entregó: ${v.elaboro}</div></div>
  <div style="text-align:center;"><div style="border-top:1px solid #94a3b8;padding-top:8px;font-size:9.5pt;color:#475569;">Recibió y conformidad: _______________</div></div>
</div>
`;
      return createPdfTemplate({
        header: { docType: 'Remisión', date: v.fecha, folio: 'REM-' + v.numero },
        content: content,
        footer: 'Remisión de Entrega — ' + v.cliente
      });
    }},

  propuesta: {
    title: 'Propuesta Comercial',
    variables: ['numero', 'fecha', 'cliente', 'contacto', 'titulo_oferta', 'elaboro'],
    varLabels: {
      numero: 'Número de propuesta',
      fecha: 'Fecha',
      cliente: 'Empresa cliente',
      contacto: 'Contacto',
      titulo_oferta: 'Título de la propuesta',
      elaboro: 'Elaboró',
    },
    defaults: {
      numero: 'PROP-001',
      fecha: today(),
      cliente: 'Empresa Ejemplo S.A. de C.V.',
      contacto: 'Ing. Juan López',
      titulo_oferta: 'Servicios de Mantenimiento Industrial Integral',
      elaboro: 'Ing. Carlos Hernández',
    },
    html: (v) => {
      const content = `
<div style="background:#f0f4f8;border-radius:4px;padding:16px;margin-bottom:20px;">
  <h3 style="color:#1e3a5f;margin:0 0 8px;font-size:12pt;font-weight:700;">${v.titulo_oferta}</h3>
  <p style="color:#475569;font-size:10pt;margin:0;">Preparada para: <strong>${v.cliente}</strong> — Attn: ${v.contacto}</p>
</div>

<h2 style="font-size:12pt;color:#1e3a5f;border-bottom:2px solid #3b82f6;padding-bottom:6px;margin-bottom:14px;">Resumen Ejecutivo</h2>
<p style="font-size:11pt;color:#1e293b;margin-bottom:20px;text-align:justify;">[Escriba un resumen breve y persuasivo de la propuesta. Describa el valor que MICSA Industrial ofrecerá al cliente.]</p>

<h2 style="font-size:12pt;color:#1e3a5f;border-bottom:2px solid #3b82f6;padding-bottom:6px;margin-bottom:14px;">Alcance de los servicios</h2>
<p style="font-size:11pt;color:#1e293b;margin-bottom:6px;">✅ [Servicio / entregable 1]</p>
<p style="font-size:11pt;color:#1e293b;margin-bottom:6px;">✅ [Servicio / entregable 2]</p>
<p style="font-size:11pt;color:#1e293b;margin-bottom:20px;">✅ [Servicio / entregable 3]</p>

<h2 style="font-size:12pt;color:#1e3a5f;border-bottom:2px solid #3b82f6;padding-bottom:6px;margin-bottom:14px;">Inversión</h2>
<table class="pdf-table" style="margin-bottom:20px;">
  <thead><tr>
    <th style="text-align:left;">Concepto</th>
    <th style="width:30%;text-align:right;">Inversión</th>
  </tr></thead>
  <tbody>
    <tr><td>[Concepto 1]</td><td style="text-align:right;">$0.00 MXN</td></tr>
    <tr style="background:#f8fafc;"><td>[Concepto 2]</td><td style="text-align:right;">$0.00 MXN</td></tr>
  </tbody>
</table>

<div style="text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;">
  <div style="border-top:1px solid #94a3b8;padding-top:8px;display:inline-block;font-size:9.5pt;color:#475569;">Elaboró: ${v.elaboro}</div>
</div>
`;
      return createPdfTemplate({
        header: { docType: 'Propuesta Comercial', date: v.fecha, folio: v.numero },
        content: content,
        footer: 'Propuesta válida por 30 días — ' + v.cliente
      });
    }},

  seguridad: {
    title: 'Política de Seguridad Industrial',
    variables: ['responsable', 'ciudad', 'fecha', 'revision'],
    varLabels: {
      responsable: 'Responsable / Contacto',
      ciudad: 'Ciudad',
      fecha: 'Fecha de emisión',
      revision: 'Revisión (ej. Rev.A)',
    },
    defaults: {
      responsable: 'Jordán Neftalí Contreras Gonzalez',
      ciudad: 'Monclova, Coahuila',
      fecha: today(),
      revision: 'Rev. A',
    },
    html: (v) => {
      const content = `
<p style="font-size:10pt;color:#475569;margin-bottom:16px;"><strong>Responsable:</strong> ${v.responsable} | <strong>Ciudad:</strong> ${v.ciudad}</p>

<h2 style="font-size:12pt;font-weight:700;color:#1e3a5f;margin:0 0 14px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">1. POLÍTICA DE SEGURIDAD INDUSTRIAL</h2>

<blockquote style="border-left:4px solid #3b82f6;background:#eff6ff;padding:12px 14px;margin:0 0 16px;border-radius:0 4px 4px 0;color:#1e40af;font-size:10.5pt;">
MICSA Industrial tiene como compromiso el cuidado de la salud, la integridad física y la protección de todos nuestros trabajadores. Tenemos como objetivo lograr cero accidentes y cero lesiones, buscando siempre una mejora continua.
</blockquote>

<h2 style="font-size:12pt;font-weight:700;color:#1e3a5f;margin:20px 0 10px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">2. MATRICES REGLAMENTARIAS</h2>

<h3 style="font-size:11pt;font-weight:600;color:#1e3a5f;margin:12px 0 8px;">Requisitos Legales (NOM-STPS)</h3>
<table class="pdf-table" style="margin-bottom:18px;">
  <thead>
    <tr>
      <th style="width:15%;">Norma</th>
      <th>Descripción</th>
      <th style="width:20%;">Estatus</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>NOM-001-STPS</td>
      <td>Edificios, locales, instalaciones y áreas</td>
      <td style="color:#16a34a;font-weight:600;">Cumplimiento</td>
    </tr>
    <tr style="background:#f8fafc;">
      <td>NOM-017-STPS</td>
      <td>Equipo de protección personal</td>
      <td style="color:#16a34a;font-weight:600;">Cumplimiento</td>
    </tr>
  </tbody>
</table>

<h2 style="font-size:12pt;font-weight:700;color:#1e3a5f;margin:20px 0 10px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">3. ESTADÍSTICAS Y MÉTRICAS</h2>

<table class="pdf-table">
  <thead>
    <tr>
      <th>Indicador</th>
      <th style="width:20%;text-align:center;">Meta</th>
      <th style="width:20%;text-align:center;">Resultado</th>
      <th style="width:20%;text-align:center;">Estatus</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Accidentes incapacitantes</td>
      <td style="text-align:center;">0</td>
      <td style="text-align:center;">0</td>
      <td style="text-align:center;color:#16a34a;font-weight:600;">✅ Meta lograda</td>
    </tr>
    <tr style="background:#f8fafc;">
      <td>Horas sin accidente</td>
      <td style="text-align:center;">8,760+</td>
      <td style="text-align:center;">0</td>
      <td style="text-align:center;color:#6b7280;">En seguimiento</td>
    </tr>
  </tbody>
</table>
`;
      return createPdfTemplate({
        header: { docType: 'Política de Seguridad', date: v.fecha, folio: v.revision },
        content: content,
        footer: 'Política de Seguridad Industrial — MICSA'
      });
    }},

  blank: {
    title: 'Documento nuevo',
    variables: [],
    varLabels: {},
    defaults: {},
    html: () => {
      const content = `<p style="font-size:11pt;color:#9ca3af;font-style:italic;">Comience a escribir su documento...</p>`;
      return createPdfTemplate({
        header: { docType: 'Documento', date: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }), folio: '' },
        content: content,
        footer: 'MICSA Industrial S.A. de C.V.'
      });
    }},

  desviaciones: {
    title: 'Informe de Desviaciones Operativas',
    variables: ['proyecto', 'cliente', 'semana', 'fecha', 'fecha_evento', 'impacto_mxn', 'altura_giro', 'responsable'],
    varLabels: {
      proyecto: 'Proyecto / Descripción',
      cliente: 'Cliente',
      semana: 'Semana contractual',
      fecha: 'Fecha del informe',
      fecha_evento: 'Fecha detención de maniobra',
      impacto_mxn: 'Impacto estimado (MXN)',
      altura_giro: 'Altura requerida de giro (m)',
      responsable: 'Elaboró (nombre)',
    },
    defaults: {
      proyecto: 'Carrier – Maniobra Expander',
      cliente: 'Carrier',
      semana: '5',
      fecha: today(),
      fecha_evento: today(),
      impacto_mxn: '$100,000 MXN',
      altura_giro: '8.60',
      responsable: 'Jordán Neftalí Contreras Gonzalez',
    },
    html: (v) => {
      const content = `
<!-- I. OBJETO -->
<h2 style="font-size:12.5pt;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;margin:0 0 12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;">I. Objeto del Informe</h2>
<p style="font-size:11pt;color:#374151;margin-bottom:10px;">El presente documento tiene como finalidad:</p>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:18px;line-height:1.85;">
  <li>Consolidar las desviaciones ocurridas durante la ejecución del proyecto.</li>
  <li>Documentar atrasos <strong>no imputables al proveedor</strong>.</li>
  <li>Confirmar que el plan técnico de izaje existía y estaba documentado.</li>
  <li>Establecer el impacto operativo y económico generado.</li>
  <li>Preservar el equilibrio contractual del proyecto.</li>
  <li>Permitir al cliente trasladar internamente los impactos generados por planta.</li>
</ul>
<blockquote style="border-left:4px solid #f59e0b;background:#fffbeb;padding:11px 16px;margin:0 0 20px;border-radius:0 6px 6px 0;color:#92400e;font-size:10.5pt;">
  Este informe <strong>no modifica el alcance original</strong>, pero deja constancia formal de afectaciones acumuladas.
</blockquote>

<!-- II. LÍNEA BASE -->
<h2 style="font-size:12.5pt;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;">II. Línea Base Acordada</h2>
<p style="font-size:11pt;color:#374151;margin-bottom:10px;">Se acordó que:</p>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:20px;line-height:1.85;">
  <li>El área eléctrica estaría completamente liberada.</li>
  <li>Se permitiría desenergización total.</li>
  <li>Se ejecutaría desconexión eléctrica sin interferencias.</li>
  <li>El área estaría aislada para ejecución segura de maniobra.</li>
  <li>Se respetaría la ventana operativa programada.</li>
</ul>

<!-- III. DESVIACIÓN 01 -->
<h2 style="font-size:12.5pt;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid #fee2e2;">III. Desviación 01 — Atraso en Liberación Eléctrica</h2>
<h3 style="font-size:10.5pt;font-weight:600;color:#374151;margin:0 0 8px;">Situación actual (al cierre de la semana ${v.semana}):</h3>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:14px;line-height:1.85;">
  <li>No se ha liberado completamente el sistema eléctrico.</li>
  <li>Continúan interferencias y trabajos eléctricos en área.</li>
  <li>No ha sido posible ejecutar desenergización total.</li>
  <li>Se mantiene presencia eléctrica que altera la secuencia del desmontaje.</li>
</ul>
<h3 style="font-size:10.5pt;font-weight:600;color:#374151;margin:0 0 8px;">Impacto operativo:</h3>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:14px;line-height:1.85;">
  <li>Reprogramación continua.</li>
  <li>Tiempo muerto de personal especializado.</li>
  <li>Incremento en costos indirectos.</li>
  <li>Alteración del plan de desmontaje originalmente acordado.</li>
</ul>
<blockquote style="border-left:4px solid #dc2626;background:#fef2f2;padding:11px 16px;margin:0 0 20px;border-radius:0 6px 6px 0;color:#991b1b;font-size:10.5pt;">
  <strong>Observación crítica:</strong> La permanencia de interferencias eléctricas excede la ventana originalmente comprometida, generando extensión de permanencia del proveedor en sitio.
</blockquote>

<!-- IV. DESVIACIÓN 02 -->
<h2 style="font-size:12.5pt;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid #fee2e2;">IV. Desviación 02 — Detención de Maniobra por Seguridad Planta</h2>
<p style="font-size:10.5pt;color:#6b7280;margin-bottom:12px;"><strong>Fecha del evento:</strong> ${v.fecha_evento}</p>
<p style="font-size:11pt;color:#374151;margin-bottom:10px;">La maniobra fue suspendida bajo los siguientes argumentos:</p>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:14px;line-height:1.85;">
  <li>Falta de respaldo técnico.</li>
  <li>Inexistencia de plan de izaje.</li>
  <li>Supuesta tardanza excesiva.</li>
  <li>Cuestionamiento de competencia operativa.</li>
</ul>
<h3 style="font-size:10.5pt;font-weight:700;color:#374151;margin:14px 0 10px;">Hechos objetivos:</h3>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:10pt;">
  <thead>
    <tr>
      <th style="background:#1e3a5f;color:#fff;padding:8px 12px;text-align:left;width:60%;">Hecho</th>
      <th style="background:#1e3a5f;color:#fff;padding:8px 12px;text-align:center;width:40%;">Estado</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:8px 12px;">Plan de Izaje formal</td>
      <td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:center;color:#16a34a;font-weight:600;">✅ Documentado</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="border:1px solid #e5e7eb;padding:8px 12px;">Cálculo estructural</td>
      <td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:center;color:#16a34a;font-weight:600;">✅ Elaborado</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:8px 12px;">Matriz de riesgos</td>
      <td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:center;color:#16a34a;font-weight:600;">✅ Definida</td>
    </tr>
    <tr style="background:#f9fafb;">
      <td style="border:1px solid #e5e7eb;padding:8px 12px;">Protocolo Stop-Work — causa</td>
      <td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:center;color:#dc2626;font-weight:600;">⚠ Interferencia geométrica</td>
    </tr>
    <tr>
      <td style="border:1px solid #e5e7eb;padding:8px 12px;">Requerimiento formal previo de entrega documental</td>
      <td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:center;color:#dc2626;font-weight:600;">❌ No existió</td>
    </tr>
  </tbody>
</table>
<h3 style="font-size:10.5pt;font-weight:700;color:#374151;margin:14px 0 10px;">Impacto económico directo — Desviación 02:</h3>
<table style="width:100%;border-collapse:collapse;margin-bottom:18px;font-size:10pt;">
  <thead>
    <tr>
      <th style="background:#1e3a5f;color:#fff;padding:8px 12px;text-align:left;">Concepto</th>
      <th style="background:#1e3a5f;color:#fff;padding:8px 12px;text-align:right;width:30%;">Impacto</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border:1px solid #e5e7eb;padding:8px 12px;">Reprogramación de grúa</td><td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:right;">Por cuantificar</td></tr>
    <tr style="background:#f9fafb;"><td style="border:1px solid #e5e7eb;padding:8px 12px;">Logística adicional</td><td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:right;">Por cuantificar</td></tr>
    <tr><td style="border:1px solid #e5e7eb;padding:8px 12px;">Personal especializado en sitio</td><td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:right;">Por cuantificar</td></tr>
    <tr style="background:#f9fafb;"><td style="border:1px solid #e5e7eb;padding:8px 12px;">Costos asociados a equipo de izaje</td><td style="border:1px solid #e5e7eb;padding:8px 12px;text-align:right;">Por cuantificar</td></tr>
    <tr style="background:#1e3a5f;color:#fff;"><td style="padding:10px 12px;font-weight:700;font-size:11pt;">IMPACTO ESTIMADO</td><td style="padding:10px 12px;text-align:right;font-weight:700;font-size:11pt;">${v.impacto_mxn}</td></tr>
  </tbody>
</table>

<!-- V. CONDICIÓN GEOMÉTRICA -->
<h2 style="font-size:12.5pt;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;">V. Condición Geométrica del Sitio</h2>
<p style="font-size:11pt;color:#374151;margin-bottom:10px;">El análisis técnico demostró:</p>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:10px;line-height:1.85;">
  <li>Altura requerida de giro: <strong>${v.altura_giro} m</strong>.</li>
  <li>Existencia de tubería e infraestructura invadiendo el arco de rotación.</li>
  <li>Imposibilidad física de ejecutar verticalización estándar.</li>
</ul>
<blockquote style="border-left:4px solid #3b82f6;background:#eff6ff;padding:11px 16px;margin:0 0 20px;border-radius:0 6px 6px 0;color:#1e40af;font-size:10.5pt;">
  La suspensión fue consecuencia directa de <strong>interferencia estructural del sitio</strong>, no de error técnico del proveedor.
</blockquote>

<!-- VI. EFECTO ACUMULADO -->
<h2 style="font-size:12.5pt;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;">VI. Efecto Acumulado de Desviaciones</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px;">
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px;">
    <p style="font-size:9.5pt;font-weight:700;color:#dc2626;text-transform:uppercase;margin-bottom:8px;">Causas de extensión</p>
    <ul style="font-size:10pt;color:#374151;padding-left:18px;margin:0;line-height:1.8;">
      <li>No liberación eléctrica oportuna</li>
      <li>Interferencias internas de planta</li>
      <li>Detención unilateral de maniobra</li>
      <li>Validaciones extemporáneas</li>
    </ul>
  </div>
  <div style="background:#fef9c3;border:1px solid #fde68a;border-radius:8px;padding:14px;">
    <p style="font-size:9.5pt;font-weight:700;color:#92400e;text-transform:uppercase;margin-bottom:8px;">Consecuencias generadas</p>
    <ul style="font-size:10pt;color:#374151;padding-left:18px;margin:0;line-height:1.8;">
      <li>Incremento en costos indirectos</li>
      <li>Extensión de permanencia en sitio</li>
      <li>Reprogramación logística</li>
      <li>Exposición financiera adicional</li>
    </ul>
  </div>
</div>

<!-- VII. EQUILIBRIO ECONÓMICO -->
<h2 style="font-size:12.5pt;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;">VII. Preservación del Equilibrio Económico</h2>
<p style="font-size:11pt;color:#374151;margin-bottom:10px;">Conforme a principios básicos de equilibrio contractual:</p>
<blockquote style="border-left:4px solid #1d4ed8;background:#eff6ff;padding:11px 16px;margin:0 0 14px;border-radius:0 6px 6px 0;color:#1e40af;font-size:10.5pt;">
  Cuando el cronograma y las condiciones operativas se ven modificadas por causas ajenas al proveedor, el impacto económico derivado <strong>debe ser reconocido</strong>.
</blockquote>
<p style="font-size:10.5pt;color:#374151;margin-bottom:6px;">GRUPO MICSA deja constancia formal de que:</p>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:20px;line-height:1.85;">
  <li>Los eventos descritos generan <strong>afectación económica acumulativa</strong>.</li>
  <li>Dichos impactos serán cuantificados y presentados como estimación adicional en su momento.</li>
</ul>

<!-- VIII. GESTIÓN INTERNA DEL CLIENTE -->
<h2 style="font-size:12.5pt;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;">VIII. Consideración para Gestión Interna del Cliente</h2>
<p style="font-size:11pt;color:#374151;margin-bottom:10px;">El presente informe tiene como objetivo permitir que el cliente:</p>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:10px;line-height:1.85;">
  <li>Documente internamente las causas del impacto.</li>
  <li>Traslade a planta los costos derivados de interferencias.</li>
  <li>Evite controversias futuras por falta de notificación.</li>
</ul>
<p style="font-size:10.5pt;color:#374151;margin-bottom:20px;">Se deja asentado que la presente comunicación cumple con la <strong>obligación de aviso oportuno</strong>.</p>

<!-- IX. RESERVA FORMAL -->
<h2 style="font-size:12.5pt;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid #fee2e2;">IX. Reserva Formal</h2>
<p style="font-size:11pt;color:#374151;margin-bottom:10px;">GRUPO MICSA se reserva el derecho de:</p>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:20px;line-height:1.85;">
  <li>Presentar estimación adicional por tiempos improductivos.</li>
  <li>Ajustar cronograma contractual.</li>
  <li>Reclamar impacto directo derivado de suspensión de maniobra.</li>
  <li>Solicitar reconocimiento económico por extensión operativa.</li>
</ul>

<!-- X. SOLICITUD DE VALIDACIÓN -->
<h2 style="font-size:12.5pt;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;">X. Solicitud de Validación</h2>
<p style="font-size:11pt;color:#374151;margin-bottom:10px;">Se solicita:</p>
<ul style="font-size:10.5pt;color:#374151;padding-left:22px;margin-bottom:24px;line-height:1.85;">
  <li>Firma de recepción del presente informe.</li>
  <li>Confirmación formal de liberación eléctrica definitiva.</li>
  <li>Validación técnica del plan de izaje.</li>
  <li>Definición de nuevo cronograma ajustado.</li>
</ul>

<!-- XI. FIRMAS -->
<h2 style="font-size:12.5pt;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.04em;margin:24px 0 20px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;">XI. Firmas</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px;">
  <div>
    <div style="border-top:1px solid #9ca3af;padding-top:10px;margin-top:48px;">
      <p style="font-size:10.5pt;font-weight:600;color:#1e293b;margin:0;">${v.responsable}</p>
      <p style="font-size:9.5pt;color:#6b7280;margin:2px 0 0;">Proveedor — GRUPO MICSA</p>
    </div>
  </div>
  <div>
    <div style="border-top:1px solid #9ca3af;padding-top:10px;margin-top:48px;">
      <p style="font-size:10.5pt;font-weight:600;color:#1e293b;margin:0;">___________________________</p>
      <p style="font-size:9.5pt;color:#6b7280;margin:2px 0 0;">Cliente — ${v.cliente}</p>
    </div>
  </div>
  <div>
    <div style="border-top:1px solid #9ca3af;padding-top:10px;margin-top:48px;">
      <p style="font-size:10.5pt;font-weight:600;color:#1e293b;margin:0;">___________________________</p>
      <p style="font-size:9.5pt;color:#6b7280;margin:2px 0 0;">Seguridad Planta</p>
    </div>
  </div>
  <div>
    <div style="border-top:1px solid #9ca3af;padding-top:10px;margin-top:48px;">
      <p style="font-size:10.5pt;font-weight:600;color:#1e293b;margin:0;">Fecha: ${v.fecha}</p>
      <p style="font-size:9.5pt;color:#6b7280;margin:2px 0 0;">Lugar de firma</p>
    </div>
  </div>
</div>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:8px 0 12px;" />
<div style="display:flex;justify-content:space-between;align-items:center;font-size:8.5pt;color:#9ca3af;">
  <span>GRUPO MICSA — Montajes e Izajes del Centro S.A. de C.V.</span>
  <span>Informe de Desviaciones — Semana ${v.semana} — ${v.fecha}</span>
</div>
      `;
      return createPdfTemplate({
        header: { docType: 'Informe de Desviaciones', date: v.fecha, folio: 'DEV-' + v.semana },
        content: content,
        footer: 'Informe de Desviaciones Operativas — ' + v.cliente
      });
    }},

  cotizacion_formal: {
    title: 'Cotización Formal',
    variables: [
      'folio', 'fecha', 'vigencia',
      'cliente_nombre', 'cliente_rfc', 'cliente_domicilio', 'cliente_regimen',
      'proyecto_nombre', 'proyecto_duracion', 'cliente_final', 'servicio', 'ubicacion', 'turno', 'num_personas',
      'concepto1_desc', 'concepto1_qty', 'concepto1_unit', 'concepto1_subtotal',
      'concepto2_desc', 'concepto2_qty', 'concepto2_unit', 'concepto2_subtotal',
      'concepto3_desc', 'concepto3_qty', 'concepto3_unit', 'concepto3_subtotal',
      'concepto4_desc', 'concepto4_qty', 'concepto4_unit', 'concepto4_subtotal',
      'concepto5_desc', 'concepto5_qty', 'concepto5_unit', 'concepto5_subtotal',
      'gestion_pct',
      'banco', 'beneficiario', 'cuenta', 'clabe',
      'condicion_pago', 'vigencia_dias',
    ],
    varLabels: {
      folio: 'Folio (ej. COT-2025-001)',
      fecha: 'Fecha',
      vigencia: 'Vigencia',
      cliente_nombre: 'Nombre del cliente',
      cliente_rfc: 'RFC del cliente',
      cliente_domicilio: 'Domicilio del cliente',
      cliente_regimen: 'Régimen fiscal',
      proyecto_nombre: 'Nombre del proyecto',
      proyecto_duracion: 'Duración',
      cliente_final: 'Cliente final',
      servicio: 'Tipo de servicio',
      ubicacion: 'Ubicación',
      turno: 'Turno',
      num_personas: 'No. de personas',
      concepto1_desc: 'Concepto 1 — Descripción',
      concepto1_qty: 'Concepto 1 — Cantidad/Tiempo',
      concepto1_unit: 'Concepto 1 — Precio Unitario (MXN)',
      concepto1_subtotal: 'Concepto 1 — Subtotal (MXN)',
      concepto2_desc: 'Concepto 2 — Descripción',
      concepto2_qty: 'Concepto 2 — Cantidad/Tiempo',
      concepto2_unit: 'Concepto 2 — Precio Unitario (MXN)',
      concepto2_subtotal: 'Concepto 2 — Subtotal (MXN)',
      concepto3_desc: 'Concepto 3 — Descripción',
      concepto3_qty: 'Concepto 3 — Cantidad/Tiempo',
      concepto3_unit: 'Concepto 3 — Precio Unitario (MXN)',
      concepto3_subtotal: 'Concepto 3 — Subtotal (MXN)',
      concepto4_desc: 'Concepto 4 — Descripción',
      concepto4_qty: 'Concepto 4 — Cantidad/Tiempo',
      concepto4_unit: 'Concepto 4 — Precio Unitario (MXN)',
      concepto4_subtotal: 'Concepto 4 — Subtotal (MXN)',
      concepto5_desc: 'Concepto 5 — Descripción',
      concepto5_qty: 'Concepto 5 — Cantidad/Tiempo',
      concepto5_unit: 'Concepto 5 — Precio Unitario (MXN)',
      concepto5_subtotal: 'Concepto 5 — Subtotal (MXN)',
      gestion_pct: 'Gestión MICSA (%)',
      banco: 'Banco',
      beneficiario: 'Beneficiario',
      cuenta: 'No. de Cuenta',
      clabe: 'CLABE',
      condicion_pago: 'Condición de pago',
      vigencia_dias: 'Vigencia (días)',
    },
    defaults: {
      folio: 'COT-2025-001',
      fecha: today(),
      vigencia: '15 días naturales',
      cliente_nombre: 'MONTAJES E IZAJES DEL CENTRO INDUSTRIAL CONTRACTOR SA DE CV',
      cliente_rfc: 'MIC2301268S5',
      cliente_domicilio: 'Calle Guerrero Sur #108, Col. Monclova Centro, Monclova, Coahuila',
      cliente_regimen: 'Régimen General de Ley Personas Morales',
      proyecto_nombre: 'iron cast OC43766',
      proyecto_duracion: '6 meses (24 sem)',
      cliente_final: 'IRON CAST',
      servicio: 'MANTENIMIENTO',
      ubicacion: 'LOCAL',
      turno: 'DIURNO',
      num_personas: '6',
      concepto1_desc: 'Nómina y Mano de Obra\nIncluye salarios, prestaciones y administración',
      concepto1_qty: '6 pers × 24 sem',
      concepto1_unit: '6489.25',
      concepto1_subtotal: '934452.00',
      concepto2_desc: 'IMSS y Cargas Sociales',
      concepto2_qty: '6 pers × 6 meses',
      concepto2_unit: '1489.25',
      concepto2_subtotal: '53613.00',
      concepto3_desc: 'EPP (Equipo de Protección Personal)',
      concepto3_qty: '1 kit completo',
      concepto3_unit: '16732.54',
      concepto3_subtotal: '16732.54',
      concepto4_desc: 'Herramientas y Equipo Menor',
      concepto4_qty: '1 lote',
      concepto4_unit: '25000.00',
      concepto4_subtotal: '25000.00',
      concepto5_desc: 'Logística',
      concepto5_qty: 'N/A',
      concepto5_unit: '0',
      concepto5_subtotal: '0.00',
      gestion_pct: '15',
      banco: 'BBVA México',
      beneficiario: 'Montajes e Izajes del Centro Industrial Contractor SA de CV',
      cuenta: '0123456789',
      clabe: '012760001234567890',
      condicion_pago: '50% anticipo, 50% contra entrega',
      vigencia_dias: '15',
    },
    html: (v) => {
      const fmt = (n) => Number(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const sub1 = Number(v.concepto1_subtotal || 0);
      const sub2 = Number(v.concepto2_subtotal || 0);
      const sub3 = Number(v.concepto3_subtotal || 0);
      const sub4 = Number(v.concepto4_subtotal || 0);
      const sub5 = Number(v.concepto5_subtotal || 0);
      const subtotalDirecto = sub1 + sub2 + sub3 + sub4 + sub5;
      const gestionPct = Number(v.gestion_pct || 15) / 100;
      const gestionMonto = subtotalDirecto * gestionPct;
      const subtotalBase = subtotalDirecto + gestionMonto;
      const iva = subtotalBase * 0.16;
      const total = subtotalBase + iva;

      const formatDesc = (txt) => {
        if (!txt) return '';
        const lines = txt.split('\n');
        const title = lines[0];
        const rest = lines.slice(1).join('<br/>');
        return `<div style="font-weight:700;color:#000;">${title}</div>` +
               (rest ? `<div style="color:#666;font-size:8pt;margin-top:2px;line-height:1.2;">${rest}</div>` : '');
      };

      const content = `
<div style="font-family:'Arial',Helvetica,sans-serif;font-size:9.5pt;color:#333;line-height:1.4;">

  <!-- DATOS CLIENTE + PROYECTO -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
    <div style="border:1px solid #ddd;border-radius:6px;overflow:hidden;">
      <div style="background:#1f4e78;color:#fff;padding:4px 10px;font-size:8.5pt;font-weight:700;text-transform:uppercase;">Datos del Cliente</div>
      <div style="padding:8px 10px;font-size:8.5pt;min-height:75px;">
        <div style="font-weight:700;margin-bottom:4px;color:#000;">${v.cliente_nombre}</div>
        <div style="margin-bottom:2px;"><span style="font-weight:700;color:#555;margin-right:4px;">RFC:</span>${v.cliente_rfc}</div>
        <div style="margin-bottom:2px;"><span style="font-weight:700;color:#555;margin-right:4px;">Reg:</span>${v.cliente_regimen}</div>
        <div><span style="font-weight:700;color:#555;margin-right:4px;">Dom:</span>${v.cliente_domicilio}</div>
      </div>
    </div>
    <div style="border:1px solid #ddd;border-radius:6px;overflow:hidden;">
      <div style="background:#1f4e78;color:#fff;padding:4px 10px;font-size:8.5pt;font-weight:700;text-transform:uppercase;">Datos del Proyecto</div>
      <div style="padding:10px;font-size:8.5pt;display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;min-height:75px;">
        <div><span style="font-weight:700;color:#555;">Proyecto:</span> ${v.proyecto_nombre}</div>
        <div><span style="font-weight:700;color:#555;">Duración:</span> ${v.proyecto_duracion}</div>
        <div><span style="font-weight:700;color:#555;">Cliente Final:</span> ${v.cliente_final}</div>
        <div><span style="font-weight:700;color:#555;">Servicio:</span> ${v.servicio}</div>
        <div><span style="font-weight:700;color:#555;">Personal:</span> ${v.num_personas} pers.</div>
        <div><span style="font-weight:700;color:#555;">Turno:</span> ${v.turno}</div>
      </div>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse;font-size:8.5pt;margin-bottom:15px;">
    <thead>
      <tr>
        <th style="background:#1f4e78;color:#fff;padding:8px 10px;text-align:left;border:1px solid #1f4e78;width:40%;">CONCEPTO / DESCRIPCIÓN</th>
        <th style="background:#1f4e78;color:#fff;padding:8px 10px;text-align:center;border:1px solid #1f4e78;width:20%;">CANTIDAD</th>
        <th style="background:#1f4e78;color:#fff;padding:8px 10px;text-align:right;border:1px solid #1f4e78;width:20%;">PRECIO UNIT.</th>
        <th style="background:#1f4e78;color:#fff;padding:8px 10px;text-align:right;border:1px solid #1f4e78;width:20%;">SUBTOTAL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border:1px solid #ddd;padding:6px 10px;">${formatDesc(v.concepto1_desc)}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">${v.concepto1_qty}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">$${fmt(v.concepto1_unit)}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:700;">$${fmt(sub1)}</td>
      </tr>
      <tr style="background:#f9fafb;">
        <td style="border:1px solid #ddd;padding:6px 10px;">${formatDesc(v.concepto2_desc)}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">${v.concepto2_qty}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">$${fmt(v.concepto2_unit)}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:700;">$${fmt(sub2)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd;padding:6px 10px;">${formatDesc(v.concepto3_desc)}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">${v.concepto3_qty}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">$${fmt(v.concepto3_unit)}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:700;">$${fmt(sub3)}</td>
      </tr>
      <tr style="background:#f9fafb;">
        <td style="border:1px solid #ddd;padding:6px 10px;">${formatDesc(v.concepto4_desc)}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">${v.concepto4_qty}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">$${fmt(v.concepto4_unit)}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:700;">$${fmt(sub4)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd;padding:6px 10px;">${v.concepto5_desc ? formatDesc(v.concepto5_desc) : '—'}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">${v.concepto5_qty || 'N/A'}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">${Number(v.concepto5_unit) > 0 ? '$' + fmt(v.concepto5_unit) : '-'}</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:700;">$${fmt(sub5)}</td>
      </tr>
      <tr style="background:#f1f5f9;font-weight:700;">
        <td colspan="3" style="text-align:right;padding:6px 10px;border:1px solid #ddd;border-top:2px solid #1f4e78;">SUBTOTAL DIRECTO:</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;border-top:2px solid #1f4e78;">$${fmt(subtotalDirecto)}</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align:right;padding:6px 10px;border:1px solid #ddd;">Gestión Administrativa MICSA (${v.gestion_pct}%):</td>
        <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">$${fmt(gestionMonto)}</td>
      </tr>
    </tbody>
  </table>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;">
    <div>
      <div style="background:#555;color:#fff;padding:4px 10px;font-size:8.5pt;font-weight:700;text-transform:uppercase;border-radius:4px 4px 0 0;">Condiciones Comerciales</div>
      <div style="border:1px solid #eee;border-left:5px solid #f5a623;padding:10px;font-size:8pt;line-height:1.5;">
        <ul style="margin:0;padding-left:14px;">
          <li>Precios en Moneda Nacional (MXN) + IVA 16%</li>
          <li>Vigencia: ${v.vigencia_dias} días naturales (${v.vigencia})</li>
          <li><strong>Forma de pago:</strong> ${v.condicion_pago}</li>
          <li>Tiempo de arranque: 5-7 días hábiles tras anticipo</li>
          <li>Incluye: EPP completo, IMSS, nómina, gestión MICSA</li>
        </ul>
      </div>
      <div style="margin-top:12px;">
        <div style="background:#555;color:#fff;padding:4px 10px;font-size:8.5pt;font-weight:700;text-transform:uppercase;border-radius:4px 4px 0 0;">Datos Bancarios</div>
        <div style="border:1px solid #ddd;padding:10px;font-size:8pt;background:#fafafa;">
          <div style="font-weight:700;margin-bottom:3px;color:#1f4e78;">${v.banco}</div>
          <div><strong>Beneficiario:</strong> ${v.beneficiario}</div>
          <div style="margin-top:3px;"><strong>Cuenta:</strong> ${v.cuenta} | <strong>CLABE:</strong> ${v.clabe}</div>
        </div>
      </div>
    </div>

    <div>
      <div style="border:2px solid #1f4e78;border-radius:6px;overflow:hidden;font-size:9pt;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <div style="display:flex;justify-content:space-between;padding:6px 12px;border-bottom:1px solid #eee;">
          <span>Subtotal Directo:</span><span style="font-weight:600;">$${fmt(subtotalDirecto)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 12px;border-bottom:1px solid #eee;">
          <span>Gestión Administrativa (${v.gestion_pct}%):</span><span style="font-weight:600;">$${fmt(gestionMonto)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 12px;border-bottom:1px solid #ddd;background:#f8faff;font-weight:700;color:#1f4e78;">
          <span>SUBTOTAL BASE:</span><span>$${fmt(subtotalBase)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 12px;border-bottom:1px solid #eee;">
          <span>IVA (16%):</span><span style="font-weight:600;">$${fmt(iva)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 12px;background:#1f4e78;color:#fff;font-weight:900;font-size:11pt;">
          <span>TOTAL COTIZACIÓN:</span><span>$${fmt(total)} MXN</span>
        </div>
      </div>
      <div style="text-align:center;margin-top:30px;">
        <div style="border-bottom:1px solid #555;width:220px;margin:0 auto 6px;height:45px;"></div>
        <div style="font-size:8.5pt;font-weight:800;color:#1f4e78;">AUTORIZACIÓN / FIRMA</div>
        <div style="font-size:7.5pt;color:#666;text-transform:uppercase;letter-spacing:0.5px;">MICSA Industrial SA de CV</div>
      </div>
    </div>
  </div>

</div>
      `;
      return createPdfTemplate({
        header: { docType: 'Cotización Formal', date: v.fecha, folio: v.folio },
        content: content,
        footer: 'Cotización válida por ' + v.vigencia_dias + ' días — ' + v.cliente_nombre
      });
    },
  },

  // ── PLAN DE IZAJE ─────────────────────────────────────────────────
  plan_izaje: {
    title: 'Plan de Izaje',
    variables: [
      'folio', 'fecha', 'proyecto', 'cliente', 'ubicacion', 'elaboro',
      'reviso', 'aprueba', 'equipo_izaje', 'capacidad_ton',
      'carga_real_ton', 'radio_operacion', 'altura_izaje',
      'rigger', 'operador', 'senalero',
    ],
    varLabels: {
      folio: 'Folio / Número',
      fecha: 'Fecha',
      proyecto: 'Proyecto / Descripción',
      cliente: 'Cliente / Empresa',
      ubicacion: 'Ubicación / Planta',
      elaboro: 'Elaboró (nombre)',
      reviso: 'Revisó (nombre)',
      aprueba: 'Aprueba (nombre)',
      equipo_izaje: 'Equipo de izaje (grúa/montacargas)',
      capacidad_ton: 'Capacidad del equipo (Ton)',
      carga_real_ton: 'Peso de la carga real (Ton)',
      radio_operacion: 'Radio de operación (m)',
      altura_izaje: 'Altura de izaje (m)',
      rigger: 'Rigger / Aparejador',
      operador: 'Operador de grúa',
      senalero: 'Señalero',
    },
    defaults: {
      folio: 'PI-2026-001',
      fecha: '',
      proyecto: 'Maniobra de izaje',
      cliente: 'MICSA Industrial S.A. de C.V.',
      ubicacion: 'La Madrid 500, Monclova, Coahuila',
      elaboro: '',
      reviso: '',
      aprueba: '',
      equipo_izaje: 'Grúa telescópica',
      capacidad_ton: '',
      carga_real_ton: '',
      radio_operacion: '',
      altura_izaje: '',
      rigger: '',
      operador: '',
      senalero: '',
    },
    html: (v) => {
      const content = `
<div style="font-family:Arial,Helvetica,sans-serif;color:#111;font-size:10.5pt;">

<!-- SECCIÓN 1: IDENTIFICACIÓN -->
<table style="width:100%;border-collapse:collapse;margin-top:-2px;">
  <tr>
    <td colspan="4" style="background:#1f4e78;color:#fff;font-weight:700;font-size:9pt;padding:6px 14px;letter-spacing:.06em;text-transform:uppercase;">
      1. Identificación del Proyecto
    </td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;width:16%;background:#f8fafc;">Proyecto:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:10pt;font-weight:700;" colspan="3">${v.proyecto || 'Descripción de la maniobra'}</td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Cliente:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:9.5pt;">${v.cliente || ''}</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;width:16%;">Ubicación:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:9.5pt;">${v.ubicacion || ''}</td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Elaboró:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;">${v.elaboro || ''}</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Revisó:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;">${v.reviso || ''}</td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Aprueba:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;" colspan="3">${v.aprueba || ''}</td>
  </tr>
</table>

<!-- SECCIÓN 2: EQUIPO DE IZAJE -->
<table style="width:100%;border-collapse:collapse;margin-top:10px;">
  <tr>
    <td colspan="4" style="background:#1f4e78;color:#fff;font-weight:700;font-size:9pt;padding:6px 14px;letter-spacing:.06em;text-transform:uppercase;">
      2. Datos del Equipo de Izaje
    </td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;width:22%;">Equipo de izaje:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:9.5pt;">${v.equipo_izaje || 'Grúa telescópica'}</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;width:22%;">Capacidad nominal (Ton):</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:9.5pt;font-weight:700;">${v.capacidad_ton || '___'} Ton</td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Peso de la carga (Ton):</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:10pt;font-weight:900;color:#dc2626;">${v.carga_real_ton || '___'} Ton</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">% Utilización:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:10pt;font-weight:900;color:${(+v.carga_real_ton / +v.capacidad_ton * 100) > 75 ? '#dc2626' : '#16a34a'};">
      ${v.carga_real_ton && v.capacidad_ton ? (((+v.carga_real_ton) / (+v.capacidad_ton)) * 100).toFixed(1) + '%' : '___%'}
    </td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Radio de operación (m):</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;">${v.radio_operacion || '___'} m</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Altura de izaje (m):</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;">${v.altura_izaje || '___'} m</td>
  </tr>
</table>

<!-- SECCIÓN 3: PERSONAL -->
<table style="width:100%;border-collapse:collapse;margin-top:10px;">
  <tr>
    <td colspan="4" style="background:#1f4e78;color:#fff;font-weight:700;font-size:9pt;padding:6px 14px;letter-spacing:.06em;text-transform:uppercase;">
      3. Personal Involucrado
    </td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Rigger / Aparejador:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;">${v.rigger || ''}</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Operador de grúa:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;">${v.operador || ''}</td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Señalero:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;">${v.senalero || ''}</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;font-size:8.5pt;font-weight:700;color:#475569;background:#f8fafc;">Supervisor MICSA:</td>
    <td style="border:1px solid #cbd5e1;padding:6px 10px;">&nbsp;</td>
  </tr>
</table>

<!-- SECCIÓN 4: CONDICIONES PREVIAS -->
<table style="width:100%;border-collapse:collapse;margin-top:10px;">
  <tr>
    <td colspan="3" style="background:#1f4e78;color:#fff;font-weight:700;font-size:9pt;padding:6px 14px;letter-spacing:.06em;text-transform:uppercase;">
      4. Lista de Verificación Previa (Checklist)
    </td>
  </tr>
  <tr style="background:#f8fafc;">
    <td style="border:1px solid #cbd5e1;padding:5px 10px;font-size:8.5pt;font-weight:700;width:55%;">Condición</td>
    <td style="border:1px solid #cbd5e1;padding:5px 10px;font-size:8.5pt;font-weight:700;text-align:center;width:12%;">Cumple</td>
    <td style="border:1px solid #cbd5e1;padding:5px 10px;font-size:8.5pt;font-weight:700;text-align:center;width:12%;">N/A</td>
  </tr>
  ${[
        'Operador cuenta con licencia vigente para operación de grúa',
        'Rigger certificado y con experiencia documentada',
        'Grúa con certificado de mantenimiento y prueba de carga vigente',
        'Eslingas, grilletes y aparejos inspeccionados y en buen estado',
        'Zona de maniobra delimitada y señalizada',
        'Sin líneas eléctricas en área de barrido de la pluma',
        'Protocolo de señas acordado entre operador, rigger y señalero',
        'Condiciones meteorológicas aceptables (viento < 40 km/h)',
        'EPP completo: casco, guantes, calzado de seguridad, chaleco',
        'Radio de comunicación operativo entre operador y señalero',
        'Zona de exclusión establecida (1.5× altura de izaje)',
        'Análisis de Riesgo de Maniobra (ARM) firmado por todos',
      ].map(c => `
  <tr>
    <td style="border:1px solid #cbd5e1;padding:5px 10px;font-size:8.5pt;">${c}</td>
    <td style="border:1px solid #cbd5e1;padding:5px;text-align:center;font-size:12pt;">☐</td>
    <td style="border:1px solid #cbd5e1;padding:5px;text-align:center;font-size:12pt;">☐</td>
  </tr>`).join('')}
</table>

<!-- SECCIÓN 5: DIAGRAMA / CROQUIS -->
<table style="width:100%;border-collapse:collapse;margin-top:10px;">
  <tr>
    <td colspan="2" style="background:#1f4e78;color:#fff;font-weight:700;font-size:9pt;padding:6px 14px;letter-spacing:.06em;text-transform:uppercase;">
      5. Croquis / Diagrama de Maniobra
    </td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:14px;height:160px;vertical-align:top;">
      <div style="border:2px dashed #94a3b8;border-radius:6px;height:140px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:9pt;font-style:italic;">
        [ Insertar croquis o diagrama de la maniobra — puede anexar imagen ]
      </div>
    </td>
  </tr>
</table>

<!-- SECCIÓN 6: OBSERVACIONES -->
<table style="width:100%;border-collapse:collapse;margin-top:10px;">
  <tr>
    <td style="background:#1f4e78;color:#fff;font-weight:700;font-size:9pt;padding:6px 14px;letter-spacing:.06em;text-transform:uppercase;">
      6. Observaciones y Restricciones Especiales
    </td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:10px;font-size:9pt;min-height:60px;">
      &nbsp;<br>&nbsp;<br>&nbsp;
    </td>
  </tr>
</table>

<!-- SECCIÓN 7: FIRMAS -->
<table style="width:100%;border-collapse:collapse;margin-top:12px;">
  <tr>
    <td colspan="3" style="background:#1f4e78;color:#fff;font-weight:700;font-size:9pt;padding:6px 14px;letter-spacing:.06em;text-transform:uppercase;">
      7. Firmas de Autorización
    </td>
  </tr>
  <tr>
    <td style="border:1px solid #cbd5e1;padding:10px 14px;text-align:center;width:33%;">
      <div style="border-bottom:1.5px solid #222;height:50px;margin-bottom:6px;"></div>
      <div style="font-size:8.5pt;font-weight:700;">${v.elaboro || 'Elaboró'}</div>
      <div style="font-size:7.5pt;color:#64748b;">Rigger / Responsable de maniobra</div>
    </td>
    <td style="border:1px solid #cbd5e1;padding:10px 14px;text-align:center;width:33%;">
      <div style="border-bottom:1.5px solid #222;height:50px;margin-bottom:6px;"></div>
      <div style="font-size:8.5pt;font-weight:700;">${v.reviso || 'Revisó'}</div>
      <div style="font-size:7.5pt;color:#64748b;">Supervisor de Seguridad</div>
    </td>
    <td style="border:1px solid #cbd5e1;padding:10px 14px;text-align:center;width:33%;">
      <div style="border-bottom:1.5px solid #222;height:50px;margin-bottom:6px;"></div>
      <div style="font-size:8.5pt;font-weight:700;">${v.aprueba || 'Aprueba'}</div>
      <div style="font-size:7.5pt;color:#64748b;">Gerente / Superintendente</div>
    </td>
  </tr>
</table>

<!-- PIE DE PÁGINA -->
<div style="margin-top:12px;padding-top:8px;border-top:2px solid #1f4e78;display:flex;justify-content:space-between;font-size:7.5pt;color:#64748b;">
  <span>MICSA Industrial S.A. de C.V. | La Madrid 500, Monclova, Coahuila | RFC: MIC2301268S5 | Tel: (866) 176-6621</span>
  <span>Folio: ${v.folio || 'PI-2026-001'} | ${v.fecha || ''}</span>
</div>

</div>
      `;
      return createPdfTemplate({
        header: { docType: 'Plan de Izaje', date: v.fecha, folio: v.folio },
        content: content,
        footer: 'Plan de Maniobra de Izaje — NOM-006-STPS-2014 — ' + v.cliente
      });
    },
  },

};



// ==================== UTILITIES ====================
function today() {
  const d = new Date();
  return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
}

function notify(msg, type = 'info') {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `
    position:fixed;bottom:40px;left:50%;transform:translateX(-50%) translateY(20px);
    background:${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#3b82f6'};
    color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:500;
    z-index:9999;opacity:0;transition:all .3s;box-shadow:0 4px 20px rgba(0,0,0,.4);
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

// ==================== EDITOR COMMANDS ====================
function execCmd(cmd, val = null) {
  document.getElementById('editor').focus();
  document.execCommand(cmd, false, val);
}

function insertHR() {
  const editor = document.getElementById('editor');
  editor.focus();
  document.execCommand('insertHTML', false, '<hr/>');
}

function insertBlockquote() {
  const editor = document.getElementById('editor');
  editor.focus();
  const html = '<blockquote style="border-left:4px solid #3b82f6;background:#eff6ff;padding:12px 16px;margin:14px 0;border-radius:0 8px 8px 0;color:#1e40af;">Nota o cita destacada aquí...</blockquote><p><br/></p>';
  document.execCommand('insertHTML', false, html);
}

// ==================== MINIMAP ====================
function updateMinimap() {
  const editor = document.getElementById('editor');
  const minimap = document.getElementById('minimap');
  if (!minimap) return;

  const headings = editor.querySelectorAll('h1, h2, h3, p');
  minimap.innerHTML = '';

  let count = 0;
  headings.forEach((el) => {
    if (count >= 12) return;
    if (el.tagName === 'P' && !el.textContent.trim()) return;
    const tag = el.tagName.toLowerCase();
    const item = document.createElement('div');
    item.className = 'minimap-item';
    item.title = el.textContent.slice(0, 40);
    item.onclick = () => el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const line = document.createElement('div');
    line.className = `minimap-line ${tag}`;
    item.appendChild(line);
    minimap.appendChild(item);
    count++;
  });
}

function insertTable() {
  const rows = prompt('¿Cuántas filas?', '3');
  const cols = prompt('¿Cuántas columnas?', '3');
  if (!rows || !cols) return;
  let html = '<table style="width:100%;border-collapse:collapse;margin-bottom:14px;">';
  html += '<thead><tr>';
  for (let c = 0; c < +cols; c++) html += `<th style="background:#1e3a5f;color:#fff;padding:8px 12px;text-align:left;font-size:10pt;">Columna ${c + 1}</th>`;
  html += '</tr></thead><tbody>';
  for (let r = 0; r < +rows; r++) {
    html += r % 2 === 0 ? '<tr>' : '<tr style="background:#f8fafc;">';
    for (let c = 0; c < +cols; c++) html += '<td style="border:1px solid #e2e8f0;padding:8px 12px;font-size:10pt;">Celda</td>';
    html += '</tr>';
  }
  html += '</tbody></table>';
  const editor = document.getElementById('editor');
  editor.focus();
  document.execCommand('insertHTML', false, html);
}

function insertHeading(tag) {
  if (!tag) return;
  document.getElementById('editor').focus();
  document.execCommand('formatBlock', false, `<${tag}>`);
  const sel = document.querySelector('#toolbar select:last-of-type');
  if (sel) sel.value = '';
}

function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveDocument();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault();
    exportPDF();
  }
}

// ==================== WORD COUNT ====================
function updateStats() {
  const text = document.getElementById('editor').innerText || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  document.getElementById('word-count').textContent = `${words} palabras`;
  document.getElementById('char-count').textContent = `${chars} caracteres`;
}

function onEditorChange() {
  updateStats();
  markUnsaved();
  updateMinimap();
  clearTimeout(state.autoSaveTimer);
  state.autoSaveTimer = setTimeout(() => autoSave(), 5000);
}

// ==================== SAVE STATE ====================
function markUnsaved() {
  state.isDirty = true;
  const el = document.getElementById('save-status');
  el.textContent = 'Sin guardar';
  el.className = 'unsaved';
}

function markSaved() {
  state.isDirty = false;
  const el = document.getElementById('save-status');
  el.textContent = '✓ Guardado';
  el.className = 'saved';
  setTimeout(() => {
    if (el.className === 'saved') el.textContent = 'Guardado';
  }, 3000);
}

// ==================== LOAD TEMPLATE ====================
function loadTemplate(key) {
  const tpl = TEMPLATES[key];
  if (!tpl) return;

  if (state.isDirty && document.getElementById('editor').innerHTML.trim()) {
    if (!confirm('¿Cargar nueva plantilla? Se perderán cambios no guardados.')) return;
  }

  state.currentTemplate = key;
  document.getElementById('doc-title').value = tpl.title;

  // Fill defaults
  const vars = {};
  if (tpl.variables) {
    tpl.variables.forEach(v => { vars[v] = tpl.defaults[v] || ''; });
  }
  
  const editor = document.getElementById('editor');
  if (typeof tpl.html === 'function') {
    editor.innerHTML = tpl.html(vars);
  } else {
    editor.innerHTML = '';
  }

  // Update sidebar active
  document.querySelectorAll('.template-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.template === key);
  });

  // Cerrar sidebar en móvil tras seleccionar
  if (window.innerWidth <= 1024) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
  }

  updateStats();
  if (typeof updateMinimap === 'function') updateMinimap();
  state.isDirty = false;
  
  const saveStatus = document.getElementById('save-status');
  if (saveStatus) saveStatus.textContent = 'Plantilla cargada';

  // Show variables panel if template has variables
  if (tpl.variables && tpl.variables.length > 0) {
    setTimeout(() => openVarPanel(key), 350);
  }
}


// ==================== VARIABLES PANEL ====================
function openVarPanel(key) {
  const tpl = TEMPLATES[key || state.currentTemplate];
  if (!tpl || tpl.variables.length === 0) return;

  const fieldsEl = document.getElementById('var-fields');
  fieldsEl.innerHTML = '';

  // --- Special layout for cotizacion_formal: grouped sections + live calc ---
  if ((key || state.currentTemplate) === 'cotizacion_formal') {
    _buildCotizacionFormalPanel(tpl, fieldsEl);
    document.getElementById('var-panel').classList.add('open');
    document.getElementById('var-overlay').classList.add('open');
    return;
  }

  tpl.variables.forEach(v => {
    const div = document.createElement('div');
    div.className = 'var-field';
    const isLong = ['asunto', 'observaciones'].includes(v);
    div.innerHTML = `
      <label for="var-${v}">${tpl.varLabels[v] || v}</label>
      ${isLong
        ? `<textarea id="var-${v}" rows="3">${tpl.defaults[v] || ''}</textarea>`
        : `<input id="var-${v}" type="text" value="${tpl.defaults[v] || ''}" />`}
    `;
    fieldsEl.appendChild(div);
  });

  document.getElementById('var-panel').classList.add('open');
  document.getElementById('var-overlay').classList.add('open');
}

// ==================== COTIZACIÓN FORMAL PANEL ====================
function _buildCotizacionFormalPanel(tpl, container) {
  const d = tpl.defaults;

  // Enhance container style for better grouping
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '15px';

  const section = (title, color = '#1f4e78') => {
    const h = document.createElement('div');
    h.style.cssText = `background:${color};color:#fff;padding:6px 12px;font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-radius:4px;margin-top:5px;display:flex;align-items:center;gap:8px;`;
    h.innerHTML = `<span>${title}</span>`;
    container.appendChild(h);
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:5px 2px;';
    container.appendChild(grid);
    return grid;
  };

  const field = (parent, id, label, value, type = 'text', rows = 0, fullWidth = false) => {
    const div = document.createElement('div');
    div.className = 'var-field';
    if (fullWidth) div.style.gridColumn = 'span 2';
    div.innerHTML = `<label for="${id}" style="font-size:8pt;margin-bottom:2px;display:block;">${label}</label>` +
      (rows > 0
        ? `<textarea id="${id}" rows="${rows}" style="width:100%;font-size:12px;">${value || ''}</textarea>`
        : `<input id="${id}" type="${type}" value="${value || ''}" style="width:100%;height:32px;font-size:12px;" />`);
    parent.appendChild(div);
    return div;
  };

  // --- Folio / Fecha / Vigencia ---
  const g1 = section('📋 Datos de la Cotización');
  field(g1, 'var-folio', 'Folio', d.folio);
  field(g1, 'var-fecha', 'Fecha', d.fecha);
  field(g1, 'var-vigencia', 'Vigencia (Texto)', d.vigencia);
  field(g1, 'var-vigencia_dias', 'Vigencia (Días)', d.vigencia_dias, 'number');

  // --- Datos del Cliente ---
  const g2 = section('🏢 Datos del Cliente');
  field(g2, 'var-cliente_nombre', 'Nombre del cliente', d.cliente_nombre, 'text', 0, true);
  field(g2, 'var-cliente_rfc', 'RFC', d.cliente_rfc);
  field(g2, 'var-cliente_regimen', 'Régimen fiscal', d.cliente_regimen);
  field(g2, 'var-cliente_domicilio', 'Domicilio', d.cliente_domicilio, 'text', 2, true);

  // --- Datos del Proyecto ---
  const g3 = section('🏗 Datos del Proyecto');
  field(g3, 'var-proyecto_nombre', 'Proyecto', d.proyecto_nombre, 'text', 0, true);
  field(g3, 'var-cliente_final', 'Cliente final', d.cliente_final);
  field(g3, 'var-servicio', 'Servicio', d.servicio);
  field(g3, 'var-ubicacion', 'Ubicación', d.ubicacion);
  field(g3, 'var-turno', 'Turno', d.turno);
  field(g3, 'var-proyecto_duracion', 'Duración', d.proyecto_duracion);
  field(g3, 'var-num_personas', 'No. de personas', d.num_personas, 'number');

  // --- Tabla de Conceptos ---
  section('💰 Conceptos y Resumen', '#d97706');
  const calcBox = document.createElement('div');
  calcBox.style.cssText = 'background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px;margin:5px 0 15px;font-family:monospace;';
  calcBox.id = 'calc-preview';
  container.appendChild(calcBox);

  // Helper to add a concept row group
  for (let i = 1; i <= 5; i++) {
    const cGrid = document.createElement('div');
    cGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#f8fafc;padding:10px;border-radius:6px;border-left:4px solid #1f4e78;margin-bottom:5px;';
    container.appendChild(cGrid);
    
    const h = document.createElement('div');
    h.style.cssText = 'grid-column:span 2;font-size:9pt;font-weight:800;color:#1e40af;margin-bottom:4px;';
    h.textContent = `Concepto ${i}`;
    cGrid.appendChild(h);

    field(cGrid, `var-concepto${i}_desc`, 'Descripción', d[`concepto${i}_desc`], 'text', 2, true);
    field(cGrid, `var-concepto${i}_qty`, 'Cantidad / Tiempo', d[`concepto${i}_qty`]);
    field(cGrid, `var-concepto${i}_unit`, 'Precio Unit. (MXN)', d[`concepto${i}_unit`], 'number');
    field(cGrid, `var-concepto${i}_subtotal`, 'Subtotal (MXN)', d[`concepto${i}_subtotal`], 'number', 0, true);
  }

  // --- % Gestión ---
  const g4 = section('📊 Gestión y Pago');
  field(g4, 'var-gestion_pct', 'Gestión MICSA (%)', d.gestion_pct, 'number');
  field(g4, 'var-condicion_pago', 'Forma de pago', d.condicion_pago);

  // --- Banco ---
  const g5 = section('🏦 Datos Bancarios');
  field(g5, 'var-banco', 'Banco', d.banco);
  field(g5, 'var-beneficiario', 'Beneficiario', d.beneficiario, 'text', 0, true);
  field(g5, 'var-cuenta', 'Cuenta', d.cuenta);
  field(g5, 'var-clabe', 'CLABE', d.clabe);

  // --- Live calculator logic ---
  function recalc() {
    const fmt = (n) => n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let totalDirecto = 0;
    for (let i = 1; i <= 5; i++) {
      const qty = document.getElementById(`var-concepto${i}_qty`)?.value || '';
      const unit = Number(document.getElementById(`var-concepto${i}_unit`)?.value || 0);
      const subEl = document.getElementById(`var-concepto${i}_subtotal`);
      
      // If subtotal is empty and we have unit/qty, try to help? 
      // But qty is often text. We'll just sum what's in subtotal unless it's 0.
      totalDirecto += Number(subEl?.value || 0);
    }
    const pct = Number(document.getElementById('var-gestion_pct')?.value || 15) / 100;
    const gestion = totalDirecto * pct;
    const base = totalDirecto + gestion;
    const iva = base * 0.16;
    const gran = base + iva;

    const box = document.getElementById('calc-preview');
    if (box) {
      box.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr auto;gap:4px 12px;font-size:12px;color:#451a03;">
          <span>Subtotal directo:</span><span style="font-weight:700;">$${fmt(totalDirecto)}</span>
          <span>Gestión (${(pct * 100).toFixed(0)}%):</span><span style="font-weight:700;">$${fmt(gestion)}</span>
          <div style="grid-column:span 2;border-top:1px solid #fed7aa;margin:2px 0;"></div>
          <span style="font-weight:700;">Subtotal base:</span><span style="font-weight:700;">$${fmt(base)}</span>
          <span>IVA (16%):</span><span style="font-weight:700;">$${fmt(iva)}</span>
          <div style="grid-column:span 2;height:2px;background:#f5a623;margin:4px 0;"></div>
          <span style="font-size:14px;font-weight:900;color:#92400e;">TOTAL FINAL:</span>
          <span style="font-size:14px;font-weight:900;color:#92400e;">$${fmt(gran)} MXN</span>
        </div>
      `;
    }
  }

  // Attach live listeners
  setTimeout(() => {
    for (let i = 1; i <= 5; i++) {
      ['qty', 'unit', 'subtotal'].forEach(suffix => {
        const el = document.getElementById(`var-concepto${i}_${suffix}`);
        if (el) el.addEventListener('input', recalc);
      });
    }
    ['var-gestion_pct', 'var-folio', 'var-cliente_nombre'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', recalc);
    });
    recalc();
  }, 100);
}


function closeVarPanel() {
  document.getElementById('var-panel').classList.remove('open');
  document.getElementById('var-overlay').classList.remove('open');
}

function applyVariables() {
  const tpl = TEMPLATES[state.currentTemplate];
  if (!tpl) return;
  const vars = {};
  tpl.variables.forEach(v => {
    const el = document.getElementById(`var-${v}`);
    vars[v] = el ? el.value : tpl.defaults[v] || '';
  });
  document.getElementById('editor').innerHTML = tpl.html(vars);
  closeVarPanel();
  updateStats();
  markUnsaved();
  notify('¡Variables aplicadas!', 'success');
}

// ==================== SAVE / LOAD ====================
function saveDocument() {
  const title = document.getElementById('doc-title').value.trim() || 'Sin título';
  const content = document.getElementById('editor').innerHTML;
  const id = Date.now().toString();
  const existing = state.savedDocs.findIndex(d => d.title === title);

  const doc = { id: existing >= 0 ? state.savedDocs[existing].id : id, title, content, savedAt: new Date().toISOString(), template: state.currentTemplate };

  if (existing >= 0) {
    state.savedDocs[existing] = doc;
  } else {
    state.savedDocs.unshift(doc);
  }

  localStorage.setItem('micsa_docs', JSON.stringify(state.savedDocs));
  renderSavedList();
  markSaved();
  notify('Documento guardado ✓', 'success');
}

function autoSave() {
  if (state.isDirty && document.getElementById('editor').innerHTML.trim()) {
    saveDocument();
  }
}

function loadDocument(id) {
  const doc = state.savedDocs.find(d => d.id === id);
  if (!doc) return;
  if (state.isDirty && !confirm('¿Cargar este documento? Se perderán cambios no guardados.')) return;
  document.getElementById('doc-title').value = doc.title;
  document.getElementById('editor').innerHTML = doc.content;
  state.currentTemplate = doc.template || 'blank';
  document.querySelectorAll('.template-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.template === state.currentTemplate);
  });
  updateStats();
  state.isDirty = false;
  document.getElementById('save-status').textContent = 'Cargado';
}

function deleteDocument(id) {
  if (!confirm('¿Eliminar este documento guardado?')) return;
  state.savedDocs = state.savedDocs.filter(d => d.id !== id);
  localStorage.setItem('micsa_docs', JSON.stringify(state.savedDocs));
  renderSavedList();
  notify('Documento eliminado', 'info');
}

function newDocument() {
  if (state.isDirty && !confirm('¿Crear nuevo documento? Se perderán cambios no guardados.')) return;
  document.getElementById('doc-title').value = 'Nuevo documento';
  document.getElementById('editor').innerHTML = TEMPLATES.blank.html({});
  state.currentTemplate = 'blank';
  document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-template="blank"]')?.classList.add('active');
  updateStats();
  state.isDirty = false;
  document.getElementById('save-status').textContent = 'Nuevo documento';
}

function printAllSaved() {
  if (state.savedDocs.length === 0) {
    notify('No hay documentos guardados para imprimir', 'error');
    return;
  }
  const docs = state.savedDocs.map(d => ({
    title: d.title,
    folio: d.folio || 'SN',
    content: d.content
  }));
  exportPDF_Professional(docs);
}

function renderSavedList() {
  const el = document.getElementById('saved-list');
  if (state.savedDocs.length === 0) {
    el.innerHTML = '<p class="empty-saved">No hay documentos guardados</p>';
    return;
  }

  const printAllBtn = `<button class="btn-print-all" onclick="printAllSaved()" title="Exportar todos los guardados en un solo PDF (uno por hoja)">🖨️ Exportar Secuencia (Todos)</button>`;

  el.innerHTML = printAllBtn + state.savedDocs.slice(0, 15).map(doc => `
    <div class="saved-item" onclick="loadDocument('${doc.id}')">
      <span class="saved-item-name" title="${doc.title}">📄 ${doc.title}</span>
      <div class="saved-item-actions">
        <button class="saved-item-del" onclick="event.stopPropagation();deleteDocument('${doc.id}')" title="Eliminar">✕</button>
      </div>
    </div>
  `).join('');
}

// ==================== EXPORT PDF ====================
function exportPDF() {
  const title = document.getElementById('doc-title').value || 'documento';
  const content = document.getElementById('editor').innerHTML;
  const printArea = document.getElementById('print-area');
  printArea.innerHTML = content;

  // Set page title for the PDF filename hint
  const origTitle = document.title;
  document.title = title;
  window.print();
  document.title = origTitle;
  printArea.innerHTML = '';
  notify('Enviando a impresión / PDF...', 'info');
}

// ==================== PREVIEW ====================
function togglePreview() {
  const wrapper = document.getElementById('editor-wrapper');
  const editor = document.getElementById('editor');
  const btn = document.getElementById('preview-btn');
  const isPreview = wrapper.classList.toggle('preview-mode');
  editor.contentEditable = isPreview ? 'false' : 'true';
  btn.textContent = isPreview ? '✏️ Editar' : '👁 Vista previa';
}

// ==================== INIT ====================
function init() {
  // Load saved docs from localStorage
  try {
    state.savedDocs = JSON.parse(localStorage.getItem('micsa_docs') || '[]');
  } catch { state.savedDocs = []; }
  renderSavedList();

  // Load iLoveAPI credentials from localStorage
  loadILoveCredentials();


  // Load default template
  loadTemplate('cotizacion');


  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    // ⌘+Shift+V = open variables
    if ((e.ctrlKey || e.metaKey) && e.key === 'v' && e.shiftKey) {
      e.preventDefault();
      openVarPanel();
    }
  });

  // Focus editor
  setTimeout(() => {
    document.getElementById('editor').focus();
    updateMinimap();
  }, 300);
}

document.addEventListener('DOMContentLoaded', init);

// ==================== FILE IMPORT ====================

/**
 * Trigger the hidden file input
 */
function triggerFileImport() {
  document.getElementById('file-input').value = ''; // reset so same file can re-trigger
  document.getElementById('file-input').click();
}

/**
 * Called when user selects file from dialog
 */
function handleFileSelect(file) {
  if (!file) return;
  processImportedFile(file);
}

/**
 * Drag-over: show overlay
 */
function onDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('drop-overlay').classList.add('active');
}

/**
 * Drag-leave: hide overlay
 */
function onDragLeave(e) {
  e.preventDefault();
  if (!document.getElementById('editor-wrapper').contains(e.relatedTarget)) {
    document.getElementById('drop-overlay').classList.remove('active');
  }
}

/**
 * Drop: process file
 */
function onDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('drop-overlay').classList.remove('active');
  const file = e.dataTransfer?.files?.[0];
  if (file) processImportedFile(file);
}

/**
 * Core import handler — dispatches by file type
 */
function processImportedFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const supported = ['html', 'htm', 'txt', 'docx', 'doc', 'rtf'];

  if (!supported.includes(ext)) {
    showImportToast('error', `❌ Formato no soportado (.${ext}). Usa .html, .txt, .docx o .rtf`);
    return;
  }

  // Rechazar archivos de red/compartidos (file.path vacío en archivos cloud-only)
  if (file.size === 0 && !file.name) {
    showImportToast('error', '❌ Selecciona un archivo LOCAL (no desde OneDrive/Compartidos sin sincronizar)');
    return;
  }

  if (state.isDirty && document.getElementById('editor').innerHTML.trim()) {
    if (!confirm(`¿Importar "${file.name}"? Se perderán los cambios no guardados.`)) return;
  }

  showImportToast('loading', `Importando ${file.name}…`);

  if (ext === 'html' || ext === 'htm') {
    importHTMLFile(file);
  } else if (ext === 'txt') {
    importTXTFile(file);
  } else if (ext === 'docx' || ext === 'doc') {
    importDOCXFile(file);
  }
}

/**
 * Import .html / .htm file — load raw HTML into editor
 */
function importHTMLFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    let content = e.target.result;

    // Try to extract <body> content if it's a full page
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) content = bodyMatch[1];

    applyImportedContent(content, file.name);
  };
  reader.onerror = () => showImportToast('error', '❌ Error leyendo el archivo HTML');
  reader.readAsText(file, 'UTF-8');
}

/**
 * Import .txt file — convert line breaks to HTML paragraphs
 */
function importTXTFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    // Convert plain text to paragraphs
    const html = text
      .split(/\n\n+/)
      .map(block => {
        const lines = block.split('\n').join('<br>');
        return `<p>${lines}</p>`;
      })
      .join('\n');
    applyImportedContent(html, file.name);
  };
  reader.onerror = () => showImportToast('error', '❌ Error leyendo el archivo TXT');
  reader.readAsText(file, 'UTF-8');
}

/**
 * Import .docx file using mammoth.js
 */
function importDOCXFile(file) {
  if (typeof mammoth === 'undefined') {
    showImportToast('error', '❌ Librería mammoth.js no disponible. Verifica tu conexión a internet.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const arrayBuffer = e.target.result;
    mammoth.convertToHtml({ arrayBuffer })
      .then((result) => {
        if (result.messages && result.messages.length > 0) {
          console.info('Mammoth warnings:', result.messages);
        }
        // Apply MICSA styling to converted content
        const styled = applyMICSAStylesToDocx(result.value);
        applyImportedContent(styled, file.name);
      })
      .catch((err) => {
        console.error('Mammoth error:', err);
        showImportToast('error', '❌ Error convirtiendo el .docx. Intenta con otro archivo.');
      });
  };
  reader.onerror = () => showImportToast('error', '❌ Error leyendo el archivo DOCX');
  reader.readAsArrayBuffer(file);
}

/**
 * Apply basic MICSA styling to mammoth-converted HTML
 */
function applyMICSAStylesToDocx(html) {
  // mammoth produces clean semantic HTML — just return it
  // Could enhance with regex replacements if needed
  return html;
}

/**
 * Put imported content into the editor
 */
function applyImportedContent(html, filename) {
  document.getElementById('editor').innerHTML = html;

  // Set document title from filename (without extension)
  const title = filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
  document.getElementById('doc-title').value = title;

  // Update state
  state.currentTemplate = 'blank';
  document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));

  updateStats();
  updateMinimap();
  markUnsaved();

  // Show info chip in sidebar
  const info = document.getElementById('import-info');
  info.style.display = 'block';
  info.textContent = `📄 ${filename} (${formatBytes(html.length)})`;

  // Show success toast
  showImportToast('success', `✅ Importado: ${filename}`);

  // Scroll to top of editor
  document.getElementById('editor-wrapper').scrollTop = 0;
}

/**
 * Show/hide import toast with loading spinner or status icon
 */
function showImportToast(type, message) {
  const toast = document.getElementById('import-toast');
  toast.style.display = 'flex';
  toast.innerHTML = type === 'loading'
    ? `<div class="toast-spinner"></div><span class="toast-msg">${message}</span>`
    : `<span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span><span class="toast-msg">${message}</span>`;

  toast.classList.add('show');

  if (type !== 'loading') {
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.style.display = 'none'; }, 350);
    }, 3500);
  }
}

/**
 * Format bytes to human-readable
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ==================== iLoveAPI INTEGRATION ====================

/**
 * iLoveAPI state — stores credentials and merge files
 */
const iLoveState = {
  publicKey: '',
  secretKey: '',
  mergeFiles: [], // Array of File objects for merge
};

/**
 * Load saved credentials on app init (called from init())
 */
function loadILoveCredentials() {
  iLoveState.publicKey = localStorage.getItem('ilove_pub') || '';
  iLoveState.secretKey = localStorage.getItem('ilove_sec') || '';
  updateILoveDot();
}

/**
 * Update the status dot in the sidebar
 */
function updateILoveDot() {
  const dot = document.getElementById('ilove-dot');
  if (!dot) return;
  if (iLoveState.publicKey && iLoveState.secretKey) {
    dot.classList.add('connected');
    dot.classList.remove('error');
  } else {
    dot.classList.remove('connected', 'error');
  }
}

// ---- Credentials Modal ----

function openILoveConfig() {
  document.getElementById('ilove-public-key').value = iLoveState.publicKey;
  document.getElementById('ilove-secret-key').value = iLoveState.secretKey;
  document.getElementById('ilove-modal').style.display = 'block';
  document.getElementById('ilove-modal-overlay').style.display = 'block';
}

function closeILoveConfig() {
  document.getElementById('ilove-modal').style.display = 'none';
  document.getElementById('ilove-modal-overlay').style.display = 'none';
}

function saveILoveCredentials() {
  const pub = document.getElementById('ilove-public-key').value.trim();
  const sec = document.getElementById('ilove-secret-key').value.trim();
  if (!pub || !sec) { notify('Ingresa ambas claves', 'error'); return; }
  iLoveState.publicKey = pub;
  iLoveState.secretKey = sec;
  localStorage.setItem('ilove_pub', pub);
  localStorage.setItem('ilove_sec', sec);
  updateILoveDot();
  closeILoveConfig();
  notify('✅ Credenciales guardadas', 'success');
}

async function testILoveCredentials() {
  const pub = document.getElementById('ilove-public-key').value.trim();
  const sec = document.getElementById('ilove-secret-key').value.trim();
  if (!pub || !sec) { notify('Ingresa ambas claves primero', 'error'); return; }
  notify('🔍 Probando conexión...', 'info');
  try {
    const token = await getILoveToken(pub, sec);
    if (token) {
      notify('✅ ¡Conexión exitosa! Credenciales válidas.', 'success');
      const dot = document.getElementById('ilove-dot');
      dot.classList.add('connected'); dot.classList.remove('error');
    }
  } catch (e) {
    notify('❌ Error: ' + (e.message || 'Credenciales inválidas'), 'error');
    const dot = document.getElementById('ilove-dot');
    dot.classList.add('error'); dot.classList.remove('connected');
  }
}

// ---- iLoveAPI Core: Authentication ----

/**
 * Get a JWT token from iLoveAPI authentication server
 * Uses the /auth endpoint (client-side method)
 */
async function getILoveToken(pubKey, secKey) {
  pubKey = pubKey || iLoveState.publicKey;
  secKey = secKey || iLoveState.secretKey;

  const resp = await fetch('https://api.ilovepdf.com/v1/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_key: pubKey }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${resp.status}`);
  }
  const data = await resp.json();
  return data.token;
}

/**
 * Start an iLoveAPI task and get server + task_id
 */
async function iLoveStartTask(token, tool) {
  const resp = await fetch(`https://api.ilovepdf.com/v1/start/${tool}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`Start task failed: HTTP ${resp.status}`);
  return await resp.json(); // { server, task }
}

/**
 * Upload a file (Blob or File) to iLoveAPI server
 */
async function iLoveUploadFile(token, server, task, file, filename) {
  const form = new FormData();
  form.append('task', task);
  form.append('file', file, filename || file.name || 'document.pdf');

  const resp = await fetch(`https://${server}/v1/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!resp.ok) throw new Error(`Upload failed: HTTP ${resp.status}`);
  return await resp.json(); // { server_filename, ... }
}

/**
 * Process files on iLoveAPI server
 */
async function iLoveProcess(token, server, task, tool, files, extraParams = {}) {
  const body = {
    task,
    tool,
    files: files.map(f => ({ server_filename: f.server_filename, filename: f.filename || f.server_filename })),
    ...extraParams,
  };

  const resp = await fetch(`https://${server}/v1/process`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Process failed: HTTP ${resp.status}`);
  }
  return await resp.json();
}

/**
 * Download processed file from iLoveAPI server
 */
async function iLoveDownload(token, server, task) {
  const resp = await fetch(`https://${server}/v1/download/${task}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`Download failed: HTTP ${resp.status}`);
  return await resp.blob();
}

/**
 * Trigger browser download of a Blob
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}

// ---- Export HTML → PDF via iLoveAPI ----

async function exportPDF_iLoveAPI() {
  if (!iLoveState.publicKey || !iLoveState.secretKey) {
    notify('⚙️ Configura tus credenciales de iLoveAPI primero', 'error');
    openILoveConfig();
    return;
  }

  const title = document.getElementById('doc-title').value.trim() || 'documento-micsa';
  const editorHTML = document.getElementById('editor').innerHTML;

  // Build a self-contained HTML page for conversion
  const fullHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 11pt; line-height: 1.75;
      color: #1e293b; background: #fff;
      padding: 18mm 20mm;
    }
    h1 { font-size: 20pt; font-weight: 800; color: #1d4ed8; margin-bottom: 6px; }
    h2 { font-size: 14pt; font-weight: 700; color: #1e40af; text-transform: uppercase; letter-spacing: .03em; margin: 20px 0 8px; }
    h3 { font-size: 11.5pt; font-weight: 600; color: #1e3a8a; margin: 14px 0 5px; }
    p  { margin-bottom: 9px; }
    ul, ol { padding-left: 20px; margin-bottom: 9px; }
    li { margin-bottom: 3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 9.5pt; }
    td, th { border: 1px solid #e5e7eb; padding: 7px 11px; vertical-align: top; }
    th { background: #1e3a5f !important; color: #fff !important; font-weight: 600; }
    tr:nth-child(even) td { background: #f9fafb; }
    hr { border: none; border-top: 2px solid #e5e7eb; margin: 16px 0; }
    blockquote { border-left: 4px solid #3b82f6; background: #eff6ff; padding: 10px 16px; margin: 12px 0; color: #1e40af; border-radius: 0 6px 6px 0; }
  </style>
</head>
<body>${editorHTML}</body>
</html>`;

  const htmlBlob = new Blob([fullHTML], { type: 'text/html' });
  const htmlFile = new File([htmlBlob], `${title}.html`, { type: 'text/html' });

  notify('🔴 Conectando con iLoveAPI...', 'info');

  try {
    const token = await getILoveToken();
    notify('📤 Subiendo documento...', 'info');

    const { server, task } = await iLoveStartTask(token, 'htmlpdf');
    const uploaded = await iLoveUploadFile(token, server, task, htmlFile, `${title}.html`);

    notify('⚙️ Convirtiendo a PDF...', 'info');
    await iLoveProcess(token, server, task, 'htmlpdf', [
      { server_filename: uploaded.server_filename, filename: `${title}.html` }
    ], {
      output_filename: title,
      margin_top: 0, margin_bottom: 0, margin_left: 0, margin_right: 0,
      page_size: 'A4', orientation: 'portrait',
    });

    notify('📥 Descargando PDF...', 'info');
    const pdfBlob = await iLoveDownload(token, server, task);
    downloadBlob(pdfBlob, `${title}.pdf`);
    notify('✅ PDF descargado con iLoveAPI', 'success');
  } catch (err) {
    console.error('iLoveAPI export error:', err);
    notify('❌ Error iLoveAPI: ' + (err.message || 'Desconocido'), 'error');
  }
}

// ---- Compress PDF via iLoveAPI ----

function compressPDF_iLoveAPI() {
  if (!iLoveState.publicKey || !iLoveState.secretKey) {
    notify('⚙️ Configura tus credenciales de iLoveAPI primero', 'error');
    openILoveConfig();
    return;
  }
  document.getElementById('compress-file-input').click();
}

async function executeCompressPDF(file) {
  if (!file) return;
  notify('🗜️ Comprimiendo PDF con iLoveAPI...', 'info');

  try {
    const token = await getILoveToken();
    const { server, task } = await iLoveStartTask(token, 'compress');
    const uploaded = await iLoveUploadFile(token, server, task, file, file.name);
    await iLoveProcess(token, server, task, 'compress', [
      { server_filename: uploaded.server_filename, filename: file.name }
    ], { compression_level: 'recommended' });

    const pdfBlob = await iLoveDownload(token, server, task);
    const outName = file.name.replace('.pdf', '') + '_comprimido.pdf';
    downloadBlob(pdfBlob, outName);
    notify('✅ PDF comprimido descargado', 'success');
  } catch (err) {
    console.error('Compress error:', err);
    notify('❌ Error al comprimir: ' + (err.message || 'Desconocido'), 'error');
  }
}

// ---- Merge PDFs via iLoveAPI ----

function openMergePanel() {
  if (!iLoveState.publicKey || !iLoveState.secretKey) {
    notify('⚙️ Configura tus credenciales de iLoveAPI primero', 'error');
    openILoveConfig();
    return;
  }
  iLoveState.mergeFiles = [];
  renderMergeFileList();
  document.getElementById('merge-modal').style.display = 'block';
  document.getElementById('merge-modal-overlay').style.display = 'block';
}

function closeMergePanel() {
  document.getElementById('merge-modal').style.display = 'none';
  document.getElementById('merge-modal-overlay').style.display = 'none';
}

function handleMergeFileSelect(files) {
  Array.from(files).forEach(f => {
    if (f.type === 'application/pdf' || f.name.endsWith('.pdf')) {
      iLoveState.mergeFiles.push(f);
    }
  });
  renderMergeFileList();
}

function handleMergeDrop(event) {
  event.preventDefault();
  document.getElementById('merge-drop-zone').classList.remove('drag-over');
  const files = event.dataTransfer?.files;
  if (files) handleMergeFileSelect(files);
}

function renderMergeFileList() {
  const container = document.getElementById('merge-file-list');
  if (iLoveState.mergeFiles.length === 0) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = iLoveState.mergeFiles.map((f, i) => `
    <div class="merge-file-item">
      <span>📄 ${f.name} <span style="color:#475569;">(${formatBytes(f.size)})</span></span>
      <button onclick="removeMergeFile(${i})" title="Quitar">✕</button>
    </div>
  `).join('');
}

function removeMergeFile(index) {
  iLoveState.mergeFiles.splice(index, 1);
  renderMergeFileList();
}

async function executeMergePDF() {
  if (iLoveState.mergeFiles.length < 2) {
    notify('Agrega al menos 2 archivos PDF para combinar', 'error');
    return;
  }

  notify('🔗 Combinando PDFs con iLoveAPI...', 'info');

  try {
    const token = await getILoveToken();
    const { server, task } = await iLoveStartTask(token, 'merge');

    // Upload all files
    const uploadedFiles = [];
    for (const file of iLoveState.mergeFiles) {
      notify(`📤 Subiendo ${file.name}...`, 'info');
      const uploaded = await iLoveUploadFile(token, server, task, file, file.name);
      uploadedFiles.push({ server_filename: uploaded.server_filename, filename: file.name });
    }

    notify('⚙️ Combinando archivos...', 'info');
    await iLoveProcess(token, server, task, 'merge', uploadedFiles, {
      output_filename: 'documentos-combinados-micsa',
    });

    const pdfBlob = await iLoveDownload(token, server, task);
    downloadBlob(pdfBlob, 'documentos-combinados-micsa.pdf');
    notify('✅ PDFs combinados descargados', 'success');
    closeMergePanel();
  } catch (err) {
    console.error('Merge error:', err);
    notify('❌ Error al combinar: ' + (err.message || 'Desconocido'), 'error');
  }
}

// ==================== PDF HELPERS ====================

/**
 * Returns a base64 data URL of the MICSA logo (SVG embebido, sin dependencia externa).
 */
async function getLogoBase64() {
  const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><rect width="200" height="60" fill="#1f4e78" rx="4"/><text x="12" y="38" font-family="Arial,sans-serif" font-weight="900" font-size="28" fill="#f5a623" letter-spacing="-1">MICSA</text><text x="12" y="52" font-family="Arial,sans-serif" font-weight="400" font-size="9" fill="#cce0f5" letter-spacing="0.3">MONTAJES E IZAJES DEL CENTRO</text></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgLogo)));
}

/**
 * Construye un contenedor DOM real con estilos INLINE para html2canvas.
 * NO usar innerHTML con un documento HTML completo: el browser descarta <head><style>.
 * Aquí construimos el container directamente via DOM con estilos inline.
 */
function buildPrintContainer(title, editorEl, logoB64) {
  const now = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  // Wrapper
  const wrap = document.createElement('div');
  wrap.style.cssText = 'font-family:Arial,Helvetica,sans-serif;font-size:10.5pt;color:#111;background:#fff;width:794px;padding:22px 28px;box-sizing:border-box;position:fixed;top:0;left:0;opacity:0;pointer-events:none;z-index:9999;';

  // Header
  const header = document.createElement('div');
  header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;border-bottom:2.5px solid #f5a623;padding-bottom:10px;margin-bottom:18px;';
  const logo = new Image();
  logo.src = logoB64;
  logo.style.cssText = 'height:48px;display:block;';
  const info = document.createElement('div');
  info.style.cssText = 'text-align:right;font-size:8.5pt;color:#555;line-height:1.5;';
  info.innerHTML = `<div style="font-size:12pt;font-weight:700;color:#1f4e78;">${title}</div><div>MICSA Industrial S.A. de C.V.</div><div>La Madrid 500, Monclova, Coahuila | RFC: MIC2301268S5</div><div>Tel: (866) 176-6621</div>`;
  header.appendChild(logo);
  header.appendChild(info);
  wrap.appendChild(header);

  // Clonar el editor y limpiar colores oscuros para fondo blanco
  const bodyClone = editorEl.cloneNode(true);
  bodyClone.style.cssText = 'font-family:Arial,Helvetica,sans-serif;font-size:10.5pt;color:#111;background:#fff;width:100%;line-height:1.6;padding:0;margin:0;border:none;outline:none;min-height:unset;';
  bodyClone.querySelectorAll('*').forEach(el => {
    const cs = window.getComputedStyle(el);
    const bg = cs.backgroundColor.match(/\d+/g);
    const col = cs.color.match(/\d+/g);
    if (bg) {
      const lum = 0.299 * +bg[0] + 0.587 * +bg[1] + 0.114 * +bg[2];
      if (lum < 55) el.style.backgroundColor = '#ffffff';
    }
    if (col) {
      const lum = 0.299 * +col[0] + 0.587 * +col[1] + 0.114 * +col[2];
      if (lum > 215) el.style.color = '#111111';
    }
  });
  wrap.appendChild(bodyClone);

  // Footer
  const footer = document.createElement('div');
  footer.style.cssText = 'border-top:1px solid #ddd;margin-top:20px;padding-top:8px;display:flex;justify-content:space-between;font-size:7.5pt;color:#888;';
  footer.innerHTML = `<span>MICSA Industrial S.A. de C.V. &nbsp;|&nbsp; RFC: MIC2301268S5</span><span>Generado el ${now}</span>`;
  wrap.appendChild(footer);

  return wrap;
}

/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  STUB DELEGADOR — no modificar aquí                  ║
 * ║  La lógica real vive en  pdf-export.js               ║
 * ║  Editar SOLO pdf-export.js para cambios en el PDF    ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * pdf-export.js sobreescribe window.exportPDF_Professional al cargarse.
 * Este stub en app.js existe solo para que los botones HTML encuentren
 * la función; al momento de ejecutarse, la real ya sustituyó a este stub.
 */
// La función exportPDF_Professional es proveída por el script inline en index.html

/**
 * Motor B: clona el editor con fondo blanco, captura con html2canvas y pagina en A4 con jsPDF.
 */
async function exportPDF_Fallback(title, editorEl) {
  const { jsPDF } = window.jspdf;

  notify('📸 Capturando contenido...', 'info');

  // Crear clon con fondo blanco fuera de pantalla
  const clone = editorEl.cloneNode(true);
  clone.style.cssText = [
    'position:absolute', 'left:-9999px', 'top:0',
    'width:794px', 'background:#fff', 'color:#111',
    'font-family:Arial,Helvetica,sans-serif', 'font-size:10.5pt',
    'padding:24px', 'box-sizing:border-box', 'line-height:1.6',
  ].join(';');

  // Corregir colores oscuros del editor oscuro
  clone.querySelectorAll('*').forEach(el => {
    const cs = window.getComputedStyle(el);
    const bg = cs.backgroundColor.match(/\d+/g);
    const col = cs.color.match(/\d+/g);
    if (bg) {
      const lum = 0.299 * +bg[0] + 0.587 * +bg[1] + 0.114 * +bg[2];
      if (lum < 55) el.style.backgroundColor = '#ffffff';
    }
    if (col) {
      const lum = 0.299 * +col[0] + 0.587 * +col[1] + 0.114 * +col[2];
      if (lum > 210) el.style.color = '#111111';
    }
  });

  document.body.appendChild(clone);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  try {
    const canvas = await html2canvas(clone, {
      scale: 2, useCORS: true, allowTaint: true,
      backgroundColor: '#ffffff', logging: false,
    });
    document.body.removeChild(clone);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgW = pdfW - margin * 2;
    const imgH = (canvas.height * imgW) / canvas.width;
    const pageH = pdfH - margin * 2;

    let yOffset = 0;
    pdf.addImage(imgData, 'JPEG', margin, margin, imgW, imgH);
    yOffset += pageH;

    while (yOffset < imgH) {
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, margin - yOffset, imgW, imgH);
      yOffset += pageH;
    }

    pdf.save(`${title}.pdf`);
    notify('✅ PDF descargado', 'success');
  } catch (err) {
    if (clone.parentNode) document.body.removeChild(clone);
    throw err;
  }
}

// ==================== EVIDENCE PHOTOS ====================

/**
 * Insert a new evidence photo block into the editor at cursor position
 */
function insertEvidenciasBlock() {
  const id = 'ev_' + Date.now();
  const blockHTML = `
  < div class="micsa-evidence-block" id = "${id}" >
    <div class="micsa-evidence-title">
      <span>📸<\/span>
        <span contenteditable="true">Registro Fotográfico de Evidencias<\/span>
          <\/div>
          <button class="micsa-evidence-upload-btn" onclick="triggerEvidenceUpload('${id}')">
            ➕ Agregar fotos
            <\/button>
            <div class="micsa-evidence-grid" id="grid_${id}">
              <div class="micsa-evidence-empty">Las fotografías aparecerán aquí automáticamente<\/div>
                <\/div>
                <\/div>
                <p><br><\/p>`;

  const editor = document.getElementById('editor');
  // Always append to end of editor — sidebar click removes editor focus
  editor.insertAdjacentHTML('beforeend', blockHTML);
  // Scroll to the new block
  const newBlock = document.getElementById(id);
  if (newBlock) newBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  onEditorChange();
  notify('📸 Área de evidencias insertada — usa el botón "Agregar fotos"', 'info');
}

/**
 * Trigger the hidden evidence photo file input, storing which block to target
 */
function triggerEvidenceUpload(blockId) {
  window.__evidenceTargetId = blockId;
  document.getElementById('evidence-file-input').value = '';
  document.getElementById('evidence-file-input').click();
}

/**
 * Handle evidence photo uploads — converts each to base64, inserts into grid with caption
 */
function handleEvidencePhotos(files) {
  if (!files || files.length === 0) return;
  const blockId = window.__evidenceTargetId;
  if (!blockId) return;

  const grid = document.getElementById('grid_' + blockId);
  if (!grid) { notify('No se encontró el área de evidencias', 'error'); return; }

  // Remove placeholder if present
  const placeholder = grid.querySelector('.micsa-evidence-empty');
  if (placeholder) placeholder.remove();

  let loaded = 0;
  const total = files.length;

  Array.from(files).forEach((file, index) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoNum = grid.querySelectorAll('.micsa-evidence-photo-wrap').length + 1;
      const wrap = document.createElement('div');
      wrap.className = 'micsa-evidence-photo-wrap';
      wrap.innerHTML = `
                  <img src="${e.target.result}" alt="Evidencia ${photoNum}" />
                  <div class="micsa-evidence-photo-caption" contenteditable="true" placeholder="Descripción de la evidencia...">
                    Foto ${photoNum}: ${file.name.replace(/\.[^.]+$/, '')}
                  </div>`;
      grid.appendChild(wrap);
      loaded++;
      if (loaded === total) {
        notify(`✅ ${total} foto(s) agregada(s) al área de evidencias`, 'success');
        onEditorChange();
      }
    };
    reader.readAsDataURL(file);
  });
}

// ==================== ADOBE ACROBAT SIGN API ====================
// Based on the Adobe Sign API v6 REST workflow:
// 1. Upload PDF as Transient Document (valid 7 days)
// 2. Create Agreement → status "IN_PROCESS"
// 3. Get Signing URL (for in-person/embedded flow)
// 4. Poll status (or webhook) for completion

const ADOBE_SIGN = {
  // Default to NA1 region — user can change to eu1, in1, au1 in settings
  baseUrl: 'https://api.na1.adobesign.com/api/rest/v6',
  integrationKey: '',
  agreementId: null,
};

// ---- Panel open/close ----

function openAdobeSignPanel() {
  const savedKey = localStorage.getItem('adobe_sign_key') || '';
  document.getElementById('adobe-integration-key').value = savedKey;
  document.getElementById('adobe-signer-email').value = localStorage.getItem('adobe_signer_email') || '';
  document.getElementById('adobe-signer-name').value = localStorage.getItem('adobe_signer_name') || '';
  document.getElementById('adobe-message').value = 'Por favor revise y firme el documento de MICSA Industrial S.A. de C.V.';
  ADOBE_SIGN.integrationKey = savedKey;
  document.getElementById('adobe-modal').style.display = 'block';
  document.getElementById('adobe-modal-overlay').style.display = 'block';
  updateAdobeDot();
}

function closeAdobeSignPanel() {
  document.getElementById('adobe-modal').style.display = 'none';
  document.getElementById('adobe-modal-overlay').style.display = 'none';
}

function saveAdobeKey() {
  const key = document.getElementById('adobe-integration-key').value.trim();
  if (!key) { notify('Ingresa la Integration Key de Adobe Sign', 'error'); return; }
  ADOBE_SIGN.integrationKey = key;
  localStorage.setItem('adobe_sign_key', key);
  updateAdobeDot();
  notify('✅ Integration Key guardada', 'success');
}

function updateAdobeDot() {
  const dot = document.getElementById('adobe-dot');
  if (!dot) return;
  const key = localStorage.getItem('adobe_sign_key') || '';
  dot.classList.toggle('connected', key.length > 10);
}

// ---- Core Adobe Sign API helper ----

async function adobeSignRequest(method, endpoint, body = null, extraHeaders = {}) {
  const key = ADOBE_SIGN.integrationKey || localStorage.getItem('adobe_sign_key');
  if (!key) throw new Error('No Adobe Sign Integration Key configurada');

  const headers = {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const resp = await fetch(`${ADOBE_SIGN.baseUrl}${endpoint}`, opts);

  // Handle throttling: HTTP 429 + Retry-After header
  if (resp.status === 429) {
    const retryAfter = parseInt(resp.headers.get('Retry-After') || '10', 10);
    notify(`⏳ Límite de Adobe Sign — reintentando en ${retryAfter}s...`, 'info');
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    return adobeSignRequest(method, endpoint, body, extraHeaders);
  }

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || err.code || `HTTP ${resp.status}`);
  }

  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) return resp.json();
  return resp.blob(); // for binary downloads
}

/**
 * STEP 1: Upload document as Transient Document (valid 7 days)
 * Returns: transientDocumentId
 */
async function adobeUploadTransientDocument(pdfBlob, filename) {
  const key = ADOBE_SIGN.integrationKey || localStorage.getItem('adobe_sign_key');
  const form = new FormData();
  form.append('File-Name', filename);
  form.append('Mime-Type', 'application/pdf');
  form.append('File', pdfBlob, filename);

  const resp = await fetch(`${ADOBE_SIGN.baseUrl}/transientDocuments`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}` },
    body: form,
  });

  if (resp.status === 429) {
    const retryAfter = parseInt(resp.headers.get('Retry-After') || '10', 10);
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    return adobeUploadTransientDocument(pdfBlob, filename);
  }

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed: HTTP ${resp.status}`);
  }
  const data = await resp.json();
  return data.transientDocumentId;
}

/**
 * STEP 2: Create Agreement
 * Returns: agreementId
 */
async function adobeCreateAgreement(transientDocumentId, title, signerEmail, signerName, message) {
  const body = {
    fileInfos: [{ transientDocumentId }],
    name: title,
    participantSetsInfo: [
      {
        order: 1,
        role: 'SIGNER',
        memberInfos: [
          { email: signerEmail, name: signerName }
        ],
      },
    ],
    signatureType: 'ESIGN',
    state: 'IN_PROCESS',
    message: message || '',
    reminderFrequency: 'DAILY_UNTIL_SIGNED',
    emailOption: {
      sendOptions: {
        completionEmails: 'ALL',
        inFlightEmails: 'ALL',
        initEmails: 'ALL',
      },
    },
  };

  const data = await adobeSignRequest('POST', '/agreements', body);
  return data.id;
}

/**
 * STEP 3: Get Signing URL for in-person / embedded signing
 * Returns: signing URL string
 */
async function adobeGetSigningUrl(agreementId) {
  const data = await adobeSignRequest('GET', `/agreements/${agreementId}/signingUrls`);
  const signingUrlSets = data.signingUrlSetInfos || [];
  if (signingUrlSets.length === 0) throw new Error('No signing URLs disponibles');
  const firstSet = signingUrlSets[0];
  const urls = firstSet.signingUrls || [];
  if (urls.length === 0) throw new Error('No signing URL para el firmante');
  return urls[0].esignUrl;
}

/**
 * Full Adobe Sign flow:
 * 1. Generate PDF from current document
 * 2. Upload as transient document
 * 3. Create agreement
 * 4. Open signing URL in new tab
 */
async function sendForAdobeSign() {
  const key = document.getElementById('adobe-integration-key').value.trim();
  const signerEmail = document.getElementById('adobe-signer-email').value.trim();
  const signerName = document.getElementById('adobe-signer-name').value.trim();
  const message = document.getElementById('adobe-message').value.trim();

  if (!key) { notify('⚠️ Configura la Integration Key de Adobe Sign', 'error'); return; }
  if (!signerEmail) { notify('⚠️ Ingresa el correo del firmante', 'error'); return; }

  ADOBE_SIGN.integrationKey = key;
  localStorage.setItem('adobe_sign_key', key);
  localStorage.setItem('adobe_signer_email', signerEmail);
  localStorage.setItem('adobe_signer_name', signerName);

  const title = document.getElementById('doc-title').value.trim() || 'Documento MICSA';
  notify('🖼️ Preparando documento...', 'info');

  try {
    // Generate PDF blob using html2pdf + buildPrintContainer (DOM real, no innerHTML de doc)
    const logoB64 = await getLogoBase64();
    const editorEl = document.getElementById('editor');

    const container = buildPrintContainer(title, editorEl, logoB64);
    document.body.appendChild(container);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    notify('📄 Generando PDF para firma...', 'info');
    const pdfBlob = await new Promise((resolve, reject) => {
      html2pdf().set({
        margin: [0, 0, 0, 0],
        image: { type: 'jpeg', quality: 0.90 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(container).output('blob').then(resolve).catch(reject);
    });
    document.body.removeChild(container);

    // STEP 1: Upload transient document
    notify('📤 Subiendo a Adobe Sign...', 'info');
    const filename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    const transientDocId = await adobeUploadTransientDocument(pdfBlob, filename);
    notify('✅ Documento subido (transitorio 7 días)', 'info');

    // STEP 2: Create agreement
    notify('📝 Creando acuerdo Adobe Sign...', 'info');
    const agreementId = await adobeCreateAgreement(transientDocId, title, signerEmail, signerName, message);
    ADOBE_SIGN.agreementId = agreementId;
    notify(`✅ Acuerdo creado — ID: ${agreementId.substring(0, 16)}...`, 'info');

    // STEP 3: Get signing URL for immediate in-person signing
    notify('🔗 Obteniendo URL de firma...', 'info');
    try {
      const signingUrl = await adobeGetSigningUrl(agreementId);
      notify('✅ Enviado a Adobe Sign — abriendo URL de firma...', 'success');
      closeAdobeSignPanel();
      // Open signing URL in new tab (for in-person signing)
      window.open(signingUrl, '_blank');
    } catch (urlErr) {
      // URL may not be available immediately — agreement is IN_PROCESS, email sent
      notify(`✅ Acuerdo enviado a ${signerEmail}. Recibirá un correo para firmar.`, 'success');
      closeAdobeSignPanel();
    }

  } catch (err) {
    console.error('Adobe Sign error:', err);
    notify('❌ Error Adobe Sign: ' + (err.message || 'Desconocido'), 'error');
  }
}

// Initialize Adobe dot on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(updateAdobeDot, 500);
  setTimeout(updateGDocsDot, 600);
});

// ==================== GOOGLE DOCS / DRIVE API INTEGRATION ====================
// Based on Google Drive API v3 + Google Docs API v1
// Flow (Export): HTML content → multipart upload as text/html →
//                Drive converts to application/vnd.google-apps.document
// Flow (Import): User provides Google Doc ID → files.export as text/html →
//                insert into editor
// Auth: Google Identity Services (GIS) OAuth 2.0 popup token

const GDOCS = {
  clientId: '',
  apiKey: '',
  accessToken: '',
  tokenExpiry: 0,
  SCOPES: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/documents',
  DRIVE_BASE: 'https://www.googleapis.com/drive/v3',
  UPLOAD_BASE: 'https://www.googleapis.com/upload/drive/v3',
};

// ---- Panel open / close ----

function openGoogleDocsPanel() {
  document.getElementById('gdocs-client-id').value = localStorage.getItem('gdocs_client_id') || '';
  document.getElementById('gdocs-api-key').value = localStorage.getItem('gdocs_api_key') || '';
  document.getElementById('gdocs-modal').style.display = 'block';
  document.getElementById('gdocs-modal-overlay').style.display = 'block';
}

function closeGoogleDocsPanel() {
  document.getElementById('gdocs-modal').style.display = 'none';
  document.getElementById('gdocs-modal-overlay').style.display = 'none';
}

function saveGoogleDocsConfig() {
  const clientId = document.getElementById('gdocs-client-id').value.trim();
  const apiKey = document.getElementById('gdocs-api-key').value.trim();

  if (!clientId) { notify('⚠️ Ingresa el Client ID de Google', 'error'); return; }
  if (!apiKey) { notify('⚠️ Ingresa la API Key de Google', 'error'); return; }

  GDOCS.clientId = clientId;
  GDOCS.apiKey = apiKey;
  localStorage.setItem('gdocs_client_id', clientId);
  localStorage.setItem('gdocs_api_key', apiKey);

  notify('✅ Credenciales guardadas — autenticando...', 'info');
  requestGoogleToken().then(() => {
    notify('🟢 Google Docs conectado correctamente', 'success');
    updateGDocsDot();
    closeGoogleDocsPanel();
  }).catch(err => {
    notify('❌ Error de autenticación: ' + (err.message || err), 'error');
  });
}

function updateGDocsDot() {
  const dot = document.getElementById('gdocs-dot');
  if (!dot) return;
  const hasToken = GDOCS.accessToken && Date.now() < GDOCS.tokenExpiry;
  dot.classList.toggle('connected', hasToken);
}

// ---- OAuth 2.0 via Google Identity Services ----

/**
 * Request or reuse an OAuth access token using GIS implicit flow (popup).
 * Returns the access token string.
 */
function requestGoogleToken() {
  return new Promise((resolve, reject) => {
    // Reuse if still valid (with 60s buffer)
    if (GDOCS.accessToken && Date.now() < GDOCS.tokenExpiry - 60000) {
      return resolve(GDOCS.accessToken);
    }

    const clientId = GDOCS.clientId || localStorage.getItem('gdocs_client_id');
    if (!clientId) {
      return reject(new Error('Configura primero el Client ID de Google en "Configurar API"'));
    }

    if (typeof google === 'undefined' || !google.accounts) {
      return reject(new Error('Google Identity Services no cargado. Verifica conexión a internet.'));
    }

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GDOCS.SCOPES,
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error));
          return;
        }
        GDOCS.accessToken = response.access_token;
        // GIS tokens usually expire in 3600s
        GDOCS.tokenExpiry = Date.now() + (response.expires_in || 3600) * 1000;
        updateGDocsDot();
        resolve(GDOCS.accessToken);
      },
    });

    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

// ---- Core Drive API helper ----

async function driveRequest(method, endpoint, body = null, params = {}, isUpload = false) {
  const token = await requestGoogleToken();
  const base = isUpload ? GDOCS.UPLOAD_BASE : GDOCS.DRIVE_BASE;

  let url = `${base}${endpoint}`;
  const qs = new URLSearchParams({ key: GDOCS.apiKey, ...params }).toString();
  if (qs) url += '?' + qs;

  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  if (body instanceof FormData || body instanceof Blob) {
    opts.body = body;
  } else if (body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  const resp = await fetch(url, opts);

  if (resp.status === 429) {
    const retryAfter = parseInt(resp.headers.get('Retry-After') || '5', 10);
    notify(`⏳ Límite Google API — reintentando en ${retryAfter}s...`, 'info');
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    return driveRequest(method, endpoint, body, params, isUpload);
  }

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const msg = err?.error?.message || `HTTP ${resp.status}`;
    throw new Error(msg);
  }

  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) return resp.json();
  return resp.text();
}

// ---- EXPORT: HTML → Google Docs ----

/**
 * Export current editor content to Google Drive as a Google Doc.
 * Uses multipart upload with MIME conversion:
 *   Source: text/html  →  Target: application/vnd.google-apps.document
 */
async function exportToGoogleDocs() {
  const title = document.getElementById('doc-title').value.trim() || 'Documento MICSA';
  const editorHTML = document.getElementById('editor').innerHTML;

  if (!editorHTML.trim()) {
    notify('⚠️ El documento está vacío', 'error');
    return;
  }

  // Build full HTML document
  const fullHTML = `<!DOCTYPE html>
                  <html lang="es">
                    <head>
                      <meta charset="UTF-8" />
                      <title>${title}</title>
                      <style>
                        body {font - family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #000; margin: 2cm; line-height: 1.7; }
                        h1,h2,h3 {color: #000; font-family: Arial, sans-serif; }
                        table {border - collapse: collapse; width: 100%; }
                        td, th {border: 1px solid #000; padding: 6px; }
                        th {background: #000; color: #fff; font-weight: 700; }
                      </style>
                    </head>
                    <body>
                      <h1>${title}</h1>
                      ${editorHTML}
                      <p style="margin-top:40px;font-size:9pt;color:#555;">
                        Documento generado por MICSA Doc Studio — MICSA Industrial S.A. de C.V. (MIC230126BS5)
                      </p>
                    </body>
                  </html>`;

  // Try OAuth flow first (if credentials are set up)
  const clientId = GDOCS.clientId || localStorage.getItem('gdocs_client_id');
  const hasGIS = typeof google !== 'undefined' && google.accounts;

  if (clientId && hasGIS) {
    notify('🔑 Autenticando con Google...', 'info');
    try {
      const token = await requestGoogleToken();
      const apiKey = GDOCS.apiKey || localStorage.getItem('gdocs_api_key') || '';
      const metadata = { name: title, mimeType: 'application/vnd.google-apps.document' };
      const boundary = 'micsa_' + Date.now();
      const body = [
        `--${boundary}`,
        'Content-Type: application/json; charset=UTF-8',
        '',
        JSON.stringify(metadata),
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=UTF-8',
        '',
        fullHTML,
        '',
        `--${boundary}--`,
      ].join('\r\n');

      const keyParam = apiKey ? `&key=${apiKey}` : '';
      notify('📤 Subiendo a Google Drive...', 'info');
      const resp = await fetch(`${GDOCS.UPLOAD_BASE}/files?uploadType=multipart${keyParam}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary="${boundary}"`,
        },
        body,
      });

      if (resp.ok) {
        const file = await resp.json();
        const docUrl = `https://docs.google.com/document/d/${file.id}/edit`;
        notify('✅ Exportado a Google Docs — abriendo...', 'success');
        window.open(docUrl, '_blank');
        showGDocsResult(`📄 <strong>${title}</strong> exportado<br><a href="${docUrl}" target="_blank">🔗 Abrir en Google Docs</a>`);
        return;
      }
    } catch (oauthErr) {
      console.warn('OAuth export failed, falling back to download:', oauthErr);
    }
  }

  // Fallback: download HTML and open Google Docs
  notify('📥 Descargando HTML para Google Docs...', 'info');
  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.html`;
  a.click();
  URL.revokeObjectURL(url);

  setTimeout(() => {
    window.open('https://drive.google.com/drive/my-drive', '_blank');
    notify('✅ Archivo descargado. Arrastra el .html a Google Drive → clic derecho → "Abrir con Google Docs"', 'success');
    showGDocsResult(`
                    📄 <strong>${title}.html</strong> descargado<br>
                      <span style="font-size:11px;">1. Arrastra a <a href="https://drive.google.com" target="_blank">Google Drive</a><br>
                        2. Clic derecho → <strong>Abrir con → Google Docs</strong></span>
                      `);
  }, 800);
}


// ---- IMPORT: Google Doc → Editor ----

/**
 * Import a Google Doc from Drive into the editor.
 * Uses files.export with mimeType=text/html.
 * The Google Doc ID is extracted from a URL or entered directly.
 */
async function importFromGoogleDrive() {
  const docInput = prompt(
    '🟦 Importar desde Google Docs\n\n' +
    'Pega la URL del documento de Google Docs\n' +
    '(Ejemplo: https://docs.google.com/document/d/DOCUMENT_ID/edit)\n\n' +
    'O ingresa solo el Document ID:',
    ''
  );

  if (!docInput || !docInput.trim()) return;

  // Extract document ID from URL or use as-is
  let docId = docInput.trim();
  const idMatch = docInput.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (idMatch) docId = idMatch[1];

  if (!docId) {
    notify('⚠️ ID de documento inválido', 'error');
    return;
  }

  notify('🔑 Autenticando con Google...', 'info');
  try {
    const token = await requestGoogleToken();

    notify('📥 Descargando documento...', 'info');

    // Export Google Doc as HTML (Drive API v3: files.export)
    const exportUrl = `${GDOCS.DRIVE_BASE}/files/${docId}/export?mimeType=text/html&key=${GDOCS.apiKey}`;
    const resp = await fetch(exportUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (resp.status === 404) {
      throw new Error('Documento no encontrado. Verifica que tienes acceso y que el ID es correcto.');
    }
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${resp.status}`);
    }

    const htmlContent = await resp.text();

    // Extract just the body content
    let bodyContent = htmlContent;
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) bodyContent = bodyMatch[1];

    // Clean up Google Docs-specific attributes and styles
    bodyContent = bodyContent
      .replace(/class="[^"]*"/g, '')
      .replace(/style="[^"]*color:\s*#[0-9a-f]{6}[^"]*"/gi, '')
      .replace(/<span\s*>/g, '')
      .replace(/<\/span>/g, '')
      .trim();

    // Confirm before replacing editor content
    const editor = document.getElementById('editor');
    if (editor.innerHTML.trim() && editor.innerHTML.trim() !== '<br>') {
      const confirm = window.confirm(
        '¿Reemplazar el contenido actual del editor con el documento importado?\n\n' +
        'Esta acción no se puede deshacer.'
      );
      if (!confirm) return;
    }

    editor.innerHTML = bodyContent;

    // Get document metadata for the title
    try {
      const metaResp = await fetch(
        `${GDOCS.DRIVE_BASE}/files/${docId}?fields=name&key=${GDOCS.apiKey}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (metaResp.ok) {
        const meta = await metaResp.json();
        document.getElementById('doc-title').value = meta.name || 'Documento importado';
      }
    } catch (_) { /* title fallback */ }

    onEditorChange();
    notify('✅ Documento importado desde Google Docs — fuente Arial aplicada', 'success');

  } catch (err) {
    console.error('Google Docs import error:', err);
    notify('❌ Error al importar: ' + (err.message || 'Desconocido'), 'error');
  }
}

/**
 * Show a result/status area below the Google Docs sidebar section.
 */
function showGDocsResult(html) {
  // Remove existing result if any
  const existing = document.getElementById('gdocs-result-bar');
  if (existing) existing.remove();

  const nav = document.querySelector('.sidebar-section:has(#gdocs-dot)');
  if (!nav) return;

  const bar = document.createElement('div');
  bar.id = 'gdocs-result-bar';
  bar.className = 'gdocs-import-result';
  bar.innerHTML = html;
  nav.appendChild(bar);
}

// Load saved config on startup
(function initGDocs() {
  GDOCS.clientId = localStorage.getItem('gdocs_client_id') || '';
  GDOCS.apiKey = localStorage.getItem('gdocs_api_key') || '';
})();

// ==================== COTIZADOR FORMAL MICSA ====================

function openCotizador() {
  // Set today's date
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('cot-fecha').value = hoy;

  // Auto-increment folio based on saved docs
  const saved = state.savedDocs || [];
  const cotCount = saved.filter(d => d.title && d.title.startsWith('COT-')).length + 1;
  const year = new Date().getFullYear();
  document.getElementById('cot-folio').value = `COT-${year}-${String(cotCount).padStart(3, '0')}`;

  document.getElementById('cot-modal').style.display = 'block';
  document.getElementById('cot-modal-overlay').style.display = 'block';

  // Run initial calculation
  cotRecalc();
}

function closeCotizador() {
  document.getElementById('cot-modal').style.display = 'none';
  document.getElementById('cot-modal-overlay').style.display = 'none';
}

/** Live recalculation engine */
function cotRecalc() {
  const MXN = (n) => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const personal = +document.getElementById('cot-personal').value || 0;
  const semanas = +document.getElementById('cot-semanas').value || 0;
  const meses = +document.getElementById('cot-meses').value || 0;

  const pNomina = +document.getElementById('cot-precio-nomina').value || 0;
  const pIMSS = +document.getElementById('cot-precio-imss').value || 0;
  const pEPP = +document.getElementById('cot-precio-epp').value || 0;
  const pHerr = +document.getElementById('cot-precio-herr').value || 0;
  const pLog = +document.getElementById('cot-precio-log').value || 0;
  const pctGest = +document.getElementById('cot-gestion-pct').value || 15;

  // Subtotals
  const subNomina = personal * semanas * pNomina;
  const subIMSS = personal * meses * pIMSS;
  const subEPP = pEPP;
  const subHerr = pHerr;
  const subLog = pLog;

  // Update quantity labels
  document.getElementById('cot-q-nomina').textContent = `${personal}p × ${semanas}s`;
  document.getElementById('cot-q-imss').textContent = `${personal}p × ${meses}m`;

  // Update subtotal labels
  document.getElementById('cot-sub-nomina').textContent = MXN(subNomina);
  document.getElementById('cot-sub-imss').textContent = MXN(subIMSS);
  document.getElementById('cot-sub-epp').textContent = MXN(subEPP);
  document.getElementById('cot-sub-herr').textContent = MXN(subHerr);
  document.getElementById('cot-sub-log').textContent = MXN(subLog);

  // Totals
  const subtotalDirecto = subNomina + subIMSS + subEPP + subHerr + subLog;
  const gestion = subtotalDirecto * (pctGest / 100);
  const subtotalBase = subtotalDirecto + gestion;
  const iva = subtotalBase * 0.16;
  const total = subtotalBase + iva;

  document.getElementById('cot-total-directo').textContent = MXN(subtotalDirecto);
  document.getElementById('cot-total-gestion').textContent = MXN(gestion);
  document.getElementById('cot-total-base').textContent = MXN(subtotalBase);
  document.getElementById('cot-total-iva').textContent = MXN(iva);
  document.getElementById('cot-total-final').textContent = MXN(total) + ' MXN';

  // Store for document generation
  window.__cotData = {
    folio: document.getElementById('cot-folio').value,
    fecha: document.getElementById('cot-fecha').value,
    vigencia: document.getElementById('cot-vigencia').value,
    cliNombre: document.getElementById('cot-cli-nombre').value,
    cliRFC: document.getElementById('cot-cli-rfc').value,
    cliDom: document.getElementById('cot-cli-dom').value,
    signerEmail: document.getElementById('cot-signer-email').value,
    proyNombre: document.getElementById('cot-proy-nombre').value,
    cliFinal: document.getElementById('cot-cli-final').value,
    servicio: document.getElementById('cot-servicio').value,
    meses, semanas, personal,
    turno: document.getElementById('cot-turno').value,
    pNomina, pIMSS, pEPP, pHerr, pLog, pctGest,
    subNomina, subIMSS, subEPP, subHerr, subLog,
    subtotalDirecto, gestion, subtotalBase, iva, total,
    MXN,
  };
}

/** Build the final HTML document for the editor */
function buildCotizacionHTML(d) {
  const fechaDisplay = d.fecha
    ? new Date(d.fecha + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });

  return `
                        <div style="border-bottom:3px solid #f5a623;padding-bottom:12px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:flex-start;">
                          <div>
                            <div style="font-size:22pt;font-weight:900;color:#1f4e78;letter-spacing:-.02em;">MICSA</div>
                            <div style="font-size:9pt;color:#555;font-weight:600;">Montajes e Izajes del Centro Industrial Contractor SA de CV</div>
                            <div style="font-size:8.5pt;color:#666;">La Madrid 500, Col. Deportivo, Monclova, Coahuila, C.P. 25760</div>
                            <div style="font-size:8.5pt;color:#666;">Tel: (866) 176-6621 | RFC: MIC230126BS5</div>
                          </div>
                          <div style="text-align:right;">
                            <div style="background:#1f4e78;color:#fff;padding:6px 16px;border-radius:6px;display:inline-block;">
                              <div style="font-size:8pt;opacity:.8;text-transform:uppercase;letter-spacing:.07em;">Cotización</div>
                              <div style="font-size:16pt;font-weight:900;">${d.folio}</div>
                            </div>
                          </div>
                        </div>

                        <div style="background:#f2f2f2;padding:6px 12px;border-bottom:1px solid #ddd;margin-bottom:16px;display:flex;justify-content:space-between;font-weight:700;font-size:10pt;">
                          <div>COTIZACIÓN FORMAL</div>
                          <div>FECHA: ${fechaDisplay}</div>
                          <div>VIGENCIA: ${d.vigencia}</div>
                        </div>

                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;">
                          <div style="border:1px solid #ddd;border-radius:6px;overflow:hidden;">
                            <div style="background:#1f4e78;color:#fff;padding:4px 10px;font-size:9pt;font-weight:700;text-transform:uppercase;">Datos del Cliente</div>
                            <div style="padding:10px;font-size:9pt;">
                              <div style="font-weight:700;margin-bottom:3px;">${d.cliNombre || '—'}</div>
                              <div><strong>RFC:</strong> ${d.cliRFC || '—'}</div>
                              <div><strong>Dom:</strong> ${d.cliDom || '—'}</div>
                            </div>
                          </div>
                          <div style="border:1px solid #ddd;border-radius:6px;overflow:hidden;">
                            <div style="background:#1f4e78;color:#fff;padding:4px 10px;font-size:9pt;font-weight:700;text-transform:uppercase;">Datos del Proyecto</div>
                            <div style="padding:10px;font-size:9pt;display:grid;grid-template-columns:1fr 1fr;gap:3px;">
                              <div><strong>Proyecto:</strong> ${d.proyNombre || '—'}</div>
                              <div><strong>Duración:</strong> ${d.meses} meses (${d.semanas} sem)</div>
                              <div><strong>Cliente Final:</strong> ${d.cliFinal || '—'}</div>
                              <div><strong>Servicio:</strong> ${d.servicio || '—'}</div>
                              <div><strong>Personal:</strong> ${d.personal} personas</div>
                              <div><strong>Turno:</strong> ${d.turno}</div>
                            </div>
                          </div>
                        </div>

                        <table style="width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:16px;">
                          <thead>
                            <tr>
                              <th style="background:#1f4e78;color:#fff;padding:7px 10px;text-align:left;width:40%;">CONCEPTO</th>
                              <th style="background:#1f4e78;color:#fff;padding:7px 10px;text-align:center;width:20%;">CANTIDAD</th>
                              <th style="background:#1f4e78;color:#fff;padding:7px 10px;text-align:right;width:20%;">PRECIO UNIT.</th>
                              <th style="background:#1f4e78;color:#fff;padding:7px 10px;text-align:right;width:20%;">SUBTOTAL</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style="border:1px solid #ddd;padding:6px 10px;"><strong>Nómina y Mano de Obra</strong><br><small style="color:#888;">Incluye salarios, prestaciones y administración</small></td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">${d.personal} pers × ${d.semanas} sem</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">${d.MXN(d.pNomina)} /sem</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:600;">${d.MXN(d.subNomina)}</td>
                            </tr>
                            <tr style="background:#fafafa;">
                              <td style="border:1px solid #ddd;padding:6px 10px;"><strong>IMSS y Cargas Sociales</strong></td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">${d.personal} pers × ${d.meses} meses</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">${d.MXN(d.pIMSS)} /mes</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:600;">${d.MXN(d.subIMSS)}</td>
                            </tr>
                            <tr>
                              <td style="border:1px solid #ddd;padding:6px 10px;"><strong>EPP — Equipo de Protección Personal</strong></td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">1 kit completo</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">${d.MXN(d.pEPP)}</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:600;">${d.MXN(d.subEPP)}</td>
                            </tr>
                            <tr style="background:#fafafa;">
                              <td style="border:1px solid #ddd;padding:6px 10px;"><strong>Herramientas y Equipo Menor</strong></td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">1 lote</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">${d.MXN(d.pHerr)}</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:600;">${d.MXN(d.subHerr)}</td>
                            </tr>
                            <tr>
                              <td style="border:1px solid #ddd;padding:6px 10px;">Logística / Traslados</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:center;">N/A</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">—</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;font-weight:600;">${d.MXN(d.subLog)}</td>
                            </tr>
                            <tr style="background:#f5f5f5;font-weight:700;">
                              <td colspan="3" style="border:none;padding:6px 10px;text-align:right;">SUBTOTAL DIRECTO:</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">${d.MXN(d.subtotalDirecto)}</td>
                            </tr>
                            <tr>
                              <td colspan="3" style="border:none;padding:6px 10px;text-align:right;">Gestión Administrativa MICSA (${d.pctGest}%):</td>
                              <td style="border:1px solid #ddd;padding:6px 10px;text-align:right;">${d.MXN(d.gestion)}</td>
                            </tr>
                          </tbody>
                        </table>

                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;">
                          <div>
                            <div style="background:#1f4e78;color:#fff;padding:4px 10px;font-size:9pt;font-weight:700;text-transform:uppercase;margin-bottom:0;">Condiciones Comerciales</div>
                            <div style="border:1px solid #ddd;border-left:4px solid #f5a623;padding:10px;font-size:8.5pt;">
                              <ul style="margin:0;padding-left:16px;">
                                <li>Precios en Moneda Nacional (MXN) + IVA 16%</li>
                                <li>Vigencia de cotización: ${d.vigencia}</li>
                                <li><strong>Forma de pago:</strong> 50% anticipo, 50% contra entrega</li>
                                <li>Tiempo de arranque: 5–7 días hábiles tras anticipo</li>
                                <li>Incluye: EPP completo, IMSS, nómina, gestión MICSA</li>
                              </ul>
                            </div>
                            <div style="margin-top:10px;">
                              <div style="background:#555;color:#fff;padding:4px 10px;font-size:9pt;font-weight:700;text-transform:uppercase;">Datos Bancarios</div>
                              <div style="border:1px solid #ddd;padding:8px 10px;font-size:8.5pt;">
                                <div style="font-weight:700;margin-bottom:3px;">BBVA México</div>
                                <div><strong>Beneficiario:</strong> Montajes e Izajes del Centro Industrial Contractor SA de CV</div>
                                <div style="margin-top:3px;"><strong>Cuenta:</strong> 0123456789 | <strong>CLABE:</strong> 012760001234567890</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div style="border:2px solid #ddd;font-size:9pt;">
                              <div style="display:flex;justify-content:space-between;padding:5px 10px;border-bottom:1px solid #eee;"><span>Subtotal Directo:</span><span>${d.MXN(d.subtotalDirecto)}</span></div>
                              <div style="display:flex;justify-content:space-between;padding:5px 10px;border-bottom:1px solid #eee;"><span>Gestión Administrativa (${d.pctGest}%):</span><span>${d.MXN(d.gestion)}</span></div>
                              <div style="display:flex;justify-content:space-between;padding:5px 10px;border-bottom:1px solid #ccc;font-weight:700;background:#f8f8f8;"><span>SUBTOTAL BASE:</span><span>${d.MXN(d.subtotalBase)}</span></div>
                              <div style="display:flex;justify-content:space-between;padding:5px 10px;border-bottom:1px solid #eee;"><span>IVA (16%):</span><span>${d.MXN(d.iva)}</span></div>
                              <div style="display:flex;justify-content:space-between;padding:8px 10px;background:#1f4e78;color:#fff;font-weight:800;font-size:11pt;"><span>TOTAL COTIZACIÓN:</span><span>${d.MXN(d.total)} MXN</span></div>
                            </div>
                            <div style="margin-top:24px;text-align:center;">
                              <div style="border-bottom:1px solid #000;width:200px;margin:0 auto 5px;height:40px;"></div>
                              <div style="font-size:8pt;font-weight:700;">AUTORIZACIÓN / FIRMA</div>
                              <div style="font-size:7pt;color:#666;">MICSA CONTRACTOR SA DE CV</div>
                            </div>
                          </div>
                        </div>
                        `;
}

/** Generate the cotización and load it into the editor */
function generarCotizacion() {
  cotRecalc(); // ensure latest values
  const d = window.__cotData;
  if (!d) return;

  const html = buildCotizacionHTML(d);
  const editor = document.getElementById('editor');
  editor.innerHTML = html;
  document.getElementById('doc-title').value = `${d.folio} — ${d.cliNombre || 'Cliente'}`;
  closeCotizador();
  onEditorChange();
  notify('✅ Cotización generada en el editor', 'success');
}

/** Generate + immediately export as PDF Pro */
async function generarYExportarPDF() {
  generarCotizacion();
  await new Promise(r => setTimeout(r, 300)); // small delay for render
  await exportPDF_Professional();
}

/** Generate + send immediately to Adobe Sign for signature */
async function generarYFirmar() {
  cotRecalc();
  const d = window.__cotData;
  if (!d) return;

  if (!d.signerEmail) {
    notify('⚠️ Ingresa el correo del firmante', 'error');
    return;
  }

  // Generate document first
  generarCotizacion();
  await new Promise(r => setTimeout(r, 300));

  // Pre-fill Adobe Sign fields if available
  const emailEl = document.getElementById('adobe-signer-email');
  const nameEl = document.getElementById('adobe-signer-name');
  const msgEl = document.getElementById('adobe-message');

  if (emailEl) emailEl.value = d.signerEmail;
  if (nameEl) nameEl.value = d.cliNombre || '';
  if (msgEl) msgEl.value = `Le enviamos para su revisión y firma la Cotización ${d.folio} por un total de ${d.MXN(d.total)} MXN + IVA. — MICSA Industrial`;

  // Check if integration key is set
  const keyEl = document.getElementById('adobe-integration-key');
  if (!keyEl || !keyEl.value.trim()) {
    notify('⚠️ Primero configura tu Integration Key de Adobe Sign en el sidebar', 'error');
    openAdobeSignPanel();
    return;
  }

  await sendForAdobeSign();
}

// ==================== COTIZADOR DE ADICIONALES / CARRIER ====================

const CARR_IVA_DEFAULT = [
  { desc: 'EQUIPO GRUA 40 TON — 2 UNIDADES 1 DÍA', linea: 'PLANTA.', costo: 130000, iva: 'inc' },
  { desc: 'EQUIPO VERSA LIFT 46/60 — 5 DÍAS', linea: 'PLANTA.', costo: 183280, iva: 'mas' },
  { desc: 'ADICIONALES DEL PROYECTO', linea: 'PLANTA.', costo: 102538, iva: 'mas' },
];

function openCarrierCot() {
  const hoy = new Date().toISOString().split('T')[0];
  document.getElementById('carr-fecha').value = hoy;

  const saved = state.savedDocs || [];
  const n = saved.filter(d => d.title && d.title.startsWith('COT-')).length + 1;
  const yr = new Date().getFullYear();
  document.getElementById('carr-folio').value = `COT-${yr}-${String(n).padStart(3, '0')}`;

  // Seed rows from last real COT (CARRIER.pdf defaults)
  const container = document.getElementById('carr-rows');
  container.innerHTML = '';
  CARR_IVA_DEFAULT.forEach(r => _carrAppendRow(r.desc, r.linea, r.costo, r.iva));

  // Reset personal
  document.getElementById('carr-personal-check').checked = false;
  document.getElementById('carr-personal-section').style.display = 'none';
  document.getElementById('carr-personal-rows').innerHTML = '';

  carrRecalc();
  document.getElementById('carr-modal').style.display = 'block';
  document.getElementById('carr-modal-overlay').style.display = 'block';
}

function closeCarrierCot() {
  document.getElementById('carr-modal').style.display = 'none';
  document.getElementById('carr-modal-overlay').style.display = 'none';
}

function _carrAppendRow(desc = '', linea = 'PLANTA.', costo = 0, ivaMode = 'mas') {
  const container = document.getElementById('carr-rows');
  const idx = container.children.length;
  const div = document.createElement('div');
  div.className = 'cot-row';
  div.style.cssText = 'grid-template-columns:3fr 1.2fr 1.4fr 1fr 28px;align-items:center;';
  div.innerHTML = `
    <div class="modal-field modal-field-0"><input type="text" value="${desc}" placeholder="Descripción del servicio"
      style="width:100%;font-size:8.5pt;" oninput="carrRecalc()" class="carr-desc"/></div>
    <div class="modal-field modal-field-0"><input type="text" value="${linea}" placeholder="PLANTA."
      style="width:100%;font-size:8.5pt;text-align:center;" class="carr-linea"/></div>
    <div class="modal-field modal-field-0"><input type="number" value="${costo}" min="0" step="0.01"
      style="width:100%;font-size:8.5pt;text-align:right;" oninput="carrRecalc()" class="carr-costo"/></div>
    <div>
      <select class="carr-iva" onchange="carrRecalc()" style="font-size:8pt;width:100%;padding:3px 2px;">
        <option value="mas" ${ivaMode==='mas'?'selected':''}>+IVA</option>
        <option value="inc" ${ivaMode==='inc'?'selected':''}>Inc.IVA</option>
        <option value="no" ${ivaMode==='no'?'selected':''}>Sin IVA</option>
      </select>
    </div>
    <button onclick="carrRemoveRow(this)" style="background:none;border:none;color:#c00;cursor:pointer;font-size:14px;padding:0;line-height:1;">✕</button>
  `;
  container.appendChild(div);
}

function carrAddRow() {
  _carrAppendRow();
  carrRecalc();
}

function carrRemoveRow(btn) {
  btn.closest('.cot-row').remove();
  carrRecalc();
}

function carrTogglePersonal() {
  const show = document.getElementById('carr-personal-check').checked;
  document.getElementById('carr-personal-section').style.display = show ? 'block' : 'none';
  if (show && document.getElementById('carr-personal-rows').children.length === 0) {
    carrAddPersonal();
  }
}

function carrAddPersonal() {
  const container = document.getElementById('carr-personal-rows');
  const n = container.children.length + 1;
  const div = document.createElement('div');
  div.style.cssText = 'display:grid;grid-template-columns:28px 2fr 1.5fr 2fr 28px;gap:4px;align-items:center;margin-top:3px;';
  div.innerHTML = `
    <span style="font-size:8pt;text-align:center;color:#666;">${n}</span>
    <input type="text" placeholder="Nombre completo" style="font-size:8pt;padding:3px 5px;border:1px solid #ccc;border-radius:3px;"/>
    <input type="text" placeholder="NSS" style="font-size:8pt;padding:3px 5px;border:1px solid #ccc;border-radius:3px;"/>
    <input type="text" placeholder="CURP" style="font-size:8pt;padding:3px 5px;border:1px solid #ccc;border-radius:3px;"/>
    <button onclick="this.closest('div').remove();carrRenumberPersonal()" style="background:none;border:none;color:#c00;cursor:pointer;font-size:13px;padding:0;">✕</button>
  `;
  container.appendChild(div);
}

function carrRenumberPersonal() {
  const rows = document.getElementById('carr-personal-rows').children;
  Array.from(rows).forEach((r, i) => {
    const num = r.querySelector('span');
    if (num) num.textContent = i + 1;
  });
}

function carrRecalc() {
  const rows = document.getElementById('carr-rows').querySelectorAll('.cot-row');
  let sinIVA = 0, ivaTotal = 0;
  rows.forEach(r => {
    const costo = +r.querySelector('.carr-costo').value || 0;
    const mode = r.querySelector('.carr-iva').value;
    if (mode === 'mas') { sinIVA += costo; ivaTotal += costo * 0.16; }
    else if (mode === 'inc') { const base = costo / 1.16; sinIVA += base; ivaTotal += costo - base; }
    else { sinIVA += costo; } // sin IVA
  });
  const total = sinIVA + ivaTotal;
  const MXN = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  document.getElementById('carr-total-base').textContent = MXN(sinIVA);
  document.getElementById('carr-total-iva').textContent = MXN(ivaTotal);
  document.getElementById('carr-total-final').textContent = MXN(total) + ' MXN';
  window.__carrData = {
    folio: document.getElementById('carr-folio').value,
    fecha: document.getElementById('carr-fecha').value,
    vigencia: document.getElementById('carr-vigencia').value,
    cliente: document.getElementById('carr-cliente').value,
    referencia: document.getElementById('carr-referencia').value,
    direccion: document.getElementById('carr-direccion').value,
    planta: document.getElementById('carr-planta').value,
    atencion: document.getElementById('carr-atencion').value,
    contacto: document.getElementById('carr-contacto').value,
    correo: document.getElementById('carr-correo').value,
    actividad: document.getElementById('carr-actividad').value,
    nota: document.getElementById('carr-nota').value,
    sinIVA, ivaTotal, total, MXN,
    partidas: Array.from(rows).map(r => ({
      desc: r.querySelector('.carr-desc').value,
      linea: r.querySelector('.carr-linea').value,
      costo: +r.querySelector('.carr-costo').value || 0,
      iva: r.querySelector('.carr-iva').value,
    })),
    personal: document.getElementById('carr-personal-check').checked
      ? Array.from(document.getElementById('carr-personal-rows').children).map((r, i) => {
          const inputs = r.querySelectorAll('input');
          return { n: i+1, nombre: inputs[0]?.value||'', nss: inputs[1]?.value||'', curp: inputs[2]?.value||'' };
        })
      : null,
  };
}

function buildCarrierCotHTML(d) {
  const fechaDisplay = d.fecha
    ? new Date(d.fecha + 'T00:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });

  const ivaLabel = m => ({ mas: 'MXN + IVA', inc: 'MXN (IVA inc.)', no: 'MXN (sin IVA)' }[m] || 'MXN');

  const filasPartidas = d.partidas.map((p, i) => `
    <tr style="background:${i%2===0?'#fff':'#f7f7f7'}">
      <td style="border:1px solid #ccc;padding:8px 10px;font-size:9pt;font-style:italic;font-weight:600;">${p.desc || '—'}</td>
      <td style="border:1px solid #ccc;padding:8px 10px;font-size:9pt;text-align:center;">${p.linea || '—'}</td>
      <td style="border:1px solid #ccc;padding:8px 10px;font-size:9pt;text-align:right;font-weight:700;">
        $${p.costo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ${ivaLabel(p.iva)}
      </td>
    </tr>`).join('');

  const notaLineas = (d.nota || '').split('\n').map(l => `<div style="margin-bottom:3px;">${l}</div>`).join('');

  const personalPage = d.personal && d.personal.length > 0 ? `
    <div style="page-break-before:always;padding:24px 32px;">
      <div style="font-size:13pt;font-weight:900;color:#1f4e78;text-align:center;margin-bottom:18px;">
        PERSONAL ASIGNADO: ${d.planta || 'Planta'}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:9pt;">
        <thead>
          <tr>
            <th style="border:1px solid #999;padding:6px 8px;background:#1f4e78;color:#fff;width:40px;">No.</th>
            <th style="border:1px solid #999;padding:6px 8px;background:#1f4e78;color:#fff;text-align:left;">Nombre completo</th>
            <th style="border:1px solid #999;padding:6px 8px;background:#1f4e78;color:#fff;text-align:left;">NSS</th>
            <th style="border:1px solid #999;padding:6px 8px;background:#1f4e78;color:#fff;text-align:left;">CURP</th>
          </tr>
        </thead>
        <tbody>
          ${d.personal.map(p => `
            <tr>
              <td style="border:1px solid #ccc;padding:5px 8px;text-align:center;">${p.n}</td>
              <td style="border:1px solid #ccc;padding:5px 8px;">${p.nombre}</td>
              <td style="border:1px solid #ccc;padding:5px 8px;">${p.nss}</td>
              <td style="border:1px solid #ccc;padding:5px 8px;">${p.curp}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>` : '';

  return `
    <div style="font-family:Arial,sans-serif;font-size:9pt;color:#111;max-width:750px;margin:0 auto;">

      <!-- HEADER CON INFO CLIENTE -->
      <table style="width:100%;border-collapse:collapse;border:1px solid #aaa;margin-bottom:18px;font-size:9pt;">
        <tr>
          <td style="padding:6px 10px;border:1px solid #aaa;width:130px;font-weight:700;background:#f5f5f5;">Cliente:</td>
          <td style="padding:6px 10px;border:1px solid #aaa;">${d.cliente || '—'}</td>
          <td style="padding:6px 10px;border:1px solid #aaa;width:130px;font-weight:700;background:#f5f5f5;">Referencia:</td>
          <td style="padding:6px 10px;border:1px solid #aaa;font-style:italic;">${d.referencia || '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;border:1px solid #aaa;font-weight:700;background:#f5f5f5;">Dirección</td>
          <td style="padding:6px 10px;border:1px solid #aaa;">${d.direccion || '—'}</td>
          <td style="padding:6px 10px;border:1px solid #aaa;font-weight:700;background:#f5f5f5;">Planta:</td>
          <td style="padding:6px 10px;border:1px solid #aaa;">${d.planta || '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;border:1px solid #aaa;font-weight:700;background:#f5f5f5;">Atención.</td>
          <td style="padding:6px 10px;border:1px solid #aaa;">${d.atencion || '—'}</td>
          <td style="padding:6px 10px;border:1px solid #aaa;font-weight:700;background:#f5f5f5;" rowspan="2">Actividad:</td>
          <td style="padding:6px 10px;border:1px solid #aaa;font-weight:700;" rowspan="2">${d.actividad || '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;border:1px solid #aaa;font-weight:700;background:#f5f5f5;">Contacto</td>
          <td style="padding:6px 10px;border:1px solid #aaa;">${d.contacto || '—'}</td>
        </tr>
        <tr>
          <td style="padding:6px 10px;border:1px solid #aaa;font-weight:700;background:#f5f5f5;">Correo.</td>
          <td colspan="3" style="padding:6px 10px;border:1px solid #aaa;color:#1a56c4;">${d.correo || '—'}</td>
        </tr>
      </table>

      <!-- TITULO SECCION -->
      <div style="font-size:9.5pt;font-weight:700;text-transform:uppercase;margin-bottom:6px;">
        Alcance de Servicios Adicionales Cotizados
      </div>
      <div style="font-size:8.5pt;margin-bottom:14px;line-height:1.5;">
        Los siguientes conceptos corresponden a <strong>servicios y recursos adicionales</strong> no contemplados dentro del alcance base del
        proyecto y podrán ser contratados de manera independiente, conforme a las necesidades operativas del CLIENTE.
      </div>

      <div style="text-align:center;font-size:11pt;font-weight:900;margin-bottom:12px;">SIENDO NUESTRO PRECIO EL SIGUIENTE</div>

      <!-- TABLA DE PARTIDAS -->
      <table style="width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:18px;">
        <thead>
          <tr>
            <th style="border:1px solid #999;padding:7px 10px;background:#1f4e78;color:#fff;text-align:left;width:55%;">DESCRIPCIÓN</th>
            <th style="border:1px solid #999;padding:7px 10px;background:#1f4e78;color:#fff;text-align:center;width:20%;">LÍNEA-ESTACIÓN</th>
            <th style="border:1px solid #999;padding:7px 10px;background:#1f4e78;color:#fff;text-align:right;width:25%;">COSTO</th>
          </tr>
        </thead>
        <tbody>
          ${filasPartidas}
          <tr style="background:#f0f0f0;font-weight:700;">
            <td colspan="2" style="border:1px solid #ccc;padding:7px 10px;text-align:right;">SUBTOTAL SIN IVA:</td>
            <td style="border:1px solid #ccc;padding:7px 10px;text-align:right;">${d.MXN(d.sinIVA)} MXN</td>
          </tr>
          <tr>
            <td colspan="2" style="border:1px solid #ccc;padding:7px 10px;text-align:right;">IVA (16%):</td>
            <td style="border:1px solid #ccc;padding:7px 10px;text-align:right;">${d.MXN(d.ivaTotal)} MXN</td>
          </tr>
          <tr style="background:#1f4e78;color:#fff;font-weight:900;font-size:10pt;">
            <td colspan="2" style="border:1px solid #1f4e78;padding:8px 10px;text-align:right;">TOTAL COTIZACIÓN:</td>
            <td style="border:1px solid #1f4e78;padding:8px 10px;text-align:right;">${d.MXN(d.total)} MXN</td>
          </tr>
        </tbody>
      </table>

      <!-- NOTA GENERAL -->
      <div style="margin-bottom:18px;">
        <div style="font-size:10pt;font-weight:900;text-align:center;margin-bottom:6px;">NOTA GENERAL</div>
        <div style="font-size:8.5pt;font-weight:700;text-align:center;line-height:1.7;">${notaLineas}</div>
      </div>

      <!-- PIE -->
      <div style="text-align:center;margin-top:24px;">
        <div style="font-size:8.5pt;margin-bottom:4px;">Atentamente.</div>
        <div style="font-size:9.5pt;font-weight:900;text-transform:uppercase;color:#1f4e78;">
          Tu Socio Estratégico en Instalación de Maquinaria
        </div>
      </div>
    </div>
    ${personalPage}`;
}

function generarCarrierCot() {
  carrRecalc();
  const d = window.__carrData;
  if (!d) return;
  const html = buildCarrierCotHTML(d);
  document.getElementById('editor').innerHTML = html;
  document.getElementById('doc-title').value = `${d.folio} — ${d.cliente || 'Cliente'} Adicionales`;
  closeCarrierCot();
  onEditorChange();
  notify('✅ Cotización de Adicionales generada', 'success');
}

async function generarCarrierPDF() {
  generarCarrierCot();
  await new Promise(r => setTimeout(r, 300));
  await exportPDF_Professional();
}

// ==================== AI CHAT ====================

const chatState = {
  history: [],          // {role: 'user'|'model', parts: [{text}] }
  lastResponse: '',     // última respuesta del modelo (para "Insertar en editor")
  docContext: '',       // texto del editor en el momento de abrir el chat
  isLoading: false,
};

// ── Abrir / cerrar panel ──

function openAIChat() {
  const panel = document.getElementById('ai-chat-panel');
  const overlay = document.getElementById('ai-chat-overlay');
  panel.style.display = 'flex';
  overlay.style.display = 'block';
  // Forzar reflow para que la transición funcione
  requestAnimationFrame(() => {
    panel.style.right = '0';
  });
  syncChatContext();
  document.getElementById('chat-input').focus();
}

function closeAIChat() {
  const panel = document.getElementById('ai-chat-panel');
  const overlay = document.getElementById('ai-chat-overlay');
  panel.style.right = '-480px';
  overlay.style.display = 'none';
  setTimeout(() => { panel.style.display = 'none'; }, 340);
}

// ── Sincronizar contexto del documento ──

function syncChatContext() {
  const title = document.getElementById('doc-title')?.value?.trim() || 'Sin título';
  const content = document.getElementById('editor')?.innerText?.trim() || '';
  const words = content.split(/\s+/).filter(Boolean).length;
  chatState.docContext = `Título: "${title}"\n\nContenido:\n${content.substring(0, 4000)}`;
  const label = document.getElementById('chat-context-label');
  if (label) label.textContent = `"${title}" · ${words} palabras`;
}

// ── Config modal ──

function openChatConfig() {
  const modal = document.getElementById('chat-config-modal');
  const overlay = document.getElementById('chat-config-overlay');
  modal.style.display = 'block';
  overlay.style.display = 'block';
  const savedKey = localStorage.getItem('gemini_api_key') || '';
  const savedModel = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';
  document.getElementById('chat-api-key').value = savedKey;
  document.getElementById('chat-model').value = savedModel;
}

function closeChatConfig() {
  document.getElementById('chat-config-modal').style.display = 'none';
  document.getElementById('chat-config-overlay').style.display = 'none';
}

function saveChatConfig() {
  const key = document.getElementById('chat-api-key').value.trim();
  const model = document.getElementById('chat-model').value;
  if (!key) { notify('Ingresa una API Key de Gemini', 'error'); return; }
  localStorage.setItem('gemini_api_key', key);
  localStorage.setItem('gemini_model', model);
  closeChatConfig();
  // Mostrar dot verde en sidebar
  const dot = document.getElementById('chat-dot');
  if (dot) dot.style.display = 'block';
  notify('✅ API Key de Gemini guardada — ¡ya puedes chatear!', 'success');
}

// ── Limpiar historial ──

function clearChatHistory() {
  chatState.history = [];
  chatState.lastResponse = '';
  const msgs = document.getElementById('chat-messages');
  msgs.innerHTML = `
                        <div class="chat-msg-ai" style="display:flex;gap:10px;">
                          <div class="chat-avatar">🤖</div>
                          <div class="chat-bubble">Historial limpiado. ¿En qué te ayudo?</div>
                        </div>`;
  document.getElementById('chat-insert-btn').style.display = 'none';
}

// ── Enviar desde tecla Enter ──

function chatHandleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

// ── Acciones rápidas ──

function sendQuickPrompt(prompt) {
  document.getElementById('chat-input').value = prompt;
  sendChatMessage();
}

// ── Enviar mensaje ──

async function sendChatMessage() {
  if (chatState.isLoading) return;

  const inputEl = document.getElementById('chat-input');
  const userText = inputEl.value.trim();
  if (!userText) return;

  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    notify('⚠️ Configura tu API Key de Gemini primero (botón ⚙️ en el chat)', 'error');
    openChatConfig();
    return;
  }

  inputEl.value = '';
  chatState.isLoading = true;
  document.getElementById('chat-send-btn').style.opacity = '0.5';

  // Mostrar mensaje usuario
  appendChatMessage('user', userText);

  // Mostrar typing indicator
  const typingId = appendTypingIndicator();

  try {
    const reply = await chatCallGemini(userText, apiKey);
    removeTypingIndicator(typingId);
    appendChatMessage('ai', reply);
    chatState.lastResponse = reply;
    document.getElementById('chat-insert-btn').style.display = 'block';
  } catch (err) {
    removeTypingIndicator(typingId);
    let errMsg = '❌ Error al contactar Gemini.';
    if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('400')) {
      errMsg = '❌ API Key inválida. Verifica en ⚙️';
    } else if (err.message?.includes('429')) {
      errMsg = '⏳ Límite de peticiones alcanzado. Espera un momento.';
    } else if (err.message?.includes('fetch') || err.message?.includes('network')) {
      errMsg = '🌐 Sin conexión a internet.';
    }
    appendChatMessage('ai', errMsg + '\n\n`' + (err.message || '') + '`');
    console.error('[AI Chat] Error:', err);
  } finally {
    chatState.isLoading = false;
    document.getElementById('chat-send-btn').style.opacity = '1';
  }
}

// ── Llamada a Gemini API ──

async function chatCallGemini(userMessage, apiKey) {
  const model = localStorage.getItem('gemini_model') || 'gemini-2.0-flash';

  // System prompt con contexto del documento
  const systemInstruction = `Eres el Asistente IA de MICSA Doc Studio, una herramienta profesional de redacción de documentos para MICSA Industrial S.A. de C.V. (empresa de montajes e izajes industriales en México).

                        Contexto del documento actual:
                        ${chatState.docContext || 'Sin documento cargado'}

                        Tu función principal:
                        - Ayudar a redactar y mejorar documentos profesionales (cotizaciones, informes, cartas, reportes)
                        - Responder preguntas sobre el contenido del documento
                        - Sugerir mejoras de redacción, estructura y formato
                        - Ayudar con términos técnicos industriales

                        Instrucciones de formato:
                        - Responde en español profesional
                        - Usa **negritas** para términos clave
                        - Sé conciso pero completo
                        - Si generas texto para insertar en el documento, formatearlo de manera clara`;

  // Construir historial para la API
  const contents = [];

  // Historial previo
  chatState.history.forEach(msg => {
    contents.push({ role: msg.role, parts: [{ text: msg.parts }] });
  });

  // Mensaje actual
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const body = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData?.error?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '(Sin respuesta)';

  // Guardar en historial (últimas 10 interacciones)
  chatState.history.push({ role: 'user', parts: userMessage });
  chatState.history.push({ role: 'model', parts: reply });
  if (chatState.history.length > 20) chatState.history = chatState.history.slice(-20);

  return reply;
}

// ── Renderizar mensajes ──

function appendChatMessage(role, text) {
  const msgs = document.getElementById('chat-messages');

  const wrap = document.createElement('div');

  if (role === 'user') {
    wrap.className = 'chat-msg-user';
    wrap.innerHTML = `<div class="chat-bubble">${escapeHTML(text).replace(/\n/g, '<br>')}</div>`;
  } else {
    wrap.className = 'chat-msg-ai';
    wrap.style.cssText = 'display:flex;gap:10px;';
    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.style.cssText = 'width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#3b82f6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;';
    avatar.textContent = '🤖';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    // Convertir markdown básico a HTML
    bubble.innerHTML = markdownToHTML(text);
    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
  }

  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendTypingIndicator() {
  const msgs = document.getElementById('chat-messages');
  const id = 'typing-' + Date.now();
  const wrap = document.createElement('div');
  wrap.id = id;
  wrap.style.cssText = 'display:flex;gap:10px;align-items:flex-start;';
  wrap.innerHTML = `
                        <div style="width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#3b82f6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;">🤖</div>
                        <div class="chat-typing"><span></span><span></span><span></span></div>`;
  msgs.appendChild(wrap);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  document.getElementById(id)?.remove();
}

// ── Insertar última respuesta en el editor ──

function insertLastResponseInEditor() {
  if (!chatState.lastResponse) return;
  const editor = document.getElementById('editor');
  editor.focus();
  // Convertir respuesta a HTML limpio para insertar
  const html = markdownToHTML(chatState.lastResponse);
  document.execCommand('insertHTML', false, `<br>${html}<br>`);
  onEditorChange();
  notify('✅ Respuesta insertada en el documento', 'success');
  closeAIChat();
}

// ── Helpers ──

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function markdownToHTML(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^#{3}\s(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{1}\s(.+)$/gm, '<h3>$1</h3>')
    .replace(/^[-*]\s(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, s => `<ul>${s}</ul>`)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>');
}



// ==================== GMAIL / EMAIL ====================

function openEmailModal() {
  const existing = document.getElementById('email-modal');
  if (existing) { existing.style.display = 'flex'; return; }
  const title = document.getElementById('doc-title').value.trim() || 'Documento MICSA';
  const modal = document.createElement('div');
  modal.id = 'email-modal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);';
  modal.innerHTML = `
    <div style="background:#1e1e2e;border:1px solid #3f3f5a;border-radius:18px;padding:30px 34px;width:460px;max-width:96vw;font-family:Inter,sans-serif;box-shadow:0 24px 64px rgba(0,0,0,.5);">
      <h3 style="color:#e2e8f0;margin:0 0 6px;font-size:17px;">📧 Enviar documento por correo</h3>
      <p style="color:#64748b;font-size:12px;margin:0 0 20px;">Se abrirá Gmail con el documento listo para enviar</p>
      <label style="color:#94a3b8;font-size:12px;display:block;margin-bottom:4px;">Para (destinatario)</label>
      <input id="email-to" type="email" placeholder="correo@empresa.com"
        style="width:100%;padding:10px 12px;border-radius:9px;border:1px solid #3f3f5a;background:#0f0f1a;color:#e2e8f0;font-size:13px;margin-bottom:12px;box-sizing:border-box;" />
      <label style="color:#94a3b8;font-size:12px;display:block;margin-bottom:4px;">Asunto</label>
      <input id="email-subject" type="text" value="${title}"
        style="width:100%;padding:10px 12px;border-radius:9px;border:1px solid #3f3f5a;background:#0f0f1a;color:#e2e8f0;font-size:13px;margin-bottom:20px;box-sizing:border-box;" />
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button onclick="sendViaGmail()" style="flex:1;padding:10px 14px;border-radius:9px;border:none;background:#db4437;color:#fff;cursor:pointer;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;">
          <span>📬</span> Abrir Gmail
        </button>
        <button onclick="sendViaMailto()" style="flex:1;padding:10px 14px;border-radius:9px;border:none;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;cursor:pointer;font-size:13px;font-weight:600;">
          📧 Cliente de correo
        </button>
        <button onclick="closeEmailModal()" style="padding:10px 16px;border-radius:9px;border:1px solid #3f3f5a;background:transparent;color:#94a3b8;cursor:pointer;font-size:13px;">
          Cancelar
        </button>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) closeEmailModal(); });
  document.body.appendChild(modal);
}

function closeEmailModal() {
  const m = document.getElementById('email-modal');
  if (m) m.style.display = 'none';
}

/** Abre Gmail directamente en el navegador con el contenido del documento */
function sendViaGmail() {
  const to = (document.getElementById('email-to')?.value || '').trim();
  const subject = (document.getElementById('email-subject')?.value || document.getElementById('doc-title').value || 'Documento MICSA').trim();
  const editorEl = document.getElementById('editor');
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = editorEl.innerHTML;
  const bodyText = (tempDiv.textContent || tempDiv.innerText || '').trim().substring(0, 1800);
  const footer = '\n\nEnviado desde MICSA Doc Studio\nMICSA Industrial S.A. de C.V. | Tel: (866) 176-6621';
  const gmailURL = 'https://mail.google.com/mail/?view=cm&fs=1' +
    '&to=' + encodeURIComponent(to) +
    '&su=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(bodyText + footer);
  // También descarga el PDF para adjuntar
  exportPDF_Professional();
  setTimeout(() => window.open(gmailURL, '_blank'), 1200);
  closeEmailModal();
  notify('📬 Abriendo Gmail + descargando PDF para adjuntar...', 'success');
}

/** Fallback: cliente de correo por defecto (Outlook, Mail, etc.) */
function sendViaMailto() {
  const to = (document.getElementById('email-to')?.value || '').trim();
  const subject = (document.getElementById('email-subject')?.value || document.getElementById('doc-title').value || 'Documento MICSA').trim();
  const editorEl = document.getElementById('editor');
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = editorEl.innerHTML;
  const bodyText = (tempDiv.textContent || tempDiv.innerText || '').trim().substring(0, 1800);
  const footer = '\n\nEnviado desde MICSA Doc Studio\nMICSA Industrial S.A. de C.V. | Tel: (866) 176-6621';
  const mailto = 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText + footer);
  exportPDF_Professional();
  setTimeout(() => { window.location.href = mailto; }, 1200);
  closeEmailModal();
  notify('📧 Descargando PDF + abriendo correo...', 'success');
}

// Alias para compatibilidad con botones existentes
function sendDocumentByEmail() { sendViaGmail(); }

// ==================== WORD EXPORT ====================

/**
 * Exporta el documento como archivo .doc (compatible con Word).
 * Usa el truco de MIME type application/msword + HTML — Word lo abre directamente.
 */
function exportWord() {
  const title = document.getElementById('doc-title').value.trim() || 'Documento MICSA';
  const editorEl = document.getElementById('editor');
  const now = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  const htmlContent = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <meta name:ProgId content="Word.Document">
  <meta name:Generator content="Microsoft Word 12">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page { size: 21cm 29.7cm; margin: 2cm 2.5cm; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; color: #111; line-height: 1.6; }
    h1, h2, h3 { color: #1f4e78; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 9.5pt; }
    th { background: #1f4e78; color: #fff; font-weight: 700; }
    .micsa-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2.5px solid #f5a623; padding-bottom: 10px; }
  </style>
</head>
<body>
  <div class="micsa-header">
    <div>
      <div style="font-size:16pt;font-weight:900;color:#1f4e78;">MICSA Industrial</div>
      <div style="font-size:8pt;color:#64748b;">Montajes e Izajes del Centro S.A. de C.V. | RFC: MIC2301268S5</div>
      <div style="font-size:8pt;color:#64748b;">La Madrid 500, Monclova, Coahuila | Tel: (866) 176-6621</div>
    </div>
    <div style="text-align:right;font-size:8pt;color:#64748b;">
      <div style="font-size:13pt;font-weight:800;color:#1f4e78;">${title}</div>
      <div>${now}</div>
    </div>
  </div>
  ${editorEl.innerHTML}
  <div style="margin-top:20px;padding-top:8px;border-top:1px solid #ddd;font-size:8pt;color:#64748b;text-align:center;">
    MICSA Industrial S.A. de C.V. | RFC: MIC2301268S5 | Documento generado el ${now}
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = title + '.doc';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 2000);
  notify('📝 Archivo Word descargado — ábrelo con Microsoft Word', 'success');
}

// ==================== WIZARD: NUEVO DOCUMENTO ====================

const TEMPLATE_CATALOG = [
  { id: 'plan_izaje', icon: '🏗️', label: 'Plan de Izaje', desc: 'NOM-006-STPS-2014 | Checklist + Firmas + Datos técnicos', color: '#dc2626', tag: 'SEGURIDAD' },
  { id: 'cotizacion', icon: '💼', label: 'Cotización', desc: 'Cotización comercial con tabla de precios y totales', color: '#2563eb', tag: 'COMERCIAL' },
  { id: 'desviaciones', icon: '⚠️', label: 'Informe de Desviaciones', desc: 'Reporte de desviaciones operativas con análisis', color: '#d97706', tag: 'OPERACIONES' },
  { id: 'blank', icon: '📄', label: 'Documento en blanco', desc: 'Empieza desde cero con encabezado MICSA', color: '#6b7280', tag: 'GENERAL' },
];

function openNewDocWizard() {
  const existing = document.getElementById('new-doc-wizard');
  if (existing) { existing.style.display = 'flex'; return; }

  const modal = document.createElement('div');
  modal.id = 'new-doc-wizard';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.65);backdrop-filter:blur(8px);';

  const cards = TEMPLATE_CATALOG.map(t => `
    <div onclick="selectWizardTemplate('${t.id}')" id="wiz-card-${t.id}"
      style="border:2px solid #2a2a3a;border-radius:14px;padding:18px 20px;cursor:pointer;transition:all .18s;background:#15152a;position:relative;overflow:hidden;"
      onmouseover="this.style.borderColor='${t.color}';this.style.background='#1a1a2e';"
      onmouseout="this.style.borderColor='#2a2a3a';this.style.background='#15152a';">
      <div style="position:absolute;top:10px;right:12px;font-size:8.5pt;font-weight:700;color:${t.color};background:${t.color}22;padding:2px 8px;border-radius:20px;">${t.tag}</div>
      <div style="font-size:28pt;margin-bottom:8px;">${t.icon}</div>
      <div style="font-size:14px;font-weight:700;color:#e2e8f0;margin-bottom:4px;">${t.label}</div>
      <div style="font-size:11px;color:#64748b;line-height:1.4;">${t.desc}</div>
    </div>`).join('');

  modal.innerHTML = `
    <div style="background:#0f0f1e;border:1px solid #2a2a3a;border-radius:22px;padding:36px;width:580px;max-width:96vw;max-height:90vh;overflow-y:auto;font-family:Inter,sans-serif;box-shadow:0 32px 80px rgba(0,0,0,.7);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;">
        <div>
          <h2 style="color:#e2e8f0;margin:0;font-size:20px;">✨ Nuevo Documento</h2>
          <p style="color:#64748b;font-size:13px;margin:6px 0 0;">Elige una plantilla para empezar rápido</p>
        </div>
        <button onclick="closeNewDocWizard()" style="border:none;background:#2a2a3a;color:#94a3b8;border-radius:8px;padding:6px 10px;cursor:pointer;font-size:16px;">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
        ${cards}
      </div>
      <div style="border-top:1px solid #2a2a3a;padding-top:20px;">
        <p style="color:#64748b;font-size:12px;margin:0 0 12px;">¿Ya tienes el documento en Word/PDF?</p>
        <button onclick="closeNewDocWizard();triggerFileImport();" style="width:100%;padding:11px;border-radius:10px;border:1px dashed #3f3f5a;background:transparent;color:#94a3b8;cursor:pointer;font-size:13px;">
          📂 Importar archivo existente (.docx, .html, .txt, .rtf)
        </button>
      </div>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) closeNewDocWizard(); });
  document.body.appendChild(modal);
}

function closeNewDocWizard() {
  const w = document.getElementById('new-doc-wizard');
  if (w) w.style.display = 'none';
}

function selectWizardTemplate(id) {
  closeNewDocWizard();
  if (state.isDirty && !confirm('¿Crear nuevo documento? Se perderán cambios no guardados.')) return;
  loadTemplate(id);
  // Si es plan de izaje, abrir inmediatamente las variables
  if (id === 'plan_izaje') {
    setTimeout(() => {
      openVarPanel();
      notify('🏗️ Plan de Izaje listo — completa los datos del panel Variables', 'info');
    }, 300);
  }
}

/** Acceso rápido desde botón dedicado */
function quickPlanIzaje() {
  if (state.isDirty && !confirm('¿Abrir Plan de Izaje? Se perderán cambios no guardados.')) return;
  loadTemplate('plan_izaje');
  setTimeout(() => {
    openVarPanel();
    notify('🏗️ Plan de Izaje listo — completa los datos y exporta a PDF o Word', 'info');
  }, 300);
}


// ==================== iLoveAPI PDF TOOLS ====================

const ILOVE = {
  BASE: 'https://api.ilovepdf.com/v1',
  publicKey: '',
  secretKey: '',
};

(function initILove() {
  ILOVE.publicKey = localStorage.getItem('ilove_public_key') || '';
  ILOVE.secretKey = localStorage.getItem('ilove_secret_key') || '';
  setTimeout(updateILoveDot, 700);
})();

function updateILoveDot() {
  const dot = document.getElementById('ilove-dot');
  if (!dot) return;
  dot.classList.toggle('connected', !!(ILOVE.publicKey && ILOVE.secretKey));
}

function openILoveConfig() {
  const m = document.getElementById('ilove-modal');
  const o = document.getElementById('ilove-modal-overlay');
  if (!m || !o) return;
  document.getElementById('ilove-public-key').value = ILOVE.publicKey;
  document.getElementById('ilove-secret-key').value = ILOVE.secretKey;
  m.classList.remove('hidden');
  o.classList.remove('hidden');
}

function closeILoveConfig() {
  const m = document.getElementById('ilove-modal');
  const o = document.getElementById('ilove-modal-overlay');
  if (m) m.classList.add('hidden');
  if (o) o.classList.add('hidden');
}

function saveILoveCredentials() {
  const pub = document.getElementById('ilove-public-key').value.trim();
  const sec = document.getElementById('ilove-secret-key').value.trim();
  if (!pub || !sec) { notify('⚠️ Ingresa ambas claves de iLoveAPI', 'error'); return; }
  ILOVE.publicKey = pub;
  ILOVE.secretKey = sec;
  localStorage.setItem('ilove_public_key', pub);
  localStorage.setItem('ilove_secret_key', sec);
  updateILoveDot();
  notify('✅ Credenciales iLoveAPI guardadas', 'success');
  closeILoveConfig();
}

async function testILoveCredentials() {
  const pub = document.getElementById('ilove-public-key').value.trim();
  const sec = document.getElementById('ilove-secret-key').value.trim();
  if (!pub || !sec) { notify('⚠️ Ingresa ambas claves primero', 'error'); return; }
  try {
    notify('🔍 Probando conexión con iLoveAPI...', 'info');
    const token = await iLoveAuth(pub, sec);
    if (token) notify('✅ Conexión exitosa con iLoveAPI', 'success');
  } catch (err) {
    notify('❌ Error: ' + (err.message || 'Credenciales inválidas'), 'error');
  }
}

async function iLoveAuth(pub, sec) {
  pub = pub || ILOVE.publicKey;
  sec = sec || ILOVE.secretKey;
  if (!pub || !sec) throw new Error('Configura las credenciales de iLoveAPI primero');
  const resp = await fetch(`${ILOVE.BASE}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_key: pub, secret_key: sec }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Auth HTTP ${resp.status}`);
  }
  const data = await resp.json();
  return data.token;
}

async function iLoveStart(token, tool) {
  const resp = await fetch(`${ILOVE.BASE}/start/${tool}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`Start HTTP ${resp.status}`);
  return resp.json();
}

async function iLoveUpload(server, token, taskId, file, filename) {
  const form = new FormData();
  form.append('task', taskId);
  form.append('file', file, filename || file.name || 'document.pdf');
  const resp = await fetch(`https://${server}/v1/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Upload HTTP ${resp.status}`);
  }
  return resp.json();
}

async function iLoveProcess(server, token, body) {
  const resp = await fetch(`https://${server}/v1/process`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Process HTTP ${resp.status}`);
  }
  return resp.json();
}

async function iLoveDownload(server, token, taskId) {
  const resp = await fetch(`https://${server}/v1/download/${taskId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error(`Download HTTP ${resp.status}`);
  return resp.blob();
}

async function exportPDF_iLoveAPI() {
  if (!ILOVE.publicKey || !ILOVE.secretKey) {
    notify('⚠️ Configura las credenciales de iLoveAPI (⚙️ Credenciales API)', 'error');
    return;
  }
  const title = document.getElementById('doc-title').value.trim() || 'Documento MICSA';
  notify('📄 Generando PDF...', 'info');
  try {
    const logoB64 = await getLogoBase64();
    const editorEl = document.getElementById('editor');
    const container = buildPrintContainer(title, editorEl, logoB64);
    document.body.appendChild(container);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const pdfBlob = await new Promise((resolve, reject) => {
      html2pdf().set({
        margin: [0, 0, 0, 0],
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(container).output('blob').then(resolve).catch(reject);
    });
    document.body.removeChild(container);

    notify('🔑 Autenticando con iLoveAPI...', 'info');
    const token = await iLoveAuth();
    const { server, task } = await iLoveStart(token, 'compress');
    const filename = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    notify('📤 Subiendo PDF...', 'info');
    const uploaded = await iLoveUpload(server, token, task, pdfBlob, filename);
    notify('⚙️ Optimizando PDF...', 'info');
    await iLoveProcess(server, token, {
      task, tool: 'compress',
      files: [{ server_filename: uploaded.server_filename, filename }],
      compression_level: 'recommended',
    });
    notify('⬇️ Descargando...', 'info');
    const resultBlob = await iLoveDownload(server, token, task);
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    notify('✅ PDF descargado (optimizado por iLoveAPI)', 'success');
  } catch (err) {
    console.error('iLoveAPI export error:', err);
    notify('❌ Error iLoveAPI: ' + (err.message || 'Desconocido'), 'error');
  }
}

function openMergePanel() {
  const m = document.getElementById('merge-modal');
  const o = document.getElementById('merge-modal-overlay');
  if (!m || !o) return;
  document.getElementById('merge-file-list').innerHTML = '';
  window.__mergeFiles = [];
  m.classList.remove('hidden');
  o.classList.remove('hidden');
}

function closeMergePanel() {
  const m = document.getElementById('merge-modal');
  const o = document.getElementById('merge-modal-overlay');
  if (m) m.classList.add('hidden');
  if (o) o.classList.add('hidden');
}

function handleMergeDrop(event) {
  event.preventDefault();
  document.getElementById('merge-drop-zone').classList.remove('drag-over');
  const files = Array.from(event.dataTransfer.files).filter(f => f.type === 'application/pdf');
  if (!files.length) { notify('⚠️ Solo se aceptan PDFs', 'error'); return; }
  addMergeFiles(files);
}

function handleMergeFileSelect(files) { addMergeFiles(Array.from(files)); }

function addMergeFiles(files) {
  if (!window.__mergeFiles) window.__mergeFiles = [];
  window.__mergeFiles = [...window.__mergeFiles, ...files];
  renderMergeFileList();
}

function renderMergeFileList() {
  const list = document.getElementById('merge-file-list');
  if (!list) return;
  list.innerHTML = window.__mergeFiles.map((f, i) => `
                            <div class="merge-file-item">
                              <span class="merge-file-icon">📄</span>
                              <span class="merge-file-name">${f.name}</span>
                              <span class="merge-file-size">${(f.size / 1024).toFixed(0)} KB</span>
                              <button class="merge-file-remove" onclick="removeMergeFile(${i})">✕</button>
                            </div>`).join('');
}

function removeMergeFile(index) {
  window.__mergeFiles.splice(index, 1);
  renderMergeFileList();
}

async function executeMergePDF() {
  const files = window.__mergeFiles || [];
  if (files.length < 2) { notify('⚠️ Sube al menos 2 PDFs', 'error'); return; }
  if (!ILOVE.publicKey || !ILOVE.secretKey) { notify('⚠️ Configura iLoveAPI primero', 'error'); return; }
  try {
    notify('🔑 Autenticando...', 'info');
    const token = await iLoveAuth();
    const { server, task } = await iLoveStart(token, 'merge');
    notify(`📤 Subiendo ${files.length} PDFs...`, 'info');
    const uploaded = [];
    for (const file of files) {
      const up = await iLoveUpload(server, token, task, file, file.name);
      uploaded.push({ server_filename: up.server_filename, filename: file.name });
    }
    notify('🔗 Combinando PDFs...', 'info');
    await iLoveProcess(server, token, { task, tool: 'merge', files: uploaded });
    const resultBlob = await iLoveDownload(server, token, task);
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = 'documentos_combinados.pdf'; a.click();
    URL.revokeObjectURL(url);
    notify('✅ PDFs combinados correctamente', 'success');
    closeMergePanel();
  } catch (err) {
    console.error('iLoveAPI merge error:', err);
    notify('❌ Error al combinar: ' + (err.message || 'Desconocido'), 'error');
  }
}

function compressPDF_iLoveAPI() {
  if (!ILOVE.publicKey || !ILOVE.secretKey) { notify('⚠️ Configura iLoveAPI primero', 'error'); return; }
  document.getElementById('compress-file-input').value = '';
  document.getElementById('compress-file-input').click();
}

async function executeCompressPDF(file) {
  if (!file) return;
  try {
    notify('🔑 Autenticando...', 'info');
    const token = await iLoveAuth();
    const { server, task } = await iLoveStart(token, 'compress');
    notify('📤 Subiendo PDF...', 'info');
    const uploaded = await iLoveUpload(server, token, task, file, file.name);
    notify('🗜️ Comprimiendo...', 'info');
    await iLoveProcess(server, token, {
      task, tool: 'compress',
      files: [{ server_filename: uploaded.server_filename, filename: file.name }],
      compression_level: 'recommended',
    });
    const resultBlob = await iLoveDownload(server, token, task);
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url; a.download = file.name.replace('.pdf', '_comprimido.pdf'); a.click();
    URL.revokeObjectURL(url);
    const savings = Math.round((1 - resultBlob.size / file.size) * 100);
    notify(`✅ Comprimido: ${(file.size / 1024).toFixed(0)}KB → ${(resultBlob.size / 1024).toFixed(0)}KB (${savings}% reducción)`, 'success');
  } catch (err) {
    console.error('iLoveAPI compress error:', err);
    notify('❌ Error al comprimir: ' + (err.message || 'Desconocido'), 'error');
  }
}
