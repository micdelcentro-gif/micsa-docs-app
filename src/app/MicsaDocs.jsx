'use client'
import { useState, useRef, useCallback } from "react";

/* ─── CONSTANTS ─────────────────────────────────────────────────────────────── */
const NAVY="#0a1628", BLUE="#1a3a6b", GOLD="#c8a84b", RED="#d42b2b", LGRAY="#f4f6f9";
const MI={dir:"Guerrero sur #108 colonia ZC, Monclova Coahuila CP-257",tel1:"866-176-6621",tel2:"866-206-5632",email:"micdelcentro@gmail.com",web:"micdelcentro.com",emailJ:"Jgonzalez@micsadelcentro.com",rfc:"MIC2301268S5",repse:"AR42119/2022-11-24"};

/* ─── LEGAL BLOCKS ───────────────────────────────────────────────────────────── */
const ALCANCES_DEFAULT=["Asignación de un supervisor de proyecto para coordinar las actividades, quien se asegurará que los trabajos sean ejecutados de manera expedita y apegados a los manuales, instructivos o códigos de prácticas aplicables a la actividad y siguiendo las reglas de seguridad para personal y equipo.","Durante el periodo de trabajo el supervisor a su consideración podrá disponer de los siguientes elementos para el manejo de los equipos: Personal especializado en el número adecuado laborando las jornadas de trabajo requerido por el volumen de obra indicado y con el equipo de protección personal necesario.","El supervisor de proyecto estará trabajando en todo momento en coordinación con los representantes, estableciendo entre las partes el procedimiento más adecuado para el desarrollo de los trabajadores, atendiendo las instrucciones y/o layout que se le otorguen y asegurándose de que no se efectúen desviaciones de dichas instrucciones sin la previa autorización del cliente.","Personal especializado para realizar actividades de acuerdo a su puesto de trabajo, de requerir que realice una actividad distinta a la solicitada se debe informar previamente para determinar si es apto para realizar dicha actividad.","Ejecución de actividades exclusivamente por personal calificado conforme a su perfil y puesto de trabajo.","Es responsabilidad de MICSA cumplir con el reglamento interno de planta.","Es responsabilidad de MICSA portar la herramienta adecuada para cada actividad asignada, así como equipo de protección personal requerido.","Toma de fotografías en caso de requerirse, únicamente para elaborar reportes de trabajo.","El supervisor de seguridad industrial por parte de MICSA asegurará el cumplimiento de los estándares de seguridad requeridos durante todo el evento.","Planeación, coordinación, control documental y reportes del proyecto.","Seguro de Responsabilidad Civil vigente durante toda la ejecución del servicio.","Es responsabilidad exclusiva del personal del cliente entregar los equipos de operación y el área libre de material de producción.","Brindar asistencia permanente del personal durante todo el evento y así mismo un representante del cliente para que aclare cualquier duda relacionada con las actividades, permisos de trabajo, liberación de área, documentación, solicitudes administrativas entre otros."];
const INCLUYE_DEFAULT=["Mano de obra especializada para trabajos mecánicos y maniobras.","Supervisión operativa y coordinación de proyecto en sitio.","Herramienta necesaria para la correcta ejecución del alcance.","Viáticos y hospedaje del personal asignado.","Traslados y logística del personal.","Incluye Seguro de Responsabilidad vigente.","Constancia de habilidades DC3."];
const EXCLUYE_DEFAULT=["No incluye instalación de servicios.","No incluye suministro de materiales eléctricos, mecánicos o estructurales.","No incluye obra civil, adecuaciones o refuerzos estructurales.","No incluye el suministro ni la renta de equipos tales como; montacargas, grúas o cualquier equipo de izaje.","No incluye puesta en marcha, pruebas en caliente o validaciones de procesos productivos."];
const NOTA_SUP=`El uso y funcionamiento del equipo de montaje de MICSA pueden causar daños a las superficies de suelo y/o estructuras de soporte. Por lo tanto, es responsabilidad del cliente asegurar que los pisos y/o estructuras son capaces de soportar los equipos y las cargas en el proceso.\n\nEl cliente asume toda la responsabilidad y el riesgo de cualquier daño que pueda ocurrir al centro de destino; Pavimento, pasillos, pisos y cualquier otra superficie incluida estructuras de soportes causados por cualquier equipo proporcionado por MICSA.\n\nEl cliente debe asegurarse de que dichas superficies son adecuadas de soportar el peso de todo el equipo para realizar el montaje traslado o descarga de los componentes a instalar. Si se requiere placa de acero o cualquier otro tipo de superficie o de otro tipo de protección en las superficies a trabajar, el cliente debe solicitar antes de realizar cualquier servicio para proporcionar un presupuesto por separado.\n\nMICSA EXPRESAMENTE RECHAZA Y NO ASUME NINGUNA RESPONSABILIDAD, Y/O RIESGO DE CUALQUIER DAÑO QUE PUEDA OCURRIR A CUALQUIERA DE LAS SUPERFICIES.`;
const COND_DEFAULT=["En caso de que se nos originen tiempos muertos, maniobras dobles o en falso por: suspensión de actividades, interferencias en el área, falta de equipos o falta de supervisión por parte de CLIENTE se deberán cuantificar los tiempos para ser costeados de forma adicional, así mismo el tiempo de entrega se vuelve indefinido.","La presente cotización ha sido generada en base un plan de actividades para realizarse de forma continua, cualquier aplazamiento o reprogramación de las actividades se debe informar inmediatamente para determinar los costos adicionales que este implique.","Horario considerado lunes a sábado de 8:00 a 18:00, horario extraordinario al estipulado y actividades en día domingo tiene un costo adicional lo cual se debe solicitar previamente.","Cualquier actividad no contemplada en esta propuesta serán consideradas como adicional.","En caso de que sea requerido asistir a cursos de inducción, capacitaciones o exámenes médicos por parte de la empresa cliente antes del inicio del proyecto, el tiempo invertido, así como traslados, viáticos y gastos relacionados, no están considerados en esta cotización y serán cotizados como costo adicional.","En caso de retraso en el pago del monto correspondiente a esta cotización, se aplicará un interés moratorio del 5% semanal sobre el saldo insoluto. Este interés comenzará a generarse a partir del día siguiente a la fecha de finalización de los trabajos contratados, independientemente de la fecha en que se emita la factura, la orden de compra, o cualquier otro documento administrativo. La aceptación de esta cotización implica el reconocimiento de la fecha de conclusión de los trabajos como el inicio del cómputo para el plazo de pago y para la generación del interés moratorio. La empresa contratante acepta que los procesos internos, administrativos o de autorización no suspenden ni modifican el inicio del cómputo del interés pactado.","La presente cotización deberá formar parte integral del pedido, orden de compra o contrato que resulte de la transacción."];

/* ─── DOCUMENT TYPES ─────────────────────────────────────────────────────────── */
const DOC_TYPES=[
  {id:"bitacora",label:"Bitácora Diaria",icon:"📋",color:BLUE},
  {id:"cotizacion",label:"Cotización Formal",icon:"💼",color:GOLD},
  {id:"costos_adicionales",label:"Costos Adicionales",icon:"➕",color:"#2d6a4f"},
  {id:"checklist_izaje",label:"Checklist Izaje",icon:"🔗",color:RED},
  {id:"orden_trabajo",label:"Orden de Trabajo",icon:"🔧",color:"#6b46c1"},
  {id:"contrato",label:"Contrato de Servicios",icon:"📜",color:NAVY},
  {id:"requisicion",label:"Requisición de Material",icon:"📦",color:"#c05621"},
  {id:"entrega_epp",label:"Entrega de EPP",icon:"🪖",color:"#2b6cb0"},
  {id:"plan_izaje",label:"Plan de Izaje",icon:"🏗️",color:"#276749"},
  {id:"reporte_avance",label:"Reporte de Avance",icon:"📊",color:"#553c9a"},
];

