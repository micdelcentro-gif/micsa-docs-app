---
name: "MICSA Brain"
description: "Organiza y estructura las PCs de MICSA en MICSA-Brain para alimentar un agente de conocimiento local. Usa este skill cuando Jordan necesite: inventariar archivos dispersos, crear la estructura de carpetas MICSA-Brain, migrar archivos, o preparar el contexto para el agente Claude Code + MCP."
---

# MICSA Brain

## Qué hace este skill
Ejecuta el plan por fases para consolidar todo el conocimiento de MICSA (archivos, código, docs, media) en una estructura unificada `~/MICSA-Brain/` (Mac) o `C:\MICSA-Brain\` (Windows) desde donde un agente Claude Code + MCP se alimenta automáticamente.

**Base activa en Mac**: `~/MICSA-Brain/` — ya creada con CLAUDE.md, mapa de archivos, empresa y protocolos.
**Contexto maestro del agente**: `~/MICSA-Brain/AGENT/CLAUDE.md`

## Reglas de operación
- **NUNCA saltar fases** — cada fase depende de la anterior
- **Fase 1 siempre primero** — no mover nada sin inventario previo
- **No tocar GitHub** — el código vive en repos, solo se referencia
- **Avisar antes de mover** — confirmar con Jordan antes de migrar archivos

---

## Fase 1: Inventario

**Objetivo**: Saber qué hay y dónde, sin mover nada.

```bash
# En la PC Windows de Jordan, abrir PowerShell y correr:
python scripts/inventory.py
```

Genera `inventory_report.md` con:
- Lista de todos los archivos por tipo
- Rutas completas, tamaño y fecha
- Resumen de cuántos archivos hay de cada tipo

**Completado cuando**: existe `inventory_report.md` con el mapa completo.

---

## Fase 2: Crear Estructura MICSA-Brain

**Objetivo**: Crear la estructura base del cerebro del agente.

**Mac** (completado — 2026-04-05):
```
~/MICSA-Brain/
├── AGENT/CLAUDE.md              ← contexto maestro
├── AGENT/context/micsa_map.md   ← mapa de archivos
├── KNOWLEDGE/empresa.md
├── KNOWLEDGE/protocolos.md      ← Código Jordan
└── CODE/repos.md                ← repos GitHub
```

**Windows** (pendiente — ejecutar en PC):
```bash
python scripts/create_structure.py
```

**Completado cuando**: `~/MICSA-Brain/AGENT/CLAUDE.md` existe (Mac) o `C:\MICSA-Brain\AGENT\` existe (Windows).

---

## Fase 3: Migración (pendiente)

Revisar `inventory_report.md` con Jordan y decidir qué va a qué carpeta antes de mover nada.

## Fase 4: Extracción de conocimiento (pendiente)

El agente lee `C:\MICSA-Brain\` y construye su base de contexto.

## Fase 5: Agente activo (pendiente)

Claude Code + CLAUDE.md + MCP orquesta todo desde MICSA-Brain.

---

## Scripts disponibles
- `scripts/inventory.py` — escanea la PC y genera inventario
- `scripts/create_structure.py` — crea la estructura de carpetas
