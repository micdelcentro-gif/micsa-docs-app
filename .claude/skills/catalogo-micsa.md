# Skill: catalogo-micsa

## Description
Gestiona el catalogo de precios de MICSA Industrial Supply. Permite modificar precios (aumentar o reducir por porcentaje), agregar productos nuevos, eliminar productos, y generar archivos XLSX actualizados del catalogo. Activa este skill cuando el usuario mencione: catalogo MICSA, precios MICSA, modificar costos, ajustar precios EPP, agregar producto al catalogo, lista de precios, descuento por porcentaje en catalogo, o cualquier operacion sobre el inventario/precios de MICSA Supply.

## Instructions

Eres el gestor del Catalogo de Precios de **MICSA Industrial Supply** (Equipo de Proteccion Personal).

### BASE DE DATOS DEL CATALOGO

El catalogo se almacena en un archivo XLSX en: `/Users/jordangonzalez/Desktop/micsa-docs-app 3/catalogo_micsa_supply.xlsx`

Si el archivo NO existe, crealo con la siguiente estructura y datos base extraidos del PDF original:

**Columnas del XLSX:**
| No | Categoria | Producto | Precio_Base_MXN | Precio_Actual_MXN | Variante | Multiplo_Venta | Caja_Master | Tallas | IVA |

**Datos base del catalogo (precios +IVA):**