/* ─── SCHEMAS ────────────────────────────────────────────────────────────────── */
const SCHEMAS={
  bitacora:{title:"Bitácora de Registro de Actividades Diarias",sections:[
    {label:"Información General",fields:[
      {key:"proyecto",label:"Proyecto / ET",type:"text",placeholder:"Especifica técnica 43766"},
      {key:"supervisor",label:"Supervisor de Proyecto",type:"text",placeholder:"Ángel Rodríguez"},
      {key:"fecha",label:"Fecha",type:"date"},
      {key:"area",label:"Área de Trabajo",type:"text",placeholder:"IRONCAST DE FRONTERA"},
      {key:"hora_inicio",label:"Hora Inicio",type:"time"},
      {key:"hora_fin",label:"Hora Fin",type:"time"},
      {key:"num_personas",label:"No. Personas",type:"number",placeholder:"6"},
      {key:"folio",label:"Folio",type:"text",placeholder:"GM-IRM-001"},
    ]},
    {label:"Permisos de Trabajo",fields:[
      {key:"permiso_caliente",label:"Trabajo en Caliente (folio)",type:"text",placeholder:"N/A"},
      {key:"permiso_rojo",label:"Trabajo Rojo (folio)",type:"text",placeholder:"N/A"},
      {key:"permiso_alturas",label:"Trabajo en Alturas (folio)",type:"text",placeholder:"N/A"},
    ]},
    {label:"Actividades",fields:[
      {key:"resumen",label:"Resumen Ejecutivo",type:"textarea",rows:3,placeholder:"Descripción general de las actividades del día..."},
      {key:"actividades",label:"Actividades Detalladas",type:"activities"},
      {key:"resumen_actividades",label:"Resumen de Actividades",type:"textarea",rows:2},
    ]},
    {label:"📷 Evidencia Fotográfica",fields:[
      {key:"photos",label:"Fotos",type:"photos"},
    ]},
    {label:"Firmas",fields:[
      {key:"supervisor_micsa",label:"Supervisor Grupo MICSA",type:"text"},
      {key:"usuario_cliente",label:"Nombre y firma Usuario por Cliente",type:"text"},
    ]},
  ]},
  cotizacion:{title:"Cotización de Servicios",sections:[
    {label:"Datos del Documento",fields:[
      {key:"cot_num",label:"N° Cotización",type:"text",placeholder:"028"},
      {key:"fecha",label:"Fecha",type:"date"},
    ]},
    {label:"Datos del Cliente",fields:[
      {key:"cliente",label:"Cliente",type:"text",placeholder:"FORZA STEEL"},
      {key:"planta",label:"Planta",type:"text",placeholder:"FORZA STEEL"},
      {key:"direccion_cliente",label:"Dirección",type:"text",placeholder:"Salinas Victoria, N.L."},
      {key:"atencion",label:"Atención",type:"text",placeholder:"Ing. Ángel Morales"},
      {key:"contacto",label:"Contacto / Tel",type:"text"},
      {key:"correo_cliente",label:"Correo",type:"text",placeholder:"contacto@empresa.com"},
      {key:"referencia",label:"Referencia",type:"text",placeholder:"Servicio."},
    ]},
    {label:"Servicio",fields:[
      {key:"actividad",label:"Actividad (título del servicio)",type:"textarea",rows:2,placeholder:"SERVICIO DE ALINEACIÓN Y PRE-NIVELACIÓN."},
      {key:"descripcion_personal",label:"Descripción del personal",type:"textarea",rows:3,placeholder:"Soporte de personal supervisor de proyecto (1), supervisor de seguridad (1), mecánicos (5)..."},
      {key:"intro_carta",label:"Intro carta personalizada (vaciar = auto-generar)",type:"textarea",rows:3},
      {key:"alcance_especifico",label:"Alcance específico (se añade al final de los generales)",type:"textarea",rows:2,placeholder:"Alineación y pre-nivelación de 5 máquinas de línea enderezadora..."},
    ]},
    {label:"Precio",fields:[
      {key:"monto_usd",label:"Monto USD (sin IVA)",type:"number",placeholder:"13805.00"},
      {key:"monto_mxn",label:"Monto MXN (sin IVA, alternativo)",type:"number"},
      {key:"descripcion_precio",label:"Descripción en tabla de precio",type:"text",placeholder:"SERVICIO DE ALINEACIÓN Y PRE-NIVELACIÓN"},
    ]},
    {label:"✅ Incluye",fields:[{key:"incluye_custom",label:"",type:"list_editor",defaults:INCLUYE_DEFAULT}]},
    {label:"❌ Exclusiones",fields:[{key:"excluye_custom",label:"",type:"list_editor",defaults:EXCLUYE_DEFAULT}]},
    {label:"📋 Alcances Generales",fields:[{key:"alcances_custom",label:"",type:"list_editor",defaults:ALCANCES_DEFAULT}]},
    {label:"Formas de Pago",fields:[
      {key:"forma_pago",label:"Forma de pago",type:"textarea",rows:2,placeholder:"50% de anticipo.\n50% al finalizar proyecto."},
      {key:"tiempo_entrega",label:"Tiempo de entrega",type:"text",placeholder:"Se está considerando elaborar un plan de actividades..."},
      {key:"dias_anticipacion",label:"Días anticipación OC",type:"text",placeholder:"7"},
      {key:"vigencia",label:"Vigencia",type:"text",placeholder:"15 días"},
      {key:"base_info",label:"Base de info (frase 1 de formas de pago)",type:"textarea",rows:2,placeholder:"obtenida en el recorrido realizado con su supervisión de acuerdo al RFQ-..."},
    ]},
  ]},
  costos_adicionales:{title:"Alcance de Servicios Adicionales",sections:[
    {label:"Datos",fields:[
      {key:"cliente",label:"Cliente",type:"text"},
      {key:"planta",label:"Planta",type:"text"},
      {key:"atencion",label:"Atención",type:"text"},
      {key:"referencia",label:"Referencia",type:"text"},
      {key:"fecha",label:"Fecha",type:"date"},
    ]},
    {label:"Servicios Adicionales",fields:[
      {key:"conceptos",label:"Conceptos adicionales",type:"cost_items"},
      {key:"notas",label:"Nota General",type:"textarea",rows:3,placeholder:"Los conceptos anteriores se consideran adicionales al alcance principal contratado."},
    ]},
  ]},
  checklist_izaje:{title:"Check List Elementos de Izaje",sections:[
    {label:"Información",fields:[
      {key:"elaboro",label:"Nombre de quien elaboró",type:"text"},
      {key:"departamento",label:"Departamento",type:"text"},
      {key:"responsable",label:"Responsable",type:"text"},
      {key:"fecha",label:"Fecha",type:"date"},
      {key:"proyecto",label:"Proyecto",type:"text"},
    ]},
    {label:"Eslingas Sintéticas",fields:[
      {key:"eslinga_num",label:"N° de Eslinga",type:"text"},
      {key:"eslinga_items",label:"Inspección",type:"checklist",items:["Hebras cortadas","Torceduras","Cortaduras","Tiene etiqueta de carga máxima","Almacenamiento correcto","Nudos presentes en la eslinga","Uniones rotas o desgastadas","Se encuentra en buen estado la protección del ojo","Quemaduras visibles","Roturas, cortes o astillamiento"]},
    ]},
    {label:"Cadenas",fields:[
      {key:"cadena_num",label:"N° de Cadena",type:"text"},
      {key:"cadena_items",label:"Inspección",type:"checklist",items:["Elongación causada por estiramiento","Eslabones distorsionados o dañados","Presenta corrosión general","Almacenamiento correcto","Eslabones torcidos","Tiene marca de carga máxima","Cuenta con seguro de gancho","Se realiza revisión de ganchos","Trizaduras en partes soldadas","Ojos o eslabones desgastados"]},
    ]},
    {label:"Grilletes",fields:[
      {key:"grillete_num",label:"N° de Grillete",type:"text"},
      {key:"grillete_items",label:"Inspección",type:"checklist",items:["Se realiza limpieza general","Hilos en buenas condiciones","Perno en buenas condiciones","Tiene rotulación de carga","No se cuenta con fisuras"]},
    ]},
    {label:"Observaciones",fields:[
      {key:"observaciones",label:"Observaciones Generales",type:"textarea",rows:3},
    ]},
  ]},
  orden_trabajo:{title:"Orden de Trabajo",sections:[
    {label:"Datos Generales",fields:[
      {key:"ot_num",label:"N° OT",type:"text",placeholder:"OT-2026-001"},
      {key:"fecha",label:"Fecha",type:"date"},
      {key:"cliente",label:"Cliente",type:"text"},
      {key:"planta",label:"Planta / Área",type:"text"},
      {key:"solicitante",label:"Solicitante",type:"text"},
      {key:"prioridad",label:"Prioridad",type:"select",options:["Normal","Urgente","Crítica"]},
    ]},
    {label:"Descripción del Trabajo",fields:[
      {key:"descripcion",label:"Descripción del trabajo a realizar",type:"textarea",rows:4},
      {key:"equipo",label:"Equipo / Maquinaria involucrada",type:"text"},
      {key:"herramienta",label:"Herramienta / Equipo necesario",type:"textarea",rows:2},
      {key:"personal",label:"Personal asignado",type:"text"},
      {key:"tiempo_est",label:"Tiempo estimado",type:"text",placeholder:"4 horas"},
    ]},
    {label:"Seguridad",fields:[
      {key:"epp_requerido",label:"EPP requerido",type:"textarea",rows:2},
      {key:"permisos",label:"Permisos necesarios",type:"text"},
      {key:"riesgos",label:"Riesgos identificados",type:"textarea",rows:2},
    ]},
    {label:"Cierre",fields:[
      {key:"supervisor_cierre",label:"Supervisor que cierra",type:"text"},
      {key:"observaciones_cierre",label:"Observaciones al cierre",type:"textarea",rows:2},
    ]},
  ]},
  contrato:{title:"Contrato de Prestación de Servicios Especializados",sections:[
    {label:"Partes",fields:[
      {key:"contratante",label:"Contratante (Razón Social)",type:"text"},
      {key:"rep_contratante",label:"Representante Legal Contratante",type:"text"},
      {key:"contrato_num",label:"Número de Contrato",type:"text",placeholder:"MICSA-2026-001"},
      {key:"fecha_inicio",label:"Fecha Inicio",type:"date"},
      {key:"fecha_fin",label:"Fecha Fin",type:"date"},
      {key:"lugar",label:"Lugar de Ejecución",type:"text"},
    ]},
    {label:"Objeto del Contrato",fields:[
      {key:"objeto",label:"Descripción del Servicio",type:"textarea",rows:4},
      {key:"alcance",label:"Alcance Específico",type:"textarea",rows:3},
    ]},
    {label:"Condiciones Económicas",fields:[
      {key:"monto",label:"Monto Total (MXN, sin IVA)",type:"text",placeholder:"$500,000.00"},
      {key:"forma_pago",label:"Forma de Pago",type:"textarea",rows:2,placeholder:"50% anticipo, 50% al término"},
      {key:"incluye",label:"El monto incluye",type:"textarea",rows:2},
      {key:"no_incluye",label:"El monto NO incluye",type:"textarea",rows:2},
    ]},
    {label:"Condiciones Generales",fields:[
      {key:"vigencia",label:"Vigencia del contrato",type:"text",placeholder:"60 días naturales"},
      {key:"garantia",label:"Garantía / Seguro RC",type:"text",placeholder:"$1,000,000 USD póliza RC"},
      {key:"condiciones_extra",label:"Condiciones adicionales",type:"textarea",rows:3},
    ]},
  ]},
  requisicion:{title:"Requisición de Materiales / Herramienta",sections:[
    {label:"Datos",fields:[
      {key:"req_num",label:"N° Requisición",type:"text",placeholder:"REQ-2026-001"},
      {key:"fecha",label:"Fecha",type:"date"},
      {key:"proyecto",label:"Proyecto",type:"text"},
      {key:"solicitante",label:"Solicitado por",type:"text"},
      {key:"prioridad",label:"Urgencia",type:"select",options:["Normal","Urgente","Inmediata"]},
    ]},
    {label:"Materiales Solicitados",fields:[
      {key:"items_req",label:"Artículos",type:"req_items"},
      {key:"uso",label:"Uso / Destino",type:"text"},
      {key:"notas",label:"Observaciones",type:"textarea",rows:2},
    ]},
  ]},
  entrega_epp:{title:"Constancia de Entrega de EPP",sections:[
    {label:"Datos del Trabajador",fields:[
      {key:"nombre_trabajador",label:"Nombre del Trabajador",type:"text"},
      {key:"puesto",label:"Puesto",type:"text",placeholder:"Mecánico Industrial"},
      {key:"proyecto",label:"Proyecto",type:"text"},
      {key:"fecha",label:"Fecha de Entrega",type:"date"},
    ]},
    {label:"EPP Entregado",fields:[
      {key:"epp_items",label:"Artículos entregados",type:"epp_items"},
      {key:"condicion",label:"Condición del EPP",type:"select",options:["Nuevo","Reposición","Intercambio"]},
      {key:"motivo",label:"Motivo de entrega",type:"text"},
    ]},
    {label:"Acuse",fields:[
      {key:"supervisor_entrega",label:"Entregado por (supervisor)",type:"text"},
      {key:"nota",label:"El trabajador declara haber recibido el EPP en buen estado y se compromete a usarlo correctamente.",type:"info"},
    ]},
  ]},
  plan_izaje:{title:"Plan de Izaje / Maniobra de Carga",sections:[
    {label:"Información General",fields:[
      {key:"proyecto",label:"Proyecto",type:"text"},
      {key:"fecha",label:"Fecha",type:"date"},
      {key:"area",label:"Área de Ejecución",type:"text"},
      {key:"responsable_izaje",label:"Responsable de Maniobra",type:"text"},
      {key:"tipo_izaje",label:"Tipo de Izaje",type:"select",options:["Simple","Tándem","Crítico","Super Crítico"]},
    ]},
    {label:"Datos de la Carga",fields:[
      {key:"descripcion_carga",label:"Descripción de la Carga",type:"text",placeholder:"Motor eléctrico 500 HP"},
      {key:"peso_carga",label:"Peso (kg)",type:"number"},
      {key:"dimensiones",label:"Dimensiones (L x A x H)",type:"text",placeholder:"3.5m x 1.2m x 1.8m"},
      {key:"centro_gravedad",label:"Centro de Gravedad",type:"text"},
    ]},
    {label:"Equipo de Izaje",fields:[
      {key:"grua_tipo",label:"Tipo de Grúa / Equipo",type:"text",placeholder:"Grúa hidráulica 40 ton"},
      {key:"capacidad_equipo",label:"Capacidad del Equipo",type:"text"},
      {key:"accesorios",label:"Accesorios de Izaje",type:"textarea",rows:2},
      {key:"factor_dinamico",label:"Factor Dinámico aplicado",type:"text",placeholder:"1.10 (90% capacidad)"},
    ]},
    {label:"Procedimiento y Seguridad",fields:[
      {key:"procedimiento",label:"Procedimiento paso a paso",type:"textarea",rows:4},
      {key:"spotter",label:"Nombre del Spotter Permanente",type:"text"},
      {key:"zona_exclusion",label:"Zona de exclusión definida",type:"select",options:["Sí","No"]},
      {key:"loto_aplicado",label:"LOTO aplicado",type:"select",options:["Sí","No","N/A"]},
      {key:"riesgos_izaje",label:"Riesgos identificados",type:"textarea",rows:2},
    ]},
  ]},
  reporte_avance:{title:"Reporte de Avance de Proyecto",sections:[
    {label:"Datos del Proyecto",fields:[
      {key:"proyecto",label:"Proyecto",type:"text"},
      {key:"cliente",label:"Cliente",type:"text"},
      {key:"periodo",label:"Período del Reporte",type:"text",placeholder:"Semana 1 - Enero 2026"},
      {key:"fecha",label:"Fecha",type:"date"},
      {key:"supervisor",label:"Supervisor",type:"text"},
    ]},
    {label:"Indicadores",fields:[
      {key:"avance_pct",label:"Avance Global (%)",type:"number",placeholder:"65"},
      {key:"personal_activo",label:"Personal activo",type:"number"},
      {key:"horas_trabajadas",label:"Horas trabajadas",type:"number"},
      {key:"incidentes",label:"Incidentes / Accidentes",type:"text",placeholder:"0 - Cero incidentes"},
    ]},
    {label:"Actividades",fields:[
      {key:"realizadas",label:"Actividades realizadas en el período",type:"textarea",rows:4},
      {key:"proximas",label:"Actividades programadas próximo período",type:"textarea",rows:3},
      {key:"pendientes",label:"Pendientes / Bloqueos",type:"textarea",rows:2},
    ]},
    {label:"Recursos",fields:[
      {key:"equipos_utilizados",label:"Equipos utilizados",type:"textarea",rows:2},
      {key:"materiales_usados",label:"Materiales / Consumibles",type:"textarea",rows:2},
      {key:"observaciones",label:"Observaciones Generales",type:"textarea",rows:3},
    ]},
  ]},
};

