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
  contrato: { title: 'Contrato de Prestación de Servicios', sections: [
    { label: 'Datos del Contrato', fields: [
      { key: 'num_contrato', label: 'N° de Contrato', type: 'text', placeholder: 'MICSA-CONT-001' },
      { key: 'fecha', label: 'Fecha del Contrato', type: 'date' },
      { key: 'lugar', label: 'Lugar de Celebración', type: 'text', placeholder: 'Monclova, Coahuila' },
      { key: 'vigencia_inicio', label: 'Vigencia Desde', type: 'date' },
      { key: 'vigencia_fin', label: 'Vigencia Hasta', type: 'date' },
    ]},
    { label: 'Datos del Cliente (Contratante)', fields: [
      { key: 'cliente', label: 'Razón Social del Cliente', type: 'text', placeholder: 'CARRIER TRANSICOLD' },
      { key: 'rfc_cliente', label: 'RFC del Cliente', type: 'text' },
      { key: 'representante_cliente', label: 'Representante Legal', type: 'text' },
      { key: 'domicilio_cliente', label: 'Domicilio Fiscal', type: 'text' },
      { key: 'contacto_cliente', label: 'Contacto / Teléfono', type: 'text' },
      { key: 'correo_cliente', label: 'Correo Electrónico', type: 'text' },
    ]},
    { label: 'Objeto del Contrato', fields: [
      { key: 'descripcion_servicio', label: 'Descripción del Servicio', type: 'textarea', rows: 4, placeholder: 'Montaje e instalación de maquinaria industrial...' },
      { key: 'ubicacion_obra', label: 'Ubicación de la Obra', type: 'text' },
      { key: 'alcance_trabajo', label: 'Alcance del Trabajo', type: 'textarea', rows: 3 },
    ]},
    { label: 'Condiciones Económicas', fields: [
      { key: 'monto_total', label: 'Monto Total (sin IVA)', type: 'number' },
      { key: 'moneda', label: 'Moneda', type: 'text', placeholder: 'MXN' },
      { key: 'forma_pago', label: 'Forma de Pago', type: 'textarea', rows: 2, placeholder: '50% anticipo, 50% al finalizar' },
      { key: 'penalizaciones', label: 'Penalizaciones por Retraso', type: 'textarea', rows: 2 },
      { key: 'comision_epp', label: 'Comisión EPP (%)', type: 'text', placeholder: '20' },
    ]},
    { label: 'Cláusulas Adicionales', fields: [
      { key: 'clausula_confidencialidad', label: 'Cláusula de Confidencialidad', type: 'textarea', rows: 2 },
      { key: 'clausula_seguridad', label: 'Cláusula de Seguridad Industrial', type: 'textarea', rows: 2 },
      { key: 'clausula_cancelacion', label: 'Cláusula de Cancelación', type: 'textarea', rows: 2 },
      { key: 'jurisdiccion', label: 'Jurisdicción Aplicable', type: 'text', placeholder: 'Monclova, Coahuila' },
    ]},
    { label: 'Firmas', fields: [
      { key: 'firma_contratante', label: 'Nombre del Contratante', type: 'text' },
      { key: 'firma_contratista', label: 'Nombre del Contratista (MICSA)', type: 'text' },
      { key: 'testigo_1', label: 'Testigo 1', type: 'text' },
      { key: 'testigo_2', label: 'Testigo 2', type: 'text' },
    ]},
  ]},
  orden_trabajo: { title: 'Orden de Trabajo', sections: [
    { label: 'Datos de la Orden', fields: [
      { key: 'num_orden', label: 'N° de Orden', type: 'text', placeholder: 'OT-001' },
      { key: 'fecha', label: 'Fecha de Emisión', type: 'date' },
      { key: 'fecha_inicio', label: 'Fecha de Inicio', type: 'date' },
      { key: 'fecha_fin', label: 'Fecha Estimada de Fin', type: 'date' },
      { key: 'prioridad', label: 'Prioridad', type: 'text', placeholder: 'Alta / Media / Baja' },
    ]},
    { label: 'Cliente y Proyecto', fields: [
      { key: 'cliente', label: 'Cliente', type: 'text' },
      { key: 'proyecto', label: 'Proyecto / Referencia', type: 'text' },
      { key: 'ubicacion', label: 'Ubicación / Planta', type: 'text' },
      { key: 'solicitado_por', label: 'Solicitado por', type: 'text' },
      { key: 'contacto', label: 'Contacto / Teléfono', type: 'text' },
    ]},
    { label: 'Descripción del Trabajo', fields: [
      { key: 'tipo_trabajo', label: 'Tipo de Trabajo', type: 'text', placeholder: 'Montaje / Soldadura / Izaje / Mantenimiento' },
      { key: 'descripcion', label: 'Descripción Detallada', type: 'textarea', rows: 4 },
      { key: 'materiales_requeridos', label: 'Materiales Requeridos', type: 'textarea', rows: 3 },
      { key: 'equipo_requerido', label: 'Equipo / Herramienta Requerida', type: 'textarea', rows: 2 },
    ]},
    { label: 'Personal Asignado', fields: [
      { key: 'supervisor', label: 'Supervisor Asignado', type: 'text' },
      { key: 'personal_asignado', label: 'Personal (nombres y puestos)', type: 'textarea', rows: 3 },
      { key: 'num_trabajadores', label: 'Número de Trabajadores', type: 'number' },
    ]},
    { label: 'Observaciones y Firmas', fields: [
      { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 3 },
      { key: 'aprobado_por', label: 'Aprobado por', type: 'text' },
      { key: 'recibido_por', label: 'Recibido por (cliente)', type: 'text' },
    ]},
  ]},
  requisicion: { title: 'Requisición de Material', sections: [
    { label: 'Datos de la Requisición', fields: [
      { key: 'num_requisicion', label: 'N° de Requisición', type: 'text', placeholder: 'REQ-001' },
      { key: 'fecha', label: 'Fecha de Solicitud', type: 'date' },
      { key: 'fecha_requerida', label: 'Fecha Requerida', type: 'date' },
      { key: 'urgencia', label: 'Urgencia', type: 'text', placeholder: 'Normal / Urgente / Crítica' },
    ]},
    { label: 'Proyecto y Solicitante', fields: [
      { key: 'proyecto', label: 'Proyecto / ET', type: 'text' },
      { key: 'cliente', label: 'Cliente', type: 'text' },
      { key: 'solicitado_por', label: 'Solicitado por', type: 'text' },
      { key: 'departamento', label: 'Departamento', type: 'text', placeholder: 'Operaciones' },
      { key: 'centro_costos', label: 'Centro de Costos', type: 'text' },
    ]},
    { label: 'Materiales Solicitados', fields: [
      { key: 'material_1', label: 'Material 1 (descripción, cantidad, unidad)', type: 'text' },
      { key: 'material_2', label: 'Material 2', type: 'text' },
      { key: 'material_3', label: 'Material 3', type: 'text' },
      { key: 'material_4', label: 'Material 4', type: 'text' },
      { key: 'material_5', label: 'Material 5', type: 'text' },
      { key: 'materiales_adicionales', label: 'Materiales adicionales', type: 'textarea', rows: 3 },
    ]},
    { label: 'Justificación y Aprobación', fields: [
      { key: 'justificacion', label: 'Justificación', type: 'textarea', rows: 3 },
      { key: 'proveedor_sugerido', label: 'Proveedor Sugerido', type: 'text' },
      { key: 'presupuesto_estimado', label: 'Presupuesto Estimado', type: 'number' },
      { key: 'aprobado_por', label: 'Aprobado por', type: 'text' },
      { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 2 },
    ]},
  ]},
  entrega_epp: { title: 'Registro de Entrega de EPP', sections: [
    { label: 'Datos del Registro', fields: [
      { key: 'num_entrega', label: 'N° de Registro', type: 'text', placeholder: 'EPP-001' },
      { key: 'fecha', label: 'Fecha de Entrega', type: 'date' },
      { key: 'proyecto', label: 'Proyecto / ET', type: 'text' },
      { key: 'cliente', label: 'Cliente / Planta', type: 'text' },
    ]},
    { label: 'Datos del Trabajador', fields: [
      { key: 'nombre_trabajador', label: 'Nombre del Trabajador', type: 'text' },
      { key: 'puesto', label: 'Puesto', type: 'text' },
      { key: 'num_empleado', label: 'N° de Empleado', type: 'text' },
      { key: 'area_trabajo', label: 'Área de Trabajo', type: 'text' },
    ]},
    { label: 'Equipo Entregado', fields: [
      { key: 'casco', label: 'Casco de Seguridad', type: 'text', placeholder: 'Sí / No — Talla / Color' },
      { key: 'lentes', label: 'Lentes de Seguridad', type: 'text', placeholder: 'Sí / No — Tipo' },
      { key: 'guantes', label: 'Guantes', type: 'text', placeholder: 'Sí / No — Tipo / Talla' },
      { key: 'botas', label: 'Botas de Seguridad', type: 'text', placeholder: 'Sí / No — Talla' },
      { key: 'chaleco', label: 'Chaleco Reflejante', type: 'text', placeholder: 'Sí / No — Talla' },
      { key: 'arnes', label: 'Arnés de Seguridad', type: 'text', placeholder: 'Sí / No — N° Serie' },
      { key: 'careta_soldadura', label: 'Careta de Soldadura', type: 'text', placeholder: 'Sí / No — Tipo' },
      { key: 'tapones_auditivos', label: 'Tapones Auditivos', type: 'text', placeholder: 'Sí / No' },
      { key: 'respirador', label: 'Respirador / Mascarilla', type: 'text', placeholder: 'Sí / No — Tipo' },
      { key: 'epp_adicional', label: 'EPP Adicional', type: 'textarea', rows: 2 },
    ]},
    { label: 'Condiciones y Firmas', fields: [
      { key: 'condiciones', label: 'Condiciones de Entrega', type: 'textarea', rows: 2, placeholder: 'Equipo nuevo / Reposición / Cambio por deterioro' },
      { key: 'compromiso', label: 'Compromiso del Trabajador', type: 'textarea', rows: 2, placeholder: 'Me comprometo a usar el EPP durante toda la jornada laboral...' },
      { key: 'entregado_por', label: 'Entregado por', type: 'text' },
      { key: 'recibido_por', label: 'Firma del Trabajador', type: 'text' },
      { key: 'supervisor', label: 'Vo.Bo. Supervisor', type: 'text' },
    ]},
  ]},
  costos_adicionales: { title: 'Reporte de Costos Adicionales', sections: [
    { label: 'Datos del Reporte', fields: [
      { key: 'num_reporte', label: 'N° de Reporte', type: 'text', placeholder: 'CA-001' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'proyecto', label: 'Proyecto / ET', type: 'text' },
      { key: 'cliente', label: 'Cliente', type: 'text' },
      { key: 'orden_trabajo_ref', label: 'Orden de Trabajo Relacionada', type: 'text' },
    ]},
    { label: 'Descripción del Costo Adicional', fields: [
      { key: 'motivo', label: 'Motivo del Costo Adicional', type: 'textarea', rows: 3, placeholder: 'Trabajos no contemplados en alcance original...' },
      { key: 'descripcion_trabajos', label: 'Descripción de Trabajos Extra', type: 'textarea', rows: 4 },
      { key: 'fecha_inicio_extra', label: 'Fecha Inicio Trabajos Extra', type: 'date' },
      { key: 'fecha_fin_extra', label: 'Fecha Fin Trabajos Extra', type: 'date' },
    ]},
    { label: 'Desglose de Costos', fields: [
      { key: 'costo_mano_obra', label: 'Costo Mano de Obra', type: 'number' },
      { key: 'costo_materiales', label: 'Costo Materiales', type: 'number' },
      { key: 'costo_equipo', label: 'Costo Equipo / Herramienta', type: 'number' },
      { key: 'costo_transporte', label: 'Costo Transporte', type: 'number' },
      { key: 'costo_otros', label: 'Otros Costos', type: 'number' },
      { key: 'subtotal', label: 'Subtotal', type: 'number' },
      { key: 'iva', label: 'IVA', type: 'number' },
      { key: 'total', label: 'Total', type: 'number' },
    ]},
    { label: 'Autorización', fields: [
      { key: 'justificacion', label: 'Justificación Detallada', type: 'textarea', rows: 3 },
      { key: 'elaborado_por', label: 'Elaborado por', type: 'text' },
      { key: 'autorizado_por_micsa', label: 'Autorizado por (MICSA)', type: 'text' },
      { key: 'autorizado_por_cliente', label: 'Autorizado por (Cliente)', type: 'text' },
      { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 2 },
    ]},
  ]},
  checklist_izaje: { title: 'Checklist de Seguridad para Izaje', sections: [
    { label: 'Datos de la Operación', fields: [
      { key: 'num_checklist', label: 'N° de Checklist', type: 'text', placeholder: 'CHK-IZ-001' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'hora', label: 'Hora de Inspección', type: 'time' },
      { key: 'proyecto', label: 'Proyecto / ET', type: 'text' },
      { key: 'cliente', label: 'Cliente / Planta', type: 'text' },
      { key: 'area_trabajo', label: 'Área de Trabajo', type: 'text' },
    ]},
    { label: 'Datos del Equipo de Izaje', fields: [
      { key: 'tipo_grua', label: 'Tipo de Grúa / Equipo', type: 'text', placeholder: 'Grúa Hidráulica / Telescópica / Puente Grúa' },
      { key: 'capacidad_grua', label: 'Capacidad de la Grúa (Ton)', type: 'text' },
      { key: 'marca_modelo', label: 'Marca y Modelo', type: 'text' },
      { key: 'num_serie_grua', label: 'N° Serie del Equipo', type: 'text' },
      { key: 'operador', label: 'Nombre del Operador', type: 'text' },
      { key: 'licencia_operador', label: 'N° Licencia del Operador', type: 'text' },
    ]},
    { label: 'Inspección Pre-Operación', fields: [
      { key: 'cables_eslingas', label: 'Cables y Eslingas en buen estado', type: 'text', placeholder: 'Sí / No / N/A — Observaciones' },
      { key: 'ganchos_seguros', label: 'Ganchos con seguro', type: 'text', placeholder: 'Sí / No / N/A' },
      { key: 'estabilizadores', label: 'Estabilizadores desplegados', type: 'text', placeholder: 'Sí / No / N/A' },
      { key: 'area_despejada', label: 'Área de izaje despejada', type: 'text', placeholder: 'Sí / No' },
      { key: 'señalizacion', label: 'Señalización colocada', type: 'text', placeholder: 'Sí / No' },
      { key: 'viento', label: 'Condiciones de viento aceptables', type: 'text', placeholder: 'Sí / No — Velocidad' },
      { key: 'comunicacion', label: 'Comunicación radio/señales OK', type: 'text', placeholder: 'Sí / No' },
      { key: 'lineas_electricas', label: 'Distancia a líneas eléctricas OK', type: 'text', placeholder: 'Sí / No — Distancia' },
    ]},
    { label: 'Datos de la Carga', fields: [
      { key: 'descripcion_carga', label: 'Descripción de la Carga', type: 'text' },
      { key: 'peso_carga', label: 'Peso de la Carga (Ton)', type: 'text' },
      { key: 'dimensiones', label: 'Dimensiones de la Carga', type: 'text' },
      { key: 'centro_gravedad', label: 'Centro de Gravedad Identificado', type: 'text', placeholder: 'Sí / No' },
      { key: 'puntos_izaje', label: 'Puntos de Izaje Identificados', type: 'text', placeholder: 'Sí / No — Cantidad' },
    ]},
    { label: 'Autorización y Firmas', fields: [
      { key: 'observaciones', label: 'Observaciones Generales', type: 'textarea', rows: 3 },
      { key: 'rigger', label: 'Rigger / Maniobrista', type: 'text' },
      { key: 'supervisor_izaje', label: 'Supervisor de Izaje', type: 'text' },
      { key: 'supervisor_seguridad', label: 'Supervisor de Seguridad', type: 'text' },
      { key: 'autoriza_cliente', label: 'Autoriza (Cliente)', type: 'text' },
    ]},
  ]},
  plan_izaje: { title: 'Plan de Izaje', sections: [
    { label: 'Datos del Plan', fields: [
      { key: 'num_plan', label: 'N° de Plan de Izaje', type: 'text', placeholder: 'PI-001' },
      { key: 'fecha', label: 'Fecha de Elaboración', type: 'date' },
      { key: 'fecha_ejecucion', label: 'Fecha Programada de Ejecución', type: 'date' },
      { key: 'proyecto', label: 'Proyecto / ET', type: 'text' },
      { key: 'cliente', label: 'Cliente', type: 'text' },
      { key: 'ubicacion', label: 'Ubicación / Planta', type: 'text' },
    ]},
    { label: 'Descripción de la Maniobra', fields: [
      { key: 'descripcion_maniobra', label: 'Descripción General de la Maniobra', type: 'textarea', rows: 4 },
      { key: 'objetivo', label: 'Objetivo del Izaje', type: 'textarea', rows: 2 },
      { key: 'secuencia', label: 'Secuencia de Operaciones', type: 'textarea', rows: 4, placeholder: '1. Posicionar grúa\n2. Colocar eslingas\n3. Izar carga...' },
    ]},
    { label: 'Datos de la Carga', fields: [
      { key: 'descripcion_carga', label: 'Descripción de la Carga', type: 'text' },
      { key: 'peso_carga', label: 'Peso de la Carga (Ton)', type: 'text' },
      { key: 'dimensiones_carga', label: 'Dimensiones (L x A x H)', type: 'text' },
      { key: 'centro_gravedad', label: 'Centro de Gravedad', type: 'text' },
      { key: 'altura_izaje', label: 'Altura de Izaje (m)', type: 'text' },
      { key: 'radio_operacion', label: 'Radio de Operación (m)', type: 'text' },
    ]},
    { label: 'Equipo y Accesorios', fields: [
      { key: 'tipo_grua', label: 'Tipo de Grúa', type: 'text' },
      { key: 'capacidad_grua', label: 'Capacidad Nominal (Ton)', type: 'text' },
      { key: 'capacidad_al_radio', label: 'Capacidad al Radio de Trabajo (Ton)', type: 'text' },
      { key: 'porcentaje_carga', label: '% de Capacidad Utilizada', type: 'text' },
      { key: 'eslingas', label: 'Eslingas (tipo, capacidad, cantidad)', type: 'textarea', rows: 2 },
      { key: 'grilletes', label: 'Grilletes (capacidad, cantidad)', type: 'text' },
      { key: 'accesorios_adicionales', label: 'Accesorios Adicionales', type: 'textarea', rows: 2 },
    ]},
    { label: 'Medidas de Seguridad', fields: [
      { key: 'area_restringida', label: 'Área Restringida Definida', type: 'text', placeholder: 'Sí / No — Radio de restricción' },
      { key: 'comunicaciones', label: 'Sistema de Comunicación', type: 'text', placeholder: 'Radio / Señales manuales' },
      { key: 'condiciones_climaticas', label: 'Condiciones Climáticas Permitidas', type: 'textarea', rows: 2 },
      { key: 'epp_requerido', label: 'EPP Requerido', type: 'textarea', rows: 2, placeholder: 'Casco, guantes, botas, chaleco...' },
      { key: 'plan_emergencia', label: 'Plan de Emergencia', type: 'textarea', rows: 2 },
      { key: 'riesgos_identificados', label: 'Riesgos Identificados', type: 'textarea', rows: 3 },
    ]},
    { label: 'Personal y Aprobación', fields: [
      { key: 'operador_grua', label: 'Operador de Grúa', type: 'text' },
      { key: 'rigger', label: 'Rigger / Maniobrista', type: 'text' },
      { key: 'señalero', label: 'Señalero', type: 'text' },
      { key: 'supervisor', label: 'Supervisor del Izaje', type: 'text' },
      { key: 'elaborado_por', label: 'Elaborado por', type: 'text' },
      { key: 'aprobado_por', label: 'Aprobado por (MICSA)', type: 'text' },
      { key: 'aprobado_cliente', label: 'Aprobado por (Cliente)', type: 'text' },
    ]},
  ]},
  reporte_avance: { title: 'Reporte de Avance de Obra', sections: [
    { label: 'Datos del Reporte', fields: [
      { key: 'num_reporte', label: 'N° de Reporte', type: 'text', placeholder: 'RA-001' },
      { key: 'fecha', label: 'Fecha del Reporte', type: 'date' },
      { key: 'periodo_inicio', label: 'Período Desde', type: 'date' },
      { key: 'periodo_fin', label: 'Período Hasta', type: 'date' },
      { key: 'num_reporte_consecutivo', label: 'Reporte N° (consecutivo)', type: 'text', placeholder: '1 de 5' },
    ]},
    { label: 'Datos del Proyecto', fields: [
      { key: 'proyecto', label: 'Proyecto / ET', type: 'text' },
      { key: 'cliente', label: 'Cliente', type: 'text' },
      { key: 'ubicacion', label: 'Ubicación / Planta', type: 'text' },
      { key: 'contrato_ref', label: 'N° de Contrato', type: 'text' },
      { key: 'supervisor', label: 'Supervisor de Obra', type: 'text' },
    ]},
    { label: 'Avance General', fields: [
      { key: 'avance_programado', label: 'Avance Programado (%)', type: 'text' },
      { key: 'avance_real', label: 'Avance Real (%)', type: 'text' },
      { key: 'desviacion', label: 'Desviación (%)', type: 'text' },
      { key: 'resumen_avance', label: 'Resumen de Avance', type: 'textarea', rows: 4, placeholder: 'Descripción general del avance en el período...' },
    ]},
    { label: 'Actividades del Período', fields: [
      { key: 'actividades_completadas', label: 'Actividades Completadas', type: 'textarea', rows: 4 },
      { key: 'actividades_en_proceso', label: 'Actividades en Proceso', type: 'textarea', rows: 3 },
      { key: 'actividades_pendientes', label: 'Actividades Pendientes', type: 'textarea', rows: 3 },
      { key: 'actividades_proxima_semana', label: 'Plan Siguiente Período', type: 'textarea', rows: 3 },
    ]},
    { label: 'Recursos y Personal', fields: [
      { key: 'personal_en_obra', label: 'Personal en Obra (cantidad)', type: 'number' },
      { key: 'detalle_personal', label: 'Detalle del Personal', type: 'textarea', rows: 2 },
      { key: 'equipo_en_obra', label: 'Equipo en Obra', type: 'textarea', rows: 2 },
      { key: 'horas_trabajadas', label: 'Horas Trabajadas en Período', type: 'number' },
    ]},
    { label: 'Problemas y Observaciones', fields: [
      { key: 'problemas', label: 'Problemas / Obstáculos', type: 'textarea', rows: 3 },
      { key: 'acciones_correctivas', label: 'Acciones Correctivas', type: 'textarea', rows: 2 },
      { key: 'incidentes_seguridad', label: 'Incidentes de Seguridad', type: 'textarea', rows: 2, placeholder: 'Sin incidentes / Descripción...' },
      { key: 'observaciones', label: 'Observaciones Generales', type: 'textarea', rows: 3 },
    ]},
    { label: 'Firmas', fields: [
      { key: 'elaborado_por', label: 'Elaborado por', type: 'text' },
      { key: 'revisado_por', label: 'Revisado por (MICSA)', type: 'text' },
      { key: 'recibido_cliente', label: 'Recibido por (Cliente)', type: 'text' },
    ]},
  ]},
  manual_integral_seguridad: { title: 'Manual Integral de Seguridad Patrimonial', sections: [
    { label: 'Datos del Documento', fields: [
      { key: 'num_manual', label: 'N\u00b0 de Manual', type: 'text', placeholder: 'MIS-001' },
      { key: 'version', label: 'Versi\u00f3n', type: 'text', placeholder: '1.0' },
      { key: 'fecha', label: 'Fecha de Emisi\u00f3n', type: 'date' },
      { key: 'vigencia_inicio', label: 'Vigencia Desde', type: 'date' },
      { key: 'vigencia_fin', label: 'Vigencia Hasta', type: 'date' },
      { key: 'elaborado_por', label: 'Elaborado por', type: 'text' },
      { key: 'aprobado_por', label: 'Aprobado por', type: 'text' },
    ]},
    { label: 'Datos del Cliente y Sitio', fields: [
      { key: 'cliente', label: 'Cliente / Empresa', type: 'text', placeholder: 'FORZA STEEL' },
      { key: 'planta', label: 'Planta / Instalaci\u00f3n', type: 'text' },
      { key: 'direccion', label: 'Direcci\u00f3n del Sitio', type: 'text' },
      { key: 'contacto_cliente', label: 'Contacto Cliente', type: 'text' },
      { key: 'telefono_cliente', label: 'Tel\u00e9fono / Ext.', type: 'text' },
      { key: 'correo_cliente', label: 'Correo Electr\u00f3nico', type: 'text' },
      { key: 'contrato_ref', label: 'N\u00b0 Contrato de Referencia', type: 'text' },
    ]},
    { label: 'Personal de Seguridad Asignado', fields: [
      { key: 'supervisor_seguridad', label: 'Supervisor de Seguridad', type: 'text' },
      { key: 'num_elementos', label: 'N\u00b0 de Elementos Asignados', type: 'number' },
      { key: 'turno_diurno', label: 'Turno Diurno (horario)', type: 'text', placeholder: '06:00 - 14:00' },
      { key: 'turno_vespertino', label: 'Turno Vespertino (horario)', type: 'text', placeholder: '14:00 - 22:00' },
      { key: 'turno_nocturno', label: 'Turno Nocturno (horario)', type: 'text', placeholder: '22:00 - 06:00' },
      { key: 'puesto_fijo', label: 'Puestos Fijos (descripci\u00f3n)', type: 'textarea', rows: 2 },
      { key: 'rondines', label: 'Rondines (frecuencia y rutas)', type: 'textarea', rows: 2 },
    ]},
    { label: 'KPIs y M\u00e9tricas de Seguridad', fields: [
      { key: 'cobertura_porcentaje', label: 'Cobertura del Sitio (%)', type: 'text', placeholder: '100' },
      { key: 'tiempo_respuesta', label: 'Tiempo de Respuesta (min)', type: 'text', placeholder: '5' },
      { key: 'frecuencia_rondines', label: 'Frecuencia de Rondines (por turno)', type: 'text', placeholder: '4' },
      { key: 'incidentes_meta', label: 'Meta de Incidentes (mensual)', type: 'text', placeholder: '0' },
      { key: 'horas_capacitacion', label: 'Horas de Capacitaci\u00f3n (mensual)', type: 'text', placeholder: '8' },
    ]},
    { label: 'Secciones del Manual (activas)', fields: [
      { key: 'sec_I_objetivo', label: 'I. Objetivo y Alcance', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_II_politicas', label: 'II. Pol\u00edticas Generales de Seguridad', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_III_funciones', label: 'III. Funciones del Personal', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_IV_epp', label: 'IV. Uso de EPP', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_V_accesos', label: 'V. Control de Accesos', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_VI_rondines', label: 'VI. Rondines y Patrullaje', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_VII_incidentes', label: 'VII. Protocolo de Incidentes', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_VIII_evacuacion', label: 'VIII. Plan de Evacuaci\u00f3n', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_IX_comunicacion', label: 'IX. Comunicaci\u00f3n y Reportes', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_X_sanciones', label: 'X. Sanciones y Disciplina', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_XI_capacitacion', label: 'XI. Capacitaci\u00f3n', type: 'text', placeholder: 'S\u00ed' },
      { key: 'sec_XII_revision', label: 'XII. Revisi\u00f3n y Actualizaci\u00f3n', type: 'text', placeholder: 'S\u00ed' },
    ]},
    { label: 'Observaciones por Secci\u00f3n Clave', fields: [
      { key: 'obs_objetivo', label: 'Obs. \u2014 Objetivo y Alcance', type: 'textarea', rows: 2 },
      { key: 'obs_accesos', label: 'Obs. \u2014 Control de Accesos', type: 'textarea', rows: 2 },
      { key: 'obs_incidentes', label: 'Obs. \u2014 Protocolo de Incidentes', type: 'textarea', rows: 2 },
      { key: 'obs_comunicacion', label: 'Obs. \u2014 Comunicaci\u00f3n y Reportes', type: 'textarea', rows: 2 },
      { key: 'observaciones_generales', label: 'Observaciones Generales', type: 'textarea', rows: 3 },
    ]},
    { label: 'Contactos de Emergencia', fields: [
      { key: 'contacto_emergencia_1', label: 'Emergencia 1 (nombre, tel)', type: 'text', placeholder: 'Supervisor MICSA' },
      { key: 'contacto_emergencia_2', label: 'Emergencia 2 (nombre, tel)', type: 'text', placeholder: 'Gerente de Planta' },
      { key: 'tel_policia', label: 'Polic\u00eda / Seguridad P\u00fablica', type: 'text', placeholder: '911' },
      { key: 'tel_bomberos', label: 'Bomberos', type: 'text', placeholder: '068' },
      { key: 'tel_ambulancia', label: 'Ambulancia / Cruz Roja', type: 'text', placeholder: '065' },
    ]},
    { label: 'Firmas y Autorizaci\u00f3n', fields: [
      { key: 'firma_supervisor', label: 'Firma Supervisor MICSA', type: 'text' },
      { key: 'firma_cliente', label: 'Firma Responsable Cliente', type: 'text' },
      { key: 'firma_gerente', label: 'Firma Gerente Operativo MICSA', type: 'text' },
    ]},
  ]},


  manual_operativo: {
    title: 'Manual Operativo',
    sections: [
      { label: 'Datos Generales', fields: [
        { key: 'fecha', label: 'Fecha de emisión', type: 'date' },
        { key: 'version', label: 'Versión', type: 'text' },
        { key: 'elaboro', label: 'Elaboró', type: 'text' },
        { key: 'aprobo', label: 'Aprobó', type: 'text' },
      ]},
      { label: 'Cultura Organizacional', fields: [
        { key: 'mision', label: 'Misión', type: 'textarea', rows: 3 },
        { key: 'vision', label: 'Visión', type: 'textarea', rows: 3 },
        { key: 'valores', label: 'Valores', type: 'textarea', rows: 3 },
      ]},
      { label: 'Marco Legal', fields: [
        { key: 'marco_legal', label: 'Normativa aplicable', type: 'textarea', rows: 4 },
      ]},
      { label: 'Estructura Organizacional', fields: [
        { key: 'estructura', label: 'Descripción de la estructura', type: 'textarea', rows: 4 },
      ]},
      { label: 'Procedimientos Operativos', fields: [
        { key: 'procedimientos', label: 'Procedimientos principales', type: 'textarea', rows: 5 },
        { key: 'control_accesos', label: 'Control de accesos', type: 'textarea', rows: 3 },
        { key: 'cctv', label: 'Circuito cerrado CCTV', type: 'textarea', rows: 3 },
        { key: 'rondas', label: 'Rondas y recorridos', type: 'textarea', rows: 3 },
      ]},
      { label: 'Observaciones', fields: [
        { key: 'observaciones', label: 'Observaciones generales', type: 'textarea', rows: 3 },
      ]},
    ],
  },
  propuesta_comercial: {
    title: 'Propuesta Comercial',
    sections: [
      { label: 'Datos del Cliente', fields: [
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'cliente', label: 'Nombre del cliente / empresa', type: 'text' },
        { key: 'contacto', label: 'Contacto', type: 'text' },
        { key: 'correo', label: 'Correo electrónico', type: 'text' },
        { key: 'telefono', label: 'Teléfono', type: 'text' },
      ]},
      { label: 'Presentación', fields: [
        { key: 'presentacion', label: 'Presentación de MICSA', type: 'textarea', rows: 4 },
        { key: 'experiencia', label: 'Experiencia y trayectoria', type: 'textarea', rows: 3 },
      ]},
      { label: 'Servicios Propuestos', fields: [
        { key: 'servicios', label: 'Servicios ofrecidos', type: 'textarea', rows: 5 },
        { key: 'alcance', label: 'Alcance del servicio', type: 'textarea', rows: 3 },
      ]},
      { label: 'Diferenciadores', fields: [
        { key: 'diferenciadores', label: 'Ventajas competitivas', type: 'textarea', rows: 3 },
        { key: 'certificaciones', label: 'Certificaciones y avales', type: 'textarea', rows: 2 },
      ]},
      { label: 'Inversión', fields: [
        { key: 'inversion', label: 'Descripción de la inversión', type: 'textarea', rows: 3 },
        { key: 'vigencia', label: 'Vigencia de la propuesta', type: 'text' },
        { key: 'condiciones', label: 'Condiciones de pago', type: 'textarea', rows: 2 },
      ]},
    ],
  },
  codigo_etica: {
    title: 'Código de Ética y Reglamento',
    sections: [
      { label: 'Datos Generales', fields: [
        { key: 'fecha', label: 'Fecha de emisión', type: 'date' },
        { key: 'version', label: 'Versión', type: 'text' },
        { key: 'elaboro', label: 'Elaboró', type: 'text' },
      ]},
      { label: 'Principios Éticos', fields: [
        { key: 'principios', label: 'Principios y valores éticos', type: 'textarea', rows: 5 },
        { key: 'conducta', label: 'Código de conducta', type: 'textarea', rows: 4 },
      ]},
      { label: 'Reglamento Interior', fields: [
        { key: 'obligaciones', label: 'Obligaciones del empleado', type: 'textarea', rows: 4 },
        { key: 'prohibiciones', label: 'Conductas prohibidas', type: 'textarea', rows: 4 },
        { key: 'horarios', label: 'Horarios y asistencia', type: 'textarea', rows: 3 },
        { key: 'uniforme', label: 'Uniforme y presentación', type: 'textarea', rows: 2 },
      ]},
      { label: 'Sistema Disciplinario', fields: [
        { key: 'faltas_leves', label: 'Faltas leves', type: 'textarea', rows: 3 },
        { key: 'faltas_graves', label: 'Faltas graves', type: 'textarea', rows: 3 },
        { key: 'sanciones', label: 'Sanciones aplicables', type: 'textarea', rows: 3 },
      ]},
      { label: 'Compromiso', fields: [
        { key: 'compromiso', label: 'Declaración de compromiso', type: 'textarea', rows: 3 },
        { key: 'firma_empleado', label: 'Nombre y firma del empleado', type: 'text' },
      ]},
    ],
  },
  manual_reclutamiento: {
    title: 'Manual de Reclutamiento',
    sections: [
      { label: 'Datos Generales', fields: [
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'version', label: 'Versión', type: 'text' },
        { key: 'elaboro', label: 'Elaboró', type: 'text' },
      ]},
      { label: 'Perfil del Elemento', fields: [
        { key: 'puesto', label: 'Puesto solicitado', type: 'text' },
        { key: 'requisitos', label: 'Requisitos del perfil', type: 'textarea', rows: 4 },
        { key: 'habilidades', label: 'Habilidades requeridas', type: 'textarea', rows: 3 },
      ]},
      { label: 'Proceso de Reclutamiento', fields: [
        { key: 'fuentes', label: 'Fuentes de reclutamiento', type: 'textarea', rows: 3 },
        { key: 'proceso', label: 'Etapas del proceso', type: 'textarea', rows: 4 },
        { key: 'documentos', label: 'Documentación requerida', type: 'textarea', rows: 3 },
      ]},
      { label: 'Evaluaciones', fields: [
        { key: 'evaluaciones', label: 'Tipos de evaluación', type: 'textarea', rows: 3 },
        { key: 'criterios', label: 'Criterios de selección', type: 'textarea', rows: 3 },
      ]},
      { label: 'Capacitación e Inducción', fields: [
        { key: 'induccion', label: 'Programa de inducción', type: 'textarea', rows: 3 },
        { key: 'capacitacion', label: 'Plan de capacitación inicial', type: 'textarea', rows: 3 },
      ]},
      { label: 'Alta del Elemento', fields: [
        { key: 'alta_imss', label: 'Alta IMSS', type: 'text' },
        { key: 'alta_repse', label: 'Alta REPSE', type: 'text' },
        { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 2 },
      ]},
    ],
  },
}

