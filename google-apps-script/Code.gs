function doGet(e) {
  return handleRequest(e, null);
}

function doPost(e) {
  return handleRequest(e, e.postData ? JSON.parse(e.postData.contents) : {});
}

function handleRequest(e, body) {
  try {
    const p = e.parameter || {};
    const action = p.action || (body && body.action);
    const sheetName = p.sheet || (body && body.sheet);

    if (!sheetName) throw new Error('sheet parameter required');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ws = ss.getSheetByName(sheetName);
    if (!ws) throw new Error('Sheet not found: ' + sheetName);

    let result;
    switch (action) {
      case 'read':   result = readSheet(ws, p); break;
      case 'write':  result = writeRow(ws, body.data); break;
      case 'update': result = updateRow(ws, Number(body.rowId), body.data); break;
      case 'delete': result = deleteRow(ws, Number(body.rowId)); break;
      default: throw new Error('Unknown action: ' + action);
    }

    return json({ success: true, data: result });
  } catch (err) {
    return json({ success: false, error: err.message });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function readSheet(ws, p) {
  const all = ws.getDataRange().getValues();
  if (all.length < 2) return [];

  const headers = all[0];
  let rows = all.slice(1).map((row, i) => {
    const obj = { _rowId: i + 2 };
    headers.forEach((h, j) => { obj[h] = row[j]; });
    return obj;
  }).filter(row =>
    Object.entries(row)
      .filter(([k]) => k !== '_rowId')
      .some(([, v]) => v !== '' && v !== null && v !== undefined)
  );

  // Filter by month YYYY-MM (for Kassa, Zakaz)
  if (p.month) {
    const [yr, mo] = p.month.split('-').map(Number);
    rows = rows.filter(r => {
      const d = new Date(r['Sana'] || r['Oy']);
      return d.getFullYear() === yr && d.getMonth() + 1 === mo;
    });
  }

  // Filter by date range (for Kassa recent operations)
  if (p.dateFrom && p.dateTo) {
    const from = new Date(p.dateFrom);
    const to = new Date(p.dateTo);
    to.setHours(23, 59, 59);
    rows = rows.filter(r => {
      const d = new Date(r['Sana']);
      return d >= from && d <= to;
    });
  }

  // Filter Maosh by Oy (YYYY-MM string; handle Sheets auto-parsing Oy as Date)
  if (p.oy) {
    rows = rows.filter(r => {
      const val = r['Oy'] instanceof Date
        ? r['Oy'].getFullYear() + '-' + String(r['Oy'].getMonth() + 1).padStart(2, '0')
        : String(r['Oy']).slice(0, 7);
      return val === p.oy;
    });
  }

  return rows.map(r => {
    // Serialize Date objects to ISO strings
    Object.keys(r).forEach(k => {
      if (r[k] instanceof Date) r[k] = r[k].toISOString().split('T')[0];
    });
    return r;
  });
}

function writeRow(ws, data) {
  const headers = ws.getRange(1, 1, 1, ws.getLastColumn()).getValues()[0];
  const row = headers.map(h => (data[h] !== undefined ? data[h] : ''));
  ws.appendRow(row);
  return { rowId: ws.getLastRow() };
}

function updateRow(ws, rowId, data) {
  const headers = ws.getRange(1, 1, 1, ws.getLastColumn()).getValues()[0];
  headers.forEach((h, i) => {
    if (data[h] !== undefined) {
      ws.getRange(rowId, i + 1).setValue(data[h]);
    }
  });
  return { success: true };
}

function deleteRow(ws, rowId) {
  ws.deleteRow(rowId);
  return { success: true };
}
