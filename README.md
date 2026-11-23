# 🤖 AI Project Auditor

> Extensión de VS Code para **auditar proyectos** y generar **contexto listo para asistentes de IA**.

Escanea tu espacio de trabajo, detecta errores y advertencias con los diagnósticos de VS Code, y produce un índice que puedes pegar directamente en una IA para darle contexto de tu proyecto.

---

## ✨ Características

- 🔍 Escanea los archivos de código de la primera carpeta abierta.
- 🧠 Reconoce archivos de **TypeScript, JavaScript, Python, C/C++, C#, Java, Kotlin, Scala, Rust, Go, Ruby, PHP, Swift, Objective-C, Shell, SQL, Lua y Dart**.
- 🚫 Excluye automáticamente `node_modules`, `.git`, `out`, `dist`, `build` y `.audit`.
- 📊 Consulta los diagnósticos de VS Code y contabiliza errores y advertencias.
- ⏳ Muestra una barra de progreso **cancelable** durante el análisis.
- 📦 Genera `.audit/audit.json` (datos estructurados) y `.audit/INDEX.md` (resumen legible).
- 📋 Copia el índice al **portapapeles** al terminar, listo para pegar en una IA.

---

## 📥 Instalación

**Desde el código fuente**
```bash
git clone https://github.com/PaonSaphir/ai-project-auditor.git
cd ai-project-auditor
npm install
npm run compile
code .