| No | Categoria | Producto | Precio_Base_MXN | Precio_Actual_MXN | Variante | Multiplo_Venta | Caja_Master | Tallas | IVA |
|----|-----------|----------|-----------------|-------------------|----------|----------------|-------------|--------|-----|
| 1 | Proteccion Cabeza | Casco de Proteccion Mundial | 105.90 | 105.90 | Sin matraca | 5PZ | 24PZ/20PZ | Unitalla | +IVA |
| 2 | Proteccion Cabeza | Casco de Proteccion Mundial con Matraca | 120.90 | 120.90 | Con matraca | 5PZ | 24PZ/20PZ | Unitalla | +IVA |
| 3 | Proteccion Cabeza | Casco de Proteccion Ala Ancha | 130.50 | 130.50 | Sin matraca | 5PZ | 24PZ/20PZ | Unitalla | +IVA |
| 4 | Proteccion Cabeza | Casco de Proteccion Ala Ancha con Matraca | 156.90 | 156.90 | Con matraca | 5PZ | 24PZ/20PZ | Unitalla | +IVA |
| 5 | Proteccion Cabeza | Cubre Nuca con Reflejante | 45.90 | 45.90 | - | 10PZ | 100PZ | Unitalla | +IVA |
| 6 | Proteccion Cabeza | Capucha Antiflama Ignifuga | 148.50 | 148.50 | - | 10PZ | 100PZ | Unitalla | +IVA |
| 7 | Proteccion Cabeza | Tapon Auditivo Reusable | 8.90 | 8.90 | - | 200PZ | 1000PZ | Unitalla | +IVA |
| 8 | Proteccion Cabeza | Tapon Auditivo Desechable | 7.90 | 7.90 | - | 100PZ | 1000PZ | Unitalla | +IVA |
| 9 | Proteccion Cabeza | Cofia Pisada Desechable | 56.90 | 56.90 | Dispenser | 100PZ | 1000PZ | Unitalla | +IVA |
| 10 | Proteccion Cabeza | Cofia Ninja Hood Desechable | 184.90 | 184.90 | Dispenser | 100PZ | 1000PZ | Unitalla | +IVA |
| 11 | Proteccion Cabeza | Barbiquejo 2 Puntos | 23.40 | 23.40 | - | 10PZ | 500PZ | Unitalla | +IVA |
| 12 | Proteccion Cabeza | Capucha de Mezclilla | 100.80 | 100.80 | - | 10PZ | 50PZ | Unitalla | +IVA |
| 13 | Proteccion Visual | Lente DC0024 | 16.20 | 16.20 | - | 12PZ | 240PZ | Unitalla | +IVA |
| 14 | Proteccion Visual | Lente DC0025 Blanco | 23.90 | 23.90 | Blanco | 12PZ | 300PZ | Unitalla | +IVA |
| 15 | Proteccion Visual | Lente DC0025 Negro | 23.90 | 23.90 | Negro | 12PZ | 300PZ | Unitalla | +IVA |
| 16 | Proteccion Visual | Lente DC0026 | 36.80 | 36.80 | - | 12PZ | 144PZ | Unitalla | +IVA |
| 17 | Proteccion Visual | Lente Tipo Nemesis | 79.80 | 79.80 | - | 12PZ | 144PZ | Unitalla | +IVA |
| 18 | Proteccion Visual | Google Trilogy | 145.90 | 145.90 | - | 12PZ | 60PZ | Unitalla | +IVA |
| 19 | Proteccion Visual | Lente Pasta Dura Polarizado | 145.90 | 145.90 | - | 1PZ | 60PZ | Unitalla | +IVA |
| 20 | Proteccion Visual | Sobre Lente DC0027 | 45.90 | 45.90 | - | 12PZ | 144PZ | Unitalla | +IVA |
| 21 | Proteccion Visual | Monogoogle Ventilado | 70.30 | 70.30 | - | 6PZ | 60PZ | Unitalla | +IVA |
| 22 | Proteccion Manos | Guantes Nylon con Nitrilo | 16.90 | 16.90 | - | 12 pares | 240 pares | 6,7,8,9,10 | +IVA |
| 23 | Proteccion Manos | Guante Nylon con Poliuretano | 16.60 | 16.60 | - | 12 pares | 240 pares | 6,7,8,9,10 | +IVA |
| 24 | Proteccion Manos | Guantes Anticorte Nivel 5 Anti Impacto | 370.90 | 370.90 | - | 12 pares | 144 pares | Unitalla | +IVA |
| 25 | Proteccion Manos | Guantes Anticorte Nivel 5 Palma de Nitrilo | 70.90 | 70.90 | - | 12 pares | 240 pares | 6,7,8,9,10 | +IVA |
| 26 | Proteccion Manos | Guantes Inspector 100% Poliester | 12.90 | 12.90 | - | 12 pares | 240 pares | 7,8,9,10 | +IVA |
| 27 | Proteccion Manos | Guante Japones con Palma Latex | 45.90 | 45.90 | - | 12 pares | 240 pares | 7,8,9,10 | +IVA |
| 28 | Proteccion Manos | Guantes Electricista | 85.90 | 85.90 | - | 5 pares | 100 pares | Unitalla | +IVA |
| 29 | Proteccion Manos | Guante Carnaza Corto | 60.90 | 60.90 | - | 5 pares | 100 pares | Unitalla | +IVA |
| 30 | Proteccion Manos | Guantes Carnaza Largo | 65.90 | 65.90 | - | 5 pares | 100 pares | Unitalla | +IVA |
| 31 | Proteccion Manos | Guante Operador | 85.90 | 85.90 | - | 5 pares | 100 pares | Unitalla | +IVA |
| 32 | Proteccion Manos | Guantes Toalla Terry | 32.95 | 32.95 | - | 12 pares | 120 pares | Unitalla | +IVA |
| 33 | Proteccion Manos | Guante Japones 100% Algodon 60g | 14.95 | 14.95 | 60g | 12 pares | 300 pares | Unitalla | +IVA |
| 34 | Proteccion Manos | Guante Japones 100% Algodon 40g | 14.95 | 14.95 | 40g | 12 pares | 300 pares | Unitalla | +IVA |
| 35 | Proteccion Manos | Guantes Japones con Puntos PVC | 24.90 | 24.90 | - | 12 pares | 300 pares | Unitalla | +IVA |
| 36 | Proteccion Manos | Guante Chino Doble Palma | 64.90 | 64.90 | - | 12 pares | 120 pares | Unitalla | +IVA |
| 37 | Proteccion Manos | Guantes Nitrilo Puno de Lona | 51.90 | 51.90 | - | 12 pares | 144 pares | Unitalla | +IVA |
| 38 | Proteccion Manos | Guante Nitrilo Puno Elastico | 51.90 | 51.90 | - | 12 pares | 144 pares | Unitalla | +IVA |
| 39 | Proteccion Manos | Guantes Nitrilo Desechable | 150.90 | 150.90 | Dispenser | 100 pares | 1000 pares | 7,8,9,10 | +IVA |
| 40 | Proteccion Manos | Guante Nitrilo Verde Tipo Solvex | 45.95 | 45.95 | - | 12 pares | 144 pares | 7,8,9,10 | +IVA |
| 41 | Proteccion Manos | Guantes Conta Acidos 18" | 125.90 | 125.90 | - | 12 pares | 144 pares | Unitalla | +IVA |
| 42 | Proteccion Manos | Guante Soldador con Hilo Kevlar Rojo | 121.90 | 121.90 | Rojo | 6 pares | 72 pares | Unitalla | +IVA |
| 43 | Proteccion Manos | Guante Soldador con Hilo Kevlar Azul | 128.90 | 128.90 | Azul | 6 pares | 72 pares | Unitalla | +IVA |
| 44 | Proteccion Manos | Guantes Anticorte Nivel 5 Poliuletano | 64.90 | 64.90 | - | 12 pares | 240 pares | 6,7,8,9,10 | +IVA |
| 45 | Calzado | Bota Industrial | 240.00 | 240.00 | - | 5 pares | 28 pares | 22-31 | +IVA |
| 46 | Calzado | Bota Roper | 630.00 | 630.00 | - | 5 pares | 19 pares | 26-30 | +IVA |
| 47 | Calzado | Rodilleras 2 Capsulas | 190.00 | 190.00 | - | 5 pares | 50 pares | Unitalla | +IVA |
| 48 | Calzado | Polaina de Carnaza | 108.90 | 108.90 | - | 5 pares | 50 pares | Unitalla | +IVA |
| 49 | Ropa de Trabajo | Chaleco de Malla | 40.70 | 40.70 | - | 25PZ | 100PZ | Unitalla | +IVA |
| 50 | Ropa de Trabajo | Chaleco Clase 2 | 64.90 | 64.90 | - | 10PZ | 100PZ | Unitalla | +IVA |
| 51 | Ropa de Trabajo | Chaleco Clase 2 con Bolsas | 70.90 | 70.90 | - | 10PZ | 100PZ | Unitalla | +IVA |
| 52 | Ropa de Trabajo | Chaleco Poliester Premium | 85.90 | 85.90 | - | 10PZ | 100PZ | Unitalla | +IVA |
| 53 | Ropa de Trabajo | Chaleco Rescatista Desprendible | 124.90 | 124.90 | - | 10PZ | 100PZ | Unitalla | +IVA |
| 54 | Ropa de Trabajo | Chaleco Cazador | 450.90 | 450.90 | - | 5PZ | 50PZ | CH,M,G,XL,XXL,XXXL | +IVA |
| 55 | Ropa de Trabajo | Chaleco Brigadista Premium | 185.90 | 185.90 | - | 10PZ | 50PZ | Unitalla | +IVA |
| 56 | Ropa de Trabajo | Chaleco Brigadista Estandar | 160.90 | 160.90 | - | 10PZ | 100PZ | Unitalla | +IVA |
| 57 | Ropa de Trabajo | Chaleco Ligero Espalda de Malla | 185.90 | 185.90 | - | 10PZ | 100PZ | Unitalla | +IVA |
| 58 | Ropa de Trabajo | Chaleco Regio | 285.90 | 285.90 | - | 5PZ | 50PZ | CH,M,G,XL,XXL,XXXL | +IVA |
| 59 | Ropa de Trabajo | Overol Laminado | 64.90 | 64.90 | - | 10PZ | 50PZ | CH,M,G,XL,XXL,XXXL | +IVA |
| 60 | Ropa de Trabajo | Overol Gabardina con Reflejante | 498.90 | 498.90 | - | 5PZ | 50PZ | 36-46 | +IVA |
| 61 | Ropa de Trabajo | Elastico Carrillero | 64.90 | 64.90 | - | 12PZ | 100PZ | Unitalla | +IVA |
| 62 | Ropa de Trabajo | Faja Lumbar 3er Cinto | 125.90 | 125.90 | - | 5PZ | 50PZ | CH,M,G,XL,XXL | +IVA |
| 63 | Ropa de Trabajo | Yompa de Mezclilla 14oz | 295.00 | 295.00 | - | 5PZ | 20PZ | CH,M,G,XL,XXL | +IVA |
| 64 | Ropa de Trabajo | Camisa de Mezclilla con Reflejante | 305.00 | 305.00 | Con reflejante | 5PZ | 20PZ | CH,M,G,XL,XXL,XXXL | +IVA |
| 65 | Ropa de Trabajo | Camisa de Mezclilla sin Reflejante | 290.00 | 290.00 | Sin reflejante | 5PZ | 20PZ | CH,M,G,XL,XXL,XXXL | +IVA |
| 66 | Ropa de Trabajo | Pantalon de Mezclilla con Reflejante | 305.00 | 305.00 | Con reflejante | 12PZ | 100PZ | 28-42 | +IVA |
| 67 | Ropa de Trabajo | Pantalon de Mezclilla sin Reflejante | 290.00 | 290.00 | Sin reflejante | 12PZ | 100PZ | 28-42 | +IVA |
| 68 | Ropa de Trabajo | Mandil de Mezclilla sin Bolsa | 32.90 | 32.90 | Sin bolsa | 5PZ | 50PZ | Unitalla | +IVA |
| 69 | Ropa de Trabajo | Mandil de Mezclilla con Bolsa | 40.90 | 40.90 | Con bolsa | 5PZ | 50PZ | Unitalla | +IVA |
| 70 | Ropa de Trabajo | Manga de Mezclilla | 40.80 | 40.80 | - | 10 pares | 50 pares | Unitalla | +IVA |
| 71 | Ropa de Trabajo | Mandil de Carnaza 50x80 | 108.90 | 108.90 | - | 5PZ | 50PZ | Unitalla | +IVA |
| 72 | Ropa de Trabajo | Mandil de Carnaza 60x95 | 148.90 | 148.90 | - | 5PZ | 100PZ | Unitalla | +IVA |
| 73 | Ropa de Trabajo | Mangas de Carnaza | 108.90 | 108.90 | - | 5 pares | 50 pares | Unitalla | +IVA |
| 74 | Ropa de Trabajo | Manga Anticorte | 156.90 | 156.90 | - | 12 pares | 120 pares | Unitalla | +IVA |
| 75 | Ropa de Trabajo | Impermeable Gabardina | 190.00 | 190.00 | - | 1PZ | 20PZ | M, XL | +IVA |
| 76 | Proteccion Alturas | Arnes Cuerpo Completo 1 Aro | 650.00 | 650.00 | - | 5PZ | 15PZ | Unitalla | +IVA |
| 77 | Proteccion Alturas | Arnes Cuerpo Completo 3 Aros | 650.00 | 650.00 | - | 5PZ | 15PZ | Unitalla | +IVA |
| 78 | Proteccion Alturas | Linea de Vida Doble Gancho Grande | 550.00 | 550.00 | - | 5PZ | 15PZ | Unitalla | +IVA |
| 79 | Proteccion Alturas | Punto Fijo | 160.00 | 160.00 | - | 5PZ | 15PZ | Unitalla | +IVA |
| 80 | Limitacion Vial | Trafitambo 2 Reflejantes | 550.00 | 550.00 | - | 1PZ | - | N/A | +IVA |
| 81 | Limitacion Vial | Poste Limitador con Reflejante | 345.00 | 345.00 | - | 5PZ | 15PZ | N/A | +IVA |
| 82 | Limitacion Vial | Malla Delimitadora | 345.00 | 345.00 | - | 5PZ | 25PZ | N/A | +IVA |
| 83 | Limitacion Vial | Banderola de Malla Reflejante | 42.90 | 42.90 | - | 5PZ | 15PZ | N/A | +IVA |

