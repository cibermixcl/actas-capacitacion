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
    ['SessionCode', 'Capacitador', 'Fecha', 'HoraInicio', 'HoraTermino', 'Unidad', 'Temas', 'Observaciones', 'Creado']);

  const now = new Date();
  const count = sheet.getLastRow();
  const sessionCode = 'SES-' + Utilities.formatDate(now, 'GMT-4', 'yyyyMMdd') + '-' + String(count).padStart(3, '0');

  const temas = Array.isArray(data.temas) ? data.temas.join('; ') : data.temas || '';

  sheet.appendRow([sessionCode, data.capacitador, data.fecha, data.horaInicio || '', data.horaTermino || '', data.unidad, temas, data.observaciones, now]);

  return jsonOutput({ success: true, sessionCode: sessionCode });
}

function registrarParticipante(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet(ss, SHEET_PARTICIPANTES,
    ['Timestamp', 'SessionCode', 'Nombre', 'RUT', 'Email', 'Unidad', 'Cargo', 'Declaracion']);

  sheet.appendRow([new Date(), data.sessionCode, data.nombre, data.rut, data.email, data.unidad, data.cargo, 'Si']);

  // Enviar email de confirmación
  try {
    var sesionSheet = ss.getSheetByName(SHEET_SESIONES);
    if (sesionSheet && data.email) {
      var sesData = sesionSheet.getDataRange().getValues();
      var sesHeaders = sesData[0];
      var idxTemas = sesHeaders.indexOf('Temas');
      var idxObs = sesHeaders.indexOf('Observaciones');
      var temas = '—', observaciones = '—';
      for (var i = 1; i < sesData.length; i++) {
        if (sesData[i][0] === data.sessionCode) {
          if (idxTemas >= 0) temas = sesData[i][idxTemas] || '—';
          if (idxObs >= 0) observaciones = sesData[i][idxObs] || '—';
          break;
        }
      }
      var asunto = 'Confirmación de Registro - Capacitación / Inducción';
      var cuerpo = 'Estimado/a ' + data.nombre + ',\n\n' +
        'Hemos registrado su participación en la capacitación/inducción.\n\n' +
        'Sesión: ' + data.sessionCode + '\n' +
        'Temas: ' + temas + '\n' +
        'Observaciones: ' + observaciones + '\n\n' +
        'Usted ha firmado electrónicamente aceptando la declaración.\n\n' +
        'Este es un correo automático, por favor no responder.';
      MailApp.sendEmail({
        to: data.email,
        subject: asunto,
        body: cuerpo,
        name: 'Sistema de Capacitaciones - Municipalidad de Catemu'
      });
    }
  } catch (e) {
    // Si falla el envío de email, no interrumpe el registro
  }

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

function getOrCreateSheet(ss, name, expectedHeaders) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(expectedHeaders);
    sheet.setFrozenRows(1);
  } else if (name === SHEET_SESIONES) {
    ensureSesionHeaders(sheet, expectedHeaders);
  }
  return sheet;
}

function ensureSesionHeaders(sheet, expectedHeaders) {
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(expectedHeaders);
    sheet.setFrozenRows(1);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  let match = currentHeaders.length === expectedHeaders.length;
  if (match) {
    for (let i = 0; i < expectedHeaders.length; i++) {
      if (currentHeaders[i] !== expectedHeaders[i]) { match = false; break; }
    }
  }
  if (match) return;

  // Migrate: insert HoraInicio and HoraTermino after Fecha (col 3)
  if (currentHeaders.indexOf('HoraInicio') === -1) {
    sheet.insertColumns(4);
  }
  if (currentHeaders.indexOf('HoraTermino') === -1) {
    sheet.insertColumns(5);
  }

  // Write the complete header row
  const colCount = sheet.getLastColumn();
  if (colCount < expectedHeaders.length) {
    sheet.insertColumns(colCount + 1, expectedHeaders.length - colCount);
  }
  sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorJson(msg) {
  return jsonOutput({ success: false, error: msg });
}