/* ─── HELPERS ────────────────────────────────────────────────────────────────── */
const today=()=>new Date().toISOString().split("T")[0];
const fmtDate=d=>{if(!d)return"___";const[y,m,day]=d.split("-");return`${day}/${m}/${y}`;};
const fmtMXN=n=>"$"+parseFloat(n||0).toLocaleString("es-MX",{minimumFractionDigits:2});
const LETTERS="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const inp={fontFamily:"'IBM Plex Mono',monospace",fontSize:"12px",padding:"7px 10px",border:"1px solid #d1d9e0",borderRadius:"4px",width:"100%",boxSizing:"border-box",background:"#fafbfc",color:"#1a202c",outline:"none"};
const tdL={border:"1px solid #999",padding:"5px 10px",background:"#f0f4f8",fontWeight:"600",fontSize:"11px"};
const tdV={border:"1px solid #999",padding:"5px 10px",fontSize:"11px"};

/* ─── PRINT HEADER/FOOTER ────────────────────────────────────────────────────── */
function PHeader({cotNum,fecha}){
  return(
    <div style={{borderBottom:"2px solid "+NAVY,paddingBottom:"10px",marginBottom:"12px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        <div style={{background:NAVY,color:"white",fontWeight:"900",fontSize:"15px",padding:"5px 12px",borderRadius:"4px",letterSpacing:"0.1em",fontFamily:"'Barlow Condensed',sans-serif"}}>MICSA</div>
        <div style={{fontSize:"8px",color:"#666",lineHeight:"1.5",textTransform:"uppercase",letterSpacing:"0.05em"}}>
          <div style={{fontWeight:"700",color:NAVY,fontSize:"9px"}}>Tu Socio Estratégico en</div>
          <div>Instalación de Maquinaria</div>
        </div>
      </div>
      <div style={{textAlign:"right",fontSize:"9px",lineHeight:"1.8",color:"#444"}}>
        {fecha&&<div style={{fontWeight:"700",fontSize:"10px",color:NAVY}}>Monclova Coahuila a {fmtDate(fecha)}</div>}
        <div>RFC: {MI.rfc}</div>
        {cotNum&&<div style={{fontWeight:"800",color:RED,fontSize:"10px"}}>COTIZACIÓN. {cotNum}</div>}
      </div>
    </div>
  );
}
function BHeader({title}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"2px solid "+NAVY,paddingBottom:"10px",marginBottom:"12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        <div style={{background:NAVY,color:"white",fontWeight:"900",fontSize:"15px",padding:"5px 12px",borderRadius:"4px",letterSpacing:"0.1em",fontFamily:"'Barlow Condensed',sans-serif"}}>MICSA</div>
        <div style={{fontSize:"8px",color:"#666",lineHeight:"1.5",textTransform:"uppercase"}}>
          <div style={{fontWeight:"700",color:NAVY,fontSize:"9px"}}>Tu Socio Estratégico en</div>
          <div>Instalación de Maquinaria</div>
        </div>
      </div>
      <div style={{textAlign:"center",flex:1,padding:"0 16px"}}>
        <div style={{fontWeight:"800",fontSize:"13px",color:NAVY,textTransform:"uppercase",letterSpacing:"0.08em",fontFamily:"'Barlow Condensed',sans-serif"}}>{title}</div>
      </div>
      <div style={{textAlign:"right",fontSize:"8px",color:"#666",lineHeight:"1.6"}}>
        <div>REPSE: {MI.repse}</div>
        <div>{MI.tel1} | {MI.tel2}</div>
        <div>{MI.email}</div>
      </div>
    </div>
  );
}
function PFooter(){
  return(
    <div style={{background:NAVY,color:"white",padding:"6px 16px",display:"flex",justifyContent:"space-between",fontSize:"8px",marginTop:"auto",flexWrap:"wrap",gap:"4px"}}>
      <span>{MI.dir}</span>
      <span>Cel- {MI.tel1} | Cel- {MI.tel2}</span>
      <span>{MI.email} | {MI.web} | {MI.emailJ}</span>
    </div>
  );
}

/* ─── PREVIEW: COTIZACIÓN (exact COT-028 format) ─────────────────────────────── */
function PreviewCot({d}){
  const monto=d.monto_usd?`$${parseFloat(d.monto_usd).toLocaleString("en-US",{minimumFractionDigits:2})} USD MAS IVA`:d.monto_mxn?fmtMXN(d.monto_mxn)+" MAS IVA":"—";
  const alcances=d.alcances_custom||ALCANCES_DEFAULT;
  const incluye=d.incluye_custom||INCLUYE_DEFAULT;
  const excluye=d.excluye_custom||EXCLUYE_DEFAULT;
  return(
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"11px",color:"#111",background:"white",display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <div style={{padding:"16px 20px",flex:1}}>
        <PHeader cotNum={d.cot_num} fecha={d.fecha}/>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:"14px",fontSize:"11px"}}>
          <tbody>
            <tr><td style={tdL}>Cliente:</td><td style={tdV}>{d.cliente||"___"}</td><td style={tdL}>Referencia: {d.referencia||"Servicio."}</td></tr>
            <tr><td style={tdL}>Dirección</td><td style={tdV}>{d.direccion_cliente||"___"}</td><td style={tdV}>Planta: {d.planta||"___"}</td></tr>
            <tr><td style={tdL}>Atención.</td><td style={tdV}>{d.atencion||"___"}</td><td style={tdV} rowSpan={3}><em>{d.actividad||"___"}</em></td></tr>
            <tr><td style={tdL}>Contacto</td><td style={tdV}>{d.contacto||""}</td></tr>
            <tr><td style={tdL}>Correo.</td><td style={tdV}>{d.correo_cliente||""}</td></tr>
          </tbody>
        </table>
        <p style={{margin:"0 0 12px",lineHeight:"1.8",textAlign:"justify"}}>
          Estimado cliente:<br/><br/>
          {d.intro_carta||`En respuesta a su amable solicitud, le presentamos nuestro presupuesto por los servicios de ${d.actividad||"[actividad]"} en planta ${d.planta||"[planta]"} ${d.direccion_cliente||""}.`}
        </p>
        {d.descripcion_personal&&<div style={{marginBottom:"12px"}}><div style={{fontWeight:"800",marginBottom:"4px"}}>DESCRIPCIÓN.</div><p style={{margin:0,lineHeight:"1.7",textAlign:"justify"}}>{d.descripcion_personal}</p></div>}
        <div style={{fontWeight:"800",textAlign:"center",marginBottom:"8px",textTransform:"uppercase",fontSize:"12px",letterSpacing:"0.06em"}}>I. ALCANCES GENERALES</div>
        <div style={{marginBottom:"14px"}}>
          {alcances.map((a,i)=>(
            <div key={i} style={{display:"flex",gap:"8px",marginBottom:"5px",lineHeight:"1.6",textAlign:"justify"}}>
              <span style={{fontWeight:"700",flexShrink:0}}>{LETTERS[i]}.</span><span>{a}</span>
            </div>
          ))}
          {d.alcance_especifico&&<div style={{display:"flex",gap:"8px",marginBottom:"5px",lineHeight:"1.6"}}><span style={{fontWeight:"700",flexShrink:0}}>{LETTERS[alcances.length]}.</span><span>{d.alcance_especifico}</span></div>}
        </div>
        <div style={{fontWeight:"800",textAlign:"center",marginBottom:"8px",textTransform:"uppercase",fontSize:"12px",letterSpacing:"0.06em"}}>SIENDO NUESTRO PRECIO EL SIGUIENTE</div>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:"8px"}}>
          <thead><tr style={{background:NAVY,color:"white"}}>
            <th style={{padding:"7px 12px",textAlign:"left",fontSize:"11px"}}>DESCRIPCIÓN</th>
            <th style={{padding:"7px 12px",textAlign:"center",fontSize:"11px",width:"130px"}}>LÍNEA-ESTACIÓN</th>
            <th style={{padding:"7px 12px",textAlign:"right",fontSize:"11px",width:"190px"}}>COSTO</th>
          </tr></thead>
          <tbody><tr>
            <td style={{border:"1px solid #ccc",padding:"8px 12px",fontStyle:"italic",fontWeight:"600"}}>{d.descripcion_precio||d.actividad||"___"}</td>
            <td style={{border:"1px solid #ccc",padding:"8px 12px",textAlign:"center"}}>PLANTA.</td>
            <td style={{border:"1px solid #ccc",padding:"8px 12px",textAlign:"right",fontWeight:"800"}}>{monto}</td>
          </tr></tbody>
        </table>
        {d.monto_usd&&<div style={{textAlign:"center",fontStyle:"italic",fontWeight:"600",marginBottom:"12px",fontSize:"10px"}}>({parseFloat(d.monto_usd).toLocaleString("es-MX")} DÓLARES MÁS IVA)</div>}
        <div style={{fontWeight:"800",marginBottom:"5px"}}>LA PRESENTE COTIZACIÓN INCLUYE:</div>
        <div style={{marginBottom:"12px",paddingLeft:"8px"}}>{incluye.map((it,i)=><div key={i} style={{lineHeight:"1.8"}}>{it}</div>)}</div>
        <div style={{fontWeight:"800",marginBottom:"5px"}}>EXCLUSIÓN:</div>
        <div style={{marginBottom:"14px",paddingLeft:"8px"}}>{excluye.map((ex,i)=><div key={i} style={{lineHeight:"1.8"}}>{i+1}.- {ex}</div>)}</div>
        <div style={{marginBottom:"14px"}}>
          <div style={{fontWeight:"800",textAlign:"center",marginBottom:"6px"}}>NOTA.</div>
          {NOTA_SUP.split("\n\n").map((p,i)=>(
            <p key={i} style={{margin:"0 0 8px",lineHeight:"1.7",textAlign:"justify",fontSize:"10px",fontWeight:p.startsWith("MICSA EXPRESAMENTE")?"700":"400",fontStyle:p.startsWith("MICSA EXPRESAMENTE")?"italic":"normal"}}>{p}</p>
          ))}
        </div>
        <div style={{marginBottom:"14px",fontSize:"10px",lineHeight:"1.7"}}>
          {COND_DEFAULT.map((c,i)=>(
            <div key={i} style={{marginBottom:"4px",display:"flex",gap:"6px"}}><span style={{flexShrink:0,fontWeight:"700"}}>{i+1}.-</span><span>{c}</span></div>
          ))}
        </div>
        <div style={{fontWeight:"800",marginBottom:"8px"}}>FORMAS DE PAGO:</div>
        <div style={{marginBottom:"16px",fontSize:"11px",lineHeight:"1.8"}}>
          <div><strong>1.</strong> La presente cotización está basada en la información verbal y/o escrita proporcionada por <strong>{d.cliente||"el cliente"}</strong>, {d.base_info||"obtenida en el recorrido realizado con su supervisión"} para el volumen total indicado, para ejecutarse de forma continua en un solo evento.</div>
          <div style={{marginTop:"6px"}}><strong>2.</strong> Forma de pago:<br/><span style={{paddingLeft:"20px",display:"block"}}>{d.forma_pago||"50% de anticipo.\n50% al finalizar proyecto."}</span></div>
          <div><strong>3.</strong> Tiempo de entrega: {d.tiempo_entrega||"Se está considerando elaborar un plan de actividades en conjunto con el cliente."}</div>
          <div><strong>4.</strong> Se solicitan {d.dias_anticipacion||"7"} días de anticipación a partir de la OC.</div>
          <div><strong>5.</strong> Vigencia: {d.vigencia||"15 días"}.</div>
        </div>
        <div style={{textAlign:"center",marginTop:"20px"}}>
          <div>Atentamente.</div><br/>
          <div style={{fontWeight:"800",letterSpacing:"0.06em",textTransform:"uppercase"}}>TU SOCIO ESTRATÉGICO EN INSTALACIÓN DE MAQUINARIA</div>
        </div>
      </div>
      <PFooter/>
    </div>
  );
}