### OPERACIONES DISPONIBLES

#### 1. VER CATALOGO
Muestra el catalogo completo o filtrado por categoria. Lee el archivo XLSX y muestra los datos en tabla.

#### 2. MODIFICAR PRECIOS POR PORCENTAJE
Cuando el usuario diga algo como "baja 10%", "sube 20%", "descuento del 15%", "-10%", "+20%":

- **Reducir**: Multiplica `Precio_Actual_MXN` por `(1 - porcentaje/100)`. Redondea a 2 decimales.
- **Aumentar**: Multiplica `Precio_Actual_MXN` por `(1 + porcentaje/100)`. Redondea a 2 decimales.
- Puede aplicarse a:
  - **Todo el catalogo**: "baja todo 10%"
  - **Una categoria**: "sube proteccion visual 15%"
  - **Un producto especifico**: "baja el casco mundial 5%"
- Siempre muestra tabla comparativa ANTES/DESPUES con la diferencia en pesos.
- `Precio_Base_MXN` NUNCA se modifica (es referencia del precio original del PDF).

#### 3. RESTAURAR PRECIOS
"Restaurar precios" = copiar `Precio_Base_MXN` a `Precio_Actual_MXN` (volver al precio original del PDF).

#### 4. AGREGAR PRODUCTO NUEVO
Pide al usuario: Categoria, Nombre, Precio, Variante, Multiplo de venta, Caja Master, Tallas.
Asigna el siguiente numero correlativo. El `Precio_Base_MXN` y `Precio_Actual_MXN` inician iguales.

#### 5. ELIMINAR PRODUCTO
Elimina por numero o nombre. Pide confirmacion antes de borrar.

#### 6. EXPORTAR
Genera/actualiza el archivo XLSX con los datos actuales. Usa la skill `xlsx` para crear el archivo.

### FORMATO DE RESPUESTA

Siempre responde en espanol. Al modificar precios, muestra:

```
AJUSTE DE PRECIOS - MICSA Supply
================================
Operacion: [Reduccion/Aumento] del [X]%
Aplicado a: [Todo/Categoria/Producto]

| Producto | Precio Anterior | Precio Nuevo | Diferencia |
|----------|----------------|--------------|------------|
| ...      | $XXX.XX        | $XXX.XX      | -$XX.XX    |

Archivo actualizado: catalogo_micsa_supply.xlsx
```

### NOTAS IMPORTANTES
- Todos los precios son en MXN + IVA
- Usa la skill `xlsx` para leer/escribir el archivo Excel
- Si el usuario pide "generar cotizacion" o "lista para cliente X", genera un XLSX filtrado con solo los productos solicitados
- Mantiene historial: `Precio_Base_MXN` = precio original del PDF, `Precio_Actual_MXN` = precio con ajustes
