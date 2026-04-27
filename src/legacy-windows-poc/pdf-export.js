/**
 * pdf-export.js v4.0 — MICSA Doc Studio
 * Estrategia: window.print() DIRECTO con overlay DOM visible
 * ✅ Sin iframe, sin html2canvas, sin jsPDF, sin CORS
 * ✅ Funciona en Chrome, Edge, Firefox en HTTPS
 * ✅ Hoja membretada MICSA real en el PDF
 */
'use strict';

(function () {

    var LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="140" height="44" viewBox="0 0 140 44"><rect width="140" height="44" rx="5" fill="#1e3a5f"/><text x="10" y="28" font-family="Arial" font-size="20" font-weight="800" fill="#f5a623" letter-spacing="2">MICSA</text><text x="10" y="40" font-family="Arial" font-size="7" fill="#93c5fd">INDUSTRIAL S.A. DE C.V.</text></svg>';
    var LOGO_URL = 'data:image/svg+xml;base64,' + btoa(LOGO_SVG);

    function fmtDate() {
        try { return new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }); }
        catch (e) { return new Date().toISOString().slice(0, 10); }
    }

    function getNextFolio() {
        try {
            var n = parseInt(localStorage.getItem('micsa_folio_n') || '0', 10) + 1;
            localStorage.setItem('micsa_folio_n', String(n));
            return 'COT-' + new Date().getFullYear() + '-' + String(n).padStart(4, '0');
        } catch (e) { return 'DOC-' + Date.now(); }
    }

    function safeNotify(msg, type) {
        if (typeof notify === 'function') { try { notify(msg, type); } catch (e) { } }
        else { console.log('[PDF]', msg); }
    }

    /* ─── Inyecta estilos de impresión en <head> (solo una vez) ─── */
    function injectPrintStyles() {
        if (document.getElementById('micsa-print-css')) return;
        var s = document.createElement('style');
        s.id = 'micsa-print-css';
        s.textContent = [
            '@media print {',
            '  body > * { display: none !important; }',
            '  #micsa-print-overlay { display: block !important; }',
            '  #micsa-print-overlay {',
            '    position: static !important;',
            '    background: white !important;',
            '    width: 100% !important;',
            '    padding: 0 !important;',
            '    margin: 0 !important;',
            '    box-shadow: none !important;',
            '    font-family: Arial, Helvetica, sans-serif !important;',
            '    font-size: 10.5pt !important;',
            '    color: #111 !important;',
            '    line-height: 1.6 !important;',
            '  }',
            '  .micsa-ph { display:flex; justify-content:space-between; align-items:center;',
            '    border-bottom: 2.5px solid #f5a623; padding-bottom: 10px; margin-bottom: 16px; }',
            '  .micsa-ph img { height: 40px; }',
            '  .micsa-ph-info { text-align: right; font-size: 7.5pt; color: #555; line-height: 1.5; }',
            '  .micsa-ph-title { font-size: 12pt; font-weight: 800; color: #1f4e78; display:block; }',
            '  .micsa-pmeta { display:flex; justify-content:space-between; background:#f0f4f8;',
            '    border-radius:4px; padding:6px 12px; font-size:8.5pt; color:#374151; margin-bottom:14px; }',
            '  .micsa-pmeta strong { color: #1f4e78; }',
            '  .micsa-pcontent { color: #111; }',
            '  .micsa-pcontent table { width:100%; border-collapse:collapse; margin-bottom:12px; }',
            '  .micsa-pcontent th { background:#1e3a5f; color:#fff; padding:6px 10px; font-size:9pt; }',
            '  .micsa-pcontent td { border:1px solid #d1d5db; padding:5px 9px; font-size:9pt; }',
            '  .micsa-pfoot { border-top:1px solid #d1d5db; margin-top:20px; padding-top:7px;',
            '    display:flex; justify-content:space-between; font-size:7pt; color:#9ca3af; }',
            '  @page { size: Letter; margin: 10mm 12mm; }',
            '  table { page-break-inside: auto; }',
            '  tr { page-break-inside: avoid; page-break-after: auto; }',
            '  thead { display: table-header-group; }',
            '}',
        ].join('\n');
        document.head.appendChild(s);
    }

    /* ─── Crea el overlay de impresión en el <body> ─── */
    function buildPrintOverlay(title, folio, content) {
        var date = fmtDate();

        // Eliminar overlay previo si existe
        var prev = document.getElementById('micsa-print-overlay');
        if (prev) prev.parentNode.removeChild(prev);

        var div = document.createElement('div');
        div.id = 'micsa-print-overlay';
        div.style.cssText = 'display:none;'; // solo visible al imprimir

        div.innerHTML =
            // Header
            '<div class="micsa-ph">' +
            '<img src="' + LOGO_URL + '" alt="MICSA"/>' +
            '<div class="micsa-ph-info">' +
            '<span class="micsa-ph-title">' + escHtml(title) + '</span>' +
            'MICSA Industrial S.A. de C.V.<br>' +
            'La Madrid 500, Monclova, Coahuila &nbsp;|&nbsp; RFC: MIC2301268S5<br>' +
            'Tel: (866) 176-6621 &nbsp;|&nbsp; contacto@micsa.com.mx' +
            '</div></div>' +
            // Folio + fecha
            '<div class="micsa-pmeta">' +
            '<span><strong>Folio:</strong> ' + escHtml(folio) + '</span>' +
            '<span><strong>Fecha:</strong> ' + date + '</span>' +
            '</div>' +
            // Contenido
            '<div class="micsa-pcontent">' + content + '</div>' +
            // Footer
            '<div class="micsa-pfoot">' +
            '<span>MICSA Industrial S.A. de C.V. &nbsp;|&nbsp; RFC: MIC2301268S5</span>' +
            '<span>' + date + '</span>' +
            '</div>';

        document.body.appendChild(div);
        return div;
    }

    function escHtml(s) {
        return String(s || '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* ─── Función pública ─── */
    window.exportPDF_Professional = function () {
        var titleEl = document.getElementById('doc-title');
        var editorEl = document.getElementById('editor');

        if (!editorEl) { safeNotify('❌ Editor no encontrado', 'error'); return; }

        var title = ((titleEl && titleEl.value) || '').trim() || 'Documento MICSA';
        var content = editorEl.innerHTML || '<p>Sin contenido</p>';
        var folio = getNextFolio();

        safeNotify('📄 Abriendo impresión — selecciona "Guardar como PDF"', 'info');

        injectPrintStyles();
        buildPrintOverlay(title, folio, content);

        // Pequeño delay para que el DOM se actualice
        setTimeout(function () {
            // Optimizar paginación antes de imprimir
            if (typeof preparePrintOverlay === 'function') {
                preparePrintOverlay();
            }
            window.print();
            // Limpiar overlay después de imprimir
            setTimeout(function () {
                var overlay = document.getElementById('micsa-print-overlay');
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 5000);
        }, 300);
    };

    // Alias compatibilidad
    window.exportPDF_iLoveAPI = window.exportPDF_Professional;

    console.log('[MICSA] pdf-export.js v4.0 ✓');

})();