/* ─── PREVIEW: BITÁCORA ──────────────────────────────────────────────────────── */
function PreviewBitacora({d}){
  const photos=d.photos||[];
  return(
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"11px",color:"#111",background:"white",display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <div style={{padding:"16px 20px",flex:1}}>
        <BHeader title="Bitácora de Registro de Actividades Diarias"/>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:"10px",fontSize:"11px"}}>
          <tbody>
            <tr><td style={tdL} colSpan={2}>Proyecto: {d.proyecto||"___"}</td><td style={tdL} colSpan={2}>Supervisor de Proyecto: {d.supervisor||"___"}</td></tr>
            <tr><td style={{...tdL,textAlign:"center",fontWeight:"800"}} colSpan={4}>INFORMACIÓN DEL TRABAJO</td></tr>
            <tr><td style={tdL}>Fecha</td><td style={tdV} colSpan={3}>{fmtDate(d.fecha)}</td></tr>
            <tr><td style={tdL}>Área de Trabajo</td><td style={tdV} colSpan={3}>{d.area||"___"}</td></tr>
            <tr><td style={tdL}>Horario</td><td style={tdV}>Inicio {d.hora_inicio||"___"}</td><td style={tdL}>No. Personas</td><td style={tdV}>{d.num_personas||"___"}</td></tr>
          </tbody>
        </table>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:"10px",fontSize:"11px"}}>
          <tbody>
            <tr><td style={{...tdL,textAlign:"center",fontWeight:"800"}} colSpan={3}>PERMISOS DE TRABAJO</td></tr>
            <tr><td style={tdL}><strong>Tipo de Permiso</strong></td><td style={tdL}><strong>Número/folio</strong></td><td style={tdL}><strong>Estado</strong></td></tr>
            <tr><td style={tdV}>Trabajo en Caliente</td><td style={tdV}>{d.permiso_caliente||"N/A"}</td><td style={tdV}>—</td></tr>
            {d.permiso_rojo&&<tr><td style={tdV}>Trabajo Rojo</td><td style={tdV}>{d.permiso_rojo}</td><td style={tdV}>—</td></tr>}
            {d.permiso_alturas&&<tr><td style={tdV}>Trabajo en Alturas</td><td style={tdV}>{d.permiso_alturas}</td><td style={tdV}>—</td></tr>}
          </tbody>
        </table>
        <div style={{border:"1px solid #999",padding:"8px 10px",marginBottom:"10px"}}>
          <div style={{fontWeight:"800",textAlign:"center",marginBottom:"4px"}}>RESUMEN DE ACTIVIDADES EJECUTADAS</div>
          <p style={{margin:0,lineHeight:"1.7",fontWeight:"600",textAlign:"justify"}}>{d.resumen||"—"}</p>
        </div>
        {(d.actividades||[]).length>0&&(
          <table style={{width:"100%",borderCollapse:"collapse",marginBottom:"10px",fontSize:"11px"}}>
            <thead><tr><td style={{...tdL,textAlign:"center",fontWeight:"800"}} colSpan={2}>ACTIVIDADES DETALLADAS</td></tr></thead>
            <tbody>{(d.actividades||[]).map((a,i)=>(
              <tr key={i}><td style={{...tdL,width:"200px",fontWeight:"700"}}>{a.titulo}</td><td style={tdV}>{a.descripcion}</td></tr>
            ))}</tbody>
          </table>
        )}
        {d.resumen_actividades&&<div style={{border:"1px solid #999",padding:"8px 10px",marginBottom:"10px"}}><div style={{fontWeight:"800",textAlign:"center",marginBottom:"4px"}}>RESUMEN DE ACTIVIDADES</div><p style={{margin:0,lineHeight:"1.7"}}>{d.resumen_actividades}</p></div>}
        {photos.length>0&&(
          <div style={{border:"1px solid #999",padding:"8px 10px",marginBottom:"10px"}}>
            <div style={{fontWeight:"800",textAlign:"center",marginBottom:"8px"}}>Evidencia Fotográfica</div>
            <div style={{display:"grid",gridTemplateColumns:photos.length===1?"1fr":photos.length===2?"1fr 1fr":"1fr 1fr 1fr",gap:"6px"}}>
              {photos.slice(0,6).map((src,i)=>(
                <div key={i} style={{aspectRatio:"4/3",overflow:"hidden",borderRadius:"3px",border:"1px solid #ddd"}}>
                  <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                </div>
              ))}
            </div>
            {photos.length>6&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"6px",marginTop:"6px"}}>
              {photos.slice(6).map((src,i)=>(
                <div key={i} style={{aspectRatio:"4/3",overflow:"hidden",borderRadius:"3px",border:"1px solid #ddd"}}>
                  <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                </div>
              ))}
            </div>}
          </div>
        )}
        <table style={{width:"100%",borderCollapse:"collapse",marginTop:"16px",fontSize:"11px"}}>
          <tbody><tr>
            <td style={{border:"1px solid #999",padding:"32px 16px 8px",textAlign:"center",width:"40%"}}>Supervisor Grupo MICSA:<br/><br/>{d.supervisor_micsa||""}</td>
            <td style={{border:"1px solid #999",padding:"8px",textAlign:"center",width:"20%",fontWeight:"700",background:"#f9f9f9"}}>Folio: {d.folio||"___"}</td>
            <td style={{border:"1px solid #999",padding:"32px 16px 8px",textAlign:"center",width:"40%"}}>Nombre y firma Usuario por Cliente:<br/><br/>{d.usuario_cliente||""}</td>
          </tr></tbody>
        </table>
      </div>
      <PFooter/>
    </div>
  );
}

