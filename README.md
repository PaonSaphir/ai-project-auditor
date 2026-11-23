# 🤖 AI Project Auditor

> **Extensión de VS Code para auditar proyectos y generar contexto optimizado para IA.**

Analiza la estructura de tu proyecto, identifica patrones y genera un resumen de contexto listo para alimentar a modelos de lenguaje (LLMs) o para documentación automática.

---

## ✨ Características

- 🔍 **Auditoría rápida**: Escanea tu espacio de trabajo en busca de archivos clave.
- 📝 **Generación de contexto**: Crea un archivo `CONTEXT.md` o `PROMPT.md` optimizado para IA.
- ⚙️ **Configurable**: Ignora archivos automáticamente usando tu `.gitignore`.
- 🚀 **Ligero y rápido**: Escrito en TypeScript, sin dependencias pesadas.

---

## 📸 Demostración

*(Aquí iría un GIF o captura de pantalla de la extensión en acción. Ej: mostrando el comando en la paleta de VS Code y el archivo generado).*

![Demo de AI Project Auditor](https://via.placeholder.com/800x400?text=Captura+de+la+extension+en+VS+Code)

---

## 📥 Instalación

1. Abre VS Code.
2. Ve a la vista de Extensiones (`Ctrl+Shift+X`).
3. Busca `AI Project Auditor` (o instala desde el archivo `.vsix` si aún no está en el Marketplace).
4. Haz clic en **Instalar**.

---

## 🚀 Cómo usar

1. Abre tu proyecto en VS Code.
2. Abre la Paleta de Comandos (`Ctrl+Shift+P` o `Cmd+Shift+P` en Mac).
3. Escribe y selecciona: **`AI Auditor: Generate Project Context`**.
4. La extensión escaneará tu proyecto y generará el archivo de contexto en la raíz.

### Comandos disponibles
- `AI Auditor: Generate Project Context`: Genera el archivo de contexto principal.
- `AI Auditor: Clean Context`: Elimina archivos de contexto generados previamente.

---

## ⚙️ Configuración

Esta extensión no requiere configuración inicial, pero puedes personalizarla en `settings.json`:

```json
{
  "aiProjectAuditor.outputFileName": "PROMPT.md",
  "aiProjectAuditor.includeComments": true
}
