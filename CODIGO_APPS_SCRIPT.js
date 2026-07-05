/**
 * MUNICIPALIDAD DE CATEMU
 * Sistema de Registro de Capacitaciones - Transparencia Activa
 * Resolución CPLT N°80
 *
 * INSTRUCCIONES:
 * 1. Abre https://sheets.google.com y crea una planilla llamada "Registro Capacitaciones"
 * 2. Ve a Extensiones > Apps Script
 * 3. Borra el código existente y pega este archivo
 * 4. Guarda (Ctrl+S) y nómbralo "Sistema Capacitaciones"
 * 5. Haz clic en "Implementar" > "Nueva implementación"
 * 6. Tipo: "App web", Ejecutar como: "Yo", Acceso: "Cualquiera"
 * 7. Implementa y COPIA LA URL que aparece (la necesitas para el index.html)
 */

const SHEET_SESIONES = 'Sesiones';
const SHEET_PARTICIPANTES = 'Participantes';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'crearSesion') {
      return crearSesion(data);
    } else if (action === 'registrarParticipante') {
      return registrarParticipante(data);
    } else {
      return errorJson('Accion no valida');
    }
  } catch (err) {
    return errorJson(err.toString());
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'obtenerSesion') {
      return obtenerSesion(e.parameter.sessionCode);
    } else if (action === 'obtenerParticipantes') {
      return obtenerParticipantes(e.parameter.sessionCode);
    } else if (action === 'obtenerTodasSesiones') {
      return obtenerTodasSesiones();
    } else {
      return errorJson('Accion no valida');
    }
  } catch (err) {
    return errorJson(err.toString());
  }
}

function crearSesion(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, SHEET_SESIONES,
    ['SessionCode', 'Capacitador', 'Fecha', 'Unidad', 'Temas', 'Observaciones', 'Creado']);

  const now = new Date();
  const count = sheet.getLastRow();
  const sessionCode = 'SES-' + Utilities.formatDate(now, 'GMT-4', 'yyyyMMdd') + '-' + String(count).padStart(3, '0');

  const temas = Array.isArray(data.temas) ? data.temas.join('; ') : data.temas || '';

  sheet.appendRow([sessionCode, data.capacitador, data.fecha, data.unidad, temas, data.observaciones, now]);

  return jsonOutput({ success: true, sessionCode: sessionCode });
}

function registrarParticipante(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, SHEET_PARTICIPANTES,
    ['Timestamp', 'SessionCode', 'Nombre', 'RUT', 'Email', 'Unidad', 'Cargo', 'Declaracion']);

  sheet.appendRow([new Date(), data.sessionCode, data.nombre, data.rut, data.email, data.unidad, data.cargo, 'Si']);

  return jsonOutput({ success: true });
}

function obtenerSesion(sessionCode) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SESIONES);
  if (!sheet) return errorJson('No hay sesiones');

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return errorJson('No hay sesiones registradas');

  const headers = data[0];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === sessionCode) {
      const sesion = {};
      headers.forEach(function (h, idx) { sesion[h] = data[i][idx]; });
      return jsonOutput({ success: true, sesion: sesion });
    }
  }
  return errorJson('Sesion no encontrada');
}

function obtenerParticipantes(sessionCode) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PARTICIPANTES);
  if (!sheet) return jsonOutput({ success: true, participantes: [] });

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return jsonOutput({ success: true, participantes: [] });

  const headers = data[0];
  const participantes = [];

  for (let i = 1; i < data.length; i++) {
    if (!sessionCode || sessionCode === 'todas' || data[i][1] === sessionCode) {
      const p = {};
      headers.forEach(function (h, idx) { p[h] = data[i][idx]; });
      participantes.push(p);
    }
  }

  return jsonOutput({ success: true, participantes: participantes });
}

function obtenerTodasSesiones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_SESIONES);
  if (!sheet) return jsonOutput({ success: true, sesiones: [] });

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return jsonOutput({ success: true, sesiones: [] });

  const headers = data[0];
  const sesiones = [];
  for (let i = 1; i < data.length; i++) {
    const s = {};
    headers.forEach(function (h, idx) { s[h] = data[i][idx]; });
    sesiones.push(s);
  }

  return jsonOutput({ success: true, sesiones: sesiones });
}

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorJson(msg) {
  return jsonOutput({ success: false, error: msg });
}