// Default schema for other doc types
function defaultSchema(tipo: string, title: string) {
  return { title, sections: [{ label: 'Información General', fields: [
    { key: 'fecha', label: 'Fecha', type: 'date' },
    { key: 'cliente', label: 'Cliente', type: 'text' },
    { key: 'proyecto', label: 'Proyecto / Referencia', type: 'text' },
    { key: 'supervisor', label: 'Supervisor', type: 'text' },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', rows: 4 },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 3 },
  ], }], }
}


// ── MANUAL OPERATIVO ──────────────────────────────────────────────────────────
const SCHEMA_MANUAL_OPERATIVO = {
  title: 'Manual Operativo',
  sections: [
    { label: 'Datos Generales', fields: [
      { key: 'fecha', label: 'Fecha de emisión', type: 'date' },
      { key: 'version', label: 'Versión', type: 'text' },
      { key: 'elaboro', label: 'Elaboró', type: 'text' },
      { key: 'aprobo', label: 'Aprobó', type: 'text' },
    ]},
    { label: 'Cultura Organizacional', fields: [
      { key: 'mision', label: 'Misión', type: 'textarea', rows: 3 },
      { key: 'vision', label: 'Visión', type: 'textarea', rows: 3 },
      { key: 'valores', label: 'Valores', type: 'textarea', rows: 3 },
    ]},
    { label: 'Marco Legal', fields: [
      { key: 'marco_legal', label: 'Normativa aplicable', type: 'textarea', rows: 4 },
    ]},
    { label: 'Estructura Organizacional', fields: [
      { key: 'estructura', label: 'Descripción de la estructura', type: 'textarea', rows: 4 },
    ]},
    { label: 'Procedimientos Operativos', fields: [
      { key: 'procedimientos', label: 'Procedimientos principales', type: 'textarea', rows: 5 },
      { key: 'control_accesos', label: 'Control de accesos', type: 'textarea', rows: 3 },
      { key: 'cctv', label: 'Circuito cerrado CCTV', type: 'textarea', rows: 3 },
      { key: 'rondas', label: 'Rondas y recorridos', type: 'textarea', rows: 3 },
    ]},
    { label: 'Observaciones', fields: [
      { key: 'observaciones', label: 'Observaciones generales', type: 'textarea', rows: 3 },
    ]},
  ],
}