/* ─── PREVIEW: COSTOS ADICIONALES ───────────────────────────────────────────── */
function PreviewCostosAd({d}){
  const items=d.conceptos||[];
  const total=items.reduce((s,it)=>s+(parseFloat(it.costo)||0),0);
  return(
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"11px",color:"#111",background:"white",display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <div style={{padding:"16px 20px",flex:1}}>
        <BHeader title="Alcance de Servicios Adicionales"/>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:"14px"}}>
          <tbody>
            <tr><td style={tdL}>Cliente:</td><td style={tdV}>{d.cliente||"___"}</td><td style={tdL}>Planta:</td><td style={tdV}>{d.planta||"___"}</td></tr>
            <tr><td style={tdL}>Atención:</td><td style={tdV}>{d.atencion||"___"}</td><td style={tdL}>Referencia:</td><td style={tdV}>{d.referencia||"___"}</td></tr>
            <tr><td style={tdL}>Fecha:</td><td style={tdV} colSpan={3}>{fmtDate(d.fecha)}</td></tr>
          </tbody>
        </table>
        <div style={{fontWeight:"800",textAlign:"center",marginBottom:"8px",textTransform:"uppercase",fontSize:"12px"}}>SIENDO NUESTRO PRECIO EL SIGUIENTE</div>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:"12px"}}>
          <thead><tr style={{background:NAVY,color:"white"}}>
            <th style={{padding:"7px 12px",textAlign:"left",fontSize:"11px"}}>DESCRIPCIÓN</th>
            <th style={{padding:"7px 12px",textAlign:"center",fontSize:"11px",width:"130px"}}>LÍNEA-ESTACIÓN</th>
            <th style={{padding:"7px 12px",textAlign:"right",fontSize:"11px",width:"150px"}}>COSTO</th>
          </tr></thead>
          <tbody>
            {items.map((it,i)=>(
              <tr key={i} style={{background:i%2===0?"#f8f9fa":"white"}}>
                <td style={{border:"1px solid #ddd",padding:"6px 12px",fontStyle:"italic"}}>{it.descripcion}</td>
                <td style={{border:"1px solid #ddd",padding:"6px 12px",textAlign:"center"}}>{it.linea||"PLANTA."}</td>
                <td style={{border:"1px solid #ddd",padding:"6px 12px",textAlign:"right",fontWeight:"700"}}>{fmtMXN(it.costo)}</td>
              </tr>
            ))}
            <tr style={{background:NAVY,color:"white"}}>
              <td colSpan={2} style={{padding:"7px 12px",fontWeight:"800"}}>TOTAL</td>
              <td style={{padding:"7px 12px",textAlign:"right",fontWeight:"900"}}>{fmtMXN(total)}</td>
            </tr>
          </tbody>
        </table>
        {d.notas&&<div style={{border:"1px solid #999",padding:"8px 10px",marginBottom:"12px"}}>
          <div style={{fontWeight:"800",textAlign:"center",marginBottom:"4px"}}>NOTA GENERAL</div>
          <p style={{margin:0,lineHeight:"1.7",textAlign:"justify"}}>{d.notas}</p>
        </div>}
        <div style={{textAlign:"center",marginTop:"20px"}}>
          <div>Atentamente.</div><br/>
          <div style={{fontWeight:"800",letterSpacing:"0.06em",textTransform:"uppercase"}}>TU SOCIO ESTRATÉGICO EN INSTALACIÓN DE MAQUINARIA</div>
        </div>
      </div>
      <PFooter/>
    </div>
  );
}

/* ─── PREVIEW: GENERIC ───────────────────────────────────────────────────────── */
function PreviewGeneric({d,docType}){
  const schema=SCHEMAS[docType];
  return(
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"11px",color:"#111",background:"white",display:"flex",flexDirection:"column",minHeight:"100%"}}>
      <div style={{padding:"16px 20px",flex:1}}>
        <BHeader title={schema.title}/>
        {schema.sections.map((sec,si)=>(
          <div key={si} style={{marginBottom:"14px"}}>
            <div style={{background:BLUE,color:"white",padding:"5px 10px",fontWeight:"700",fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"8px"}}>{sec.label}</div>
            {sec.fields.filter(f=>!["activities","cost_items","req_items","epp_items","checklist","info","photos","list_editor"].includes(f.type)).map((f,fi)=>(
              d[f.key]?(
                <div key={fi} style={{display:"flex",marginBottom:"4px",gap:"8px"}}>
                  <div style={{minWidth:"160px",fontWeight:"600",color:"#444",fontSize:"11px"}}>{f.label}:</div>
                  <div style={{fontSize:"11px",color:"#111"}}>{f.type==="date"?fmtDate(d[f.key]):d[f.key]}</div>
                </div>
              ):null
            ))}
            {sec.fields.filter(f=>f.type==="activities").map((f,fi)=>(
              (d[f.key]||[]).length?(
                <table key={fi} style={{width:"100%",borderCollapse:"collapse",marginTop:"6px"}}>
                  <tbody>{(d[f.key]||[]).map((a,i)=>(
                    <tr key={i}><td style={{...tdL,width:"200px",fontWeight:"700"}}>{a.titulo}</td><td style={tdV}>{a.descripcion}</td></tr>
                  ))}</tbody>
                </table>
              ):null
            ))}
            {sec.fields.filter(f=>f.type==="cost_items").map((f,fi)=>{
              const items=d[f.key]||[];
              if(!items.length)return null;
              const total=items.reduce((s,it)=>s+(parseFloat(it.costo)||0),0);
              return(<table key={fi} style={{width:"100%",borderCollapse:"collapse",marginTop:"6px"}}>
                <thead><tr style={{background:NAVY,color:"white"}}><th style={{padding:"6px 10px",textAlign:"left",fontSize:"11px"}}>Descripción</th><th style={{padding:"6px 10px",width:"130px",fontSize:"11px"}}>Línea</th><th style={{padding:"6px 10px",textAlign:"right",width:"120px",fontSize:"11px"}}>Costo</th></tr></thead>
                <tbody>
                  {items.map((it,i)=>(
                    <tr key={i} style={{background:i%2===0?"#f8f9fa":"white"}}>
                      <td style={{border:"1px solid #ddd",padding:"5px 10px",fontSize:"11px"}}>{it.descripcion}</td>
                      <td style={{border:"1px solid #ddd",padding:"5px 10px",fontSize:"11px"}}>{it.linea||"PLANTA."}</td>
                      <td style={{border:"1px solid #ddd",padding:"5px 10px",textAlign:"right",fontWeight:"700",fontSize:"11px"}}>{fmtMXN(it.costo)}</td>
                    </tr>
                  ))}
                  <tr style={{background:NAVY,color:"white"}}><td colSpan={2} style={{padding:"6px 10px",fontWeight:"800"}}>TOTAL</td><td style={{padding:"6px 10px",textAlign:"right",fontWeight:"900"}}>{fmtMXN(total)}</td></tr>
                </tbody>
              </table>);
            })}
            {sec.fields.filter(f=>f.type==="checklist").map((f,fi)=>{
              const state=d[f.key]||{};
              return(<table key={fi} style={{width:"100%",borderCollapse:"collapse",marginTop:"6px",fontSize:"10px"}}>
                <thead><tr style={{background:BLUE,color:"white"}}>
                  <th style={{padding:"5px 8px",textAlign:"left"}}>#</th>
                  <th style={{padding:"5px 8px",textAlign:"left"}}>Descripción</th>
                  <th style={{padding:"5px 8px",textAlign:"center",width:"50px"}}>✓</th>
                  <th style={{padding:"5px 8px",textAlign:"center",width:"50px"}}>✗</th>
                  <th style={{padding:"5px 8px",textAlign:"left"}}>Observaciones</th>
                </tr></thead>
                <tbody>{f.items.map((item,i)=>(
                  <tr key={i} style={{background:i%2===0?"white":"#f8f9fa"}}>
                    <td style={{border:"1px solid #ddd",padding:"4px 8px"}}>{i+1}</td>
                    <td style={{border:"1px solid #ddd",padding:"4px 8px"}}>{item}</td>
                    <td style={{border:"1px solid #ddd",padding:"4px 8px",textAlign:"center"}}>{state[i]==="ok"?"✓":""}</td>
                    <td style={{border:"1px solid #ddd",padding:"4px 8px",textAlign:"center"}}>{state[i]==="falla"?"✗":""}</td>
                    <td style={{border:"1px solid #ddd",padding:"4px 8px"}}>{state[`obs_${i}`]||""}</td>
                  </tr>
                ))}</tbody>
              </table>);
            })}
            {sec.fields.filter(f=>f.type==="epp_items").map((f,fi)=>{
              const items=d[f.key]||[];
              if(!items.length)return null;
              return(<div key={fi} style={{display:"flex",flexWrap:"wrap",gap:"6px",marginTop:"6px"}}>
                {items.map((epp,i)=><span key={i} style={{background:BLUE,color:"white",padding:"3px 10px",borderRadius:"20px",fontSize:"11px"}}>{epp}</span>)}
              </div>);
            })}
            {sec.fields.filter(f=>f.type==="req_items").map((f,fi)=>{
              const items=d[f.key]||[];
              if(!items.length)return null;
              return(<table key={fi} style={{width:"100%",borderCollapse:"collapse",marginTop:"6px",fontSize:"10px"}}>
                <thead><tr style={{background:BLUE,color:"white"}}><th style={{padding:"5px 8px"}}>Cant.</th><th style={{padding:"5px 8px"}}>Unidad</th><th style={{padding:"5px 8px",textAlign:"left"}}>Descripción</th><th style={{padding:"5px 8px",textAlign:"left"}}>Uso</th></tr></thead>
                <tbody>{items.map((it,i)=>(
                  <tr key={i} style={{background:i%2===0?"white":"#f8f9fa"}}>
                    <td style={{border:"1px solid #ddd",padding:"4px 8px",textAlign:"center"}}>{it.cantidad}</td>
                    <td style={{border:"1px solid #ddd",padding:"4px 8px",textAlign:"center"}}>{it.unidad}</td>
                    <td style={{border:"1px solid #ddd",padding:"4px 8px"}}>{it.descripcion}</td>
                    <td style={{border:"1px solid #ddd",padding:"4px 8px"}}>{it.uso}</td>
                  </tr>
                ))}</tbody>
              </table>);
            })}
          </div>
        ))}
        <div style={{marginTop:"40px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px"}}>
          {["Elaboró – MICSA","Vo.Bo. – Cliente"].map(label=>(
            <div key={label} style={{borderTop:"2px solid #333",paddingTop:"8px",textAlign:"center",fontSize:"11px",color:"#444"}}>{label}</div>
          ))}
        </div>
      </div>
      <PFooter/>
    </div>
  );
}

