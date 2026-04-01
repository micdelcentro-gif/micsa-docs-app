'use client'
import { useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { ALCANCES_DEFAULT, INCLUYE_DEFAULT, EXCLUYE_DEFAULT, COND_DEFAULT, NOTA_SUP, LETTERS, LOGO_B64, MI, NAVY, RED, GOLD, fmtDate, fmtMXN } from '@/lib/constants'

/* ─── SCHEMAS ─────────────────────────────────────────────── */
const SCHEMAS: Record<string, { title: string; sections: { label: string; fields: { key: string; label: string; type: string; placeholder?: string; rows?: number; items?: string[] }[] }[] }> = {
  cotizacion: { title: 'Cotización de Servicios', sections: [
    { label: 'Datos del Documento', fields: [
      { key: 'cot_num', label: 'N° Cotización', type: 'text', placeholder: '028' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
    ]},
    { label: 'Datos del Cliente', fields: [
      { key: 'cliente', label: 'Cliente', type: 'text', placeholder: 'FORZA STEEL' },
      { key: 'planta', label: 'Planta', type: 'text' },
      { key: 'direccion_cliente', label: 'Dirección', type: 'text' },
      { key: 'atencion', label: 'Atención', type: 'text' },
      { key: 'contacto', label: 'Contacto / Tel', type: 'text' },
      { key: 'correo_cliente', label: 'Correo', type: 'text' },
      { key: 'referencia', label: 'Referencia', type: 'text', placeholder: 'Servicio.' },
    ]},
    { label: 'Servicio', fields: [
      { key: 'actividad', label: 'Actividad (título)', type: 'textarea', rows: 2 },
      { key: 'descripcion_personal', label: 'Descripción del personal', type: 'textarea', rows: 3 },
      { key: 'alcance_especifico', label: 'Alcance específico adicional', type: 'textarea', rows: 2 },
    ]},
    { label: 'Precio', fields: [
      { key: 'monto_usd', label: 'Monto USD (sin IVA)', type: 'number' },
      { key: 'monto_mxn', label: 'Monto MXN (sin IVA)', type: 'number' },
      { key: 'descripcion_precio', label: 'Descripción en tabla de precio', type: 'text' },
    ]},
    { label: 'Formas de Pago', fields: [
      { key: 'forma_pago', label: 'Forma de pago', type: 'textarea', rows: 2, placeholder: '50% anticipo.\n50% al finalizar.' },
      { key: 'tiempo_entrega', label: 'Tiempo de entrega', type: 'text' },
      { key: 'dias_anticipacion', label: 'Días anticipación OC', type: 'text', placeholder: '7' },
      { key: 'vigencia', label: 'Vigencia', type: 'text', placeholder: '15 días' },
      { key: 'base_info', label: 'Base de información', type: 'textarea', rows: 2 },
    ]},
  ]},
  bitacora: { title: 'Bitácora de Registro de Actividades Diarias', sections: [
    { label: 'Información General', fields: [
      { key: 'proyecto', label: 'Proyecto / ET', type: 'text' },
      { key: 'supervisor', label: 'Supervisor', type: 'text' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'area', label: 'Área de Trabajo', type: 'text' },
      { key: 'hora_inicio', label: 'Hora Inicio', type: 'time' },
      { key: 'hora_fin', label: 'Hora Fin', type: 'time' },
      { key: 'num_personas', label: 'No. Personas', type: 'number' },
      { key: 'folio', label: 'Folio', type: 'text' },
    ]},
    { label: 'Permisos', fields: [
      { key: 'permiso_caliente', label: 'Trabajo en Caliente (folio)', type: 'text', placeholder: 'N/A' },
      { key: 'permiso_rojo', label: 'Trabajo Rojo (folio)', type: 'text', placeholder: 'N/A' },
      { key: 'permiso_alturas', label: 'Trabajo en Alturas (folio)', type: 'text', placeholder: 'N/A' },
    ]},
    { label: 'Actividades', fields: [
      { key: 'resumen', label: 'Resumen Ejecutivo', type: 'textarea', rows: 3 },
      { key: 'actividades_detalle', label: 'Actividades Detalladas', type: 'textarea', rows: 4 },
    ]},
    { label: 'Firmas', fields: [
      { key: 'supervisor_micsa', label: 'Supervisor Grupo MICSA', type: 'text' },
      { key: 'usuario_cliente', label: 'Nombre Usuario por Cliente', type: 'text' },
    ]},
  ]},

  /* ─── MANUAL INTEGRAL — Seguridad Patrimonial v2.0 ─── */
  manual_integral: { title: 'Manual Integral — Sistema de Gestión de Seguridad Patrimonial', sections: [
    { label: 'Control del Documento', fields: [
      { key: 'codigo_doc', label: 'Código del Documento', type: 'text', placeholder: 'SGC-MI-001' },
      { key: 'version', label: 'Versión', type: 'text', placeholder: '2.0' },
      { key: 'fecha', label: 'Fecha de Emisión', type: 'date' },
      { key: 'elaboro', label: 'Elaboró', type: 'text' },
      { key: 'reviso', label: 'Revisó', type: 'text' },
      { key: 'aprobo', label: 'Aprobó', type: 'text' },
      { key: 'paginas', label: 'Páginas', type: 'text' },
    ]},
    { label: 'I. Introducción y Alcance', fields: [
      { key: 'recursos_humanos', label: 'Recursos Humanos Capacitados', type: 'textarea', rows: 2, placeholder: 'Personal seleccionado, evaluado y capacitado con DC3.' },
      { key: 'procesos_estandarizados', label: 'Procesos Estandarizados', type: 'textarea', rows: 2, placeholder: 'Protocolos documentados, auditables y replicables.' },
      { key: 'tecnologia_control', label: 'Tecnología de Control', type: 'textarea', rows: 2, placeholder: 'CCTV, control de accesos, QR/NFC para rondas, bitácora digital.' },
      { key: 'prevencion_activa', label: 'Prevención Activa', type: 'textarea', rows: 2, placeholder: 'Análisis de riesgos, disuasión y control preventivo.' },
      { key: 'integracion_cliente', label: 'Integración con el Cliente', type: 'textarea', rows: 2, placeholder: 'Se integra con logística, producción y seguridad industrial.' },
      { key: 'proteccion_integral', label: 'Protección Integral', type: 'textarea', rows: 2, placeholder: 'Activos físicos, personal, información y continuidad operativa.' },
    ]},
    { label: 'II. Filosofía y Cultura Operativa', fields: [
      { key: 'disciplina_real', label: 'Disciplina Real', type: 'textarea', rows: 2, placeholder: 'Cumplimiento sin desviaciones. Sin supervisión constante.' },
      { key: 'criterio_campo', label: 'Criterio en Campo', type: 'textarea', rows: 2, placeholder: 'Decisiones correctas bajo presión. Inteligencia operativa.' },
      { key: 'respeto_operativo', label: 'Respeto Operativo', type: 'textarea', rows: 2, placeholder: 'Reconocimiento de jerarquías y procesos del cliente.' },
      { key: 'confiabilidad', label: 'Confiabilidad', type: 'textarea', rows: 2, placeholder: 'Selección, formación y seguimiento de cada elemento.' },
    ]},
    { label: 'III. Sistema de Gestión PDCA', fields: [
      { key: 'planear', label: 'PLANEAR — Análisis y Diseño', type: 'textarea', rows: 2, placeholder: 'Análisis de riesgos, vulnerabilidades, definición de consignas.' },
      { key: 'ejecutar', label: 'EJECUTAR — Implementación', type: 'textarea', rows: 2, placeholder: 'Implementación de protocolos, control de accesos, despliegue.' },
      { key: 'verificar', label: 'VERIFICAR — Medición', type: 'textarea', rows: 2, placeholder: 'Auditorías semanales/mensuales, revisión de KPIs.' },
      { key: 'actuar', label: 'ACTUAR — Mejora Continua', type: 'textarea', rows: 2, placeholder: 'Correcciones operativas, ajustes de protocolos.' },
    ]},
    { label: 'IV. Cadena de Mando', fields: [
      { key: 'director_ops', label: 'Director de Operaciones', type: 'textarea', rows: 2, placeholder: 'Control total del servicio. Toma de decisiones críticas.' },
      { key: 'supervisores', label: 'Supervisores', type: 'textarea', rows: 2, placeholder: 'Validan operación en sitio. Detectan riesgos.' },
      { key: 'jefe_turno', label: 'Jefe de Turno', type: 'textarea', rows: 2, placeholder: 'Líder operativo. Primera autoridad. Pase de novedades.' },
      { key: 'elementos_ops', label: 'Elementos Operativos', type: 'textarea', rows: 2, placeholder: 'Ejecutan consignas. Controlan accesos. Primera línea.' },
      { key: 'operador_cctv', label: 'Operador CCTV', type: 'textarea', rows: 2, placeholder: 'Monitoreo de cámaras, detección de anomalías.' },
    ]},
    { label: 'V. Procedimientos Críticos', fields: [
      { key: 'control_accesos', label: 'Control de Accesos', type: 'textarea', rows: 2, placeholder: 'Validación de identidad, registro obligatorio.' },
      { key: 'ingreso_proveedores', label: 'Ingreso de Proveedores', type: 'textarea', rows: 2, placeholder: 'Validación INE, confirmación área interna, revisión EPP.' },
      { key: 'salida_materiales', label: 'Salida de Materiales', type: 'textarea', rows: 2, placeholder: 'Validación documental, inspección física, registro.' },
      { key: 'enemigo_interno', label: 'Enemigo Interno', type: 'textarea', rows: 2, placeholder: 'Evaluación de personal, control de accesos internos.' },
      { key: 'protocolo_rondas', label: 'Protocolo de Rondas', type: 'textarea', rows: 2, placeholder: 'Checkpoints QR/NFC. Cada 60 min diurno, 45 min nocturno.' },
      { key: 'operacion_cctv', label: 'Operación CCTV', type: 'textarea', rows: 2, placeholder: 'Monitoreo activo, detección de eventos, respaldo 30 días.' },
    ]},
    { label: 'VI. Gestión de Incidentes', fields: [
      { key: 'nivel_1', label: 'Nivel 1 — Incidente Leve', type: 'textarea', rows: 2, placeholder: 'Novedad operativa menor. Registro en bitácora.' },
      { key: 'nivel_2', label: 'Nivel 2 — Incidente Moderado', type: 'textarea', rows: 2, placeholder: 'Daño a propiedad, acceso no autorizado. Evidencia fotográfica.' },
      { key: 'nivel_3', label: 'Nivel 3 — Incidente Crítico', type: 'textarea', rows: 2, placeholder: 'Robo, agresión, intrusión. Protocolo 4A completo.' },
    ]},
    { label: 'VII. Sistema de Control y KPIs', fields: [
      { key: 'kpi_cobertura', label: 'Cobertura', type: 'text', placeholder: '100% de puestos cubiertos' },
      { key: 'kpi_rondines', label: 'Rondines Completados', type: 'text', placeholder: 'Meta: >95%' },
      { key: 'kpi_respuesta', label: 'Tiempo de Respuesta', type: 'text', placeholder: 'Meta: <3 minutos' },
      { key: 'kpi_accesos', label: 'Accesos Incorrectos', type: 'text', placeholder: 'Meta: 0' },
      { key: 'auditoria_semanal', label: 'Auditoría Semanal', type: 'textarea', rows: 2, placeholder: 'Validación: consignas, formatos, presencia, uniforme.' },
      { key: 'auditoria_mensual', label: 'Auditoría Mensual', type: 'textarea', rows: 2, placeholder: 'Reporte ejecutivo: KPIs, tendencias, recomendaciones.' },
    ]},
    { label: 'VIII. Sistema Disciplinario', fields: [
      { key: 'falta_leve', label: 'Falta Leve — Advertencia', type: 'textarea', rows: 2, placeholder: 'Retardo, uniforme incompleto, omisión menor.' },
      { key: 'falta_moderada', label: 'Falta Moderada — Suspensión', type: 'textarea', rows: 2, placeholder: 'Reincidencia, celular en servicio, ronda incompleta.' },
      { key: 'falta_grave', label: 'Falta Grave — Baja Inmediata', type: 'textarea', rows: 2, placeholder: 'Abandono, sustancias, agresión, robo, negligencia.' },
    ]},
    { label: 'IX. Marco Legal y Blindaje', fields: [
      { key: 'cuip', label: 'CUIP Obligatorio', type: 'textarea', rows: 2, placeholder: 'Cédula Única de Identificación de Personal.' },
      { key: 'dc3', label: 'DC3 - Capacitación', type: 'textarea', rows: 2, placeholder: 'Constancias registradas ante STPS.' },
      { key: 'examenes_medicos', label: 'Exámenes Médicos', type: 'textarea', rows: 2, placeholder: 'General, antidoping, agudeza visual. Renovación anual.' },
      { key: 'repse', label: 'REPSE Vigente', type: 'textarea', rows: 2, placeholder: 'Registro como Prestadora de Servicios Especializados.' },
    ]},
    { label: 'Observaciones Adicionales', fields: [
      { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 4 },
    ]},
  ]},

  /* ─── MANUAL OPERATIVO INTEGRAL ─── */
  manual_operativo: { title: 'Manual Operativo — Sistema Integral de Gestión de Seguridad Patrimonial', sections: [
    { label: 'Control del Documento', fields: [
      { key: 'codigo_doc', label: 'Código del Documento', type: 'text', placeholder: 'SGC-MO-001' },
      { key: 'version', label: 'Versión', type: 'text', placeholder: '1.0' },
      { key: 'fecha', label: 'Fecha de Emisión', type: 'date' },
      { key: 'elaboro', label: 'Elaboró', type: 'text' },
      { key: 'reviso', label: 'Revisó', type: 'text' },
      { key: 'aprobo', label: 'Aprobó', type: 'text' },
    ]},
    { label: 'Cultura Organizacional', fields: [
      { key: 'proposito', label: 'Propósito', type: 'textarea', rows: 2, placeholder: 'Proteger activos, instalaciones y personal mediante control operativo.' },
      { key: 'mision', label: 'Misión', type: 'textarea', rows: 2, placeholder: 'Brindar seguridad patrimonial bajo estándares industriales.' },
      { key: 'vision', label: 'Visión', type: 'textarea', rows: 2, placeholder: 'Empresa de gestión integral de seguridad para corporativos.' },
    ]},
    { label: 'Marco Legal y Normativo', fields: [
      { key: 'ley_federal', label: 'Ley Federal de Seguridad Privada', type: 'textarea', rows: 2, placeholder: 'Regulación federal para control y legalidad.' },
      { key: 'reglamento_sspc', label: 'Reglamento de la SSPC', type: 'textarea', rows: 2, placeholder: 'Cumplimiento con lineamientos de la SSPC.' },
      { key: 'normatividad_repse', label: 'Normatividad REPSE', type: 'textarea', rows: 2, placeholder: 'Registro ante IMSS y SAT para subcontratación legal.' },
      { key: 'expedientes', label: 'Expedientes Completos', type: 'textarea', rows: 2, placeholder: 'INE, CURP, antecedentes, médico, DC3.' },
      { key: 'control_version', label: 'Control de Versión Documental', type: 'textarea', rows: 2, placeholder: 'Versión, fecha, responsable, firma de validación.' },
    ]},
    { label: 'Estructura Organizacional', fields: [
      { key: 'director_ops', label: 'Director de Operaciones', type: 'textarea', rows: 2, placeholder: 'Responsable de la estrategia operativa.' },
      { key: 'coordinador_zona', label: 'Coordinador de Zona', type: 'textarea', rows: 2, placeholder: 'Supervisión de múltiples sitios.' },
      { key: 'supervisor_sitio', label: 'Supervisor de Sitio', type: 'textarea', rows: 2, placeholder: 'Control directo de la operación en planta.' },
      { key: 'jefe_turno', label: 'Jefe de Turno', type: 'textarea', rows: 2, placeholder: 'Líder operativo durante su turno.' },
      { key: 'elemento_operativo', label: 'Elemento Operativo', type: 'textarea', rows: 2, placeholder: 'Ejecuta protocolos de seguridad.' },
      { key: 'operador_cctv', label: 'Operador CCTV', type: 'textarea', rows: 2, placeholder: 'Monitoreo de cámaras y detección de anomalías.' },
    ]},
    { label: 'Procedimientos Operativos', fields: [
      { key: 'inicio_turno', label: '5.1 Inicio de Turno', type: 'textarea', rows: 2, placeholder: 'Revisión de equipo, pase de novedades, verificación bitácora.' },
      { key: 'cambio_turno', label: '5.2 Cambio de Turno', type: 'textarea', rows: 2, placeholder: 'Entrega formal de novedades, equipo y llaves.' },
      { key: 'reporte_novedades', label: '5.3 Reporte de Novedades', type: 'textarea', rows: 2, placeholder: 'Comunicación inmediata al supervisor.' },
      { key: 'uso_radio', label: '5.4 Uso de Radio', type: 'textarea', rows: 2, placeholder: 'Canal asignado, códigos de comunicación.' },
      { key: 'registro_bitacora', label: '5.5 Registro en Bitácora', type: 'textarea', rows: 2, placeholder: 'Anotación cronológica: hora, evento, responsable, firma.' },
      { key: 'entrega_turno', label: '5.6 Entrega de Turno', type: 'textarea', rows: 2, placeholder: 'Verificación de áreas, conteo de llaves, firma.' },
    ]},
    { label: 'Control de Accesos', fields: [
      { key: 'personal_interno', label: 'Personal Interno', type: 'textarea', rows: 2, placeholder: 'Verificación de gafete, registro biométrico.' },
      { key: 'visitantes', label: 'Visitantes', type: 'textarea', rows: 2, placeholder: 'Identificación oficial, registro en bitácora, gafete temporal.' },
      { key: 'proveedores', label: 'Proveedores', type: 'textarea', rows: 2, placeholder: 'Orden de compra, inspección de vehículo.' },
      { key: 'vehiculos', label: 'Vehículos', type: 'textarea', rows: 2, placeholder: 'Revisión de cajuela/carga, número de placas.' },
      { key: 'material_salida', label: 'Material de Salida', type: 'textarea', rows: 2, placeholder: 'Pase de salida autorizado, verificación física.' },
    ]},
    { label: 'Operación CCTV', fields: [
      { key: 'monitoreo_activo', label: 'Monitoreo Activo', type: 'textarea', rows: 2, placeholder: 'Revisión continua: accesos, perímetro, almacenes.' },
      { key: 'deteccion_eventos', label: 'Detección de Eventos', type: 'textarea', rows: 2, placeholder: 'Movimientos sospechosos, accesos no autorizados.' },
      { key: 'respaldo_video', label: 'Respaldo de Video', type: 'textarea', rows: 2, placeholder: 'Retención mínima 30 días. Servidor local y nube.' },
      { key: 'mantenimiento_cctv', label: 'Mantenimiento', type: 'textarea', rows: 2, placeholder: 'Limpieza mensual de lentes. Verificación de ángulos.' },
    ]},
    { label: 'Protocolo de Rondas', fields: [
      { key: 'frecuencia_rondas', label: 'Frecuencia', type: 'text', placeholder: 'Diurno: cada 60 min / Nocturno: cada 45 min' },
      { key: 'ruta_asignada', label: 'Ruta Asignada', type: 'textarea', rows: 2, placeholder: 'Recorrido predefinido con checkpoints QR/NFC.' },
      { key: 'registro_automatico', label: 'Registro Automático', type: 'textarea', rows: 2, placeholder: 'Hora y ubicación GPS al escanear cada punto.' },
      { key: 'prohibiciones_ronda', label: 'Prohibiciones', type: 'textarea', rows: 2, placeholder: 'No celular, no audífonos, no alterar ruta.' },
    ]},
    { label: 'Observaciones', fields: [
      { key: 'observaciones', label: 'Observaciones Generales', type: 'textarea', rows: 4 },
    ]},
  ]},

  /* ─── PROPUESTA COMERCIAL ─── */
  propuesta_comercial: { title: 'Propuesta Comercial — MICSA Safety Division', sections: [
    { label: 'Datos del Documento', fields: [
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'version', label: 'Versión', type: 'text', placeholder: '1.0' },
      { key: 'confidencial', label: 'Clasificación', type: 'text', placeholder: 'DOCUMENTO CONFIDENCIAL' },
    ]},
    { label: 'Datos del Cliente', fields: [
      { key: 'cliente', label: 'Cliente / Empresa', type: 'text', placeholder: 'Nombre de la empresa' },
      { key: 'planta', label: 'Planta / Ubicación', type: 'text' },
      { key: 'atencion', label: 'Atención', type: 'text' },
      { key: 'contacto', label: 'Contacto / Tel', type: 'text' },
      { key: 'correo_cliente', label: 'Correo', type: 'text' },
    ]},
    { label: 'Presentación Corporativa', fields: [
      { key: 'quienes_somos', label: 'Quiénes Somos', type: 'textarea', rows: 3, placeholder: 'MICSA Safety Division — empresa de gestión integral de seguridad patrimonial...' },
      { key: 'propuesta_valor', label: 'Propuesta de Valor', type: 'textarea', rows: 3, placeholder: 'No vendemos guardias. Implementamos: control operativo, gestión de riesgos, protección patrimonial.' },
    ]},
    { label: 'Servicios Ofertados', fields: [
      { key: 'seguridad_fisica', label: 'Seguridad Física', type: 'textarea', rows: 2, placeholder: 'Elementos operativos capacitados, supervisión 24/7.' },
      { key: 'control_accesos', label: 'Control de Accesos', type: 'textarea', rows: 2, placeholder: 'Personal, visitantes, proveedores, vehículos, materiales.' },
      { key: 'monitoreo_cctv', label: 'Monitoreo CCTV', type: 'textarea', rows: 2, placeholder: 'Operadores dedicados, respaldo de video, detección proactiva.' },
      { key: 'rondas', label: 'Sistema de Rondas', type: 'textarea', rows: 2, placeholder: 'QR/NFC, GPS automático, frecuencia programada.' },
      { key: 'gestion_incidentes', label: 'Gestión de Incidentes', type: 'textarea', rows: 2, placeholder: 'Protocolo 4A, clasificación por niveles, escalamiento.' },
      { key: 'reporteo', label: 'Sistema de Reporteo', type: 'textarea', rows: 2, placeholder: 'Diario, semanal, mensual. KPIs medibles.' },
    ]},
    { label: 'Diferenciadores', fields: [
      { key: 'cumplimiento_legal', label: 'Cumplimiento Legal', type: 'textarea', rows: 2, placeholder: 'REPSE vigente, CUIP, DC3, Ley Federal de Seguridad Privada.' },
      { key: 'nivel_gestion', label: 'Nivel de Gestión', type: 'textarea', rows: 2, placeholder: 'Nivel 4: Gestión Integral. Procesos definidos, KPIs activos, mejora continua.' },
      { key: 'tecnologia', label: 'Tecnología', type: 'textarea', rows: 2, placeholder: 'Bitácora digital, rondas QR/NFC, reportes automatizados.' },
    ]},
    { label: 'Inversión', fields: [
      { key: 'descripcion_servicio', label: 'Descripción del Servicio', type: 'textarea', rows: 3 },
      { key: 'monto_mensual', label: 'Inversión Mensual (sin IVA)', type: 'text' },
      { key: 'num_elementos', label: 'Número de Elementos', type: 'text' },
      { key: 'esquema_turnos', label: 'Esquema de Turnos', type: 'text', placeholder: '24x7, 12x12, etc.' },
      { key: 'forma_pago', label: 'Forma de Pago', type: 'textarea', rows: 2 },
      { key: 'vigencia', label: 'Vigencia de la Propuesta', type: 'text', placeholder: '15 días' },
    ]},
    { label: 'Observaciones', fields: [
      { key: 'observaciones', label: 'Notas Adicionales', type: 'textarea', rows: 3 },
    ]},
  ]},

  /* ─── CÓDIGO DE ÉTICA Y REGLAMENTO ─── */
  codigo_etica: { title: 'Código de Ética y Reglamento Interno — MICSA', sections: [
    { label: 'Control del Documento', fields: [
      { key: 'codigo_doc', label: 'Código del Documento', type: 'text', placeholder: 'SGC-CE-001' },
      { key: 'version', label: 'Versión', type: 'text', placeholder: '1.0' },
      { key: 'fecha', label: 'Fecha de Emisión', type: 'date' },
      { key: 'elaboro', label: 'Elaboró', type: 'text' },
      { key: 'aprobo', label: 'Aprobó', type: 'text' },
    ]},
    { label: 'Principios Éticos', fields: [
      { key: 'integridad', label: 'Integridad', type: 'textarea', rows: 2, placeholder: 'Actuar con honestidad en cada acción dentro y fuera de la operación.' },
      { key: 'confidencialidad', label: 'Confidencialidad', type: 'textarea', rows: 2, placeholder: 'Protección absoluta de la información del cliente y de la empresa.' },
      { key: 'respeto', label: 'Respeto', type: 'textarea', rows: 2, placeholder: 'Trato digno a compañeros, superiores, clientes y proveedores.' },
      { key: 'responsabilidad', label: 'Responsabilidad', type: 'textarea', rows: 2, placeholder: 'Cumplir con las funciones asignadas sin excusas ni evasiones.' },
      { key: 'lealtad', label: 'Lealtad', type: 'textarea', rows: 2, placeholder: 'Compromiso con la empresa, el cliente y el equipo.' },
      { key: 'profesionalismo', label: 'Profesionalismo', type: 'textarea', rows: 2, placeholder: 'Imagen, puntualidad, disciplina y ejecución impecable.' },
    ]},
    { label: 'Reglamento Interior de Trabajo', fields: [
      { key: 'horarios', label: 'Horarios y Puntualidad', type: 'textarea', rows: 2, placeholder: 'Presentarse 15 minutos antes. Tolerancia cero en tardanzas.' },
      { key: 'uniforme', label: 'Uniforme y Presentación', type: 'textarea', rows: 2, placeholder: 'Uniforme completo, limpio, con gafete visible en todo momento.' },
      { key: 'uso_celular', label: 'Uso de Celular', type: 'textarea', rows: 2, placeholder: 'Prohibido durante el servicio. Solo en caso de emergencia.' },
      { key: 'sustancias', label: 'Sustancias Prohibidas', type: 'textarea', rows: 2, placeholder: 'Tolerancia cero: alcohol, drogas, sustancias que alteren juicio.' },
      { key: 'relaciones_cliente', label: 'Relaciones con el Cliente', type: 'textarea', rows: 2, placeholder: 'Profesionales en todo momento. Sin familiaridad excesiva.' },
      { key: 'redes_sociales', label: 'Redes Sociales', type: 'textarea', rows: 2, placeholder: 'Prohibido publicar información o imágenes del sitio de trabajo.' },
    ]},
    { label: 'Sistema Disciplinario', fields: [
      { key: 'falta_leve', label: 'Falta Leve — Advertencia Verbal', type: 'textarea', rows: 2, placeholder: 'Retardo menor, uniforme incompleto, omisión menor.' },
      { key: 'falta_moderada', label: 'Falta Moderada — Suspensión', type: 'textarea', rows: 2, placeholder: 'Reincidencia, uso de celular, incumplimiento de ronda.' },
      { key: 'falta_grave', label: 'Falta Grave — Baja Inmediata', type: 'textarea', rows: 2, placeholder: 'Abandono de puesto, consumo de sustancias, robo, agresión.' },
    ]},
    { label: 'Compromisos del Elemento', fields: [
      { key: 'compromiso', label: 'Declaración de Compromiso', type: 'textarea', rows: 3, placeholder: 'El firmante se compromete a cumplir con el presente código de ética y reglamento...' },
      { key: 'nombre_elemento', label: 'Nombre del Elemento', type: 'text' },
      { key: 'firma_fecha', label: 'Fecha de Firma', type: 'date' },
    ]},
  ]},

  /* ─── MANUAL DE RECLUTAMIENTO ─── */
  manual_reclutamiento: { title: 'Manual de Reclutamiento y Selección — MICSA', sections: [
    { label: 'Control del Documento', fields: [
      { key: 'codigo_doc', label: 'Código del Documento', type: 'text', placeholder: 'SGC-RH-001' },
      { key: 'version', label: 'Versión', type: 'text', placeholder: '1.0' },
      { key: 'fecha', label: 'Fecha de Emisión', type: 'date' },
      { key: 'elaboro', label: 'Elaboró', type: 'text' },
      { key: 'aprobo', label: 'Aprobó', type: 'text' },
    ]},
    { label: 'Perfil del Elemento Operativo', fields: [
      { key: 'edad', label: 'Rango de Edad', type: 'text', placeholder: '22 a 45 años' },
      { key: 'escolaridad', label: 'Escolaridad Mínima', type: 'text', placeholder: 'Secundaria terminada' },
      { key: 'experiencia', label: 'Experiencia', type: 'textarea', rows: 2, placeholder: 'Preferente en seguridad patrimonial, fuerzas armadas o industria.' },
      { key: 'aptitudes', label: 'Aptitudes Requeridas', type: 'textarea', rows: 2, placeholder: 'Disciplina, criterio bajo presión, buena condición física.' },
      { key: 'documentacion', label: 'Documentación Obligatoria', type: 'textarea', rows: 3, placeholder: 'INE, CURP, acta de nacimiento, comprobante de domicilio, antecedentes no penales, cartilla militar (si aplica), carta de recomendación.' },
    ]},
    { label: 'Proceso de Reclutamiento', fields: [
      { key: 'fuentes', label: 'Fuentes de Reclutamiento', type: 'textarea', rows: 2, placeholder: 'Referidos internos, bolsas de empleo, redes sociales, ferias.' },
      { key: 'filtro_inicial', label: 'Filtro Inicial', type: 'textarea', rows: 2, placeholder: 'Revisión de documentación, validación de identidad, historial.' },
      { key: 'entrevista', label: 'Entrevista Presencial', type: 'textarea', rows: 2, placeholder: 'Evaluación de actitud, presentación, comunicación, criterio.' },
      { key: 'investigacion', label: 'Investigación de Antecedentes', type: 'textarea', rows: 2, placeholder: 'Verificación de referencias laborales, antecedentes penales, domicilio.' },
    ]},
    { label: 'Evaluaciones', fields: [
      { key: 'examen_medico', label: 'Examen Médico', type: 'textarea', rows: 2, placeholder: 'General, antidoping, agudeza visual, prueba de esfuerzo.' },
      { key: 'examen_psicometrico', label: 'Examen Psicométrico', type: 'textarea', rows: 2, placeholder: 'Evaluación de personalidad, inteligencia y comportamiento.' },
      { key: 'prueba_campo', label: 'Prueba de Campo', type: 'textarea', rows: 2, placeholder: 'Evaluación práctica de condición física y criterio operativo.' },
    ]},
    { label: 'Capacitación Inicial', fields: [
      { key: 'induccion', label: 'Inducción Corporativa', type: 'textarea', rows: 2, placeholder: 'Cultura organizacional, código de ética, reglamento interno.' },
      { key: 'capacitacion_operativa', label: 'Capacitación Operativa', type: 'textarea', rows: 2, placeholder: 'Protocolos de acceso, rondas, bitácora, uso de radio.' },
      { key: 'capacitacion_cliente', label: 'Capacitación Específica del Sitio', type: 'textarea', rows: 2, placeholder: 'Consignas del cliente, mapa de planta, zonas críticas.' },
      { key: 'dc3', label: 'Constancia DC3', type: 'textarea', rows: 2, placeholder: 'Registro ante STPS al completar la capacitación.' },
    ]},
    { label: 'Alta del Elemento', fields: [
      { key: 'alta_imss', label: 'Alta ante IMSS', type: 'textarea', rows: 2, placeholder: 'Registro antes del primer día de trabajo.' },
      { key: 'contrato', label: 'Contrato Individual', type: 'textarea', rows: 2, placeholder: 'Contrato por tiempo determinado, con posibilidad de renovación.' },
      { key: 'expediente_completo', label: 'Expediente Digital Completo', type: 'textarea', rows: 2, placeholder: 'Todos los documentos escaneados y almacenados en sistema.' },
      { key: 'asignacion_sitio', label: 'Asignación de Sitio', type: 'text', placeholder: 'Planta / Cliente asignado' },
    ]},
    { label: 'Observaciones', fields: [
      { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 3 },
    ]},
  ]},
}

// Default schema for other doc types
function defaultSchema(tipo: string, title: string) {
  return {
    title,
    sections: [{
      label: 'Información General',
      fields: [
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'cliente', label: 'Cliente', type: 'text' },
        { key: 'proyecto', label: 'Proyecto / Referencia', type: 'text' },
        { key: 'supervisor', label: 'Supervisor', type: 'text' },
        { key: 'descripcion', label: 'Descripción', type: 'textarea', rows: 4 },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 3 },
      ],
    }],
  }
}

