# INSTRUCCIONES DE CONFIGURACIÓN

## Sistema de Registro de Capacitaciones — Transparencia Activa
### Municipalidad de Catemu — Resolución CPLT N°80

---

## 1. CREAR LA BASE DE DATOS (Google Sheets)

1. Abre [sheets.google.com](https://sheets.google.com) e inicia sesión con tu cuenta municipal.
2. Crea una planilla nueva con el nombre: `Registro Capacitaciones Transparencia`
3. (Opcional) Crea 2 pestañas dentro de la planilla con nombres exactos:
   - `Sesiones`
   - `Participantes`
   - Si no las creas, el sistema las creará automáticamente.

> ⚠️ **Importante:** La planilla debe estar en tu Drive municipal. Nunca compartas el link de edición; los participantes solo usarán el link de la app.

---

## 2. CONFIGURAR GOOGLE APPS SCRIPT (la API)

1. En tu planilla, ve a: **Extensiones > Apps Script**
2. Se abrirá una pestaña nueva. Borra el código que aparece por defecto.
3. Abre el archivo `CODIGO_APPS_SCRIPT.js` que está en esta carpeta, **copia todo su contenido** y pégalo en el editor de Apps Script.
4. Presiona **Ctrl+S** (o haz clic en el ícono de guardar).
5. Ponle nombre al proyecto: `Sistema Capacitaciones`
6. Haz clic en **"Implementar" > "Nueva implementación"**
7. Configura:
   - **Tipo:** App web
   - **Ejecutar como:** Yo (tu correo)
   - **Acceso:** Cualquiera (incluso anónimo)
8. Haz clic en **"Implementar"**
9. **IMPORTANTE:** Aparecerá una URL similar a:
   ```
   https://script.google.com/macros/s/abcdef123456/exec
   ```
   **CÓPIALA.** La necesitas para el siguiente paso.

---

## 3. CONFIGURAR EL index.html

1. Abre el archivo `index.html` con tu editor de código (VS Code, Bloc de Notas, etc.).
2. Busca esta línea (aproximadamente línea 793):
   ```javascript
   API_URL: 'https://script.google.com/...',
   ```
3. **Reemplázala** por la URL que copiaste en el paso anterior:
   ```javascript
   API_URL: 'https://script.google.com/macros/s/abcdef123456/exec',
   ```
4. (Opcional) Cambia la contraseña de administrador:
   ```javascript
   ADMIN_PASSWORD: 'catemu2025',
   ```
   Cámbiala por una clave que solo tú conozcas.
5. Guarda el archivo.

---

## 4. PUBLICAR EN GITHUB PAGES (para tener el link)

### Opción A: GitHub Pages (recomendada)

1. Ve a [github.com](https://github.com) e inicia sesión.
2. Crea un **nuevo repositorio** llamado, por ejemplo: `actas-capacitacion`
   - Puede ser público o privado (si es privado, GitHub Pages igual funciona).
3. Sube los archivos al repositorio:
   - `index.html`
   - `CODIGO_APPS_SCRIPT.js`
   - `INSTRUCCIONES.md`
4. Ve a **Settings > Pages**
5. En "Branch": selecciona `main` (o `master`) y carpeta `/root`
6. Guarda. Espera 1-2 minutos.
7. **Obtendrás un link como:**
   ```
   https://tugithub.github.io/actas-capacitacion/
   ```

### Opción B: Vercel (alternativa gratuita)

1. Ve a [vercel.com](https://vercel.com) y crea cuenta con GitHub.
2. Importa el repositorio que creaste.
3. Vercel publica automáticamente y te da un link como:
   ```
   https://actas-capacitacion.vercel.app
   ```

---

## 5. PROBAR EL SISTEMA

Abre el link que generaste desde tu celular y desde un computador.

### Flujo de prueba:

1. **Abre el link** → Verás la pantalla de "Firmar" (es la principal)
2. **Haz clic en "🔐 Admin"** (esquina superior derecha) → Te pedirá contraseña
3. **Ingresa como admin** → Configura: capacitador, fecha, **hora inicio, hora término**, unidad, temas
4. **Guarda la sesión** → Aparecerá un código como `SES-20250704-001` y un **código QR**
5. **Comparte el código o el QR** con los participantes (pizarra, WhatsApp, imprimir QR, etc.)
6. **Los participantes** abren el link desde el celular:
   - Opción A: escanean el QR → se abre la app con el código ya escrito
   - Opción B: ingresan el código manualmente en la pestaña Firmar
7. **Llenan sus datos** — El RUT se formatea automáticamente (12.345.678-9)
   - Aparece el **horario** de la capacitación y un texto informativo sobre **protección de datos personales**
8. **Aceptan la declaración y firman** → Reciben un **email de confirmación** automático
9. **Tú ves en vivo** quién ha firmado en el Dashboard
10. **Exporta Excel** cuando quieras
11. **Genera reportes individuales** desde "Reportes" o usa **"📄 Generar todos"** para imprimir actas de todos los participantes en lote — las actas incluyen Fecha, **Hora inicio** y **Hora término**
12. **Imprime el listado grupal** desde el Dashboard con el botón **"📋 Listado grupal"** — incluye **Horario** en la cabecera, los RUT y emails aparecen enmascarados (Ley 21.719)
13. **Personaliza** en la pestaña **"⚙ Ajustes"**: textos, logo

---

## 5.1 PESTAÑA AJUSTES (Personalización)

En la pestaña **"⚙ Ajustes"** (visible solo para admin) puedes personalizar:

| Campo | Descripción | Ejemplo |
|---|---|---|
| Nombre municipalidad | Aparece en el encabezado de la app y en actas | `Municipalidad de Catemu` |
| Título del acta | Título del reporte individual | `ACTA DE CAPACITACIÓN / INDUCCIÓN` |
| Subtítulo del acta | Bajo el título en actas | `Ley de Transparencia — Resolución CPLT N°80` |
| Logo | Texto, emoji o imagen subida | `🏛` o escudo municipal en JPG/PNG |
| Título listado grupal | Encabezado del listado imprimible | `LISTADO DE ASISTENCIA` |
| Texto de declaración | Texto que el participante acepta al firmar | `Declaro que...` |

Los cambios se guardan en **localStorage** (tu navegador). Si cambias de navegador o computador, deberás configurarlos de nuevo.

---

## 6. USO DIARIO

### Cada vez que capacites:

1. Abre el link
2. Haz clic en **"🔐 Admin"** e ingresa como admin
3. Crea una nueva sesión con los datos de la capacitación (incluye **hora inicio** y **hora término**)
4. **Comparte el QR** o el código con los participantes
5. Ellos firman desde su celular (escaneando el QR o escribiendo el código) — el RUT se formatea solo
6. Al final, exporta el Excel y genera los reportes individuales (PDF) — las actas incluyen Fecha, **Hora inicio** y **Hora término**
7. **Opcional:** usa **"📄 Generar todos"** en Reportes para imprimir un PDF con todas las actas
8. **Opcional:** usa **"📋 Listado grupal"** en Dashboard para imprimir la lista de asistencia (incluye **Horario** en cabecera)
9. Guarda los PDFs en una carpeta mensual para adjuntarlos a tu boleta

### Ejemplo de estructura de carpetas:

```
📁 Respaldos Capacitaciones/
   ├── 📁 2025-07 Julio/
   │   ├── 📄 Registro_2025-07-04.xlsx
   │   ├── 📄 Acta_Juan_Perez.pdf
   │   ├── 📄 Acta_Maria_Gonzalez.pdf
   │   └── 📄 Acta_Pedro_Lopez.pdf
   ├── 📁 2025-08 Agosto/
   │   └── ...
   └── ...
```

---

## 7. DATOS TÉCNICOS

### Archivos incluidos:

| Archivo | Propósito |
|---|---|
| `index.html` | Aplicación web completa (frontend) |
| `CODIGO_APPS_SCRIPT.js` | Backend API para Google Sheets |
| `INSTRUCCIONES.md` | Guía de configuración y uso |
| `AGENTS.md` | Contexto para asistentes IA (opencode) |
| `handoff.md` | Documentación técnica para desarrolladores |

### Columnas en Google Sheets:

**Pestaña "Sesiones":**
`SessionCode | Capacitador | Fecha | HoraInicio | HoraTermino | Unidad | Temas | Observaciones | Creado`

**Pestaña "Participantes":**
`Timestamp | SessionCode | Nombre | RUT | Email | Unidad | Cargo | Declaracion`

### Tecnologías usadas:

- HTML + CSS + JavaScript (vanilla, sin frameworks)
- Google Apps Script (API REST) — incluye envío automático de emails con `MailApp`
- Google Sheets (base de datos)
- SheetJS / XLSX (exportación Excel)
- QRCode.js (generación de códigos QR)
- GitHub Pages o Vercel (hosting)

---

## 8. SOLUCIÓN DE PROBLEMAS

**Error: "API_URL no configurada"**
→ No has reemplazado la URL en el paso 3. Abre index.html y cámbiala.

**Error: "Sesión no encontrada"**
→ El código de sesión no existe. Verifica que esté bien escrito (mayúsculas).

**Los datos no aparecen en el dashboard**
→ Haz clic en "Refrescar". Si aun así no aparecen, revisa que la URL del API sea correcta.

**Error 404 al abrir el link de GitHub Pages**
→ Espera 2 minutos después de publicar. Revisa que index.html esté en la raíz del repositorio.

**CORS / Error de conexión**
→ Google Apps Script puede tardar en responder la primera vez (~5 segundos). Espera y reintenta.

**No veo las pestañas de admin**
→ El sitio publicado en GitHub Pages está desactualizado. Debes subir la nueva versión de `index.html` al repositorio de GitHub. Luego espera 1-2 minutos y haz Ctrl+F5 para recarga forzada.

**Los cambios en Ajustes no se reflejan en los reportes**
→ Los cambios se guardan en el navegador donde los configuraste. Si imprimes desde otro navegador o PC, no estarán. Vuelve a configurarlos allí.

**Error: "La URL del API no está configurada"**
→ Abre `index.html`, busca `API_URL` y reemplázala por la URL que obtuviste al publicar el Apps Script (paso 2).

**El participante no recibe el email de confirmación**
→ Revisa que la bandeja de spam. Si no llega, verifica que el Apps Script esté implementado correctamente y que la cuenta ejecutora tenga permisos de `MailApp.sendEmail()`.

---

¿Dudas? Eres libre de modificar el código HTML según tus necesidades.
