/**
 * pdf-paginator.js — Lógica inteligente de paginación para evitar páginas vacías
 * ✅ Detecta espacios en blanco y colapsa páginas
 * ✅ Evita cortes feos de elementos importantes
 * ✅ Funciona con CSS @media print para window.print()
 */
'use strict';

(function () {

    /**
     * Analiza el DOM antes de imprimir para optimizar paginación
     * Retira divs de page-break vacíos y ajusta espacios
     * @param {Element} docElement - Elemento raíz del documento PDF
     */
    window.optimizePaginationBeforePrint = function (docElement) {
        if (!docElement) return;

        // 1. Detectar secciones vacías y removerlas
        const emptySections = docElement.querySelectorAll('[class*="pdf-section"]');
        emptySections.forEach(section => {
            const text = section.textContent?.trim();
            if (!text || text.length < 5) {
                section.remove();
            }
        });

        // 2. Detectar saltos de página innecesarios
        const pageBreaks = docElement.querySelectorAll('.pdf-page-break');
        pageBreaks.forEach((pb, idx) => {
            const prev = pb.previousElementSibling;
            const next = pb.nextElementSibling;

            // Si la anterior está casi vacía, remover el salto
            if (prev && isAlmostEmpty(prev)) {
                pb.remove();
            }
            // Si la siguiente está casi vacía, remover el salto
            if (next && isAlmostEmpty(next)) {
                pb.remove();
            }
        });

        // 3. Ajustar alturas mínimas dinámicamente
        const contentDiv = docElement.querySelector('.pdf-content');
        if (contentDiv) {
            adjustMinHeightForContent(contentDiv);
        }
    };

    /**
     * Detecta si un elemento tiene contenido muy escaso
     * @param {Element} el - Elemento a verificar
     * @returns {boolean} true si está casi vacío
     */
    function isAlmostEmpty(el) {
        if (!el) return true;
        const text = el.textContent?.trim() || '';
        const hasImages = el.querySelectorAll('img').length > 0;
        const hasTables = el.querySelectorAll('table').length > 0;

        return text.length < 10 && !hasImages && !hasTables;
    }

    /**
     * Ajusta dinámicamente la altura mínima del contenido
     * para evitar páginas con espacios grandes en blanco
     * @param {Element} contentEl - Elemento .pdf-content
     */
    function adjustMinHeightForContent(contentEl) {
        const children = Array.from(contentEl.children);
        if (!children.length) return;

        // Calcular altura total del contenido
        let totalHeight = 0;
        children.forEach(child => {
            totalHeight += child.offsetHeight || 0;
        });

        // Altura aproximada de una página A4 (en píxeles a 96dpi)
        const pageHeightPx = 1122; // ~297mm a 96dpi

        // Si el contenido ocupa menos del 80% de una página,
        // no forzar múltiples páginas
        if (totalHeight < pageHeightPx * 0.8) {
            contentEl.style.minHeight = 'auto';
        } else if (totalHeight < pageHeightPx * 1.5) {
            // Si ocupa entre 80-150%, distribuir en 2 páginas equilibradas
            const balancedHeight = (totalHeight / 2) + 50;
            contentEl.style.minHeight = balancedHeight + 'px';
        }
    }

    /**
     * Evita que tablas se corten a mitad
     * Aplica page-break-inside: avoid a elementos clave
     * @param {Element} docElement - Elemento raíz
     */
    window.protectTableBreaks = function (docElement) {
        if (!docElement) return;

        // Tables no deben cortarse
        docElement.querySelectorAll('table').forEach(table => {
            table.style.pageBreakInside = 'avoid';
        });

        // Bloques de firma, no deben cortarse
        docElement.querySelectorAll('[class*="signature"]').forEach(sig => {
            sig.style.pageBreakInside = 'avoid';
        });

        // Secciones etiquetadas como "keep-together"
        docElement.querySelectorAll('.pdf-keep-together').forEach(kt => {
            kt.style.pageBreakInside = 'avoid';
        });

        // Headers no deben cortarse
        docElement.querySelectorAll('.pdf-header').forEach(header => {
            header.style.pageBreakInside = 'avoid';
            header.style.pageBreakAfter = 'avoid';
        });

        // Footers no deben cortarse
        docElement.querySelectorAll('.pdf-footer').forEach(footer => {
            footer.style.pageBreakInside = 'avoid';
            footer.style.pageBreakBefore = 'avoid';
        });
    };

    /**
     * Calcular si el contenido cabe en número mínimo de páginas
     * @param {Element} docElement - Elemento raíz
     * @returns {number} Número estimado de páginas
     */
    window.estimatePageCount = function (docElement) {
        if (!docElement) return 1;

        const contentHeight = docElement.offsetHeight || 0;
        const pageHeightPx = 1122; // ~297mm a 96dpi menos márgenes
        const estimated = Math.ceil(contentHeight / pageHeightPx);

        return Math.max(1, estimated);
    };

    /**
     * Aplica todas las optimizaciones de paginación antes de imprimir
     * @param {Element} docElement - Elemento raíz del documento
     */
    window.optimizeForPrint = function (docElement) {
        if (!docElement) return;

        protectTableBreaks(docElement);
        optimizePaginationBeforePrint(docElement);
    };

    /**
     * Hook para integrar con exportPDF_Professional
     * Llama a esto justo ANTES de window.print()
     */
    window.preparePrintOverlay = function () {
        const overlay = document.getElementById('micsa-print-overlay');
        if (overlay) {
            optimizeForPrint(overlay);
            // Log para debugging
            const pageCount = estimatePageCount(overlay);
            console.log('[MICSA Paginator] Estimated pages:', pageCount);
        }
    };

    console.log('[MICSA] pdf-paginator.js ✓');

})();