const TIPO_TITLES: Record<string, string> = {
  cotizacion: 'Cotización Formal',
  bitacora: 'Bitácora Diaria',
  costos_adicionales: 'Costos Adicionales',
  checklist_izaje: 'Checklist de Izaje',
  orden_trabajo: 'Orden de Trabajo',
  contrato: 'Contrato de Servicios',
  requisicion: 'Requisición de Material',
  entrega_epp: 'Entrega de EPP',
  plan_izaje: 'Plan de Izaje',
  reporte_avance: 'Reporte de Avance',
  manual_integral: 'Manual Integral — Seguridad Patrimonial',
  manual_operativo: 'Manual Operativo Integral',
  propuesta_comercial: 'Propuesta Comercial',
  codigo_etica: 'Código de Ética y Reglamento',
  manual_reclutamiento: 'Manual de Reclutamiento',
}

/* ─── PHOTO UPLOADER ─────────────────────────────────────── */
function PhotoUploader({ documentoId, fotos, onFotosChange }: {
  documentoId?: string
  fotos: { url: string; path: string; name: string }[]
  onFotosChange: (f: { url: string; path: string; name: string }[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    if (!files.length) return
    setUploading(true)
    const newFotos = [...fotos]
    for (const file of Array.from(files)) {
      const path = `${documentoId || 'temp'}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('fotos-documentos').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('fotos-documentos').getPublicUrl(path)
        newFotos.push({ url: data.publicUrl, path, name: file.name })
      }
    }
    onFotosChange(newFotos)
    setUploading(false)
  }

  async function removePhoto(idx: number) {
    const foto = fotos[idx]
    await supabase.storage.from('fotos-documentos').remove([foto.path])
    onFotosChange(fotos.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
      >
        {uploading ? (
          <p className="text-slate-500 text-sm">Subiendo…</p>
        ) : (
          <>
            <div className="text-3xl mb-2">📷</div>
            <p className="text-sm text-slate-500">Toca para agregar fotos</p>
            <p className="text-xs text-slate-400 mt-1">Cámara o galería</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />
      {fotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {fotos.map((f, i) => (
            <div key={i} className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt="" className="w-full h-full object-cover rounded-lg" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function NuevoTipoPage() {
  const params = useParams()
  const tipo = (params as { tipo: string }).tipo
  const router = useRouter()
  const supabase = createClient()

  const [data, setData] = useState<Record<string, string>>({})
  const [fotos, setFotos] = useState<{ url: string; path: string; name: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const title = TIPO_TITLES[tipo] || tipo
  const schema = SCHEMAS[tipo] || defaultSchema(tipo, title)

  function set(key: string, val: string) {
    setData(prev => ({ ...prev, [key]: val }))
  }

  const [folio, setFolio] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    // Generar folio automático solo en el primer guardado
    let docFolio = folio
    if (!savedId && !docFolio) {
      const { data: folioData } = await supabase.rpc('get_next_folio', { p_tipo: tipo })
      docFolio = folioData as string
      setFolio(docFolio)
    }

    const docData = {
      tipo,
      folio: docFolio,
      cliente_nombre: data.cliente || data.proyecto || null,
      datos: { ...data, fotos: fotos.map(f => f.url) },
      estado: 'borrador',
      created_by: user?.id,
    }
    if (savedId) {
      const { folio: _f, ...updateData } = docData
      await supabase.from('documentos').update(updateData).eq('id', savedId)
    } else {
      const { data: doc } = await supabase.from('documentos').insert(docData).select().single()
      if (doc) setSavedId(doc.id)
    }
    setSaving(false)
  }

  function handlePrint() {
    if (!printRef.current) return
    const html = printRef.current.innerHTML
    const w = window.open('', '_blank', 'width=900,height=700')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;900&display=swap" rel="stylesheet">
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'IBM Plex Sans',sans-serif;background:white}
        @media print{@page{margin:0;size:A4}}
      </style>
    </head><body>${html}</body></html>`)
    w.document.close()
    setTimeout(() => { w.focus(); w.print() }, 800)
  }

  return (
    <div className="max-w-lg mx-auto pb-4">
      {/* Header */}
      <div className="sticky top-14 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 z-10 no-print">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 text-xl">←</button>
        <h2 className="text-base font-bold text-slate-800 flex-1 truncate">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs border border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            {showPreview ? 'Editar' : 'Vista previa'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs bg-blue-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      {savedId && (
        <div className="mx-4 mt-3 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm flex items-center justify-between no-print">
          <span>✓ Guardado — <strong>{folio}</strong></span>
          <button onClick={handlePrint} className="text-green-800 font-semibold underline text-xs">Imprimir PDF</button>
        </div>
      )}

      {showPreview ? (
        /* PREVIEW */
        <div className="p-4">
          <button
            onClick={handlePrint}
            className="w-full mb-4 bg-slate-800 text-white py-3 rounded-xl font-semibold text-sm no-print"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
          <div ref={printRef}>
            <DocumentPreview tipo={tipo} data={data} fotos={fotos} folio={folio} />
          </div>
        </div>
      ) : (
        /* FORM */
        <div className="p-4 space-y-6">
          {schema.sections.map((section, si) => (
            <div key={si} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700">{section.label}</h3>
              </div>
              <div className="p-4 space-y-3">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={data[field.key] || ''}
                        onChange={e => set(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={data[field.key] || ''}
                        onChange={e => set(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Photos section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">📷 Evidencia Fotográfica</h3>
            </div>
            <div className="p-4">
              <PhotoUploader
                documentoId={savedId || undefined}
                fotos={fotos}
                onFotosChange={setFotos}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {saving ? 'Guardando…' : '💾 Guardar Documento'}
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── DOCUMENT PREVIEW ──────────────────────────────────── */
function DocumentPreview({ tipo, data, fotos, folio }: {
  tipo: string
  data: Record<string, string>
  fotos: { url: string }[]
  folio?: string | null
}) {
  const tdL: React.CSSProperties = { padding: '5px 8px', fontWeight: 700, color: '#444', whiteSpace: 'nowrap', width: '100px', fontSize: '10px' }
  const tdV: React.CSSProperties = { padding: '5px 8px', color: '#111', fontSize: '10px', borderLeft: '1px solid #e5e7eb' }

  const Header = () => (
    <div style={{ borderBottom: `2px solid ${NAVY}`, paddingBottom: 10, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_B64} alt="Grupo MICSA" style={{ height: 64, width: 'auto', objectFit: 'contain' }} />
      <div style={{ textAlign: 'right', fontSize: 9, lineHeight: 1.8, color: '#444' }}>
        {data.fecha && <div style={{ fontWeight: 700, fontSize: 10, color: NAVY }}>Monclova Coahuila a {fmtDate(data.fecha)}</div>}
        <div>RFC: {MI.rfc}</div>
        {data.cot_num && <div style={{ fontWeight: 800, color: RED, fontSize: 10 }}>COTIZACIÓN. {data.cot_num}</div>}
      </div>
    </div>
  )

  const BHeader = ({ title }: { title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${NAVY}`, paddingBottom: 10, marginBottom: 12 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_B64} alt="Grupo MICSA" style={{ height: 60, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
      <div style={{ textAlign: 'center', flex: 1, padding: '0 12px' }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Barlow Condensed',sans-serif" }}>{title}</div>
          {folio && <div style={{ fontSize: 10, color: RED, fontWeight: 700, marginTop: 2 }}>{folio}</div>}
      </div>
      <div style={{ textAlign: 'right', fontSize: 8, color: '#666', lineHeight: 1.6, flexShrink: 0 }}>
        <div>REPSE: {MI.repse}</div>
        <div>{MI.tel1} | {MI.tel2}</div>
        <div>{MI.email}</div>
      </div>
    </div>
  )

  const Footer = ({ email }: { email?: string }) => (
    <div style={{ background: NAVY, color: 'white', padding: '6px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 8, marginTop: 'auto', flexWrap: 'wrap', gap: 4 }}>
      <span>{MI.dir}</span>
      <span>Cel- {MI.tel1} | Cel- {MI.tel2}</span>
      <span>{email || MI.email} | {MI.web} | {MI.emailJ}</span>
    </div>
  )

  const Watermark = () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={LOGO_B64} alt="" aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '55%', opacity: 0.05, pointerEvents: 'none', zIndex: 0, userSelect: 'none' }} />
  )

  if (tipo === 'cotizacion') {
    const alcances = ALCANCES_DEFAULT
    const incluye = INCLUYE_DEFAULT
    const excluye = EXCLUYE_DEFAULT
    const monto = data.monto_usd
      ? `$${parseFloat(data.monto_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD MAS IVA`
      : data.monto_mxn ? fmtMXN(parseFloat(data.monto_mxn)) + ' MAS IVA' : '—'

    return (
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 11, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
        <Watermark />
        <div style={{ padding: '16px 20px', flex: 1 }}>
          <Header />
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14, fontSize: 11 }}>
            <tbody>
              <tr><td style={tdL}>Cliente:</td><td style={tdV}>{data.cliente || '___'}</td><td style={tdL}>Referencia: {data.referencia || 'Servicio.'}</td></tr>
              <tr><td style={tdL}>Dirección</td><td style={tdV}>{data.direccion_cliente || '___'}</td><td style={tdV}>Planta: {data.planta || '___'}</td></tr>
              <tr><td style={tdL}>Atención.</td><td style={tdV}>{data.atencion || '___'}</td><td style={tdV} rowSpan={3}><em>{data.actividad || '___'}</em></td></tr>
              <tr><td style={tdL}>Contacto</td><td style={tdV}>{data.contacto || ''}</td></tr>
              <tr><td style={tdL}>Correo.</td><td style={tdV}>{data.correo_cliente || ''}</td></tr>
            </tbody>
          </table>

          <p style={{ margin: '0 0 12px', lineHeight: 1.8, textAlign: 'justify' }}>
            Estimado cliente:<br /><br />
            {`En respuesta a su amable solicitud, le presentamos nuestro presupuesto por los servicios de ${data.actividad || '[actividad]'} en planta ${data.planta || '[planta]'} ${data.direccion_cliente || ''}.`}
          </p>

          {data.descripcion_personal && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, marginBottom: 4 }}>DESCRIPCIÓN.</div>
              <p style={{ margin: 0, lineHeight: 1.7, textAlign: 'justify' }}>{data.descripcion_personal}</p>
            </div>
          )}

          <div style={{ fontWeight: 800, textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.06em' }}>I. ALCANCES GENERALES</div>
          <div style={{ marginBottom: 14 }}>
            {alcances.map((a: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, lineHeight: 1.6, textAlign: 'justify' }}>
                <span style={{ fontWeight: 700, flexShrink: 0 }}>{LETTERS[i]}.</span><span>{a}</span>
              </div>
            ))}
            {data.alcance_especifico && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 5, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 700, flexShrink: 0 }}>{LETTERS[alcances.length]}.</span>
                <span>{data.alcance_especifico}</span>
              </div>
            )}
          </div>

          <div style={{ fontWeight: 800, textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.06em' }}>SIENDO NUESTRO PRECIO EL SIGUIENTE</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
            <thead>
              <tr style={{ background: NAVY, color: 'white' }}>
                <th style={{ padding: '7px 12px', textAlign: 'left', fontSize: 11 }}>DESCRIPCIÓN</th>
                <th style={{ padding: '7px 12px', textAlign: 'center', fontSize: 11, width: 130 }}>LÍNEA-ESTACIÓN</th>
                <th style={{ padding: '7px 12px', textAlign: 'right', fontSize: 11, width: 190 }}>COSTO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px', fontStyle: 'italic', fontWeight: 600 }}>{data.descripcion_precio || data.actividad || '___'}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px', textAlign: 'center' }}>PLANTA.</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px', textAlign: 'right', fontWeight: 800 }}>{monto}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ fontWeight: 800, marginBottom: 5 }}>LA PRESENTE COTIZACIÓN INCLUYE:</div>
          <div style={{ marginBottom: 12, paddingLeft: 8 }}>{incluye.map((it: string, i: number) => <div key={i} style={{ lineHeight: 1.8 }}>{it}</div>)}</div>

          <div style={{ fontWeight: 800, marginBottom: 5 }}>EXCLUSIÓN:</div>
          <div style={{ marginBottom: 14, paddingLeft: 8 }}>{excluye.map((ex: string, i: number) => <div key={i} style={{ lineHeight: 1.8 }}>{i + 1}.- {ex}</div>)}</div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>NOTA.</div>
            {NOTA_SUP.split('\n\n').map((p: string, i: number) => (
              <p key={i} style={{ margin: '0 0 8px', lineHeight: 1.7, textAlign: 'justify', fontSize: 10, fontWeight: p.startsWith('MICSA EXPRESAMENTE') ? 700 : 400 }}>{p}</p>
            ))}
          </div>

          <div style={{ marginBottom: 14, fontSize: 10, lineHeight: 1.7 }}>
            {COND_DEFAULT.map((c: string, i: number) => (
              <div key={i} style={{ marginBottom: 4, display: 'flex', gap: 6 }}>
                <span style={{ flexShrink: 0, fontWeight: 700 }}>{i + 1}.-</span><span>{c}</span>
              </div>
            ))}
          </div>

          <div style={{ fontWeight: 800, marginBottom: 8 }}>FORMAS DE PAGO:</div>
          <div style={{ marginBottom: 16, fontSize: 11, lineHeight: 1.8 }}>
            <div><strong>1.</strong> La presente cotización está basada en la información proporcionada por <strong>{data.cliente || 'el cliente'}</strong>, {data.base_info || 'obtenida en el recorrido realizado con su supervisión'}.</div>
            <div style={{ marginTop: 6 }}><strong>2.</strong> Forma de pago: {data.forma_pago || '50% anticipo. 50% al finalizar.'}</div>
            <div><strong>3.</strong> Tiempo de entrega: {data.tiempo_entrega || 'A convenir.'}</div>
            <div><strong>4.</strong> Se solicitan {data.dias_anticipacion || '7'} días de anticipación a partir de la OC.</div>
            <div><strong>5.</strong> Vigencia: {data.vigencia || '15 días'}.</div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <div>Atentamente.</div><br />
            <div style={{ fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>TU SOCIO ESTRATÉGICO EN INSTALACIÓN DE MAQUINARIA</div>
          </div>
        </div>
        <Footer email={MI.emailCot} />
      </div>
    )
  }

  // Generic preview for other doc types
  const docTitle = TIPO_TITLES[tipo] || tipo
  return (
    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 11, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
      <Watermark />
      <div style={{ padding: '16px 20px', flex: 1 }}>
        <BHeader title={docTitle} />
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 14 }}>
          <tbody>
            {Object.entries(data).map(([k, v]) => v ? (
              <tr key={k}>
                <td style={tdL}>{k.replace(/_/g, ' ')}:</td>
                <td style={tdV}>{v}</td>
              </tr>
            ) : null)}
          </tbody>
        </table>
        {fotos.length > 0 && (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', fontSize: 11 }}>Evidencia Fotográfica</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {fotos.map((f, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={f.url} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 4 }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