// ── PROPUESTA COMERCIAL ───────────────────────────────────────────────────────
const SCHEMA_PROPUESTA_COMERCIAL = {
  title: 'Propuesta Comercial',
  sections: [
    { label: 'Datos del Cliente', fields: [
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'cliente', label: 'Nombre del cliente / empresa', type: 'text' },
      { key: 'contacto', label: 'Contacto', type: 'text' },
      { key: 'correo', label: 'Correo electrónico', type: 'text' },
      { key: 'telefono', label: 'Teléfono', type: 'text' },
    ]},
    { label: 'Presentación', fields: [
      { key: 'presentacion', label: 'Presentación de MICSA', type: 'textarea', rows: 4 },
      { key: 'experiencia', label: 'Experiencia y trayectoria', type: 'textarea', rows: 3 },
    ]},
    { label: 'Servicios Propuestos', fields: [
      { key: 'servicios', label: 'Servicios ofrecidos', type: 'textarea', rows: 5 },
      { key: 'alcance', label: 'Alcance del servicio', type: 'textarea', rows: 3 },
    ]},
    { label: 'Diferenciadores', fields: [
      { key: 'diferenciadores', label: 'Ventajas competitivas', type: 'textarea', rows: 3 },
      { key: 'certificaciones', label: 'Certificaciones y avales', type: 'textarea', rows: 2 },
    ]},
    { label: 'Inversión', fields: [
      { key: 'inversion', label: 'Descripción de la inversión', type: 'textarea', rows: 3 },
      { key: 'vigencia', label: 'Vigencia de la propuesta', type: 'text' },
      { key: 'condiciones', label: 'Condiciones de pago', type: 'textarea', rows: 2 },
    ]},
  ],
}

