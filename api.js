async function apiGet(sheet, params = {}) {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.set('action', 'read');
  url.searchParams.set('sheet', sheet);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

async function apiPost(action, sheet, payload = {}) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ action, sheet, ...payload })
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

const api = {
  read:   (sheet, params = {})          => apiGet(sheet, params),
  write:  (sheet, data)                 => apiPost('write',  sheet, { data }),
  update: (sheet, rowId, data)          => apiPost('update', sheet, { rowId, data }),
  remove: (sheet, rowId)                => apiPost('delete', sheet, { rowId })
};
