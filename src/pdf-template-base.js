/**
 * pdf-template-base.js — Estructura uniforme para todos los PDFs
 * ✅ Template reutilizable con header, contenido, footer consistentes
 * ✅ Mantiene estilos navy/oro de Grupo MICSA
 * ✅ Compatible con window.print() + CSS @media print
 */
'use strict';

(function () {

    /**
     * Crea estructura HTML uniforme para documentos PDF
     * @param {Object} config - Configuración del documento
     * @param {Object} config.header - Datos del header
     * @param {string} config.header.docType - Tipo de documento (ej: "Cotización")
     * @param {string} config.header.date - Fecha del documento
     * @param {string} config.header.folio - Folio/número de documento
     * @param {string} config.content - HTML del contenido principal
     * @param {string} config.footer - Texto del pie de página
     * @returns {string} HTML del documento PDF
     */
    window.createPdfTemplate = function (config) {
        config = config || {};
        const docType = config.header?.docType || 'Documento';
        const date = config.header?.date || '';
        const folio = config.header?.folio || '';
        const content = config.content || '';
        const footer = config.footer || 'MICSA Industrial S.A. de C.V.';

        return `
<div class="pdf-document">
  <!-- HEADER UNIFORME -->
  <div class="pdf-header">
    <div class="pdf-header-top">
      <h1 class="pdf-header-title">MICSA Industrial</h1>
      <div class="pdf-header-meta">
        <p class="pdf-meta-item"><span class="pdf-meta-label">Tipo:</span> ${escapeHtml(docType)}</p>
        <p class="pdf-meta-item"><span class="pdf-meta-label">Fecha:</span> ${escapeHtml(date)}</p>
        ${folio ? `<p class="pdf-meta-item"><span class="pdf-meta-label">Folio:</span> ${escapeHtml(folio)}</p>` : ''}
      </div>
    </div>
    <div class="pdf-header-divider"></div>
  </div>

  <!-- CONTENIDO PRINCIPAL -->
  <div class="pdf-content">
    ${content}
  </div>

  <!-- FOOTER UNIFORME -->
  <div class="pdf-footer">
    <div class="pdf-footer-divider"></div>
    <p class="pdf-footer-text">${escapeHtml(footer)}</p>
    <p class="pdf-footer-company">MICSA Industrial S.A. de C.V. | contacto@micsa.com.mx | (866) 176-6621</p>
  </div>
</div>
        `;
    };

    /**
     * Crear sección de contenido con clase para control de paginación
     * @param {string} sectionType - Tipo de sección (ej: 'table', 'text', 'block-group')
     * @param {string} html - Contenido HTML de la sección
     * @returns {string} HTML envuelto en div con clase de sección
     */
    window.createPdfSection = function (sectionType, html) {
        const validTypes = ['table', 'text', 'block-group', 'form', 'signature'];
        const type = validTypes.includes(sectionType) ? sectionType : 'block-group';
        return `<div class="pdf-section pdf-section-${type}">${html}</div>`;
    };

    /**
     * Envuelve contenido para evitar orfandad (última línea sola)
     * @param {string} html - Contenido
     * @returns {string} HTML envuelto
     */
    window.keepTogether = function (html) {
        return `<div class="pdf-keep-together">${html}</div>`;
    };

    /**
     * Fuerza un salto de página limpio
     * @returns {string} HTML para forzar salto
     */
    window.pageBreak = function () {
        return '<div class="pdf-page-break"></div>';
    };

    /**
     * Crea una tabla con estilos uniforme MICSA
     * @param {Object} config - Configuración de tabla
     * @param {string[]} config.headers - Encabezados de columnas
     * @param {Array<Array>} config.rows - Filas de datos
     * @param {string[]} config.align - Alineación por columna ['left', 'center', 'right']
     * @returns {string} HTML de tabla
     */
    window.createMicsaTable = function (config) {
        config = config || {};
        const headers = config.headers || [];
        const rows = config.rows || [];
        const align = config.align || [];

        if (!headers.length) return '';

        let html = '<table class="pdf-table">\n<thead>\n<tr>\n';
        headers.forEach((h, i) => {
            const alignment = align[i] || 'left';
            html += `  <th style="text-align: ${alignment};">${escapeHtml(h)}</th>\n`;
        });
        html += '</tr>\n</thead>\n<tbody>\n';

        rows.forEach((row, ri) => {
            html += '<tr>\n';
            row.forEach((cell, ci) => {
                const alignment = align[ci] || 'left';
                html += `  <td style="text-align: ${alignment};">${escapeHtml(String(cell))}</td>\n`;
            });
            html += '</tr>\n';
        });

        html += '</tbody>\n</table>';
        return html;
    };

    // ─── UTILIDADES ───
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text || '').replace(/[&<>"']/g, c => map[c]);
    }

    console.log('[MICSA] pdf-template-base.js ✓');

})();