// ── CÓDIGO DE ÉTICA ───────────────────────────────────────────────────────────
const SCHEMA_CODIGO_ETICA = {
  title: 'Código de Ética y Reglamento',
  sections: [
    { label: 'Datos Generales', fields: [
      { key: 'fecha', label: 'Fecha de emisión', type: 'date' },
      { key: 'version', label: 'Versión', type: 'text' },
      { key: 'elaboro', label: 'Elaboró', type: 'text' },
    ]},
    { label: 'Principios Éticos', fields: [
      { key: 'principios', label: 'Principios y valores éticos', type: 'textarea', rows: 5 },
      { key: 'conducta', label: 'Código de conducta', type: 'textarea', rows: 4 },
    ]},
    { label: 'Reglamento Interior', fields: [
      { key: 'obligaciones', label: 'Obligaciones del empleado', type: 'textarea', rows: 4 },
      { key: 'prohibiciones', label: 'Conductas prohibidas', type: 'textarea', rows: 4 },
      { key: 'horarios', label: 'Horarios y asistencia', type: 'textarea', rows: 3 },
      { key: 'uniforme', label: 'Uniforme y presentación', type: 'textarea', rows: 2 },
    ]},
    { label: 'Sistema Disciplinario', fields: [
      { key: 'faltas_leves', label: 'Faltas leves', type: 'textarea', rows: 3 },
      { key: 'faltas_graves', label: 'Faltas graves', type: 'textarea', rows: 3 },
      { key: 'sanciones', label: 'Sanciones aplicables', type: 'textarea', rows: 3 },
    ]},
    { label: 'Compromiso', fields: [
      { key: 'compromiso', label: 'Declaración de compromiso', type: 'textarea', rows: 3 },
      { key: 'firma_empleado', label: 'Nombre y firma del empleado', type: 'text' },
    ]},
  ],
}

