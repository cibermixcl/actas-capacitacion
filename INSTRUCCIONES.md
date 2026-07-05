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
2. Busca esta línea (aproximadamente línea 346):
   ```javascript
   API_URL: 'AQUI_VA_LA_URL_DE_TU_APPS_SCRIPT',
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

1. **Abre el link** → Verás la pantalla de "Firmar"
2. **Haz clic en "Configurar"** → Te pedirá contraseña (la que configuraste)
3. **Ingresa como admin** → Configura: capacitador, fecha, unidad, temas
4. **Guarda la sesión** → Aparecerá un código como `SES-20250704-001`
5. **Comparte el código** con los participantes (pizarra, WhatsApp, etc.)
6. **Los participantes** abren el link, ingresan el código y llenan sus datos
7. **Tú ves en vivo** quién ha firmado en el Dashboard
8. **Exporta Excel** cuando quieras
9. **Genera reportes individuales** desde la pestaña "Reportes"

---

## 6. USO DIARIO

### Cada vez que capacites:

1. Abre el link
2. Ingresa como admin
3. Crea una nueva sesión con los datos de la capacitación
4. Comparte el código con los participantes
5. Ellos firman desde su celular
6. Al final, exporta el Excel y genera los reportes individuales (PDF)
7. Guarda los PDFs en una carpeta mensual para adjuntarlos a tu boleta

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
| `INSTRUCCIONES.md` | Este archivo |

### Columnas en Google Sheets:

**Pestaña "Sesiones":**
`SessionCode | Capacitador | Fecha | Unidad | Temas | Observaciones | Creado`

**Pestaña "Participantes":**
`Timestamp | SessionCode | Nombre | RUT | Email | Unidad | Cargo | Declaracion`

### Tecnologías usadas:

- HTML + CSS + JavaScript (vanilla, sin frameworks)
- Google Apps Script (API REST)
- Google Sheets (base de datos)
- SheetJS / XLSX (exportación Excel)
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

---

¿Dudas? Eres libre de modificar el código HTML según tus necesidades.
