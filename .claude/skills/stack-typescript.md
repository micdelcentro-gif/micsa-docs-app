---
name: stack-typescript
description: "Contexto de stack TypeScript. Activa cuando el proyecto usa typescript, tsconfig.json, tipos explícitos."
---
# Stack TypeScript
- strict: true siempre en tsconfig
- No usar any — usar unknown y narrowing
- Tipos en interfaces para objetos públicos, type para unions/intersections
- Zod para validación en runtime de datos externos
- No castear con as — mejor narrowing o type guards