// ── MANUAL RECLUTAMIENTO ──────────────────────────────────────────────────────
const SCHEMA_MANUAL_RECLUTAMIENTO = {
  title: 'Manual de Reclutamiento',
  sections: [
    { label: 'Datos Generales', fields: [
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'version', label: 'Versión', type: 'text' },
      { key: 'elaboro', label: 'Elaboró', type: 'text' },
    ]},
    { label: 'Perfil del Elemento', fields: [
      { key: 'puesto', label: 'Puesto solicitado', type: 'text' },
      { key: 'requisitos', label: 'Requisitos del perfil', type: 'textarea', rows: 4 },
      { key: 'habilidades', label: 'Habilidades requeridas', type: 'textarea', rows: 3 },
    ]},
    { label: 'Proceso de Reclutamiento', fields: [
      { key: 'fuentes', label: 'Fuentes de reclutamiento', type: 'textarea', rows: 3 },
      { key: 'proceso', label: 'Etapas del proceso', type: 'textarea', rows: 4 },
      { key: 'documentos', label: 'Documentación requerida', type: 'textarea', rows: 3 },
    ]},
    { label: 'Evaluaciones', fields: [
      { key: 'evaluaciones', label: 'Tipos de evaluación', type: 'textarea', rows: 3 },
      { key: 'criterios', label: 'Criterios de selección', type: 'textarea', rows: 3 },
    ]},
    { label: 'Capacitación e Inducción', fields: [
      { key: 'induccion', label: 'Programa de inducción', type: 'textarea', rows: 3 },
      { key: 'capacitacion', label: 'Plan de capacitación inicial', type: 'textarea', rows: 3 },
    ]},
    { label: 'Alta del Elemento', fields: [
      { key: 'alta_imss', label: 'Alta IMSS', type: 'text' },
      { key: 'alta_repse', label: 'Alta REPSE', type: 'text' },
      { key: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 2 },
    ]},
  ],
  cotizacion_fimpress: { title: 'Cotización Soporte Técnico — 3 Especialistas', sections: [
    { label: 'Datos del Documento', fields: [
      { key: 'fecha', label: 'Fecha Emisión', type: 'date' },
      { key: 'vigencia', label: 'Vigencia', type: 'text', placeholder: '15 días naturales' },
      { key: 'cliente', label: 'Cliente (Razón Social)', type: 'text', placeholder: 'CARRIER MÉXICO S. de R.L. de C.V. — Planta A' },
      { key: 'atencion', label: 'Atención', type: 'text', placeholder: 'Sr. Jesús / Sr. Edén' },
      { key: 'proyecto', label: 'Proyecto', type: 'text', placeholder: 'Carrier CMXA — Instalación Fimpress' },
      { key: 'modalidad', label: 'Modalidad', type: 'text', placeholder: 'Soporte técnico especializado — alcance independiente' },
      { key: 'facturacion', label: 'Facturación', type: 'text', placeholder: 'Directa GRUPO MICSA → Cliente' },
    ]},
    { label: 'I. Objeto de la Cotización', fields: [
      { key: 'objeto', label: 'Descripción del objeto', type: 'textarea', rows: 4, placeholder: 'GRUPO MICSA presenta el servicio de soporte técnico especializado con 3 especialistas...' },
    ]},
    { label: 'II. Personal Asignado', fields: [
      { key: 'rol1', label: 'Rol Especialista 1', type: 'text', placeholder: 'Supervisor de campo' },
      { key: 'perfil1', label: 'Perfil 1', type: 'text', placeholder: 'Ingeniero mecánico/electromecánico 8+ años' },
      { key: 'responsabilidades1', label: 'Responsabilidades 1', type: 'text', placeholder: 'Dirección técnica en sitio, interfaz con cliente' },
      { key: 'rol2', label: 'Rol Especialista 2', type: 'text', placeholder: 'Especialista mecánico' },
      { key: 'perfil2', label: 'Perfil 2', type: 'text', placeholder: 'Técnico senior en montaje y alineación' },
      { key: 'responsabilidades2', label: 'Responsabilidades 2', type: 'text', placeholder: 'Montaje, nivelación, anclaje, torques' },
      { key: 'rol3', label: 'Rol Especialista 3', type: 'text', placeholder: 'Especialista eléctrico / instrumentación' },
      { key: 'perfil3', label: 'Perfil 3', type: 'text', placeholder: 'Técnico senior en tableros, LOTO, puesta en marcha' },
      { key: 'responsabilidades3', label: 'Responsabilidades 3', type: 'text', placeholder: 'Conexionado, pruebas, arranque, protocolos LOTO' },
    ]},
    { label: 'II. Actividades y Exclusiones', fields: [
      { key: 'actividades', label: 'Actividades incluidas', type: 'textarea', rows: 5, placeholder: 'Revisión documental previa...\nSoporte en sitio para descarga...' },
      { key: 'exclusiones', label: 'Exclusiones explícitas', type: 'textarea', rows: 4, placeholder: 'Suministro del equipo...\nPuesta en marcha formal OEM...' },
    ]},
    { label: 'III. Fases y Duración', fields: [
      { key: 'fase1_nombre', label: 'Fase 1 — Nombre', type: 'text', placeholder: 'Pre-arranque documental' },
      { key: 'fase1_dias', label: 'Fase 1 — Días hábiles', type: 'text', placeholder: '3' },
      { key: 'fase1_modalidad', label: 'Fase 1 — Modalidad', type: 'text', placeholder: 'Remoto + revisión en sitio' },
      { key: 'fase2_nombre', label: 'Fase 2 — Nombre', type: 'text', placeholder: 'Recepción y posicionamiento' },
      { key: 'fase2_dias', label: 'Fase 2 — Días hábiles', type: 'text', placeholder: '5' },
      { key: 'fase2_modalidad', label: 'Fase 2 — Modalidad', type: 'text', placeholder: '100% en sitio' },
      { key: 'fase3_nombre', label: 'Fase 3 — Nombre', type: 'text', placeholder: 'Interconexiones y pruebas' },
      { key: 'fase3_dias', label: 'Fase 3 — Días hábiles', type: 'text', placeholder: '7' },
      { key: 'fase3_modalidad', label: 'Fase 3 — Modalidad', type: 'text', placeholder: '100% en sitio' },
      { key: 'fase4_nombre', label: 'Fase 4 — Nombre', type: 'text', placeholder: 'Soporte al arranque OEM' },
      { key: 'fase4_dias', label: 'Fase 4 — Días hábiles', type: 'text', placeholder: '5' },
      { key: 'fase4_modalidad', label: 'Fase 4 — Modalidad', type: 'text', placeholder: '100% en sitio' },
      { key: 'fase5_nombre', label: 'Fase 5 — Nombre', type: 'text', placeholder: 'Cierre documental y dossier' },
      { key: 'fase5_dias', label: 'Fase 5 — Días hábiles', type: 'text', placeholder: '2' },
      { key: 'fase5_modalidad', label: 'Fase 5 — Modalidad', type: 'text', placeholder: 'Remoto + firma en sitio' },
    ]},
    { label: 'IV. Tarifas', fields: [
      { key: 'tarifa_sup_dias', label: 'Supervisor — Días', type: 'number', placeholder: '22' },
      { key: 'tarifa_sup_pu', label: 'Supervisor — P.U. MXN', type: 'number', placeholder: '12500' },
      { key: 'tarifa_mec_dias', label: 'Esp. Mecánico — Días', type: 'number', placeholder: '22' },
      { key: 'tarifa_mec_pu', label: 'Esp. Mecánico — P.U. MXN', type: 'number', placeholder: '9500' },
      { key: 'tarifa_elec_dias', label: 'Esp. Eléctrico — Días', type: 'number', placeholder: '22' },
      { key: 'tarifa_elec_pu', label: 'Esp. Eléctrico — P.U. MXN', type: 'number', placeholder: '9500' },
      { key: 'viaticos_paq', label: 'Viáticos — Paquetes', type: 'number', placeholder: '3' },
      { key: 'viaticos_pu', label: 'Viáticos — P.U. MXN', type: 'number', placeholder: '18000' },
      { key: 'epp_pu', label: 'EPP y herramienta — Monto', type: 'number', placeholder: '22500' },
      { key: 'dossier_pu', label: 'Dossier de cierre — Monto', type: 'number', placeholder: '35000' },
    ]},
    { label: 'V. Condiciones y Nota Comercial', fields: [
      { key: 'cond_pago', label: 'Condiciones de pago', type: 'text', placeholder: '50% anticipo — 50% contra dossier de cierre' },
      { key: 'plazo_pago', label: 'Plazo pago saldo', type: 'text', placeholder: '20 días naturales posteriores a facturación' },
      { key: 'garantia', label: 'Garantía del servicio', type: 'text', placeholder: '60 días sobre vicios ocultos de mano de obra' },
      { key: 'horario', label: 'Horario estándar', type: 'text', placeholder: 'Lunes a viernes 7:00–17:00 hrs' },
      { key: 'nota_comercial', label: 'Nota Comercial', type: 'textarea', rows: 3, placeholder: 'Esta cotización se emite bajo la estructura de facturación directa...' },
      { key: 'firmante_micsa', label: 'Firmante por MICSA', type: 'text', placeholder: 'Jordan Nefthali González — Dirección General' },
      { key: 'firmante_cliente', label: 'Firmante por Cliente', type: 'text', placeholder: 'Nombre y cargo' },
    ]},
  ]},
  indice_paquete: { title: 'Índice de Paquete Corporativo', sections: [
    { label: 'Datos del Documento', fields: [
      { key: 'proyecto', label: 'Proyecto / Expediente', type: 'text', placeholder: 'Carrier CMXA — Claim Económico' },
      { key: 'cliente', label: 'Cliente', type: 'text', placeholder: 'CARRIER MÉXICO S. de R.L. de C.V.' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'elaboro', label: 'Elaboró', type: 'text', placeholder: 'Jordan Nefthali González' },
      { key: 'version', label: 'Versión', type: 'text', placeholder: 'V1.0' },
    ]},
    { label: 'Frentes del Expediente', fields: [
      { key: 'frente1_titulo', label: 'Frente 1 — Título', type: 'text', placeholder: 'Contexto y Antecedentes' },
      { key: 'frente1_docs', label: 'Frente 1 — Documentos', type: 'textarea', rows: 3, placeholder: '01. Carta de presentación\n02. Expediente Técnico-Financiero\n03. Carta Formal MICSA' },
      { key: 'frente2_titulo', label: 'Frente 2 — Título', type: 'text', placeholder: 'Evidencia Técnica' },
      { key: 'frente2_docs', label: 'Frente 2 — Documentos', type: 'textarea', rows: 3, placeholder: '04. Análisis fotográfico\n05. Bitácoras diarias' },
      { key: 'frente3_titulo', label: 'Frente 3 — Título', type: 'text', placeholder: 'Soporte Financiero' },
      { key: 'frente3_docs', label: 'Frente 3 — Documentos', type: 'textarea', rows: 3, placeholder: '06. Cotización original\n07. Costos adicionales' },
      { key: 'frente4_titulo', label: 'Frente 4 — Título', type: 'text', placeholder: 'Respuesta a Hallazgos' },
      { key: 'frente4_docs', label: 'Frente 4 — Documentos', type: 'textarea', rows: 3, placeholder: '08. Carta respuesta hallazgos\n09. Anexo F — Análisis fotográfico' },
      { key: 'frente5_titulo', label: 'Frente 5 — Título', type: 'text', placeholder: '' },
      { key: 'frente5_docs', label: 'Frente 5 — Documentos', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'nota_indice', label: 'Nota al índice', type: 'textarea', rows: 2, placeholder: 'Todos los documentos están firmados en original y digital.' },
    ]},
  ]},
  expediente_financiero: { title: 'Expediente Técnico-Financiero', sections: [
    { label: 'Datos del Documento', fields: [
      { key: 'proyecto', label: 'Proyecto', type: 'text', placeholder: 'Carrier CMXA — Reclamación Económica' },
      { key: 'cliente', label: 'Cliente', type: 'text', placeholder: 'CARRIER MÉXICO S. de R.L. de C.V.' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'folio_exp', label: 'Folio Expediente', type: 'text', placeholder: 'MICSA-EXP-0001' },
      { key: 'elaboro', label: 'Elaboró', type: 'text', placeholder: 'Jordan Nefthali González — Dirección General' },
      { key: 'version', label: 'Versión', type: 'text', placeholder: 'V2.0' },
    ]},
    { label: 'I. Resumen Ejecutivo', fields: [
      { key: 'resumen', label: 'Resumen Ejecutivo', type: 'textarea', rows: 5, placeholder: 'El presente expediente documenta los trabajos ejecutados por GRUPO MICSA...' },
      { key: 'monto_reclamado', label: 'Monto Reclamado Total (MXN)', type: 'number', placeholder: '0' },
    ]},
    { label: 'II. Fases Ejecutadas', fields: [
      { key: 'fase1_desc', label: 'Fase 1 — Descripción', type: 'textarea', rows: 2, placeholder: 'Revisión documental y pre-arranque' },
      { key: 'fase1_monto', label: 'Fase 1 — Monto MXN', type: 'number', placeholder: '0' },
      { key: 'fase2_desc', label: 'Fase 2 — Descripción', type: 'textarea', rows: 2, placeholder: 'Trabajos en sitio' },
      { key: 'fase2_monto', label: 'Fase 2 — Monto MXN', type: 'number', placeholder: '0' },
      { key: 'fase3_desc', label: 'Fase 3 — Descripción', type: 'textarea', rows: 2, placeholder: 'Costos adicionales no previstos' },
      { key: 'fase3_monto', label: 'Fase 3 — Monto MXN', type: 'number', placeholder: '0' },
    ]},
    { label: 'III. Matriz de Hechos', fields: [
      { key: 'hecho1', label: 'Hecho 1', type: 'textarea', rows: 2, placeholder: 'Fecha — descripción del hecho' },
      { key: 'hecho2', label: 'Hecho 2', type: 'textarea', rows: 2, placeholder: 'Fecha — descripción del hecho' },
      { key: 'hecho3', label: 'Hecho 3', type: 'textarea', rows: 2, placeholder: 'Fecha — descripción del hecho' },
      { key: 'hecho4', label: 'Hecho 4', type: 'textarea', rows: 2, placeholder: 'Fecha — descripción del hecho' },
      { key: 'hecho5', label: 'Hecho 5', type: 'textarea', rows: 2, placeholder: 'Fecha — descripción del hecho' },
    ]},
    { label: 'IV. Impacto Financiero y Declaración', fields: [
      { key: 'impacto', label: 'Impacto Financiero Detallado', type: 'textarea', rows: 5, placeholder: 'Horas hombre adicionales...\nViáticos no contemplados...' },
      { key: 'declaracion', label: 'Declaración Final', type: 'textarea', rows: 4, placeholder: 'GRUPO MICSA declara que los trabajos fueron ejecutados conforme a los más altos estándares...' },
      { key: 'firmante', label: 'Firmante', type: 'text', placeholder: 'Jordan Nefthali González — Dirección General' },
    ]},
  ]},
  carta_formal_direccion: { title: 'Carta Formal Dirección → Cliente', sections: [
    { label: 'Encabezado', fields: [
      { key: 'folio_carta', label: 'Folio de Carta', type: 'text', placeholder: 'MICSA-CAR-0423' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'destinatario_nombre', label: 'Nombre Destinatario', type: 'text', placeholder: 'Ing. Roberto Martínez' },
      { key: 'destinatario_cargo', label: 'Cargo Destinatario', type: 'text', placeholder: 'Director de Operaciones' },
      { key: 'destinatario_empresa', label: 'Empresa Destinataria', type: 'text', placeholder: 'CARRIER MÉXICO S. de R.L. de C.V.' },
      { key: 'asunto', label: 'Asunto', type: 'text', placeholder: 'Reclamación económica por trabajos adicionales — Proyecto Fimpress' },
    ]},
    { label: 'Cuerpo de la Carta', fields: [
      { key: 'saludo', label: 'Saludo', type: 'text', placeholder: 'Estimado Ing. Martínez:' },
      { key: 'parrafo1', label: 'Párrafo 1', type: 'textarea', rows: 4, placeholder: 'Por medio de la presente, GRUPO MICSA se dirige respetuosamente a usted...' },
      { key: 'parrafo2', label: 'Párrafo 2', type: 'textarea', rows: 4, placeholder: 'En virtud de los trabajos adicionales ejecutados fuera del alcance original...' },
      { key: 'parrafo3', label: 'Párrafo 3', type: 'textarea', rows: 4, placeholder: 'Por lo anterior, solicitamos atentamente el análisis y validación del monto reclamado...' },
      { key: 'monto_carta', label: 'Monto Reclamado MXN', type: 'number', placeholder: '0' },
      { key: 'cierre', label: 'Cierre', type: 'text', placeholder: 'Sin otro particular, quedo a sus órdenes.' },
      { key: 'firmante', label: 'Firmante', type: 'text', placeholder: 'Jordan Nefthali González — Dirección General' },
    ]},
  ]},
  carta_respuesta_hallazgos: { title: 'Carta Respuesta Hallazgos', sections: [
    { label: 'Encabezado', fields: [
      { key: 'folio_carta', label: 'Folio de Carta', type: 'text', placeholder: 'MICSA-RSP-0001' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'destinatario_nombre', label: 'Nombre Destinatario', type: 'text', placeholder: 'Ing. Roberto Martínez' },
      { key: 'destinatario_cargo', label: 'Cargo Destinatario', type: 'text', placeholder: 'Director de Operaciones' },
      { key: 'destinatario_empresa', label: 'Empresa', type: 'text', placeholder: 'CARRIER MÉXICO S. de R.L. de C.V.' },
      { key: 'asunto', label: 'Asunto', type: 'text', placeholder: 'Respuesta formal al Reporte Fotográfico de Hallazgos' },
      { key: 'ref_reporte', label: 'Referencia Reporte', type: 'text', placeholder: 'Carrier — Reporte fotográfico 12 hallazgos' },
    ]},
    { label: 'Introducción', fields: [
      { key: 'intro', label: 'Párrafo introductorio', type: 'textarea', rows: 4, placeholder: 'En respuesta al reporte fotográfico recibido con fecha...' },
    ]},
    { label: 'Tabla de Hallazgos', fields: [
      { key: 'h1_desc', label: 'Hallazgo 1 — Descripción', type: 'text', placeholder: 'Descripción del hallazgo' },
      { key: 'h1_resp', label: 'Hallazgo 1 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: 'Posición técnica y argumento' },
      { key: 'h1_estatus', label: 'Hallazgo 1 — Estatus', type: 'text', placeholder: 'Aceptado / Rechazado / Bajo revisión' },
      { key: 'h2_desc', label: 'Hallazgo 2 — Descripción', type: 'text', placeholder: '' },
      { key: 'h2_resp', label: 'Hallazgo 2 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h2_estatus', label: 'Hallazgo 2 — Estatus', type: 'text', placeholder: '' },
      { key: 'h3_desc', label: 'Hallazgo 3 — Descripción', type: 'text', placeholder: '' },
      { key: 'h3_resp', label: 'Hallazgo 3 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h3_estatus', label: 'Hallazgo 3 — Estatus', type: 'text', placeholder: '' },
      { key: 'h4_desc', label: 'Hallazgo 4 — Descripción', type: 'text', placeholder: '' },
      { key: 'h4_resp', label: 'Hallazgo 4 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h4_estatus', label: 'Hallazgo 4 — Estatus', type: 'text', placeholder: '' },
      { key: 'h5_desc', label: 'Hallazgo 5 — Descripción', type: 'text', placeholder: '' },
      { key: 'h5_resp', label: 'Hallazgo 5 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h5_estatus', label: 'Hallazgo 5 — Estatus', type: 'text', placeholder: '' },
      { key: 'h6_desc', label: 'Hallazgo 6 — Descripción', type: 'text', placeholder: '' },
      { key: 'h6_resp', label: 'Hallazgo 6 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h6_estatus', label: 'Hallazgo 6 — Estatus', type: 'text', placeholder: '' },
      { key: 'h7_desc', label: 'Hallazgo 7 — Descripción', type: 'text', placeholder: '' },
      { key: 'h7_resp', label: 'Hallazgo 7 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h7_estatus', label: 'Hallazgo 7 — Estatus', type: 'text', placeholder: '' },
      { key: 'h8_desc', label: 'Hallazgo 8 — Descripción', type: 'text', placeholder: '' },
      { key: 'h8_resp', label: 'Hallazgo 8 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h8_estatus', label: 'Hallazgo 8 — Estatus', type: 'text', placeholder: '' },
      { key: 'h9_desc', label: 'Hallazgo 9 — Descripción', type: 'text', placeholder: '' },
      { key: 'h9_resp', label: 'Hallazgo 9 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h9_estatus', label: 'Hallazgo 9 — Estatus', type: 'text', placeholder: '' },
      { key: 'h10_desc', label: 'Hallazgo 10 — Descripción', type: 'text', placeholder: '' },
      { key: 'h10_resp', label: 'Hallazgo 10 — Respuesta MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h10_estatus', label: 'Hallazgo 10 — Estatus', type: 'text', placeholder: '' },
    ]},
    { label: 'Cierre', fields: [
      { key: 'conclusion', label: 'Conclusión', type: 'textarea', rows: 3, placeholder: 'Con base en los argumentos técnicos expuestos, GRUPO MICSA sustenta su posición...' },
      { key: 'firmante', label: 'Firmante', type: 'text', placeholder: 'Jordan Nefthali González — Dirección General' },
    ]},
  ]},
  anexo_hallazgos: { title: 'Anexo F — Análisis Fotográfico de Hallazgos', sections: [
    { label: 'Datos del Documento', fields: [
      { key: 'proyecto', label: 'Proyecto', type: 'text', placeholder: 'Carrier CMXA — Análisis de Hallazgos' },
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'total_hallazgos', label: 'Total de Hallazgos', type: 'number', placeholder: '10' },
      { key: 'elaboro', label: 'Elaboró', type: 'text', placeholder: 'Jordan Nefthali González' },
    ]},
    { label: 'Hallazgos (1–5)', fields: [
      { key: 'h1_num', label: 'Hallazgo 1 — No.', type: 'text', placeholder: 'H-01' },
      { key: 'h1_titulo', label: 'Hallazgo 1 — Título', type: 'text', placeholder: 'Pernos sin torque de apriete' },
      { key: 'h1_clasif', label: 'Hallazgo 1 — Clasificación', type: 'text', placeholder: 'Responsabilidad del cliente / MICSA / Compartida' },
      { key: 'h1_analisis', label: 'Hallazgo 1 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: 'Los pernos identificados en la fotografía...' },
      { key: 'h1_argumento', label: 'Hallazgo 1 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: 'Esta condición fue generada por...' },
      { key: 'h2_num', label: 'Hallazgo 2 — No.', type: 'text', placeholder: 'H-02' },
      { key: 'h2_titulo', label: 'Hallazgo 2 — Título', type: 'text', placeholder: '' },
      { key: 'h2_clasif', label: 'Hallazgo 2 — Clasificación', type: 'text', placeholder: '' },
      { key: 'h2_analisis', label: 'Hallazgo 2 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'h2_argumento', label: 'Hallazgo 2 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h3_num', label: 'Hallazgo 3 — No.', type: 'text', placeholder: 'H-03' },
      { key: 'h3_titulo', label: 'Hallazgo 3 — Título', type: 'text', placeholder: '' },
      { key: 'h3_clasif', label: 'Hallazgo 3 — Clasificación', type: 'text', placeholder: '' },
      { key: 'h3_analisis', label: 'Hallazgo 3 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'h3_argumento', label: 'Hallazgo 3 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h4_num', label: 'Hallazgo 4 — No.', type: 'text', placeholder: 'H-04' },
      { key: 'h4_titulo', label: 'Hallazgo 4 — Título', type: 'text', placeholder: '' },
      { key: 'h4_clasif', label: 'Hallazgo 4 — Clasificación', type: 'text', placeholder: '' },
      { key: 'h4_analisis', label: 'Hallazgo 4 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'h4_argumento', label: 'Hallazgo 4 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h5_num', label: 'Hallazgo 5 — No.', type: 'text', placeholder: 'H-05' },
      { key: 'h5_titulo', label: 'Hallazgo 5 — Título', type: 'text', placeholder: '' },
      { key: 'h5_clasif', label: 'Hallazgo 5 — Clasificación', type: 'text', placeholder: '' },
      { key: 'h5_analisis', label: 'Hallazgo 5 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'h5_argumento', label: 'Hallazgo 5 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: '' },
    ]},
    { label: 'Hallazgos (6–10)', fields: [
      { key: 'h6_num', label: 'Hallazgo 6 — No.', type: 'text', placeholder: 'H-06' },
      { key: 'h6_titulo', label: 'Hallazgo 6 — Título', type: 'text', placeholder: '' },
      { key: 'h6_clasif', label: 'Hallazgo 6 — Clasificación', type: 'text', placeholder: '' },
      { key: 'h6_analisis', label: 'Hallazgo 6 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'h6_argumento', label: 'Hallazgo 6 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h7_num', label: 'Hallazgo 7 — No.', type: 'text', placeholder: 'H-07' },
      { key: 'h7_titulo', label: 'Hallazgo 7 — Título', type: 'text', placeholder: '' },
      { key: 'h7_clasif', label: 'Hallazgo 7 — Clasificación', type: 'text', placeholder: '' },
      { key: 'h7_analisis', label: 'Hallazgo 7 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'h7_argumento', label: 'Hallazgo 7 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h8_num', label: 'Hallazgo 8 — No.', type: 'text', placeholder: 'H-08' },
      { key: 'h8_titulo', label: 'Hallazgo 8 — Título', type: 'text', placeholder: '' },
      { key: 'h8_clasif', label: 'Hallazgo 8 — Clasificación', type: 'text', placeholder: '' },
      { key: 'h8_analisis', label: 'Hallazgo 8 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'h8_argumento', label: 'Hallazgo 8 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h9_num', label: 'Hallazgo 9 — No.', type: 'text', placeholder: 'H-09' },
      { key: 'h9_titulo', label: 'Hallazgo 9 — Título', type: 'text', placeholder: '' },
      { key: 'h9_clasif', label: 'Hallazgo 9 — Clasificación', type: 'text', placeholder: '' },
      { key: 'h9_analisis', label: 'Hallazgo 9 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'h9_argumento', label: 'Hallazgo 9 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: '' },
      { key: 'h10_num', label: 'Hallazgo 10 — No.', type: 'text', placeholder: 'H-10' },
      { key: 'h10_titulo', label: 'Hallazgo 10 — Título', type: 'text', placeholder: '' },
      { key: 'h10_clasif', label: 'Hallazgo 10 — Clasificación', type: 'text', placeholder: '' },
      { key: 'h10_analisis', label: 'Hallazgo 10 — Análisis Técnico', type: 'textarea', rows: 3, placeholder: '' },
      { key: 'h10_argumento', label: 'Hallazgo 10 — Argumento MICSA', type: 'textarea', rows: 2, placeholder: '' },
    ]},
    { label: 'Conclusiones', fields: [
      { key: 'conclusion_general', label: 'Conclusión General', type: 'textarea', rows: 4, placeholder: 'Con base en el análisis fotográfico detallado...' },
      { key: 'firmante', label: 'Firmante', type: 'text', placeholder: 'Jordan Nefthali González — Dirección General' },
    ]},
  ]},
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
  manual_integral_seguridad: 'Manual Integral Seguridad',
  manual_operativo: 'Manual Operativo',
  propuesta_comercial: 'Propuesta Comercial',
  codigo_etica: 'Código de Ética y Reglamento',
  manual_reclutamiento: 'Manual de Reclutamiento',
  cotizacion_fimpress: 'Cotización Soporte Técnico — 3 Especialistas',
  indice_paquete: 'Índice de Paquete Corporativo',
  expediente_financiero: 'Expediente Técnico-Financiero',
  carta_formal_direccion: 'Carta Formal Dirección',
  carta_respuesta_hallazgos: 'Carta Respuesta Hallazgos',
  anexo_hallazgos: 'Anexo F — Análisis Fotográfico',
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
      <div onClick={() => inputRef.current?.click()}
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
      <input ref={inputRef} type="file" accept="image/*" multiple capture="environment"
        className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
      {fotos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {fotos.map((f, i) => (
            <div key={i} className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt="" className="w-full h-full object-cover rounded-lg" />
              <button onClick={() => removePhoto(i)}
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

    async function handleDocxDownload() {
          try {
                  const res = await fetch('/api/generate-docx', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ tipo, data, folio }),
                  })
                  if (!res.ok) throw new Error('Error generating DOCX')
                  const blob = await res.blob()
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${folio || tipo || 'documento'}.docx`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
          } catch (err) {
                  console.error('DOCX download error:', err)
                  alert('Error al generar el archivo DOCX')
          }
    }

  return (
    <div className="max-w-lg mx-auto pb-4">
      {/* Header */}
      <div className="sticky top-14 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 z-10 no-print">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-slate-600 text-xl">←</button>
        <h2 className="text-base font-bold text-slate-800 flex-1 truncate">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowPreview(!showPreview)}
            className="text-xs border border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            {showPreview ? 'Editar' : 'Vista previa'}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="text-xs bg-blue-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      {savedId && (
        <div className="mx-4 mt-3 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-sm flex items-center justify-between no-print">
          <span>✓ Guardado — <strong>{folio}</strong></span>
          <button onClick={handlePrint} className="text-green-800 font-semibold underline text-xs">Imprimir PDF</button><button onClick={handleDocxDownload} className="text-blue-800 font-semibold underline text-xs ml-2">⬇ DOCX</button>
        </div>
      )}

      {showPreview ? (
        /* PREVIEW */
        <div className="p-4">
          <button onClick={handlePrint}
            className="w-full mb-4 bg-slate-800 text-white py-3 rounded-xl font-semibold text-sm no-print"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
                  <button onClick={handleDocxDownload}
                              className="w-full mb-2 bg-blue-900 text-white py-3 rounded-xl font-semibold text-sm no-print"
                            >
                            ⬇ Descargar DOCX (Plantilla MICSA)
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
              <PhotoUploader documentoId={savedId || undefined} fotos={fotos} onFotosChange={setFotos} />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
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
    <img src={LOGO_B64} alt="" aria-hidden style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      width: '55%', opacity: 0.05, pointerEvents: 'none', zIndex: 0, userSelect: 'none'
    }} />
  )

  if (tipo === 'cotizacion') {
    const alcances = ALCANCES_DEFAULT
    const incluye = INCLUYE_DEFAULT
    const excluye = EXCLUYE_DEFAULT
    const monto = data.monto_usd
      ? `$${parseFloat(data.monto_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD MAS IVA`
      : data.monto_mxn
      ? fmtMXN(parseFloat(data.monto_mxn)) + ' MAS IVA'
      : '—'

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

  if (tipo === 'cotizacion_fimpress') {
    const fmtN = (v: string | undefined) => v ? parseFloat(v).toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'
    const sup = (parseFloat(data.tarifa_sup_dias||'0') * parseFloat(data.tarifa_sup_pu||'0'))
    const mec = (parseFloat(data.tarifa_mec_dias||'0') * parseFloat(data.tarifa_mec_pu||'0'))
    const elec = (parseFloat(data.tarifa_elec_dias||'0') * parseFloat(data.tarifa_elec_pu||'0'))
    const viat = (parseFloat(data.viaticos_paq||'0') * parseFloat(data.viaticos_pu||'0'))
    const epp = parseFloat(data.epp_pu||'0')
    const doss = parseFloat(data.dossier_pu||'0')
    const subtotal = sup + mec + elec + viat + epp + doss
    const iva = subtotal * 0.16
    const total = subtotal + iva
    const SEC = ({ title }: { title: string }) => (
      <div style={{ background: '#0a0a0a', color: '#fff', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 10px', marginBottom: 8, marginTop: 14 }}>{title}</div>
    )
    const fases = [1,2,3,4,5].map(n => ({ nombre: data[`fase${n}_nombre`], dias: data[`fase${n}_dias`], mod: data[`fase${n}_modalidad`] })).filter(f => f.nombre)
    return (
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 10.5, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Watermark />
        <div style={{ padding: '14px 20px', flex: 1 }}>
          <Header />
          {/* Título */}
          <div style={{ textAlign: 'center', margin: '10px 0 8px' }}>
            <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>COTIZACIÓN COMERCIAL</div>
            <div style={{ fontStyle: 'italic', fontSize: 10, color: '#555' }}>Servicio de Soporte Técnico — {data.proyecto || 'Instalación y Puesta en Marcha'}</div>
          </div>
          {/* Ficha */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10, fontSize: 10 }}>
            <tbody>
              {[
                ['FOLIO', folio || '—'], ['FECHA EMISIÓN', data.fecha ? new Date(data.fecha+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}) : '—'],
                ['VIGENCIA', data.vigencia || '15 días naturales'], ['EMISOR', 'GRUPO MICSA — Dirección General'],
                ['CLIENTE', data.cliente || '—'], ['ATENCIÓN', data.atencion || '—'],
                ['PROYECTO', data.proyecto || '—'], ['MODALIDAD', data.modalidad || '—'],
                ['FACTURACIÓN', data.facturacion || '—'],
              ].map(([k,v]) => (
                <tr key={k}>
                  <td style={{ padding: '4px 8px', fontWeight: 700, width: '28%', border: '1px solid #ddd', background: '#f8f8f8', fontSize: 9.5 }}>{k}:</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* I. Objeto */}
          <SEC title="I. Objeto de la Cotización" />
          <p style={{ margin: '0 0 6px', lineHeight: 1.7, textAlign: 'justify', fontSize: 10 }}>{data.objeto || 'GRUPO MICSA presenta el servicio de soporte técnico especializado con tres (3) especialistas dedicados para la instalación, arranque y seguimiento operativo del equipo.'}</p>
          {/* II. Personal */}
          <SEC title="II. Alcance Técnico — Personal Asignado (3 Especialistas)" />
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8, fontSize: 10 }}>
            <thead><tr style={{ background: '#222', color: '#fff' }}>
              <th style={{ padding: '5px 8px', textAlign: 'left', width: '25%' }}>Rol</th>
              <th style={{ padding: '5px 8px', textAlign: 'left', width: '37%' }}>Perfil</th>
              <th style={{ padding: '5px 8px', textAlign: 'left' }}>Responsabilidades</th>
            </tr></thead>
            <tbody>
              {[1,2,3].map(n => (
                <tr key={n} style={{ background: n%2===0 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd', fontWeight: 700 }}>{data[`rol${n}`] || `Especialista ${n}`}</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{data[`perfil${n}`] || '—'}</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{data[`responsabilidades${n}`] || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Actividades */}
          {data.actividades && (<><div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4, marginTop: 6 }}>2.2 Actividades incluidas</div>
          <div style={{ fontSize: 10, lineHeight: 1.7, marginBottom: 6, whiteSpace: 'pre-line' }}>{data.actividades}</div></>)}
          {data.exclusiones && (<><div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>2.3 Exclusiones explícitas</div>
          <div style={{ fontSize: 10, lineHeight: 1.7, marginBottom: 6, whiteSpace: 'pre-line' }}>{data.exclusiones}</div></>)}
          {/* III. Fases */}
          {fases.length > 0 && (<>
            <SEC title="III. Duración Estimada y Modalidad" />
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8, fontSize: 10 }}>
              <thead><tr style={{ background: '#222', color: '#fff' }}>
                <th style={{ padding: '5px 8px', textAlign: 'left' }}>Fase</th>
                <th style={{ padding: '5px 8px', textAlign: 'center', width: '22%' }}>Días hábiles</th>
                <th style={{ padding: '5px 8px', textAlign: 'left', width: '35%' }}>Modalidad</th>
              </tr></thead>
              <tbody>
                {fases.map((f,i) => (
                  <tr key={i} style={{ background: i%2===0 ? '#fff' : '#f9f9f9' }}>
                    <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>Fase {i+1} — {f.nombre}</td>
                    <td style={{ padding: '4px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{f.dias}</td>
                    <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{f.mod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>)}
          {/* IV. Tarifas */}
          <SEC title="IV. Estructura de Tarifas" />
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8, fontSize: 10 }}>
            <thead><tr style={{ background: '#222', color: '#fff' }}>
              <th style={{ padding: '5px 8px', textAlign: 'left' }}>Concepto</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', width: '12%' }}>Unidad</th>
              <th style={{ padding: '5px 8px', textAlign: 'center', width: '10%' }}>Cant.</th>
              <th style={{ padding: '5px 8px', textAlign: 'right', width: '18%' }}>P.U. (MXN)</th>
              <th style={{ padding: '5px 8px', textAlign: 'right', width: '18%' }}>Subtotal (MXN)</th>
            </tr></thead>
            <tbody>
              {[
                ['Supervisor de campo — jornada', 'día', data.tarifa_sup_dias||'0', data.tarifa_sup_pu||'0', sup],
                ['Especialista mecánico — jornada', 'día', data.tarifa_mec_dias||'0', data.tarifa_mec_pu||'0', mec],
                ['Especialista eléctrico/instr. — jornada', 'día', data.tarifa_elec_dias||'0', data.tarifa_elec_pu||'0', elec],
                ['Movilización / viáticos / hospedaje', 'paquete', data.viaticos_paq||'0', data.viaticos_pu||'0', viat],
                ['EPP especializado, herramienta y consumibles', 'paquete', '1', data.epp_pu||'0', epp],
                ['Dossier de cierre, bitácora fotográfica y memoria técnica', 'paquete', '1', data.dossier_pu||'0', doss],
              ].map(([c,u,q,pu,st],i) => (
                <tr key={i} style={{ background: i%2===0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{c as string}</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{u as string}</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd', textAlign: 'center' }}>{q as string}</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd', textAlign: 'right' }}>${fmtN(pu as string)}</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 600 }}>${fmtN(String(st))}</td>
                </tr>
              ))}
              <tr><td colSpan={4} style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 800, border: '1px solid #ddd' }}>SUBTOTAL</td><td style={{ padding: '5px 8px', textAlign: 'right', fontWeight: 800, border: '1px solid #ddd' }}>${fmtN(String(subtotal))}</td></tr>
              <tr><td colSpan={4} style={{ padding: '5px 8px', textAlign: 'right', border: '1px solid #ddd' }}>IVA 16%</td><td style={{ padding: '5px 8px', textAlign: 'right', border: '1px solid #ddd' }}>${fmtN(String(iva))}</td></tr>
              <tr style={{ background: '#0a0a0a', color: '#fff' }}><td colSpan={4} style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 900 }}>TOTAL MXN</td><td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 900 }}>${fmtN(String(total))}</td></tr>
            </tbody>
          </table>
          {/* V. Condiciones */}
          <SEC title="V. Condiciones Comerciales" />
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8, fontSize: 10 }}>
            <tbody>
              {[
                ['Condiciones de pago', data.cond_pago || '50% anticipo contra OC — 50% contra dossier de cierre'],
                ['Plazo pago saldo', data.plazo_pago || '20 días naturales posteriores a la facturación'],
                ['Garantía del servicio', data.garantia || '60 días sobre vicios ocultos de mano de obra'],
                ['Horario estándar', data.horario || 'Lunes a viernes 7:00–17:00 hrs'],
                ['Moneda', 'Pesos Mexicanos (MXN)'],
                ['Vigencia', data.vigencia || '15 días naturales'],
              ].map(([k,v]) => (
                <tr key={k as string}>
                  <td style={{ padding: '4px 8px', fontWeight: 700, width: '30%', border: '1px solid #ddd', background: '#f8f8f8' }}>{k as string}</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #ddd' }}>{v as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Nota comercial */}
          {data.nota_comercial && (<>
            <SEC title="VII. Nota Comercial" />
            <div style={{ fontStyle: 'italic', fontSize: 10, lineHeight: 1.7, textAlign: 'justify', padding: '8px 12px', border: '1px solid #ddd', background: '#fafafa', marginBottom: 12 }}>{data.nota_comercial}</div>
          </>)}
          {/* Firmas */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 24 }}>
            {[['Por GRUPO MICSA', data.firmante_micsa || 'Jordan Nefthali González\nDirección General'], ['Por ' + (data.cliente || 'CLIENTE'), data.firmante_cliente || 'Nombre y cargo']].map(([label, nombre]) => (
              <div key={label as string} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ borderTop: '1.5px solid #111', paddingTop: 6, marginTop: 36 }}>
                  <div style={{ fontWeight: 800, fontSize: 10 }}>{label as string}</div>
                  <div style={{ fontSize: 9.5, color: '#444', whiteSpace: 'pre-line' }}>{nombre as string}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer email={MI.emailCot} />
      </div>
    )
  }

  if (tipo === 'indice_paquete') {
    const frentes = [1,2,3,4,5].map(n => ({ titulo: data[`frente${n}_titulo`], docs: data[`frente${n}_docs`] })).filter(f => f.titulo)
    const SEC = ({ title }: { title: string }) => (
      <div style={{ background: '#0a0a0a', color: '#F5B800', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 10px', marginBottom: 8, marginTop: 14 }}>{title}</div>
    )
    return (
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 10.5, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Watermark />
        <div style={{ padding: '14px 20px', flex: 1 }}>
          <Header />
          <div style={{ textAlign: 'center', margin: '10px 0 8px' }}>
            <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>ÍNDICE DE PAQUETE CORPORATIVO</div>
            <div style={{ fontStyle: 'italic', fontSize: 10, color: '#555' }}>{data.proyecto || 'Expediente Corporativo MICSA'}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10, fontSize: 10 }}>
            <tbody>
              {[['CLIENTE', data.cliente||'—'],['FECHA', data.fecha ? new Date(data.fecha+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}) : '—'],['ELABORÓ', data.elaboro||'—'],['VERSIÓN', data.version||'V1.0']].map(([k,v]) => (
                <tr key={k}><td style={{ padding:'4px 8px',fontWeight:700,width:'28%',border:'1px solid #ddd',background:'#f8f8f8',fontSize:9.5 }}>{k}:</td><td style={{ padding:'4px 8px',border:'1px solid #ddd' }}>{v}</td></tr>
              ))}
            </tbody>
          </table>
          <SEC title="Contenido del Expediente" />
          {frentes.map((f, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 10.5, background: '#1a1a1a', color: '#F5B800', padding: '4px 10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Frente {i+1} — {f.titulo}</div>
              <div style={{ border: '1px solid #ddd', padding: '8px 12px' }}>
                {(f.docs||'').split('\n').filter(Boolean).map((d,j) => (
                  <div key={j} style={{ padding: '3px 0', borderBottom: '1px dotted #eee', fontSize: 10 }}>{d}</div>
                ))}
              </div>
            </div>
          ))}
          {data.nota_indice && (<div style={{ fontStyle: 'italic', fontSize: 9.5, color: '#555', marginTop: 10, padding: '6px 10px', border: '1px solid #ddd', background: '#fafafa' }}>{data.nota_indice}</div>)}
        </div>
        <Footer email={MI.emailCot} />
      </div>
    )
  }

  if (tipo === 'expediente_financiero') {
    const fmtN = (v: string | undefined) => v ? parseFloat(v).toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'
    const montos = [1,2,3].map(n => parseFloat(data[`fase${n}_monto`]||'0'))
    const total = montos.reduce((a,b) => a+b, 0)
    const hechos = [1,2,3,4,5].map(n => data[`hecho${n}`]).filter(Boolean)
    const SEC = ({ title }: { title: string }) => (
      <div style={{ background: '#0a0a0a', color: '#F5B800', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 10px', marginBottom: 8, marginTop: 14 }}>{title}</div>
    )
    return (
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 10.5, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Watermark />
        <div style={{ padding: '14px 20px', flex: 1 }}>
          <Header />
          <div style={{ textAlign: 'center', margin: '10px 0 8px' }}>
            <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>EXPEDIENTE TÉCNICO-FINANCIERO</div>
            <div style={{ fontStyle: 'italic', fontSize: 10, color: '#555' }}>{data.proyecto || 'Reclamación Económica'}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10, fontSize: 10 }}>
            <tbody>
              {[['FOLIO', data.folio_exp||folio||'—'],['CLIENTE', data.cliente||'—'],['FECHA', data.fecha ? new Date(data.fecha+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}) : '—'],['ELABORÓ', data.elaboro||'—'],['VERSIÓN', data.version||'V1.0']].map(([k,v]) => (
                <tr key={k}><td style={{ padding:'4px 8px',fontWeight:700,width:'28%',border:'1px solid #ddd',background:'#f8f8f8',fontSize:9.5 }}>{k}:</td><td style={{ padding:'4px 8px',border:'1px solid #ddd' }}>{v}</td></tr>
              ))}
            </tbody>
          </table>
          {data.resumen && (<><SEC title="I. Resumen Ejecutivo" /><p style={{ margin:'0 0 8px',lineHeight:1.7,textAlign:'justify',fontSize:10 }}>{data.resumen}</p></>)}
          <SEC title="II. Fases Ejecutadas" />
          <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:8, fontSize:10 }}>
            <thead><tr style={{ background:'#111', color:'#fff' }}><th style={{ padding:'5px 8px',textAlign:'left' }}>Fase</th><th style={{ padding:'5px 8px',textAlign:'left' }}>Descripción</th><th style={{ padding:'5px 8px',textAlign:'right',width:'22%' }}>Monto (MXN)</th></tr></thead>
            <tbody>
              {[1,2,3].map(n => data[`fase${n}_desc`] ? (
                <tr key={n} style={{ background: n%2===0 ? '#f9f9f9':'#fff' }}>
                  <td style={{ padding:'4px 8px',border:'1px solid #ddd',fontWeight:700 }}>Fase {n}</td>
                  <td style={{ padding:'4px 8px',border:'1px solid #ddd' }}>{data[`fase${n}_desc`]}</td>
                  <td style={{ padding:'4px 8px',border:'1px solid #ddd',textAlign:'right' }}>${fmtN(data[`fase${n}_monto`])}</td>
                </tr>
              ) : null)}
              <tr style={{ background:'#0a0a0a',color:'#fff' }}><td colSpan={2} style={{ padding:'6px 8px',fontWeight:900,textAlign:'right' }}>TOTAL RECLAMADO</td><td style={{ padding:'6px 8px',textAlign:'right',fontWeight:900 }}>${fmtN(String(data.monto_reclamado||total))}</td></tr>
            </tbody>
          </table>
          {hechos.length > 0 && (<>
            <SEC title="III. Matriz de Hechos" />
            {hechos.map((h,i) => (
              <div key={i} style={{ display:'flex', gap:8, marginBottom:4, fontSize:10 }}>
                <div style={{ minWidth:18, fontWeight:800, color:'#F5B800' }}>{i+1}.</div>
                <div style={{ lineHeight:1.7 }}>{h}</div>
              </div>
            ))}
          </>)}
          {data.impacto && (<><SEC title="IV. Impacto Financiero" /><div style={{ fontSize:10,lineHeight:1.7,whiteSpace:'pre-line',marginBottom:8 }}>{data.impacto}</div></>)}
          {data.declaracion && (<><SEC title="V. Declaración" /><p style={{ fontStyle:'italic',fontSize:10,lineHeight:1.7,textAlign:'justify',padding:'8px 12px',border:'1px solid #ddd',background:'#fafafa',marginBottom:12 }}>{data.declaracion}</p></>)}
          <div style={{ marginTop:20, textAlign:'center' }}>
            <div style={{ borderTop:'1.5px solid #111',paddingTop:6,marginTop:36,display:'inline-block',minWidth:200 }}>
              <div style={{ fontWeight:800, fontSize:10 }}>Por GRUPO MICSA</div>
              <div style={{ fontSize:9.5, color:'#444', whiteSpace:'pre-line' }}>{data.firmante||'Jordan Nefthali González\nDirección General'}</div>
            </div>
          </div>
        </div>
        <Footer email={MI.emailCot} />
      </div>
    )
  }

  if (tipo === 'carta_formal_direccion') {
    const fmtN = (v: string | undefined) => v ? parseFloat(v).toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'
    return (
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 10.5, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Watermark />
        <div style={{ padding: '14px 20px', flex: 1 }}>
          <Header />
          {/* Datos carta */}
          <div style={{ marginTop: 14, marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 9.5, color: '#555' }}>FOLIO: {data.folio_carta || '—'}</div>
            <div style={{ fontWeight: 700, fontSize: 9.5, color: '#555' }}>{data.fecha ? new Date(data.fecha+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}) : '—'}</div>
          </div>
          {/* Destinatario */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700 }}>{data.destinatario_nombre || 'A quien corresponda'}</div>
            {data.destinatario_cargo && <div>{data.destinatario_cargo}</div>}
            {data.destinatario_empresa && <div style={{ fontWeight: 700 }}>{data.destinatario_empresa}</div>}
            <div style={{ marginTop: 8, fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>ASUNTO: {data.asunto || '—'}</div>
          </div>
          {/* Cuerpo */}
          {data.saludo && <div style={{ marginBottom: 12, fontWeight: 600 }}>{data.saludo}</div>}
          {data.parrafo1 && <p style={{ marginBottom: 10, lineHeight: 1.8, textAlign: 'justify', fontSize: 10 }}>{data.parrafo1}</p>}
          {data.parrafo2 && <p style={{ marginBottom: 10, lineHeight: 1.8, textAlign: 'justify', fontSize: 10 }}>{data.parrafo2}</p>}
          {data.parrafo3 && <p style={{ marginBottom: 10, lineHeight: 1.8, textAlign: 'justify', fontSize: 10 }}>{data.parrafo3}</p>}
          {data.monto_carta && parseFloat(data.monto_carta) > 0 && (
            <div style={{ margin: '14px 0', padding: '10px 14px', border: '2px solid #0a0a0a', background: '#f8f8f8', textAlign: 'center' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555' }}>MONTO RECLAMADO</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>${fmtN(data.monto_carta)} MXN</div>
            </div>
          )}
          {data.cierre && <p style={{ marginBottom: 24, lineHeight: 1.8, fontSize: 10 }}>{data.cierre}</p>}
          <div style={{ marginTop: 40 }}>
            <div style={{ borderTop: '1.5px solid #111', paddingTop: 6, maxWidth: 220 }}>
              <div style={{ fontWeight: 800 }}>Por GRUPO MICSA</div>
              <div style={{ fontSize: 9.5, color: '#444', whiteSpace: 'pre-line' }}>{data.firmante || 'Jordan Nefthali González\nDirección General'}</div>
            </div>
          </div>
        </div>
        <Footer email={MI.emailCot} />
      </div>
    )
  }

  if (tipo === 'carta_respuesta_hallazgos') {
    const hallazgos = Array.from({length:10}, (_,i) => i+1).map(n => ({
      desc: data[`h${n}_desc`], resp: data[`h${n}_resp`], estatus: data[`h${n}_estatus`]
    })).filter(h => h.desc)
    const SEC = ({ title }: { title: string }) => (
      <div style={{ background: '#0a0a0a', color: '#F5B800', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 10px', marginBottom: 8, marginTop: 14 }}>{title}</div>
    )
    const estatusColor = (e: string | undefined) => {
      if (!e) return '#555'
      if (e.toLowerCase().includes('acept')) return '#2d6a4f'
      if (e.toLowerCase().includes('rechaz')) return '#d42b2b'
      return '#92400e'
    }
    return (
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 10.5, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Watermark />
        <div style={{ padding: '14px 20px', flex: 1 }}>
          <Header />
          <div style={{ textAlign: 'center', margin: '10px 0 8px' }}>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}>CARTA RESPUESTA A HALLAZGOS</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10, fontSize: 10 }}>
            <tbody>
              {[['FOLIO', data.folio_carta||folio||'—'],['FECHA', data.fecha ? new Date(data.fecha+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}) : '—'],['DESTINATARIO', `${data.destinatario_nombre||''} — ${data.destinatario_cargo||''}`],['EMPRESA', data.destinatario_empresa||'—'],['REF. REPORTE', data.ref_reporte||'—'],['ASUNTO', data.asunto||'—']].map(([k,v]) => (
                <tr key={k}><td style={{ padding:'4px 8px',fontWeight:700,width:'30%',border:'1px solid #ddd',background:'#f8f8f8',fontSize:9.5 }}>{k}:</td><td style={{ padding:'4px 8px',border:'1px solid #ddd' }}>{v}</td></tr>
              ))}
            </tbody>
          </table>
          {data.intro && (<><SEC title="Introducción" /><p style={{ lineHeight:1.7,textAlign:'justify',fontSize:10,marginBottom:8 }}>{data.intro}</p></>)}
          <SEC title="Análisis de Hallazgos" />
          <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:8, fontSize:9.5 }}>
            <thead><tr style={{ background:'#111',color:'#fff' }}>
              <th style={{ padding:'5px 8px',textAlign:'left',width:'4%' }}>#</th>
              <th style={{ padding:'5px 8px',textAlign:'left',width:'26%' }}>Hallazgo</th>
              <th style={{ padding:'5px 8px',textAlign:'left',width:'48%' }}>Respuesta MICSA</th>
              <th style={{ padding:'5px 8px',textAlign:'center',width:'22%' }}>Estatus</th>
            </tr></thead>
            <tbody>
              {hallazgos.map((h,i) => (
                <tr key={i} style={{ background: i%2===0 ? '#fff':'#f9f9f9' }}>
                  <td style={{ padding:'5px 8px',border:'1px solid #ddd',fontWeight:800,textAlign:'center' }}>{i+1}</td>
                  <td style={{ padding:'5px 8px',border:'1px solid #ddd',fontWeight:700 }}>{h.desc}</td>
                  <td style={{ padding:'5px 8px',border:'1px solid #ddd',lineHeight:1.6 }}>{h.resp}</td>
                  <td style={{ padding:'5px 8px',border:'1px solid #ddd',textAlign:'center',fontWeight:700,color:estatusColor(h.estatus),fontSize:9 }}>{h.estatus||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.conclusion && (<><SEC title="Conclusión" /><p style={{ fontStyle:'italic',fontSize:10,lineHeight:1.7,textAlign:'justify',padding:'8px 12px',border:'1px solid #ddd',background:'#fafafa',marginBottom:12 }}>{data.conclusion}</p></>)}
          <div style={{ marginTop:20, textAlign:'left' }}>
            <div style={{ borderTop:'1.5px solid #111',paddingTop:6,marginTop:36,display:'inline-block',minWidth:200 }}>
              <div style={{ fontWeight:800, fontSize:10 }}>Por GRUPO MICSA</div>
              <div style={{ fontSize:9.5, color:'#444', whiteSpace:'pre-line' }}>{data.firmante||'Jordan Nefthali González\nDirección General'}</div>
            </div>
          </div>
        </div>
        <Footer email={MI.emailCot} />
      </div>
    )
  }

  if (tipo === 'anexo_hallazgos') {
    const hallazgos = Array.from({length:10}, (_,i) => i+1).map(n => ({
      num: data[`h${n}_num`]||`H-0${n}`, titulo: data[`h${n}_titulo`], clasif: data[`h${n}_clasif`],
      analisis: data[`h${n}_analisis`], argumento: data[`h${n}_argumento`]
    })).filter(h => h.titulo)
    const clasifColor = (c: string | undefined) => {
      if (!c) return '#444'
      const l = c.toLowerCase()
      if (l.includes('cliente')) return '#1a3a6b'
      if (l.includes('micsa')) return '#d42b2b'
      return '#92400e'
    }
    const SEC = ({ title }: { title: string }) => (
      <div style={{ background: '#0a0a0a', color: '#F5B800', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 10px', marginBottom: 8, marginTop: 14 }}>{title}</div>
    )
    return (
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 10.5, color: '#111', background: 'white', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <Watermark />
        <div style={{ padding: '14px 20px', flex: 1 }}>
          <Header />
          <div style={{ textAlign: 'center', margin: '10px 0 8px' }}>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}>ANEXO F — ANÁLISIS FOTOGRÁFICO DE HALLAZGOS</div>
            <div style={{ fontStyle: 'italic', fontSize: 10, color: '#555' }}>{data.proyecto || 'Análisis de Hallazgos'}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10, fontSize: 10 }}>
            <tbody>
              {[['FECHA', data.fecha ? new Date(data.fecha+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}) : '—'],['TOTAL HALLAZGOS', data.total_hallazgos||String(hallazgos.length)],['ELABORÓ', data.elaboro||'—']].map(([k,v]) => (
                <tr key={k}><td style={{ padding:'4px 8px',fontWeight:700,width:'28%',border:'1px solid #ddd',background:'#f8f8f8',fontSize:9.5 }}>{k}:</td><td style={{ padding:'4px 8px',border:'1px solid #ddd' }}>{v}</td></tr>
              ))}
            </tbody>
          </table>
          <SEC title="Análisis Detallado por Hallazgo" />
          {hallazgos.map((h, i) => (
            <div key={i} style={{ marginBottom: 12, border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ background: '#1a1a1a', color: '#F5B800', padding: '5px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 900, fontSize: 10, letterSpacing: '0.06em' }}>{h.num} — {h.titulo}</span>
                {h.clasif && <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: clasifColor(h.clasif), padding: '2px 6px', borderRadius: 2 }}>{h.clasif}</span>}
              </div>
              <div style={{ padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {h.analisis && (<div><div style={{ fontWeight:700,fontSize:9,color:'#444',marginBottom:3,textTransform:'uppercase',letterSpacing:'0.08em' }}>Análisis Técnico</div><div style={{ fontSize:9.5,lineHeight:1.6 }}>{h.analisis}</div></div>)}
                {h.argumento && (<div><div style={{ fontWeight:700,fontSize:9,color:'#1a3a6b',marginBottom:3,textTransform:'uppercase',letterSpacing:'0.08em' }}>Posición MICSA</div><div style={{ fontSize:9.5,lineHeight:1.6 }}>{h.argumento}</div></div>)}
              </div>
            </div>
          ))}
          {data.conclusion_general && (<><SEC title="Conclusión General" /><p style={{ fontStyle:'italic',fontSize:10,lineHeight:1.7,textAlign:'justify',padding:'8px 12px',border:'1px solid #ddd',background:'#fafafa',marginBottom:12 }}>{data.conclusion_general}</p></>)}
          <div style={{ marginTop:20 }}>
            <div style={{ borderTop:'1.5px solid #111',paddingTop:6,marginTop:36,display:'inline-block',minWidth:200 }}>
              <div style={{ fontWeight:800, fontSize:10 }}>Por GRUPO MICSA</div>
              <div style={{ fontSize:9.5, color:'#444', whiteSpace:'pre-line' }}>{data.firmante||'Jordan Nefthali González\nDirección General'}</div>
            </div>
          </div>
        </div>
        <Footer email={MI.emailCot} />
      </div>
    )
  }

  // Generic preview for other doc types
  const docTitle = TIPO_TITLES[tipo] || tipo
  const isCorporate = ['manual_integral_seguridad','manual_operativo','propuesta_comercial','codigo_etica','manual_reclutamiento'].includes(tipo)

  if (isCorporate) {
    return (
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 11, color: '#fff', background: '#0a0a0a', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Portada negra */}
        <div style={{ background: '#0a0a0a', padding: '32px 28px 24px', borderBottom: '2px solid #fff', minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-micsa-white.png" alt="MICSA" style={{ height: 48, filter: 'brightness(0) invert(1)' }} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>MICSA</div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#aaa', textTransform: 'uppercase' }}>Safety Division</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 8, letterSpacing: '0.25em', color: '#888', textTransform: 'uppercase', marginBottom: 8 }}>Documento Corporativo</div>
            <div style={{ fontWeight: 900, fontSize: 26, textTransform: 'uppercase', lineHeight: 1.1, color: '#fff', letterSpacing: '0.04em', marginBottom: 6 }}>{docTitle}</div>
            <div style={{ fontSize: 10, color: '#ccc', letterSpacing: '0.06em' }}>Sistema de Gestión de Seguridad Patrimonial</div>
          </div>
        </div>
        {/* Tabla de control */}
        <div style={{ background: '#fff', color: '#111', padding: '14px 20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <tbody>
              <tr>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ddd', width: '30%', fontWeight: 700, color: '#444' }}>Elaboró:</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ddd' }}>{data.elaboro || '_______________'}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ddd', width: '20%', fontWeight: 700, color: '#444' }}>Revisó:</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ddd' }}>{data.reviso || '_______________'}</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ddd', fontWeight: 700, color: '#444' }}>Aprobó:</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ddd' }}>{data.aprobo || '_______________'}</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ddd', fontWeight: 700, color: '#444' }}>Fecha:</td>
                <td style={{ padding: '5px 8px', borderBottom: '1px solid #ddd' }}>{data.fecha || '_______________'}</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 8px', fontWeight: 700, color: '#444' }}>Versión:</td>
                <td style={{ padding: '5px 8px' }}>{data.version || '1.0'}</td>
                <td style={{ padding: '5px 8px', fontWeight: 700, color: '#444' }}>Páginas:</td>
                <td style={{ padding: '5px 8px' }}>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Contenido por secciones */}
        <div style={{ background: '#fff', color: '#111', padding: '8px 20px 20px', flex: 1 }}>
          {(SCHEMAS[tipo] || defaultSchema(tipo, TIPO_TITLES[tipo] || tipo)).sections.map((sec) => (
            <div key={sec.label} style={{ marginBottom: 16 }}>
              <div style={{ background: '#0a0a0a', color: '#fff', fontWeight: 800, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '5px 10px', marginBottom: 8 }}>{sec.label}</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {sec.fields.map((field) => data[field.key] ? (
                    <tr key={field.key}>
                      <td style={{ padding: '4px 8px', fontWeight: 700, fontSize: 10, color: '#555', width: '35%', verticalAlign: 'top', borderBottom: '1px solid #f0f0f0' }}>{field.label}:</td>
                      <td style={{ padding: '4px 8px', fontSize: 10, color: '#111', borderBottom: '1px solid #f0f0f0', whiteSpace: 'pre-wrap' }}>{data[field.key]}</td>
                    </tr>
                  ) : null)}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    )
  }

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