/* ─── PHOTO UPLOADER ─────────────────────────────────────────────────────────── */
function PhotoUploader({photos,onChange}){
  const inputRef=useRef();
  const handleFiles=useCallback((files)=>{
    Array.from(files).forEach(f=>{
      const reader=new FileReader();
      reader.onload=e=>onChange(prev=>[...prev,e.target.result]);
      reader.readAsDataURL(f);
    });
  },[onChange]);
  const onDrop=e=>{e.preventDefault();handleFiles(e.dataTransfer.files);};
  const remove=idx=>onChange(prev=>prev.filter((_,i)=>i!==idx));
  const move=(idx,dir)=>{
    const arr=[...photos];
    const t=idx+dir;
    if(t<0||t>=arr.length)return;
    [arr[idx],arr[t]]=[arr[t],arr[idx]];
    onChange(arr);
  };
  return(
    <div>
      <div onDrop={onDrop} onDragOver={e=>e.preventDefault()} onClick={()=>inputRef.current.click()}
        style={{border:"2px dashed #a0b4cc",borderRadius:"8px",padding:"18px",textAlign:"center",cursor:"pointer",background:"#f0f6ff",marginBottom:"10px"}}
        onMouseEnter={e=>e.currentTarget.style.background="#e0eeff"}
        onMouseLeave={e=>e.currentTarget.style.background="#f0f6ff"}>
        <div style={{fontSize:"22px",marginBottom:"4px"}}>📷</div>
        <div style={{fontWeight:"700",color:NAVY,fontSize:"12px"}}>Arrastra fotos aquí o haz clic para seleccionar</div>
        <div style={{fontSize:"10px",color:"#888",marginTop:"2px"}}>Se cuadran automáticamente · JPG, PNG, HEIC</div>
        <input ref={inputRef} type="file" multiple accept="image/*" style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
      </div>
      {photos.length>0&&(
        <div>
          <div style={{fontSize:"11px",color:"#666",marginBottom:"6px",fontWeight:"600"}}>{photos.length} foto{photos.length!==1?"s":""} — máx. 3 por fila en el documento</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"7px"}}>
            {photos.map((src,i)=>(
              <div key={i} style={{position:"relative",borderRadius:"5px",overflow:"hidden",border:"2px solid #d1d9e0"}}>
                <img src={src} alt="" style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",top:"3px",right:"3px",display:"flex",gap:"2px"}}>
                  <button onClick={()=>move(i,-1)} disabled={i===0} style={{padding:"2px 6px",background:"rgba(0,0,0,0.6)",color:"white",border:"none",borderRadius:"3px",cursor:"pointer",fontSize:"10px",opacity:i===0?0.3:1}}>←</button>
                  <button onClick={()=>move(i,1)} disabled={i===photos.length-1} style={{padding:"2px 6px",background:"rgba(0,0,0,0.6)",color:"white",border:"none",borderRadius:"3px",cursor:"pointer",fontSize:"10px",opacity:i===photos.length-1?0.3:1}}>→</button>
                  <button onClick={()=>remove(i)} style={{padding:"2px 6px",background:"rgba(200,0,0,0.8)",color:"white",border:"none",borderRadius:"3px",cursor:"pointer",fontSize:"10px"}}>✕</button>
                </div>
                <div style={{position:"absolute",bottom:"3px",left:"5px",background:"rgba(0,0,0,0.5)",color:"white",fontSize:"10px",padding:"1px 5px",borderRadius:"3px"}}>{i+1}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── FIELD RENDERER ─────────────────────────────────────────────────────────── */
const EPP_CATALOG=["Casco de seguridad","Lentes de seguridad","Tapones auditivos","Guantes de trabajo","Guantes anticorte","Botas con casquillo","Chaleco reflectante","Arnés de seguridad","Careta de soldar","Respirador N95","Uniforme de trabajo","Careta facial","Overol FR (ignífugo)"];

function FieldRenderer({field,value,onChange}){
  if(field.type==="info") return <div style={{padding:"8px 12px",background:"#eef2f7",borderRadius:"4px",fontSize:"12px",color:"#555",fontStyle:"italic"}}>{field.label}</div>;
  if(field.type==="textarea") return <textarea rows={field.rows||3} placeholder={field.placeholder||""} value={value||""} onChange={e=>onChange(e.target.value)} style={{...inp,resize:"vertical"}}/>;
  if(field.type==="select") return <select value={value||""} onChange={e=>onChange(e.target.value)} style={inp}><option value="">Seleccionar...</option>{field.options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
  if(field.type==="photos") return <PhotoUploader photos={value||[]} onChange={v=>{const val=typeof v==="function"?v(value||[]):v;onChange(val);}}/>;

  if(field.type==="list_editor"){
    const items=value||field.defaults||[];
    const add=()=>onChange([...items,""]);
    const upd=(i,v)=>{const a=[...items];a[i]=v;onChange(a);};
    const del=i=>onChange(items.filter((_,j)=>j!==i));
    return(
      <div>
        {items.map((it,i)=>(
          <div key={i} style={{display:"flex",gap:"6px",marginBottom:"5px",alignItems:"flex-start"}}>
            <div style={{flexShrink:0,paddingTop:"7px",fontWeight:"700",color:"#888",fontSize:"11px",width:"18px"}}>{LETTERS[i]}.</div>
            <textarea rows={2} value={it} onChange={e=>upd(i,e.target.value)} style={{...inp,flex:1,resize:"vertical",fontSize:"11px",padding:"5px 8px"}}/>
            <button onClick={()=>del(i)} style={{flexShrink:0,padding:"6px 8px",background:"#fee2e2",border:"none",borderRadius:"4px",cursor:"pointer",color:"#dc2626",marginTop:"1px"}}>✕</button>
          </div>
        ))}
        <div style={{display:"flex",gap:"6px",marginTop:"4px"}}>
          <button onClick={add} style={{padding:"5px 12px",background:"#e0f0ff",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"11px",color:NAVY,fontFamily:"inherit",fontWeight:"600"}}>+ Agregar</button>
          <button onClick={()=>onChange(field.defaults||[])} style={{padding:"5px 12px",background:"#f0f0f0",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"11px",fontFamily:"inherit"}}>↺ Restaurar</button>
        </div>
      </div>
    );
  }

  if(field.type==="activities"){
    const acts=value||[];
    const add=()=>onChange([...acts,{titulo:"",descripcion:""}]);
    const upd=(i,k,v)=>{const a=[...acts];a[i]={...a[i],[k]:v};onChange(a);};
    const del=i=>onChange(acts.filter((_,j)=>j!==i));
    return(
      <div>
        {acts.map((a,i)=>(
          <div key={i} style={{display:"flex",gap:"6px",marginBottom:"7px",alignItems:"flex-start"}}>
            <input value={a.titulo} onChange={e=>upd(i,"titulo",e.target.value)} placeholder="Actividad" style={{...inp,width:"190px",flexShrink:0,fontSize:"11px",padding:"5px 8px"}}/>
            <textarea rows={2} value={a.descripcion} onChange={e=>upd(i,"descripcion",e.target.value)} placeholder="Descripción..." style={{...inp,flex:1,resize:"vertical",fontSize:"11px",padding:"5px 8px"}}/>
            <button onClick={()=>del(i)} style={{flexShrink:0,padding:"6px 8px",background:"#fee2e2",border:"none",borderRadius:"4px",cursor:"pointer",color:"#dc2626",marginTop:"1px"}}>✕</button>
          </div>
        ))}
        <button onClick={add} style={{padding:"5px 12px",background:"#e0f0ff",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"11px",color:NAVY,fontFamily:"inherit",fontWeight:"600"}}>+ Agregar actividad</button>
      </div>
    );
  }

  if(field.type==="cost_items"){
    const items=value||[];
    const add=()=>onChange([...items,{descripcion:"",linea:"",costo:""}]);
    const upd=(i,k,v)=>{const a=[...items];a[i]={...a[i],[k]:v};onChange(a);};
    const del=i=>onChange(items.filter((_,j)=>j!==i));
    return(
      <div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 110px 120px 30px",gap:"4px",marginBottom:"5px"}}>
          {["Descripción","Línea/Estación","Costo MXN",""].map(h=><div key={h} style={{fontSize:"10px",fontWeight:"700",color:"#666",textTransform:"uppercase"}}>{h}</div>)}
        </div>
        {items.map((it,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 110px 120px 30px",gap:"4px",marginBottom:"5px"}}>
            <input placeholder="Descripción" value={it.descripcion} onChange={e=>upd(i,"descripcion",e.target.value)} style={{...inp,fontSize:"11px",padding:"5px 8px"}}/>
            <input placeholder="PLANTA" value={it.linea} onChange={e=>upd(i,"linea",e.target.value)} style={{...inp,fontSize:"11px",padding:"5px 8px"}}/>
            <input type="number" placeholder="$0.00" value={it.costo} onChange={e=>upd(i,"costo",e.target.value)} style={{...inp,fontSize:"11px",padding:"5px 8px"}}/>
            <button onClick={()=>del(i)} style={{padding:"5px",background:"#fee2e2",border:"none",borderRadius:"4px",cursor:"pointer",color:"#dc2626"}}>✕</button>
          </div>
        ))}
        <button onClick={add} style={{padding:"5px 12px",background:"#e0f0ff",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"11px",color:NAVY,fontFamily:"inherit",fontWeight:"600"}}>+ Agregar concepto</button>
      </div>
    );
  }

  if(field.type==="req_items"){
    const items=value||[];
    const add=()=>onChange([...items,{cantidad:"",unidad:"",descripcion:"",uso:""}]);
    const upd=(i,k,v)=>{const a=[...items];a[i]={...a[i],[k]:v};onChange(a);};
    const del=i=>onChange(items.filter((_,j)=>j!==i));
    return(
      <div>
        <div style={{display:"grid",gridTemplateColumns:"65px 75px 1fr 110px 30px",gap:"4px",marginBottom:"5px"}}>
          {["Cant.","Unidad","Descripción","Uso",""].map(h=><div key={h} style={{fontSize:"10px",fontWeight:"700",color:"#666",textTransform:"uppercase"}}>{h}</div>)}
        </div>
        {items.map((it,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"65px 75px 1fr 110px 30px",gap:"4px",marginBottom:"5px"}}>
            <input value={it.cantidad} onChange={e=>upd(i,"cantidad",e.target.value)} style={{...inp,fontSize:"11px",padding:"5px 7px"}} placeholder="1"/>
            <input value={it.unidad} onChange={e=>upd(i,"unidad",e.target.value)} style={{...inp,fontSize:"11px",padding:"5px 7px"}} placeholder="PZA"/>
            <input value={it.descripcion} onChange={e=>upd(i,"descripcion",e.target.value)} style={{...inp,fontSize:"11px",padding:"5px 7px"}} placeholder="Descripción"/>
            <input value={it.uso} onChange={e=>upd(i,"uso",e.target.value)} style={{...inp,fontSize:"11px",padding:"5px 7px"}} placeholder="Proyecto X"/>
            <button onClick={()=>del(i)} style={{padding:"5px",background:"#fee2e2",border:"none",borderRadius:"4px",cursor:"pointer",color:"#dc2626"}}>✕</button>
          </div>
        ))}
        <button onClick={add} style={{padding:"5px 12px",background:"#e0f0ff",border:"none",borderRadius:"4px",cursor:"pointer",fontSize:"11px",color:NAVY,fontFamily:"inherit",fontWeight:"600"}}>+ Agregar artículo</button>
      </div>
    );
  }

  if(field.type==="epp_items"){
    const items=value||[];
    return(
      <div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"8px"}}>
          {EPP_CATALOG.map(epp=>(
            <label key={epp} style={{display:"flex",alignItems:"center",gap:"4px",padding:"4px 9px",background:items.includes(epp)?BLUE:"#f0f4f8",color:items.includes(epp)?"white":"#333",borderRadius:"20px",cursor:"pointer",fontSize:"11px",userSelect:"none",transition:"all 0.15s"}}>
              <input type="checkbox" checked={items.includes(epp)} onChange={e=>{if(e.target.checked)onChange([...items,epp]);else onChange(items.filter(x=>x!==epp));}} style={{display:"none"}}/>
              {epp}
            </label>
          ))}
        </div>
        <input placeholder="Otro artículo (Enter para agregar)" style={{...inp,fontSize:"12px"}}
          onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){onChange([...items,e.target.value.trim()]);e.target.value="";}}}/>
      </div>
    );
  }

  if(field.type==="checklist"){
    const state=value||{};
    return(
      <div style={{border:"1px solid #e2e8f0",borderRadius:"6px",overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 60px 60px 1fr",background:BLUE,padding:"5px 10px",color:"white",fontSize:"10px",fontWeight:"700",textTransform:"uppercase"}}>
          <span>Descripción</span><span style={{textAlign:"center"}}>✓ OK</span><span style={{textAlign:"center"}}>✗ Falla</span><span>Observaciones</span>
        </div>
        {field.items.map((item,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 60px 60px 1fr",padding:"4px 10px",background:i%2===0?"white":"#f8fafc",borderBottom:"1px solid #f0f0f0",alignItems:"center"}}>
            <span style={{fontSize:"11px"}}>{i+1}. {item}</span>
            <span style={{textAlign:"center"}}><input type="radio" name={`${field.key}_${i}`} value="ok" checked={state[i]==="ok"} onChange={()=>onChange({...state,[i]:"ok"})}/></span>
            <span style={{textAlign:"center"}}><input type="radio" name={`${field.key}_${i}`} value="falla" checked={state[i]==="falla"} onChange={()=>onChange({...state,[i]:"falla"})}/></span>
            <input placeholder="obs..." value={state[`obs_${i}`]||""} onChange={e=>onChange({...state,[`obs_${i}`]:e.target.value})} style={{...inp,fontSize:"10px",padding:"3px 6px"}}/>
          </div>
        ))}
      </div>
    );
  }

  return <input type={field.type==="number"?"number":field.type==="date"?"date":field.type==="time"?"time":"text"} placeholder={field.placeholder||""} value={value||""} onChange={e=>onChange(e.target.value)} style={inp}/>;
}

/* ─── FORM SECTION ───────────────────────────────────────────────────────────── */
function FormSection({sec,formData,setFormData}){
  return(
    <div style={{marginBottom:"16px"}}>
      <div style={{background:NAVY,color:"white",padding:"6px 12px",borderRadius:"6px 6px 0 0",fontWeight:"700",fontSize:"11px",textTransform:"uppercase",letterSpacing:"0.07em"}}>{sec.label}</div>
      <div style={{background:"white",border:"1px solid #dde3ea",borderTop:"none",borderRadius:"0 0 6px 6px",padding:"14px",display:"flex",flexDirection:"column",gap:"10px"}}>
        {sec.fields.map((f,fi)=>(
          <div key={fi}>
            {f.type!=="info"&&f.label&&<label style={{fontSize:"10px",fontWeight:"700",color:"#555",textTransform:"uppercase",letterSpacing:"0.05em",display:"block",marginBottom:"3px"}}>{f.label}</label>}
            <FieldRenderer field={f} value={formData[f.key]} onChange={val=>setFormData(prev=>({...prev,[f.key]:val}))}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── STORAGE ────────────────────────────────────────────────────────────────── */
const SK="micsa_v3_docs";
const loadDocs=()=>{try{return JSON.parse(localStorage.getItem(SK)||"[]");}catch{return[];}};
const saveDocs=d=>{try{localStorage.setItem(SK,JSON.stringify(d));}catch{}};

/* ─── MAIN APP ───────────────────────────────────────────────────────────────── */
export default function App(){
  const [screen,setScreen]=useState("home");
  const [docType,setDocType]=useState(null);
  const [formData,setFormData]=useState({});
  const [savedDocs,setSavedDocs]=useState(loadDocs);
  const [editId,setEditId]=useState(null);
  const [toast,setToast]=useState(null);
  const printRef=useRef();

  const showToast=(msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),2600);};

  const startNew=type=>{setDocType(type);setFormData({fecha:today()});setEditId(null);setScreen("editor");};
  const startEdit=doc=>{setDocType(doc.type);setFormData(doc.data);setEditId(doc.id);setScreen("editor");};
  const startView=doc=>{setDocType(doc.type);setFormData(doc.data);setEditId(doc.id);setScreen("view");};

  const handleSave=()=>{
    const dt=DOC_TYPES.find(d=>d.id===docType);
    const doc={id:editId||Date.now().toString(),type:docType,typeLabel:dt?.label,title:formData.proyecto||formData.cliente||formData.cot_num||formData.ot_num||formData.contrato_num||formData.req_num||`${dt?.label} ${fmtDate(formData.fecha)}`,fecha:formData.fecha||today(),data:{...formData},savedAt:new Date().toISOString()};
    const existing=loadDocs();
    const idx=existing.findIndex(d=>d.id===doc.id);
    const updated=idx>=0?existing.map((d,i)=>i===idx?doc:d):[doc,...existing];
    saveDocs(updated);setSavedDocs(updated);showToast("Guardado ✓");
  };

  const handleDelete=id=>{
    const updated=savedDocs.filter(d=>d.id!==id);
    saveDocs(updated);setSavedDocs(updated);showToast("Eliminado","info");
  };

  const handlePrint=()=>{
    const html=printRef.current?.innerHTML;
    if(!html)return;
    const w=window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700;800&family=Barlow+Condensed:wght@700;900&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;}body{margin:0;padding:0;font-family:'IBM Plex Sans',sans-serif;}@page{margin:8mm;size:A4;}img{max-width:100%;}</style></head><body>${html}</body></html>`);
    w.document.close();
    setTimeout(()=>{w.focus();w.print();},800);
  };

  const schema=docType?SCHEMAS[docType]:null;

  const renderPreview=()=>{
    if(!docType)return null;
    if(docType==="bitacora")return <PreviewBitacora d={formData}/>;
    if(docType==="cotizacion")return <PreviewCot d={formData}/>;
    if(docType==="costos_adicionales")return <PreviewCostosAd d={formData}/>;
    return <PreviewGeneric d={formData} docType={docType}/>;
  };

  return(
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:NAVY,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {/* NAV */}
      <div style={{background:NAVY,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"2px solid "+GOLD,height:"52px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",cursor:"pointer"}} onClick={()=>setScreen("home")}>
          <div style={{background:GOLD,color:NAVY,fontWeight:"900",padding:"3px 10px",borderRadius:"4px",fontSize:"14px",letterSpacing:"0.08em",fontFamily:"'Barlow Condensed',sans-serif"}}>MICSA</div>
          <span style={{color:"white",fontWeight:"700",fontSize:"14px",letterSpacing:"0.04em"}}>Generador de Documentos</span>
        </div>
        <div style={{display:"flex",gap:"6px"}}>
          {[["home","+ Nuevo"],["hist","Historial"]].map(([s,label])=>(
            <button key={s} onClick={()=>setScreen(s)}
              style={{padding:"5px 14px",background:(screen===s||screen==="editor"&&s==="home")?GOLD:"transparent",color:(screen===s||screen==="editor"&&s==="home")?NAVY:"#a0b0c0",border:"1px solid #334",borderRadius:"4px",cursor:"pointer",fontSize:"12px",fontWeight:"700",fontFamily:"inherit",textTransform:"uppercase",letterSpacing:"0.05em"}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* TOAST */}
      {toast&&<div style={{position:"fixed",top:"60px",right:"20px",zIndex:999,padding:"10px 18px",background:toast.type==="info"?"#1a3a6b":"#14532d",color:"white",borderRadius:"6px",fontWeight:"700",fontSize:"13px",boxShadow:"0 4px 20px rgba(0,0,0,0.35)"}}>{toast.msg}</div>}

      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>

        {/* HOME */}
        {screen==="home"&&(
          <div style={{flex:1,padding:"32px",overflowY:"auto"}}>
            <div style={{maxWidth:"860px",margin:"0 auto"}}>
              <h2 style={{color:GOLD,margin:"0 0 6px",fontFamily:"'Barlow Condensed',sans-serif",fontSize:"26px",letterSpacing:"0.06em",textTransform:"uppercase"}}>Selecciona el tipo de documento</h2>
              <p style={{color:"#a0b0c0",margin:"0 0 24px",fontSize:"13px"}}>Todos los formatos MICSA — listos para imprimir o exportar a PDF.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:"12px"}}>
                {DOC_TYPES.map(doc=>(
                  <div key={doc.id} onClick={()=>startNew(doc.id)}
                    style={{background:"#111e33",border:"1px solid #1e3050",borderRadius:"10px",padding:"20px",cursor:"pointer",transition:"all 0.2s",position:"relative",overflow:"hidden"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="#162040";e.currentTarget.style.borderColor=doc.color;e.currentTarget.style.transform="translateY(-2px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#111e33";e.currentTarget.style.borderColor="#1e3050";e.currentTarget.style.transform="translateY(0)";}}>
                    <div style={{fontSize:"26px",marginBottom:"8px"}}>{doc.icon}</div>
                    <div style={{color:"white",fontWeight:"700",fontSize:"13px",lineHeight:"1.4"}}>{doc.label}</div>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,height:"3px",background:doc.color}}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EDITOR */}
        {screen==="editor"&&schema&&(
          <div style={{flex:1,display:"flex",overflow:"hidden"}}>
            {/* Form */}
            <div style={{width:"430px",flexShrink:0,background:LGRAY,borderRight:"1px solid #dde3ea",overflowY:"auto",padding:"16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
                <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",cursor:"pointer",color:"#666",fontSize:"20px",padding:"2px 6px"}}>←</button>
                <div>
                  <div style={{fontSize:"10px",color:"#999",textTransform:"uppercase",letterSpacing:"0.08em"}}>{DOC_TYPES.find(d=>d.id===docType)?.icon} Nuevo</div>
                  <div style={{fontWeight:"800",fontSize:"14px",color:NAVY}}>{schema.title}</div>
                </div>
              </div>
              {schema.sections.map((sec,i)=><FormSection key={i} sec={sec} formData={formData} setFormData={setFormData}/>)}
              <div style={{paddingBottom:"16px",paddingTop:"4px"}}>
                <button onClick={handleSave} style={{width:"100%",padding:"11px",background:NAVY,color:"white",border:"none",borderRadius:"6px",cursor:"pointer",fontWeight:"700",fontSize:"13px",fontFamily:"inherit",letterSpacing:"0.04em"}}>
                  💾 {editId?"Actualizar":"Guardar"}
                </button>
              </div>
            </div>
            {/* Preview */}
            <div style={{flex:1,background:"#dde3ea",overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px",flexShrink:0}}>
                <span style={{fontWeight:"700",fontSize:"13px",color:"#445"}}>Vista Previa en Tiempo Real</span>
                <button onClick={handlePrint} style={{padding:"7px 18px",background:GOLD,color:NAVY,border:"none",borderRadius:"6px",cursor:"pointer",fontWeight:"800",fontSize:"12px",fontFamily:"inherit",letterSpacing:"0.05em"}}>🖨️ IMPRIMIR / PDF</button>
              </div>
              <div ref={printRef} style={{background:"white",boxShadow:"0 4px 24px rgba(0,0,0,0.15)",maxWidth:"794px",width:"100%",margin:"0 auto"}}>
                {renderPreview()}
              </div>
            </div>
          </div>
        )}

        {/* VIEW */}
        {screen==="view"&&(
          <div style={{flex:1,background:"#dde3ea",overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"12px",flexShrink:0}}>
              <button onClick={()=>setScreen("hist")} style={{padding:"7px 14px",background:"#334",color:"white",border:"none",borderRadius:"5px",cursor:"pointer",fontWeight:"700",fontSize:"12px",fontFamily:"inherit"}}>← Historial</button>
              <button onClick={()=>startEdit({id:editId,type:docType,data:formData})} style={{padding:"7px 14px",background:GOLD,color:NAVY,border:"none",borderRadius:"5px",cursor:"pointer",fontWeight:"700",fontSize:"12px",fontFamily:"inherit"}}>✏️ Editar</button>
              <button onClick={handlePrint} style={{padding:"7px 18px",background:"#166534",color:"white",border:"none",borderRadius:"6px",cursor:"pointer",fontWeight:"800",fontSize:"12px",fontFamily:"inherit"}}>🖨️ IMPRIMIR / PDF</button>
            </div>
            <div ref={printRef} style={{background:"white",boxShadow:"0 4px 24px rgba(0,0,0,0.15)",maxWidth:"794px",width:"100%",margin:"0 auto"}}>
              {renderPreview()}
            </div>
          </div>
        )}

        {/* HISTORY */}
        {screen==="hist"&&(
          <div style={{flex:1,padding:"32px",overflowY:"auto"}}>
            <div style={{maxWidth:"760px",margin:"0 auto"}}>
              <h2 style={{color:GOLD,margin:"0 0 6px",fontFamily:"'Barlow Condensed',sans-serif",fontSize:"26px",letterSpacing:"0.06em",textTransform:"uppercase"}}>Historial</h2>
              <p style={{color:"#a0b0c0",margin:"0 0 20px",fontSize:"13px"}}>{savedDocs.length} documento{savedDocs.length!==1?"s":""} guardado{savedDocs.length!==1?"s":""}</p>
              {savedDocs.length===0?(
                <div style={{textAlign:"center",padding:"60px",color:"#556"}}><div style={{fontSize:"40px",marginBottom:"12px"}}>📂</div><div style={{fontSize:"15px"}}>Sin documentos guardados.</div></div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                  {savedDocs.map(doc=>{
                    const dt=DOC_TYPES.find(d=>d.id===doc.type);
                    return(
                      <div key={doc.id} style={{background:"#111e33",border:"1px solid #1e3050",borderRadius:"8px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"12px"}}>
                        <div style={{fontSize:"22px",flexShrink:0}}>{dt?.icon||"📄"}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{color:"white",fontWeight:"700",fontSize:"13px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.title}</div>
                          <div style={{color:"#a0b0c0",fontSize:"11px",display:"flex",gap:"10px",marginTop:"2px"}}>
                            <span style={{color:dt?.color||GOLD,fontWeight:"600"}}>{doc.typeLabel}</span>
                            <span>{fmtDate(doc.fecha)}</span>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:"5px",flexShrink:0}}>
                          <button onClick={()=>startView(doc)} style={{padding:"5px 12px",background:BLUE,color:"white",border:"none",borderRadius:"5px",cursor:"pointer",fontSize:"11px",fontWeight:"700",fontFamily:"inherit"}}>Ver</button>
                          <button onClick={()=>startEdit(doc)} style={{padding:"5px 12px",background:GOLD,color:NAVY,border:"none",borderRadius:"5px",cursor:"pointer",fontSize:"11px",fontWeight:"700",fontFamily:"inherit"}}>Editar</button>
                          <button onClick={()=>handleDelete(doc.id)} style={{padding:"5px 9px",background:"#4a1010",color:"#f87171",border:"none",borderRadius:"5px",cursor:"pointer",fontSize:"12px"}}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600&family=Barlow+Condensed:wght@700;900&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#0a1628;}
        ::-webkit-scrollbar-thumb{background:#334;border-radius:3px;}
        input:focus,textarea:focus,select:focus{border-color:#1a3a6b!important;box-shadow:0 0 0 3px rgba(26,58,107,0.12);}
      `}</style>
    </div>
  );
}
