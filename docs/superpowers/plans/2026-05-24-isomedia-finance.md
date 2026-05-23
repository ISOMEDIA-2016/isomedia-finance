# ISOMEDIA Moliyaviy Boshqaruv Tizimi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-based financial management system for ISOMEDIA using Alpine.js + Tailwind (CDN), Google Sheets as database, Google Apps Script as API, hosted on GitHub Pages.

**Architecture:** Single `index.html` file with Alpine.js x-show routing; page logic split into `pages/*.js` files; `api.js` handles all Apps Script communication; `config.js` (gitignored) holds credentials and Apps Script URL.

**Tech Stack:** Alpine.js 3 (CDN), Tailwind CSS 3 (CDN), Chart.js 4 (CDN), Google Apps Script, Google Sheets API, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-05-24-isomedia-finance-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | App shell: CDN imports, login form, sidebar, page slots |
| `app.js` | Alpine root component: auth, routing, role guards |
| `api.js` | All fetch calls to Apps Script (read/write/update/delete) |
| `config.js` | USERS array + APPS_SCRIPT_URL (gitignored) |
| `config.example.js` | Template committed to repo |
| `pages/dashboard.js` | Dashboard Alpine component |
| `pages/kassa.js` | Kassa Alpine component |
| `pages/zakaz.js` | Zakaz Alpine component |
| `pages/maosh.js` | Maosh Alpine component |
| `pages/hisobot.js` | Hisobot Alpine component |
| `pages/db.js` | Ma'lumotnoma Alpine component |
| `assets/isomedia_black.png` | Logo for light backgrounds |
| `assets/isomedia_white.png` | Logo for dark backgrounds |
| `google-apps-script/Code.gs` | Apps Script source (reference copy) |
| `.gitignore` | Excludes config.js |

---

## Task 1: Project skeleton + git

**Files:**
- Create: `index.html` (empty shell)
- Create: `.gitignore`
- Create: `config.example.js`
- Create: `google-apps-script/Code.gs` (empty placeholder)
- Create: `assets/` (copy logos)

- [ ] **Step 1: Create project directory structure**

```bash
cd /Users/macbook/Documents/ISOMEDIA
mkdir -p pages assets google-apps-script docs/superpowers/plans docs/superpowers/specs
```

- [ ] **Step 2: Copy logos to assets/**

```bash
cp "ISOMEDIA LOGO/isomedia_blackPNG.png" assets/isomedia_black.png
cp "ISOMEDIA LOGO/isomedia_whitePNG.png" assets/isomedia_white.png
```

- [ ] **Step 3: Create .gitignore**

Create `.gitignore` with this content:
```
config.js
.DS_Store
*.xlsx
*.zip
*.psd
*.jpg
"ISOMEDIA LOGO/"
```

- [ ] **Step 4: Create config.example.js**

Create `config.example.js`:
```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

const USERS = [
  { username: "admin",    password: "change_me", role: "admin"    },
  { username: "operator", password: "change_me", role: "operator" },
  { username: "viewer",   password: "change_me", role: "viewer"   }
];
```

- [ ] **Step 5: Create config.js (local only, gitignored)**

Copy `config.example.js` to `config.js` and set real passwords.

- [ ] **Step 6: Initialize git and commit skeleton**

```bash
git init
git add .gitignore config.example.js assets/ docs/
git commit -m "chore: project skeleton"
```

Expected: git repo created, config.js not tracked.

---

## Task 2: Google Sheets setup

**Goal:** Create the Google Sheets file with all 10 sheets and correct headers.

- [ ] **Step 1: Create Google Sheets file**

Go to https://sheets.google.com → New spreadsheet → Rename to "ISOMEDIA Moliya".

- [ ] **Step 2: Create Kassa sheet**

Rename "Sheet1" to `Kassa`. Set row 1 headers in columns A–M:
```
Sana | Turi | Summa | Valyuta | Kurs | Hamyon | Manbalar | Yo'nalish | Bo'lim | Aktiv | Passiv | Izoh | Xodim
```

- [ ] **Step 3: Create Zakaz sheet**

Add new sheet named `Zakaz`. Row 1 headers (A–O):
```
Sana | Mijoz | Sub-mijoz | Yo'nalish | Ish_turi | Soni | Narxi | Jami | Avans | Qoldiq | Operator1 | Operator2 | Montajchi | Status | Izoh
```

- [ ] **Step 4: Create Maosh sheet**

Add sheet `Maosh`. Row 1 headers (A–K):
```
Oy | Xodim | Avans | Operator | Arenda | Montaj | PM | Bonus | Jami | Status | Izoh
```

- [ ] **Step 5: Create Reja sheet**

Add sheet `Reja`. Row 1 headers (A–C):
```
Oy | Kunlik_reja | Oylik_reja
```

- [ ] **Step 6: Create DB_Manbalar sheet**

Add sheet `DB_Manbalar`. Row 1 headers (A–D):
```
Nomi | Turi | Xarakat_turi | Doimiy | Izoh
```

Seed data (rows 2+):
```
Tushum | Kirim | Sotish | FALSE |
Boshqa tushumlar | Kirim | Sotish | FALSE |
Administrativ hodimlar fiksa ish haqi | Chiqim | To'lovlar | TRUE |
Xizmat ko'rsatish hodimlari fiksa ish haqi | Chiqim | Tannarx | TRUE |
Tijoriy hodimlar fiksa ish haqi | Chiqim | Tannarx | TRUE |
Administrativ hodimlar o'zgaruvchan ish haqi | Chiqim | Nakladnoy | FALSE |
Xizmat ko'rsatish hodimlari o'zgaruvchan ish haqi | Chiqim | Nakladnoy | FALSE |
Tijoriy hodimlar o'zgaruvchan ish haqi | Chiqim | Nakladnoy | FALSE |
Ijara to'lovi | Chiqim | Nakladnoy | TRUE |
Transport harajatlari (syomka) | Chiqim | Nakladnoy | FALSE |
Bank xizmatlari | Chiqim | Nakladnoy | FALSE |
Oziq-ovqat xarajatlari | Chiqim | Nakladnoy | FALSE |
Uskuna servis/ta'mirlash | Chiqim | Nakladnoy | FALSE |
```

- [ ] **Step 7: Create DB_Xodimlar sheet**

Add sheet `DB_Xodimlar`. Row 1 headers (A–D):
```
Nomi | Lavozim | Telefon | Status
```

- [ ] **Step 8: Create DB_Hamyon sheet**

Add sheet `DB_Hamyon`. Row 1 headers (A–C):
```
Nomi | Valyuta | Status
```

Seed data:
```
Alliance Uzcard | So'm | aktiv
Ipoteka Humo | So'm | aktiv
Karta (Shahzodbek) | So'm | aktiv
Karta (Ismoiljon) | So'm | aktiv
USD | Dollar | aktiv
Bank h/r | So'm | aktiv
Naqd | So'm | aktiv
```

- [ ] **Step 9: Create DB_Kontragent sheet**

Add sheet `DB_Kontragent`. Row 1 headers (A–D):
```
Nomi | Turi | Telefon | Izoh
```

- [ ] **Step 10: Create DB_Xizmat sheet**

Add sheet `DB_Xizmat`. Row 1 headers (A–E):
```
Nomi | Yo'nalish | Ish_turi | Narxi_dollar | Narxi_sum
```

Seed data:
```
Reels Podklyuch | Reels | Podklyuch | 35 |
Reels Podklyuch vyezdnoy | Reels | Podklyuch (vyezdnoy) | 35 |
YouTube Podklyuch | YouTube | Podklyuch | 60 |
YouTube Podklyuch vyezdnoy | YouTube | Podklyuch (vyezdnoy) | 90 |
YouTube Montaj | YouTube | Montaj | 60 |
Podcast x2 | Podcast x2 | Syomka | 125 |
Podcast x2 Montaj | Podcast x2 | Montaj | 125 |
Podcast x3 | Podcast x3 | Syomka | 125 |
Podcast x3 Montaj | Podcast x3 | Montaj | 125 |
Podcast x4 | Podcast x4 | Syomka | 125 |
Podcast x4 Montaj | Podcast x4 | Montaj | 125 |
Studiya ijarasi | Studiya ijarasi | 1ta CAM/operator | | 400000
```

- [ ] **Step 11: Create DB_Yo'nalish sheet**

Add sheet `DB_Yo'nalish`. Row 1 headers (A–B):
```
Nomi | Izoh
```

Seed data:
```
Reels |
YouTube |
Podcast x2 |
Podcast x3 |
Podcast x4 |
Studiya ijarasi |
Seminar |
```

- [ ] **Step 12: Note the Spreadsheet ID**

Copy the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`  
Save it — needed for Apps Script in Task 3.

---

## Task 3: Google Apps Script

**Files:**
- Create: `google-apps-script/Code.gs` (reference copy)

- [ ] **Step 1: Open Apps Script editor**

In Google Sheets → Extensions → Apps Script. Delete existing code.

- [ ] **Step 2: Paste the full Apps Script code**

```javascript
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

  // Filter Maosh by Oy (YYYY-MM string)
  if (p.oy) {
    rows = rows.filter(r => r['Oy'] === p.oy);
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
```

- [ ] **Step 3: Save and deploy as web app**

Click Deploy → New deployment → Type: Web app  
- Execute as: **Me**  
- Who has access: **Anyone** (needed for fetch from GitHub Pages)  
- Click Deploy → Copy the deployment URL.

- [ ] **Step 4: Save Code.gs reference copy**

Save the same code to `google-apps-script/Code.gs` in the project and commit:
```bash
git add google-apps-script/Code.gs
git commit -m "feat: Google Apps Script backend"
```

- [ ] **Step 5: Test the API manually**

Open browser and visit:
`YOUR_APPS_SCRIPT_URL?action=read&sheet=DB_Hamyon`

Expected response:
```json
{"success": true, "data": [{"_rowId": 2, "Nomi": "Alliance Uzcard", ...}]}
```

---

## Task 4: Update config.js with Apps Script URL

**Files:**
- Modify: `config.js` (local only)

- [ ] **Step 1: Update config.js with real URL**

```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_REAL_ID/exec";

const USERS = [
  { username: "admin",    password: "isomedia2026",  role: "admin"    },
  { username: "operator", password: "operator2026",  role: "operator" },
  { username: "viewer",   password: "viewer2026",    role: "viewer"   }
];
```

---

## Task 5: api.js — API layer

**Files:**
- Create: `api.js`

- [ ] **Step 1: Create api.js**

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add api.js
git commit -m "feat: api.js — Apps Script communication layer"
```

---

## Task 6: app.js — auth, routing, Alpine root

**Files:**
- Create: `app.js`

- [ ] **Step 1: Create app.js**

```javascript
function app() {
  return {
    user: null,
    page: 'dashboard',
    loginForm: { username: '', password: '' },
    loginError: '',
    loading: false,

    init() {
      const saved = sessionStorage.getItem('isomedia_user');
      if (saved) {
        this.user = JSON.parse(saved);
        this.page = 'dashboard';
      }
    },

    login() {
      const match = USERS.find(u =>
        u.username === this.loginForm.username &&
        u.password === this.loginForm.password
      );
      if (match) {
        this.user = { username: match.username, role: match.role };
        sessionStorage.setItem('isomedia_user', JSON.stringify(this.user));
        this.loginError = '';
        this.page = 'dashboard';
      } else {
        this.loginError = "Login yoki parol noto'g'ri";
      }
    },

    logout() {
      sessionStorage.removeItem('isomedia_user');
      this.user = null;
      this.page = 'dashboard';
      this.loginForm = { username: '', password: '' };
    },

    navigate(pg) {
      if (this.canAccess(pg)) this.page = pg;
    },

    canAccess(pg) {
      if (!this.user) return false;
      const perms = {
        dashboard: ['admin', 'operator', 'viewer'],
        kassa:     ['admin', 'operator'],
        zakaz:     ['admin', 'operator'],
        maosh:     ['admin', 'operator'],
        hisobot:   ['admin', 'viewer'],
        db:        ['admin', 'operator']
      };
      return (perms[pg] || []).includes(this.user.role);
    },

    canWrite() {
      return this.user && ['admin', 'operator'].includes(this.user.role);
    },

    isAdmin() {
      return this.user && this.user.role === 'admin';
    },

    navItems() {
      return [
        { id: 'dashboard', label: 'Dashboard',      icon: 'home'    },
        { id: 'kassa',     label: 'Kassa',           icon: 'wallet'  },
        { id: 'zakaz',     label: 'Zakaz',           icon: 'list'    },
        { id: 'maosh',     label: 'Maosh',           icon: 'users'   },
        { id: 'hisobot',   label: 'Hisobot',         icon: 'chart'   },
        { id: 'db',        label: "Ma'lumotnoma",    icon: 'db'      }
      ].filter(item => this.canAccess(item.id));
    }
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app.js
git commit -m "feat: app.js — Alpine root, auth, routing"
```

---

## Task 7: index.html — full shell

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="uz" x-data="app()" x-init="init()">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ISOMEDIA — Moliya</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            ios: {
              bg:      '#F2F2F7',
              accent:  '#5856D6',
              green:   '#34C759',
              red:     '#FF3B30',
              orange:  '#FF9500',
              gray:    '#8E8E93',
              dark:    '#1C1C1E'
            }
          },
          fontFamily: { sans: ['Inter', 'sans-serif'] },
          borderRadius: { xl: '16px', '2xl': '20px' }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Inter', sans-serif; background: #F2F2F7; color: #1C1C1E; }
    .card { background: #fff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .sidebar-link { display:flex; align-items:center; gap:10px; padding:10px 16px; border-radius:10px; cursor:pointer; transition:background .15s; font-size:14px; font-weight:500; color:#1C1C1E; }
    .sidebar-link:hover { background:#F2F2F7; }
    .sidebar-link.active { background:#EEF0FF; color:#5856D6; }
    .btn-primary { background:#5856D6; color:#fff; padding:8px 20px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; border:none; transition:opacity .15s; }
    .btn-primary:hover { opacity:0.9; }
    .btn-secondary { background:#F2F2F7; color:#1C1C1E; padding:8px 20px; border-radius:10px; font-size:14px; font-weight:500; cursor:pointer; border:none; }
    .btn-danger { background:#FF3B30; color:#fff; padding:6px 14px; border-radius:8px; font-size:13px; cursor:pointer; border:none; }
    .input-field { width:100%; border:1.5px solid #E5E5EA; border-radius:10px; padding:9px 12px; font-size:14px; outline:none; transition:border-color .15s; font-family:'Inter',sans-serif; }
    .input-field:focus { border-color:#5856D6; }
    .tab-btn { padding:8px 18px; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; border:none; background:transparent; color:#8E8E93; transition:all .15s; }
    .tab-btn.active { background:#5856D6; color:#fff; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    th { text-align:left; padding:10px 12px; color:#8E8E93; font-weight:500; border-bottom:1px solid #F2F2F7; font-size:12px; }
    td { padding:10px 12px; border-bottom:1px solid #F2F2F7; }
    tr:hover td { background:#FAFAFA; }
    .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
    .badge-green { background:#E8FAF0; color:#34C759; }
    .badge-red { background:#FEF0EF; color:#FF3B30; }
    .badge-orange { background:#FFF4E6; color:#FF9500; }
    .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.3); z-index:50; display:flex; align-items:center; justify-content:center; }
    .modal { background:#fff; border-radius:20px; padding:28px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; }
    .spinner { border:3px solid #E5E5EA; border-top-color:#5856D6; border-radius:50%; width:24px; height:24px; animation:spin .7s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }
  </style>
</head>
<body>

<!-- ==================== LOGIN ==================== -->
<div x-show="!user" class="min-h-screen flex items-center justify-center p-4">
  <div class="card p-10 w-full max-w-sm">
    <div class="flex justify-center mb-8">
      <img src="assets/isomedia_black.png" alt="ISOMEDIA" class="h-8 object-contain"/>
    </div>
    <form @submit.prevent="login()" class="space-y-4">
      <div>
        <label class="block text-xs font-medium text-ios-gray mb-1">Foydalanuvchi nomi</label>
        <input x-model="loginForm.username" type="text" class="input-field" placeholder="username" required/>
      </div>
      <div>
        <label class="block text-xs font-medium text-ios-gray mb-1">Parol</label>
        <input x-model="loginForm.password" type="password" class="input-field" placeholder="••••••••" required/>
      </div>
      <div x-show="loginError" class="text-sm text-ios-red" x-text="loginError"></div>
      <button type="submit" class="btn-primary w-full mt-2">Kirish</button>
    </form>
  </div>
</div>

<!-- ==================== APP SHELL ==================== -->
<div x-show="user" class="flex min-h-screen">

  <!-- Sidebar -->
  <aside class="w-60 bg-white flex flex-col py-6 px-4 gap-1 shadow-sm flex-shrink-0">
    <div class="px-3 mb-6">
      <img src="assets/isomedia_black.png" alt="ISOMEDIA" class="h-7 object-contain"/>
    </div>

    <template x-for="item in navItems()" :key="item.id">
      <div
        class="sidebar-link"
        :class="{ active: page === item.id }"
        @click="navigate(item.id)">
        <span class="text-base" x-text="navIcon(item.icon)"></span>
        <span x-text="item.label"></span>
      </div>
    </template>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- User info -->
    <div class="px-3 py-3 rounded-xl bg-ios-bg">
      <div class="text-xs font-medium text-ios-dark" x-text="user && user.username"></div>
      <div class="text-xs text-ios-gray capitalize" x-text="user && user.role"></div>
      <button @click="logout()" class="text-xs text-ios-red mt-2 font-medium">Chiqish</button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 overflow-auto p-6">

    <div x-show="page === 'dashboard'" x-data="dashboard()" x-init="init()">
      <div x-html="render()"></div>
    </div>

    <div x-show="page === 'kassa'" x-data="kassa()" x-init="init()">
      <div x-html="render()"></div>
    </div>

    <div x-show="page === 'zakaz'" x-data="zakaz()" x-init="init()">
      <div x-html="render()"></div>
    </div>

    <div x-show="page === 'maosh'" x-data="maosh()" x-init="init()">
      <div x-html="render()"></div>
    </div>

    <div x-show="page === 'hisobot'" x-data="hisobot()" x-init="init()">
      <div x-html="render()"></div>
    </div>

    <div x-show="page === 'db'" x-data="db()" x-init="init()">
      <div x-html="render()"></div>
    </div>

  </main>
</div>

<!-- ==================== SCRIPTS ==================== -->
<script src="config.js"></script>
<script src="api.js"></script>
<script src="pages/dashboard.js"></script>
<script src="pages/kassa.js"></script>
<script src="pages/zakaz.js"></script>
<script src="pages/maosh.js"></script>
<script src="pages/hisobot.js"></script>
<script src="pages/db.js"></script>
<script src="app.js"></script>
<script>
  // Nav icons
  function navIcon(name) {
    const icons = {
      home:   '🏠', wallet: '💳', list: '📋',
      users:  '👥', chart:  '📊', db:   '🗂️'
    };
    return icons[name] || '•';
  }
</script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
</body>
</html>
```

**Note:** The page components use a hybrid approach — Alpine x-data initializes data, but HTML rendering for complex tables happens via template literals in `render()`. This avoids bloating index.html with 6 large template blocks. Each pages/*.js file exports a function that returns an Alpine component object with `init()` and `render()` methods, plus event handlers.

- [ ] **Step 2: Verify login works**

Open `index.html` in browser (file:// or local server).  
Expected: Login form shows ISOMEDIA logo. Enter `admin` / `isomedia2026` → sidebar appears with all nav items.  
Enter `viewer` / `viewer2026` → sidebar shows Dashboard and Hisobot only.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: index.html — app shell, login, sidebar routing"
```

---

## Task 8: pages/db.js — Ma'lumotnoma (reference data)

**Files:**
- Create: `pages/db.js`

This module is first because other modules (Kassa form, Zakaz form) need its data for dropdowns.

- [ ] **Step 1: Create pages/db.js**

```javascript
function db() {
  return {
    activeTab: 'manbalar',
    tabs: [
      { id: 'manbalar',   label: 'Manbalar'    },
      { id: 'xodimlar',   label: 'Xodimlar'    },
      { id: 'hamyon',     label: 'Hamyon'       },
      { id: 'kontragent', label: 'Kontragent'   },
      { id: 'xizmat',     label: 'Xizmat'       },
      { id: 'yonalish',   label: "Yo'nalish"    }
    ],
    data: {},
    showForm: false,
    formData: {},
    editRowId: null,
    loading: false,
    error: '',

    sheetFor(tab) {
      const map = {
        manbalar:   'DB_Manbalar',
        xodimlar:   'DB_Xodimlar',
        hamyon:     'DB_Hamyon',
        kontragent: 'DB_Kontragent',
        xizmat:     'DB_Xizmat',
        yonalish:   "DB_Yo'nalish"
      };
      return map[tab];
    },

    fieldsFor(tab) {
      const fields = {
        manbalar:   ['Nomi','Turi','Xarakat_turi','Doimiy','Izoh'],
        xodimlar:   ['Nomi','Lavozim','Telefon','Status'],
        hamyon:     ['Nomi','Valyuta','Status'],
        kontragent: ['Nomi','Turi','Telefon','Izoh'],
        xizmat:     ['Nomi',"Yo'nalish",'Ish_turi','Narxi_dollar','Narxi_sum'],
        yonalish:   ['Nomi','Izoh']
      };
      return fields[tab] || [];
    },

    async init() {
      await this.loadTab(this.activeTab);
    },

    async loadTab(tab) {
      this.activeTab = tab;
      if (this.data[tab]) return;
      this.loading = true;
      try {
        this.data[tab] = await api.read(this.sheetFor(tab));
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    openAdd() {
      this.formData = {};
      this.editRowId = null;
      this.showForm = true;
    },

    openEdit(row) {
      this.formData = { ...row };
      this.editRowId = row._rowId;
      this.showForm = true;
    },

    async save() {
      const sheet = this.sheetFor(this.activeTab);
      const data = { ...this.formData };
      delete data._rowId;
      this.loading = true;
      try {
        if (this.editRowId) {
          await api.update(sheet, this.editRowId, data);
          const idx = this.data[this.activeTab].findIndex(r => r._rowId === this.editRowId);
          if (idx !== -1) this.data[this.activeTab][idx] = { ...data, _rowId: this.editRowId };
        } else {
          const res = await api.write(sheet, data);
          this.data[this.activeTab].push({ ...data, _rowId: res.rowId });
        }
        this.showForm = false;
        this.formData = {};
        this.editRowId = null;
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async remove(row) {
      if (!confirm(`O'chirishni tasdiqlaysizmi?`)) return;
      const sheet = this.sheetFor(this.activeTab);
      this.loading = true;
      try {
        await api.remove(sheet, row._rowId);
        this.data[this.activeTab] = this.data[this.activeTab].filter(r => r._rowId !== row._rowId);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    render() { return ''; } // Alpine x-data handles rendering via x-html
  };
}
```

**Note:** Since this module uses Alpine reactive data directly (not x-html render()), the HTML template goes inside index.html as an Alpine template. Update the `db` section in index.html to use actual Alpine directives instead of `x-html="render()"`.

- [ ] **Step 2: Replace db section in index.html**

Replace:
```html
<div x-show="page === 'db'" x-data="db()" x-init="init()">
  <div x-html="render()"></div>
</div>
```

With:
```html
<div x-show="page === 'db'" x-data="db()" x-init="init()">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">Ma'lumotnoma</h1>
    <button @click="openAdd()" class="btn-primary" x-show="$root.canWrite()">+ Qo'shish</button>
  </div>

  <!-- Tabs -->
  <div class="flex gap-2 mb-6 flex-wrap">
    <template x-for="t in tabs" :key="t.id">
      <button class="tab-btn" :class="{active: activeTab === t.id}"
        @click="loadTab(t.id)" x-text="t.label"></button>
    </template>
  </div>

  <!-- Error -->
  <div x-show="error" class="text-ios-red text-sm mb-4" x-text="error"></div>

  <!-- Loading -->
  <div x-show="loading" class="flex justify-center py-10"><div class="spinner"></div></div>

  <!-- Table -->
  <div class="card overflow-hidden" x-show="!loading && data[activeTab]">
    <div class="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <template x-for="f in fieldsFor(activeTab)" :key="f">
              <th x-text="f"></th>
            </template>
            <th x-show="$root.canWrite()">Amal</th>
          </tr>
        </thead>
        <tbody>
          <template x-for="row in (data[activeTab] || [])" :key="row._rowId">
            <tr>
              <template x-for="f in fieldsFor(activeTab)" :key="f">
                <td x-text="row[f]"></td>
              </template>
              <td x-show="$root.canWrite()">
                <button @click="openEdit(row)" class="text-ios-accent text-xs font-medium mr-3">Tahrirlash</button>
                <button @click="remove(row)" class="text-ios-red text-xs font-medium">O'chirish</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal Form -->
  <div x-show="showForm" class="modal-overlay" @click.self="showForm=false">
    <div class="modal">
      <h3 class="text-lg font-semibold mb-5" x-text="editRowId ? 'Tahrirlash' : 'Yangi yozuv'"></h3>
      <div class="space-y-4">
        <template x-for="f in fieldsFor(activeTab)" :key="f">
          <div>
            <label class="block text-xs font-medium text-ios-gray mb-1" x-text="f"></label>
            <input class="input-field" x-model="formData[f]" :placeholder="f"/>
          </div>
        </template>
      </div>
      <div class="flex gap-3 mt-6">
        <button @click="save()" class="btn-primary flex-1">Saqlash</button>
        <button @click="showForm=false" class="btn-secondary flex-1">Bekor</button>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Apply same pattern to all page sections in index.html**

All subsequent tasks follow this same pattern: page logic in `pages/*.js`, HTML template replaces the `x-html="render()"` placeholder in index.html.

- [ ] **Step 4: Test Ma'lumotnoma**

Open `index.html`. Login as operator. Click "Ma'lumotnoma". Expected:  
- Hamyon tab shows 7 wallet rows from Google Sheets  
- DB_Manbalar shows all seeded expense categories  
- "+ Qo'shish" opens modal, fill form, save → new row appears  
- Tahrirlash → edit modal → save → row updates

- [ ] **Step 5: Commit**

```bash
git add pages/db.js index.html
git commit -m "feat: Ma'lumotnoma module — full CRUD for all reference tables"
```

---

## Task 9: pages/kassa.js — Cash register

**Files:**
- Create: `pages/kassa.js`
- Modify: `index.html` (kassa section)

- [ ] **Step 1: Create pages/kassa.js**

```javascript
function kassa() {
  return {
    activeTab: 'operatsiyalar',
    operations: [],
    balances: {},
    manbalar: [],
    hamyonlar: [],
    xodimlar: [],
    yonalishlar: [],
    showForm: false,
    formType: 'Kirim',
    formData: {
      Sana: new Date().toISOString().split('T')[0],
      Turi: 'Kirim', Summa: '', Valyuta: 'So\'m', Kurs: '',
      Hamyon: '', Manbalar: '', 'Yo\'nalish': '', Bo\'lim: '',
      Aktiv: '', Passiv: '', Izoh: '', Xodim: ''
    },
    dateFrom: (() => {
      const d = new Date();
      d.setDate(d.getDate() - 10);
      return d.toISOString().split('T')[0];
    })(),
    dateTo: new Date().toISOString().split('T')[0],
    filterHamyon: '',
    filterTuri: '',
    loading: false,
    error: '',

    async init() {
      this.loading = true;
      try {
        const [ops, manbalar, hamyonlar, xodimlar, yonalishlar, allOps] = await Promise.all([
          api.read('Kassa', { dateFrom: this.dateFrom, dateTo: this.dateTo }),
          api.read('DB_Manbalar'),
          api.read('DB_Hamyon'),
          api.read('DB_Xodimlar'),
          api.read("DB_Yo'nalish"),
          api.read('Kassa')
        ]);
        this.operations = ops;
        this.manbalar = manbalar;
        this.hamyonlar = hamyonlar.filter(h => h.Status === 'aktiv');
        this.xodimlar = xodimlar.filter(x => x.Status === 'aktiv');
        this.yonalishlar = yonalishlar;
        this.calcBalances(allOps);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    calcBalances(allOps) {
      const bal = {};
      allOps.forEach(op => {
        const hw = op['Hamyon'];
        if (!hw) return;
        if (!bal[hw]) bal[hw] = 0;
        const amt = Number(op['Summa']) || 0;
        bal[hw] += op['Turi'] === 'Kirim' ? amt : -amt;
      });
      this.balances = bal;
    },

    async applyFilter() {
      this.loading = true;
      try {
        const params = { dateFrom: this.dateFrom, dateTo: this.dateTo };
        let ops = await api.read('Kassa', params);
        if (this.filterHamyon) ops = ops.filter(o => o['Hamyon'] === this.filterHamyon);
        if (this.filterTuri)   ops = ops.filter(o => o['Turi'] === this.filterTuri);
        this.operations = ops;
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    openForm(turi) {
      this.formType = turi;
      this.formData = {
        Sana: new Date().toISOString().split('T')[0],
        Turi: turi, Summa: '', Valyuta: "So'm", Kurs: '',
        Hamyon: '', Manbalar: '', "Yo'nalish": '', Bo\'lim: '',
        Aktiv: '', Passiv: '', Izoh: '', Xodim: ''
      };
      this.showForm = true;
    },

    async save() {
      if (!this.formData.Summa || !this.formData.Hamyon || !this.formData.Manbalar) {
        this.error = "Summa, Hamyon va Manbalar majburiy";
        return;
      }
      this.loading = true;
      try {
        const data = { ...this.formData, Turi: this.formType };
        const res = await api.write('Kassa', data);
        this.operations.unshift({ ...data, _rowId: res.rowId });
        // Recalc balances
        const allOps = await api.read('Kassa');
        this.calcBalances(allOps);
        this.showForm = false;
        this.error = '';
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async remove(row) {
      if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
      this.loading = true;
      try {
        await api.remove('Kassa', row._rowId);
        this.operations = this.operations.filter(o => o._rowId !== row._rowId);
        const allOps = await api.read('Kassa');
        this.calcBalances(allOps);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    fmt(n) {
      if (!n && n !== 0) return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    }
  };
}
```

- [ ] **Step 2: Replace kassa section in index.html**

Replace the kassa placeholder with:
```html
<div x-show="page === 'kassa'" x-data="kassa()" x-init="init()">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">Kassa</h1>
    <div class="flex gap-2" x-show="$root.canWrite()">
      <button @click="openForm('Kirim')"  class="btn-primary">+ Kirim</button>
      <button @click="openForm('Chiqim')" style="background:#FF3B30" class="btn-primary">+ Chiqim</button>
    </div>
  </div>

  <!-- Tabs -->
  <div class="flex gap-2 mb-6">
    <button class="tab-btn" :class="{active: activeTab==='operatsiyalar'}" @click="activeTab='operatsiyalar'">Operatsiyalar</button>
    <button class="tab-btn" :class="{active: activeTab==='hamyon'}"       @click="activeTab='hamyon'">Hamyon qoldiqlari</button>
  </div>

  <div x-show="error" class="text-ios-red text-sm mb-4" x-text="error"></div>
  <div x-show="loading" class="flex justify-center py-10"><div class="spinner"></div></div>

  <!-- Operatsiyalar Tab -->
  <div x-show="activeTab === 'operatsiyalar'" x-cloak>
    <!-- Filters -->
    <div class="card p-4 mb-4 flex flex-wrap gap-3 items-end">
      <div>
        <label class="text-xs text-ios-gray block mb-1">Dan</label>
        <input type="date" x-model="dateFrom" class="input-field w-36"/>
      </div>
      <div>
        <label class="text-xs text-ios-gray block mb-1">Gacha</label>
        <input type="date" x-model="dateTo" class="input-field w-36"/>
      </div>
      <div>
        <label class="text-xs text-ios-gray block mb-1">Hamyon</label>
        <select x-model="filterHamyon" class="input-field w-44">
          <option value="">Barchasi</option>
          <template x-for="h in hamyonlar" :key="h.Nomi">
            <option :value="h.Nomi" x-text="h.Nomi"></option>
          </template>
        </select>
      </div>
      <div>
        <label class="text-xs text-ios-gray block mb-1">Turi</label>
        <select x-model="filterTuri" class="input-field w-36">
          <option value="">Barchasi</option>
          <option value="Kirim">Kirim</option>
          <option value="Chiqim">Chiqim</option>
        </select>
      </div>
      <button @click="applyFilter()" class="btn-primary">Filtrlash</button>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Sana</th><th>Turi</th><th>Summa</th><th>Valyuta</th>
              <th>Kurs</th><th>Hamyon</th><th>Manbalar</th><th>Izoh</th>
              <th x-show="$root.canWrite()">Amal</th>
            </tr>
          </thead>
          <tbody>
            <template x-for="op in operations" :key="op._rowId">
              <tr>
                <td x-text="op['Sana']"></td>
                <td>
                  <span class="badge" :class="op['Turi']==='Kirim' ? 'badge-green' : 'badge-red'" x-text="op['Turi']"></span>
                </td>
                <td class="font-semibold" :class="op['Turi']==='Kirim' ? 'text-ios-green' : 'text-ios-red'"
                    x-text="fmt(op['Summa'])"></td>
                <td x-text="op['Valyuta']"></td>
                <td x-text="op['Kurs']"></td>
                <td x-text="op['Hamyon']"></td>
                <td x-text="op['Manbalar']"></td>
                <td x-text="op['Izoh']"></td>
                <td x-show="$root.canWrite()">
                  <button @click="remove(op)" class="text-ios-red text-xs">O'chirish</button>
                </td>
              </tr>
            </template>
            <tr x-show="operations.length === 0 && !loading">
              <td colspan="9" class="text-center text-ios-gray py-8">Ma'lumot yo'q</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Hamyon qoldiqlari Tab -->
  <div x-show="activeTab === 'hamyon'" x-cloak>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <template x-for="(bal, name) in balances" :key="name">
        <div class="card p-5">
          <div class="text-sm text-ios-gray mb-1" x-text="name"></div>
          <div class="text-2xl font-bold" :class="bal >= 0 ? 'text-ios-dark' : 'text-ios-red'"
               x-text="fmt(bal)"></div>
        </div>
      </template>
    </div>
  </div>

  <!-- Form Modal -->
  <div x-show="showForm" class="modal-overlay" @click.self="showForm=false">
    <div class="modal">
      <h3 class="text-lg font-semibold mb-5" :class="formType==='Kirim' ? 'text-ios-green' : 'text-ios-red'"
          x-text="formType + ' qo\'shish'"></h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Sana *</label>
          <input type="date" x-model="formData.Sana" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Summa *</label>
          <input type="number" x-model="formData.Summa" class="input-field" placeholder="0"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Valyuta</label>
          <select x-model="formData.Valyuta" class="input-field">
            <option>So'm</option><option>Dollar</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Kurs</label>
          <input type="number" x-model="formData.Kurs" class="input-field" placeholder="12000"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Hamyon *</label>
          <select x-model="formData.Hamyon" class="input-field">
            <option value="">Tanlang</option>
            <template x-for="h in hamyonlar" :key="h.Nomi">
              <option :value="h.Nomi" x-text="h.Nomi"></option>
            </template>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Manbalar *</label>
          <select x-model="formData.Manbalar" class="input-field">
            <option value="">Tanlang</option>
            <template x-for="m in manbalar.filter(m => formType==='Kirim' ? m.Turi==='Kirim' : m.Turi==='Chiqim')" :key="m.Nomi">
              <option :value="m.Nomi" x-text="m.Nomi"></option>
            </template>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Yo'nalish</label>
          <select x-model="formData[`Yo'nalish`]" class="input-field">
            <option value="">—</option>
            <template x-for="y in yonalishlar" :key="y.Nomi">
              <option :value="y.Nomi" x-text="y.Nomi"></option>
            </template>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Xodim</label>
          <select x-model="formData.Xodim" class="input-field">
            <option value="">—</option>
            <template x-for="x in xodimlar" :key="x.Nomi">
              <option :value="x.Nomi" x-text="x.Nomi"></option>
            </template>
          </select>
        </div>
        <div class="col-span-2">
          <label class="text-xs text-ios-gray mb-1 block">Izoh</label>
          <input x-model="formData.Izoh" class="input-field" placeholder="Izoh..."/>
        </div>
      </div>
      <div x-show="error" class="text-ios-red text-xs mt-3" x-text="error"></div>
      <div class="flex gap-3 mt-6">
        <button @click="save()" class="btn-primary flex-1">Saqlash</button>
        <button @click="showForm=false" class="btn-secondary flex-1">Bekor</button>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify**

Login as operator. Click Kassa.  
Expected: Last 10 days operations load. "+ Kirim" opens form. Fill Summa=100, Valyuta=Dollar, Kurs=12000, select Hamyon and Manbalar → Save → row appears in table.  
Click "Hamyon qoldiqlari" tab → cards show balance per wallet.

- [ ] **Step 4: Commit**

```bash
git add pages/kassa.js index.html
git commit -m "feat: Kassa module — operations list, filters, add form, balances"
```

---

## Task 10: pages/zakaz.js — Order management

**Files:**
- Create: `pages/zakaz.js`
- Modify: `index.html` (zakaz section)

- [ ] **Step 1: Create pages/zakaz.js**

```javascript
function zakaz() {
  return {
    orders: [],
    xizmatlar: [],
    xodimlar: [],
    yonalishlar: [],
    filterMonth: new Date().toISOString().slice(0, 7),
    filterStatus: '',
    filterYonalish: '',
    showForm: false,
    formData: {
      Sana: new Date().toISOString().split('T')[0],
      Mijoz: '', 'Sub-mijoz': '', "Yo'nalish": '', Ish_turi: '',
      Soni: 1, Narxi: '', Jami: '', Avans: '', Qoldiq: '',
      Operator1: '', Operator2: '', Montajchi: '', Status: "To'lanmadi", Izoh: ''
    },
    editRowId: null,
    loading: false,
    error: '',

    async init() {
      this.loading = true;
      try {
        const [orders, xizmatlar, xodimlar, yonalishlar] = await Promise.all([
          api.read('Zakaz', { month: this.filterMonth }),
          api.read('DB_Xizmat'),
          api.read('DB_Xodimlar'),
          api.read("DB_Yo'nalish")
        ]);
        this.orders = orders;
        this.xizmatlar = xizmatlar;
        this.xodimlar = xodimlar.filter(x => x.Status === 'aktiv');
        this.yonalishlar = yonalishlar;
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async applyFilter() {
      this.loading = true;
      try {
        let orders = await api.read('Zakaz', { month: this.filterMonth });
        if (this.filterStatus)   orders = orders.filter(o => o.Status === this.filterStatus);
        if (this.filterYonalish) orders = orders.filter(o => o["Yo'nalish"] === this.filterYonalish);
        this.orders = orders;
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    autoFillPrice() {
      const xizmat = this.xizmatlar.find(x =>
        x["Yo'nalish"] === this.formData["Yo'nalish"] &&
        x.Ish_turi === this.formData.Ish_turi
      );
      if (xizmat) {
        this.formData.Narxi = xizmat.Narxi_dollar || xizmat.Narxi_sum || '';
        this.calcJami();
      }
    },

    calcJami() {
      const soni = Number(this.formData.Soni) || 0;
      const narxi = Number(this.formData.Narxi) || 0;
      this.formData.Jami = soni * narxi;
      this.calcQoldiq();
    },

    calcQoldiq() {
      const jami = Number(this.formData.Jami) || 0;
      const avans = Number(this.formData.Avans) || 0;
      this.formData.Qoldiq = jami - avans;
    },

    openAdd() {
      this.formData = {
        Sana: new Date().toISOString().split('T')[0],
        Mijoz: '', 'Sub-mijoz': '', "Yo'nalish": '', Ish_turi: '',
        Soni: 1, Narxi: '', Jami: '', Avans: 0, Qoldiq: '',
        Operator1: '', Operator2: '', Montajchi: '', Status: "To'lanmadi", Izoh: ''
      };
      this.editRowId = null;
      this.showForm = true;
    },

    openEdit(row) {
      this.formData = { ...row };
      this.editRowId = row._rowId;
      this.showForm = true;
    },

    async save() {
      if (!this.formData.Mijoz || !this.formData["Yo'nalish"]) {
        this.error = "Mijoz va Yo'nalish majburiy";
        return;
      }
      this.loading = true;
      try {
        const data = { ...this.formData };
        delete data._rowId;
        if (this.editRowId) {
          await api.update('Zakaz', this.editRowId, data);
          const idx = this.orders.findIndex(o => o._rowId === this.editRowId);
          if (idx !== -1) this.orders[idx] = { ...data, _rowId: this.editRowId };
        } else {
          const res = await api.write('Zakaz', data);
          this.orders.unshift({ ...data, _rowId: res.rowId });
        }
        this.showForm = false;
        this.error = '';
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async remove(row) {
      if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
      this.loading = true;
      try {
        await api.remove('Zakaz', row._rowId);
        this.orders = this.orders.filter(o => o._rowId !== row._rowId);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    totalRevenue() {
      return this.orders.reduce((s, o) => s + (Number(o.Jami) || 0), 0);
    },

    totalDebt() {
      return this.orders.reduce((s, o) => s + (Number(o.Qoldiq) || 0), 0);
    },

    statusBadge(status) {
      if (status === "To'landi") return 'badge-green';
      if (status === 'Qisman')   return 'badge-orange';
      return 'badge-red';
    },

    fmt(n) {
      if (!n && n !== 0) return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    }
  };
}
```

- [ ] **Step 2: Add zakaz HTML template to index.html**

Replace the zakaz placeholder with:
```html
<div x-show="page === 'zakaz'" x-data="zakaz()" x-init="init()">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">Zakaz</h1>
    <button @click="openAdd()" class="btn-primary" x-show="$root.canWrite()">+ Zakaz</button>
  </div>

  <!-- Summary cards -->
  <div class="grid grid-cols-2 gap-4 mb-6">
    <div class="card p-5">
      <div class="text-xs text-ios-gray mb-1">Oylik jami zakaz</div>
      <div class="text-2xl font-bold" x-text="'$' + fmt(totalRevenue())"></div>
    </div>
    <div class="card p-5">
      <div class="text-xs text-ios-gray mb-1">Debitorlik (qoldiq)</div>
      <div class="text-2xl font-bold text-ios-orange" x-text="'$' + fmt(totalDebt())"></div>
    </div>
  </div>

  <!-- Filters -->
  <div class="card p-4 mb-4 flex flex-wrap gap-3 items-end">
    <div>
      <label class="text-xs text-ios-gray mb-1 block">Oy</label>
      <input type="month" x-model="filterMonth" class="input-field w-36"/>
    </div>
    <div>
      <label class="text-xs text-ios-gray mb-1 block">Status</label>
      <select x-model="filterStatus" class="input-field w-36">
        <option value="">Barchasi</option>
        <option>To'landi</option><option>To'lanmadi</option><option>Qisman</option>
      </select>
    </div>
    <div>
      <label class="text-xs text-ios-gray mb-1 block">Yo'nalish</label>
      <select x-model="filterYonalish" class="input-field w-36">
        <option value="">Barchasi</option>
        <template x-for="y in yonalishlar" :key="y.Nomi">
          <option :value="y.Nomi" x-text="y.Nomi"></option>
        </template>
      </select>
    </div>
    <button @click="applyFilter()" class="btn-primary">Filtrlash</button>
  </div>

  <div x-show="error" class="text-ios-red text-sm mb-4" x-text="error"></div>
  <div x-show="loading" class="flex justify-center py-10"><div class="spinner"></div></div>

  <div class="card overflow-hidden" x-show="!loading">
    <div class="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Sana</th><th>Mijoz</th><th>Yo'nalish</th><th>Ish turi</th>
            <th>Jami ($)</th><th>Avans ($)</th><th>Qoldiq ($)</th>
            <th>Operator</th><th>Status</th>
            <th x-show="$root.canWrite()">Amal</th>
          </tr>
        </thead>
        <tbody>
          <template x-for="o in orders" :key="o._rowId">
            <tr>
              <td x-text="o.Sana"></td>
              <td class="font-medium" x-text="o.Mijoz"></td>
              <td x-text="o[`Yo'nalish`]"></td>
              <td x-text="o.Ish_turi"></td>
              <td class="font-semibold" x-text="fmt(o.Jami)"></td>
              <td x-text="fmt(o.Avans)"></td>
              <td :class="Number(o.Qoldiq) > 0 ? 'text-ios-orange font-medium' : ''" x-text="fmt(o.Qoldiq)"></td>
              <td x-text="o.Operator1"></td>
              <td><span class="badge" :class="statusBadge(o.Status)" x-text="o.Status"></span></td>
              <td x-show="$root.canWrite()">
                <button @click="openEdit(o)" class="text-ios-accent text-xs mr-2">Tahrir</button>
                <button @click="remove(o)" class="text-ios-red text-xs">O'chir</button>
              </td>
            </tr>
          </template>
          <tr x-show="orders.length === 0 && !loading">
            <td colspan="10" class="text-center text-ios-gray py-8">Ma'lumot yo'q</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Form Modal -->
  <div x-show="showForm" class="modal-overlay" @click.self="showForm=false">
    <div class="modal">
      <h3 class="text-lg font-semibold mb-5" x-text="editRowId ? 'Zakazni tahrirlash' : 'Yangi zakaz'"></h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Sana *</label>
          <input type="date" x-model="formData.Sana" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Mijoz *</label>
          <input x-model="formData.Mijoz" class="input-field" placeholder="Mijoz ismi"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Sub-mijoz</label>
          <input x-model="formData['Sub-mijoz']" class="input-field" placeholder="Sub-mijoz"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Yo'nalish *</label>
          <select x-model="formData[`Yo'nalish`]" @change="autoFillPrice()" class="input-field">
            <option value="">Tanlang</option>
            <template x-for="y in yonalishlar" :key="y.Nomi">
              <option :value="y.Nomi" x-text="y.Nomi"></option>
            </template>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Ish turi</label>
          <select x-model="formData.Ish_turi" @change="autoFillPrice()" class="input-field">
            <option value="">Tanlang</option>
            <option>Podklyuch</option><option>Podklyuch (vyezdnoy)</option>
            <option>Montaj</option><option>Syomka</option><option>1ta CAM/operator</option>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Soni</label>
          <input type="number" x-model="formData.Soni" @input="calcJami()" class="input-field" min="1"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Narxi ($)</label>
          <input type="number" x-model="formData.Narxi" @input="calcJami()" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Jami ($)</label>
          <input type="number" x-model="formData.Jami" @input="calcQoldiq()" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Avans ($)</label>
          <input type="number" x-model="formData.Avans" @input="calcQoldiq()" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Qoldiq ($)</label>
          <input type="number" x-model="formData.Qoldiq" class="input-field" readonly style="background:#f8f8f8"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Operator 1</label>
          <select x-model="formData.Operator1" class="input-field">
            <option value="">—</option>
            <template x-for="x in xodimlar" :key="x.Nomi">
              <option :value="x.Nomi" x-text="x.Nomi"></option>
            </template>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Operator 2</label>
          <select x-model="formData.Operator2" class="input-field">
            <option value="">—</option>
            <template x-for="x in xodimlar" :key="x.Nomi">
              <option :value="x.Nomi" x-text="x.Nomi"></option>
            </template>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Montajchi</label>
          <select x-model="formData.Montajchi" class="input-field">
            <option value="">—</option>
            <template x-for="x in xodimlar" :key="x.Nomi">
              <option :value="x.Nomi" x-text="x.Nomi"></option>
            </template>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Status</label>
          <select x-model="formData.Status" class="input-field">
            <option>To'lanmadi</option><option>Qisman</option><option>To'landi</option>
          </select>
        </div>
        <div class="col-span-2">
          <label class="text-xs text-ios-gray mb-1 block">Izoh</label>
          <input x-model="formData.Izoh" class="input-field" placeholder="Izoh..."/>
        </div>
      </div>
      <div x-show="error" class="text-ios-red text-xs mt-3" x-text="error"></div>
      <div class="flex gap-3 mt-6">
        <button @click="save()" class="btn-primary flex-1">Saqlash</button>
        <button @click="showForm=false" class="btn-secondary flex-1">Bekor</button>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify**

Click Zakaz. Select current month. Expected: orders load.  
Add new order: Mijoz="Test", Yo'nalish=Reels, Ish_turi=Podklyuch, Soni=2 → Narxi auto-fills 35, Jami=70. Enter Avans=35 → Qoldiq=35. Save → row appears with badge "To'lanmadi".

- [ ] **Step 4: Commit**

```bash
git add pages/zakaz.js index.html
git commit -m "feat: Zakaz module — order management, auto-price, debt tracking"
```

---

## Task 11: pages/maosh.js — Salary management

**Files:**
- Create: `pages/maosh.js`
- Modify: `index.html` (maosh section)

- [ ] **Step 1: Create pages/maosh.js**

```javascript
function maosh() {
  return {
    currentMonth: new Date().toISOString().slice(0, 7),
    records: [],
    xodimlar: [],
    showForm: false,
    formData: {
      Oy: '', Xodim: '', Avans: 0, Operator: 0, Arenda: 0,
      Montaj: 0, PM: 0, Bonus: 0, Jami: 0, Status: "To'lanmadi", Izoh: ''
    },
    editRowId: null,
    loading: false,
    error: '',

    async init() {
      this.loading = true;
      try {
        const [records, xodimlar] = await Promise.all([
          api.read('Maosh', { oy: this.currentMonth }),
          api.read('DB_Xodimlar')
        ]);
        this.records = records;
        this.xodimlar = xodimlar.filter(x => x.Status === 'aktiv');
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async changeMonth(offset) {
      const [yr, mo] = this.currentMonth.split('-').map(Number);
      const d = new Date(yr, mo - 1 + offset, 1);
      this.currentMonth = d.toISOString().slice(0, 7);
      this.loading = true;
      try {
        this.records = await api.read('Maosh', { oy: this.currentMonth });
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    monthLabel() {
      const [yr, mo] = this.currentMonth.split('-').map(Number);
      const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun',
                      'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
      return months[mo - 1] + ' ' + yr;
    },

    calcJami() {
      const f = this.formData;
      f.Jami = (Number(f.Operator)||0) + (Number(f.Arenda)||0) +
               (Number(f.Montaj)||0) + (Number(f.PM)||0) + (Number(f.Bonus)||0);
    },

    openAdd() {
      this.formData = {
        Oy: this.currentMonth, Xodim: '', Avans: 0, Operator: 0, Arenda: 0,
        Montaj: 0, PM: 0, Bonus: 0, Jami: 0, Status: "To'lanmadi", Izoh: ''
      };
      this.editRowId = null;
      this.showForm = true;
    },

    openEdit(row) {
      this.formData = { ...row };
      this.editRowId = row._rowId;
      this.showForm = true;
    },

    async save() {
      if (!this.formData.Xodim) { this.error = 'Xodim tanlang'; return; }
      this.calcJami();
      this.loading = true;
      try {
        const data = { ...this.formData };
        delete data._rowId;
        if (this.editRowId) {
          await api.update('Maosh', this.editRowId, data);
          const idx = this.records.findIndex(r => r._rowId === this.editRowId);
          if (idx !== -1) this.records[idx] = { ...data, _rowId: this.editRowId };
        } else {
          const res = await api.write('Maosh', data);
          this.records.push({ ...data, _rowId: res.rowId });
        }
        this.showForm = false;
        this.error = '';
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    async remove(row) {
      if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
      this.loading = true;
      try {
        await api.remove('Maosh', row._rowId);
        this.records = this.records.filter(r => r._rowId !== row._rowId);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
    },

    totalJami() {
      return this.records.reduce((s, r) => s + (Number(r.Jami) || 0), 0);
    },

    fmt(n) {
      if (!n && n !== 0) return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    }
  };
}
```

- [ ] **Step 2: Add maosh HTML to index.html**

Replace maosh placeholder with:
```html
<div x-show="page === 'maosh'" x-data="maosh()" x-init="init()">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">Maosh</h1>
    <button @click="openAdd()" class="btn-primary" x-show="$root.canWrite()">+ Maosh</button>
  </div>

  <!-- Month navigator -->
  <div class="flex items-center gap-4 mb-6">
    <button @click="changeMonth(-1)" class="btn-secondary px-4">←</button>
    <span class="text-lg font-semibold w-40 text-center" x-text="monthLabel()"></span>
    <button @click="changeMonth(1)"  class="btn-secondary px-4">→</button>
  </div>

  <!-- Total card -->
  <div class="card p-5 mb-6 inline-block">
    <div class="text-xs text-ios-gray mb-1">Oylik jami maosh</div>
    <div class="text-2xl font-bold" x-text="'$' + fmt(totalJami())"></div>
  </div>

  <div x-show="error" class="text-ios-red text-sm mb-4" x-text="error"></div>
  <div x-show="loading" class="flex justify-center py-10"><div class="spinner"></div></div>

  <div class="card overflow-hidden" x-show="!loading">
    <div class="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Xodim</th><th>Avans</th><th>Operator ($)</th><th>Arenda ($)</th>
            <th>Montaj ($)</th><th>PM</th><th>Bonus</th>
            <th>Jami ($)</th><th>Status</th>
            <th x-show="$root.canWrite()">Amal</th>
          </tr>
        </thead>
        <tbody>
          <template x-for="r in records" :key="r._rowId">
            <tr>
              <td class="font-medium" x-text="r.Xodim"></td>
              <td x-text="fmt(r.Avans)"></td>
              <td x-text="fmt(r.Operator)"></td>
              <td x-text="fmt(r.Arenda)"></td>
              <td x-text="fmt(r.Montaj)"></td>
              <td x-text="fmt(r.PM)"></td>
              <td x-text="fmt(r.Bonus)"></td>
              <td class="font-bold" x-text="fmt(r.Jami)"></td>
              <td>
                <span class="badge" :class="r.Status === 'Tolandi' ? 'badge-green' : 'badge-red'"
                      x-text="r.Status"></span>
              </td>
              <td x-show="$root.canWrite()">
                <button @click="openEdit(r)" class="text-ios-accent text-xs mr-2">Tahrir</button>
                <button @click="remove(r)" class="text-ios-red text-xs">O'chir</button>
              </td>
            </tr>
          </template>
          <tr x-show="records.length === 0 && !loading">
            <td colspan="10" class="text-center text-ios-gray py-8">Bu oy uchun ma'lumot yo'q</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Form Modal -->
  <div x-show="showForm" class="modal-overlay" @click.self="showForm=false">
    <div class="modal">
      <h3 class="text-lg font-semibold mb-5" x-text="editRowId ? 'Maoshni tahrirlash' : 'Maosh qo\'shish'"></h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="text-xs text-ios-gray mb-1 block">Xodim *</label>
          <select x-model="formData.Xodim" class="input-field">
            <option value="">Tanlang</option>
            <template x-for="x in xodimlar" :key="x.Nomi">
              <option :value="x.Nomi" x-text="x.Nomi"></option>
            </template>
          </select>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Avans</label>
          <input type="number" x-model="formData.Avans" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Operator ($)</label>
          <input type="number" x-model="formData.Operator" @input="calcJami()" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Arenda ($)</label>
          <input type="number" x-model="formData.Arenda" @input="calcJami()" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Montaj ($)</label>
          <input type="number" x-model="formData.Montaj" @input="calcJami()" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">PM</label>
          <input type="number" x-model="formData.PM" @input="calcJami()" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Bonus</label>
          <input type="number" x-model="formData.Bonus" @input="calcJami()" class="input-field"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Jami ($)</label>
          <input type="number" x-model="formData.Jami" class="input-field" readonly style="background:#f8f8f8"/>
        </div>
        <div>
          <label class="text-xs text-ios-gray mb-1 block">Status</label>
          <select x-model="formData.Status" class="input-field">
            <option>To'lanmadi</option><option>Tolandi</option>
          </select>
        </div>
        <div class="col-span-2">
          <label class="text-xs text-ios-gray mb-1 block">Izoh</label>
          <input x-model="formData.Izoh" class="input-field" placeholder="Izoh..."/>
        </div>
      </div>
      <div x-show="error" class="text-ios-red text-xs mt-3" x-text="error"></div>
      <div class="flex gap-3 mt-6">
        <button @click="save()" class="btn-primary flex-1">Saqlash</button>
        <button @click="showForm=false" class="btn-secondary flex-1">Bekor</button>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify**

Click Maosh. Navigate months with ← →. Add maosh: select employee, fill Operator=500, Montaj=200 → Jami auto-calculates 700. Save → row appears. Change status to Tolandi → green badge.

- [ ] **Step 4: Commit**

```bash
git add pages/maosh.js index.html
git commit -m "feat: Maosh module — monthly salary management with navigator"
```

---

## Task 12: pages/hisobot.js — Reports

**Files:**
- Create: `pages/hisobot.js`
- Modify: `index.html` (hisobot section)

- [ ] **Step 1: Create pages/hisobot.js**

```javascript
function hisobot() {
  return {
    activeTab: 'pl',
    plData: [],
    ddsData: [],
    doimiyData: [],
    manbalar: [],
    loading: false,
    error: '',
    year: new Date().getFullYear(),
    charts: {},

    async init() {
      this.loading = true;
      try {
        const [allKassa, manbalar, allZakaz] = await Promise.all([
          api.read('Kassa'),
          api.read('DB_Manbalar'),
          api.read('Zakaz')
        ]);
        this.manbalar = manbalar;
        this.buildPL(allKassa);
        this.buildDDS(allKassa);
        this.buildDoimiy(allKassa, manbalar);
      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
      this.$nextTick(() => this.renderCharts());
    },

    buildPL(ops) {
      const months = {};
      ops.forEach(op => {
        const d = new Date(op.Sana);
        if (isNaN(d)) return;
        const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
        if (!months[key]) months[key] = { kirim: 0, chiqim: 0 };
        const amt = Number(op.Summa) || 0;
        if (op.Turi === 'Kirim')  months[key].kirim  += amt;
        if (op.Turi === 'Chiqim') months[key].chiqim += amt;
      });
      this.plData = Object.entries(months)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([oy, v]) => ({
          oy,
          kirim:  v.kirim,
          chiqim: v.chiqim,
          foyda:  v.kirim - v.chiqim
        }));
    },

    buildDDS(ops) {
      let balance = 0;
      const months = {};
      ops.sort((a,b) => new Date(a.Sana) - new Date(b.Sana)).forEach(op => {
        const d = new Date(op.Sana);
        if (isNaN(d)) return;
        const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
        if (!months[key]) months[key] = { open: balance, kirim: 0, chiqim: 0 };
        const amt = Number(op.Summa) || 0;
        if (op.Turi === 'Kirim')  { months[key].kirim  += amt; balance += amt; }
        if (op.Turi === 'Chiqim') { months[key].chiqim += amt; balance -= amt; }
      });
      this.ddsData = Object.entries(months)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([oy, v]) => ({
          oy, open: v.open, kirim: v.kirim, chiqim: v.chiqim,
          close: v.open + v.kirim - v.chiqim
        }));
    },

    buildDoimiy(ops, manbalar) {
      const doimiyNames = new Set(
        manbalar.filter(m => m.Doimiy === 'TRUE' || m.Doimiy === true).map(m => m.Nomi)
      );
      const months = {};
      ops.filter(op => op.Turi === 'Chiqim' && doimiyNames.has(op.Manbalar)).forEach(op => {
        const d = new Date(op.Sana);
        if (isNaN(d)) return;
        const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
        if (!months[key]) months[key] = {};
        const manba = op.Manbalar;
        months[key][manba] = (months[key][manba] || 0) + (Number(op.Summa) || 0);
      });
      this.doimiyData = Object.entries(months)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([oy, cats]) => ({ oy, ...cats, total: Object.values(cats).reduce((s,v)=>s+v,0) }));
    },

    doimiyCategories() {
      const cats = new Set();
      this.doimiyData.forEach(row => {
        Object.keys(row).filter(k => k !== 'oy' && k !== 'total').forEach(k => cats.add(k));
      });
      return [...cats];
    },

    renderCharts() {
      if (this.activeTab === 'pl' && this.plData.length) {
        const ctx = document.getElementById('plChart');
        if (!ctx) return;
        if (this.charts.pl) this.charts.pl.destroy();
        this.charts.pl = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.plData.map(r => r.oy),
            datasets: [
              { label: 'Kirim', data: this.plData.map(r => r.kirim), backgroundColor: '#34C759' },
              { label: 'Chiqim', data: this.plData.map(r => r.chiqim), backgroundColor: '#FF3B30' },
              { label: 'Foyda', data: this.plData.map(r => r.foyda), backgroundColor: '#5856D6', type: 'line' }
            ]
          },
          options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
      }
    },

    setTab(tab) {
      this.activeTab = tab;
      this.$nextTick(() => this.renderCharts());
    },

    fmt(n) {
      if (!n && n !== 0) return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    },

    fmtMonth(oy) {
      if (!oy) return '';
      const [yr, mo] = oy.split('-').map(Number);
      const months = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];
      return (months[mo-1] || mo) + ' ' + yr;
    }
  };
}
```

- [ ] **Step 2: Add hisobot HTML to index.html**

Replace hisobot placeholder with:
```html
<div x-show="page === 'hisobot'" x-data="hisobot()" x-init="init()">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">Hisobot</h1>
  </div>

  <div class="flex gap-2 mb-6">
    <button class="tab-btn" :class="{active: activeTab==='pl'}"     @click="setTab('pl')">P&amp;L</button>
    <button class="tab-btn" :class="{active: activeTab==='dds'}"    @click="setTab('dds')">DDS</button>
    <button class="tab-btn" :class="{active: activeTab==='doimiy'}" @click="setTab('doimiy')">Doimiy xarajatlar</button>
  </div>

  <div x-show="error" class="text-ios-red text-sm mb-4" x-text="error"></div>
  <div x-show="loading" class="flex justify-center py-10"><div class="spinner"></div></div>

  <!-- P&L Tab -->
  <div x-show="activeTab === 'pl' && !loading">
    <div class="card p-4 mb-6"><canvas id="plChart" height="100"></canvas></div>
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table>
          <thead><tr><th>Oy</th><th>Kirim</th><th>Chiqim</th><th>Foyda</th></tr></thead>
          <tbody>
            <template x-for="r in plData" :key="r.oy">
              <tr>
                <td x-text="fmtMonth(r.oy)"></td>
                <td class="text-ios-green font-medium" x-text="fmt(r.kirim)"></td>
                <td class="text-ios-red font-medium" x-text="fmt(r.chiqim)"></td>
                <td class="font-bold" :class="r.foyda >= 0 ? 'text-ios-green' : 'text-ios-red'"
                    x-text="fmt(r.foyda)"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- DDS Tab -->
  <div x-show="activeTab === 'dds' && !loading">
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table>
          <thead><tr><th>Oy</th><th>Ochilish qoldiq</th><th>Kirim</th><th>Chiqim</th><th>Yopilish qoldiq</th></tr></thead>
          <tbody>
            <template x-for="r in ddsData" :key="r.oy">
              <tr>
                <td x-text="fmtMonth(r.oy)"></td>
                <td x-text="fmt(r.open)"></td>
                <td class="text-ios-green" x-text="fmt(r.kirim)"></td>
                <td class="text-ios-red" x-text="fmt(r.chiqim)"></td>
                <td class="font-bold" :class="r.close >= 0 ? '' : 'text-ios-red'" x-text="fmt(r.close)"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Doimiy xarajatlar Tab -->
  <div x-show="activeTab === 'doimiy' && !loading">
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Oy</th>
              <template x-for="cat in doimiyCategories()" :key="cat"><th x-text="cat"></th></template>
              <th>Jami</th>
            </tr>
          </thead>
          <tbody>
            <template x-for="r in doimiyData" :key="r.oy">
              <tr>
                <td x-text="fmtMonth(r.oy)"></td>
                <template x-for="cat in doimiyCategories()" :key="cat">
                  <td x-text="fmt(r[cat] || 0)"></td>
                </template>
                <td class="font-bold" x-text="fmt(r.total)"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify**

Login as admin. Click Hisobot.  
Expected: P&L tab shows bar chart + table with monthly income/expense/profit.  
DDS tab shows cash flow table (opening → closing balance per month).  
Doimiy xarajatlar tab shows fixed expense categories per month.

- [ ] **Step 4: Commit**

```bash
git add pages/hisobot.js index.html
git commit -m "feat: Hisobot module — P&L, DDS, fixed expenses reports"
```

---

## Task 13: pages/dashboard.js — Dashboard

**Files:**
- Create: `pages/dashboard.js`
- Modify: `index.html` (dashboard section)

- [ ] **Step 1: Create pages/dashboard.js**

```javascript
function dashboard() {
  return {
    kpi: {
      totalBalance: 0,
      monthIncome: 0,
      monthProfit: 0,
      ddsOpen: 0,
      ddsClose: 0,
      debtors: 0,
      doimiy: 0,
      monthPlan: 0
    },
    recentOps: [],
    dailyData: [],
    expenseData: [],
    loading: false,
    error: '',
    chart: null,

    currentMonthKey() {
      return new Date().toISOString().slice(0, 7);
    },

    async init() {
      this.loading = true;
      try {
        const month = this.currentMonthKey();
        const [allKassa, monthKassa, monthZakaz, manbalar, reja] = await Promise.all([
          api.read('Kassa'),
          api.read('Kassa', { month }),
          api.read('Zakaz', { month }),
          api.read('DB_Manbalar'),
          api.read('Reja')
        ]);

        // Total balance across all wallets
        let bal = 0;
        allKassa.forEach(op => {
          const amt = Number(op.Summa) || 0;
          bal += op.Turi === 'Kirim' ? amt : -amt;
        });
        this.kpi.totalBalance = bal;

        // Monthly income & profit
        let income = 0, expense = 0;
        monthKassa.forEach(op => {
          const amt = Number(op.Summa) || 0;
          if (op.Turi === 'Kirim')  income  += amt;
          if (op.Turi === 'Chiqim') expense += amt;
        });
        this.kpi.monthIncome  = income;
        this.kpi.monthProfit  = income - expense;

        // DDS this month
        const prevMonth = (() => {
          const d = new Date();
          d.setMonth(d.getMonth() - 1);
          return d.toISOString().slice(0, 7);
        })();
        let openBal = 0;
        allKassa.filter(op => {
          const d = new Date(op.Sana);
          if (isNaN(d)) return false;
          return d.toISOString().slice(0,7) < month;
        }).forEach(op => {
          const amt = Number(op.Summa) || 0;
          openBal += op.Turi === 'Kirim' ? amt : -amt;
        });
        this.kpi.ddsOpen  = openBal;
        this.kpi.ddsClose = openBal + income - expense;

        // Debtors
        this.kpi.debtors = monthZakaz.reduce((s, o) => s + (Number(o.Qoldiq)||0), 0);

        // Doimiy xarajatlar this month
        const doimiyNames = new Set(
          manbalar.filter(m => m.Doimiy === 'TRUE' || m.Doimiy === true).map(m => m.Nomi)
        );
        this.kpi.doimiy = monthKassa
          .filter(op => op.Turi === 'Chiqim' && doimiyNames.has(op.Manbalar))
          .reduce((s, op) => s + (Number(op.Summa)||0), 0);

        // Monthly plan
        const rejaRow = reja.find(r => r.Oy === month);
        this.kpi.monthPlan = rejaRow ? Number(rejaRow.Oylik_reja) || 0 : 0;

        // Recent 10 operations
        this.recentOps = [...allKassa]
          .sort((a,b) => new Date(b.Sana) - new Date(a.Sana))
          .slice(0, 10);

        // Daily income this month for chart
        const dailyMap = {};
        monthKassa.filter(op => op.Turi === 'Kirim').forEach(op => {
          const day = op.Sana;
          dailyMap[day] = (dailyMap[day] || 0) + (Number(op.Summa)||0);
        });
        this.dailyData = Object.entries(dailyMap).sort(([a],[b]) => a.localeCompare(b));

        // Top expense categories
        const expMap = {};
        monthKassa.filter(op => op.Turi === 'Chiqim').forEach(op => {
          const cat = op.Manbalar || 'Boshqa';
          expMap[cat] = (expMap[cat] || 0) + (Number(op.Summa)||0);
        });
        this.expenseData = Object.entries(expMap)
          .sort(([,a],[,b]) => b - a).slice(0, 5);

      } catch(e) { this.error = e.message; }
      finally { this.loading = false; }
      this.$nextTick(() => this.renderCharts());
    },

    renderCharts() {
      // Daily income chart
      const ctx1 = document.getElementById('dailyChart');
      if (ctx1 && this.dailyData.length) {
        if (this.charts && this.charts.daily) this.charts.daily.destroy();
        if (!this.charts) this.charts = {};
        this.charts.daily = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: this.dailyData.map(([d]) => d.slice(5)),
            datasets: [{ label: 'Kirim', data: this.dailyData.map(([,v]) => v),
              backgroundColor: '#5856D6', borderRadius: 6 }]
          },
          options: { responsive: true, plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } } }
        });
      }
      // Expense donut chart
      const ctx2 = document.getElementById('expChart');
      if (ctx2 && this.expenseData.length) {
        if (this.charts && this.charts.exp) this.charts.exp.destroy();
        if (!this.charts) this.charts = {};
        this.charts.exp = new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: this.expenseData.map(([k]) => k),
            datasets: [{ data: this.expenseData.map(([,v]) => v),
              backgroundColor: ['#5856D6','#FF3B30','#FF9500','#34C759','#8E8E93'] }]
          },
          options: { responsive: true, plugins: { legend: { position: 'right' } } }
        });
      }
    },

    planPercent() {
      if (!this.kpi.monthPlan) return null;
      return Math.round((this.kpi.monthIncome / this.kpi.monthPlan) * 100);
    },

    fmt(n) {
      if (!n && n !== 0) return '—';
      return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(n)));
    }
  };
}
```

- [ ] **Step 2: Add dashboard HTML to index.html**

Replace dashboard placeholder with:
```html
<div x-show="page === 'dashboard'" x-data="dashboard()" x-init="init()">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">Dashboard</h1>
    <span class="text-sm text-ios-gray" x-text="new Date().toLocaleDateString('uz-UZ', {month:'long', year:'numeric', day:'numeric'})"></span>
  </div>

  <div x-show="error" class="text-ios-red text-sm mb-4" x-text="error"></div>
  <div x-show="loading" class="flex justify-center py-16"><div class="spinner"></div></div>

  <div x-show="!loading">
    <!-- KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <!-- Total balance -->
      <div class="card p-5">
        <div class="text-xs text-ios-gray mb-1">Umumiy qoldiq</div>
        <div class="text-2xl font-bold" :class="kpi.totalBalance >= 0 ? '' : 'text-ios-red'"
             x-text="fmt(kpi.totalBalance)"></div>
      </div>
      <!-- Monthly income vs plan -->
      <div class="card p-5">
        <div class="text-xs text-ios-gray mb-1">Oylik daromad</div>
        <div class="text-2xl font-bold text-ios-green" x-text="fmt(kpi.monthIncome)"></div>
        <div class="text-xs text-ios-gray mt-1" x-show="kpi.monthPlan">
          Plan: <span x-text="fmt(kpi.monthPlan)"></span>
          <span class="ml-1 font-semibold"
                :class="planPercent() >= 100 ? 'text-ios-green' : 'text-ios-orange'"
                x-text="planPercent() + '%'"></span>
        </div>
      </div>
      <!-- Profit -->
      <div class="card p-5">
        <div class="text-xs text-ios-gray mb-1">Oylik foyda</div>
        <div class="text-2xl font-bold" :class="kpi.monthProfit >= 0 ? 'text-ios-green' : 'text-ios-red'"
             x-text="fmt(kpi.monthProfit)"></div>
      </div>
      <!-- DDS -->
      <div class="card p-5">
        <div class="text-xs text-ios-gray mb-1">DDS (oy)</div>
        <div class="text-sm text-ios-gray">Ochilish: <span class="font-medium text-ios-dark" x-text="fmt(kpi.ddsOpen)"></span></div>
        <div class="text-sm text-ios-gray mt-1">Yopilish: <span class="font-bold text-ios-dark" x-text="fmt(kpi.ddsClose)"></span></div>
      </div>
      <!-- Debtors -->
      <div class="card p-5">
        <div class="text-xs text-ios-gray mb-1">Debitorlik</div>
        <div class="text-2xl font-bold text-ios-orange" x-text="'$' + fmt(kpi.debtors)"></div>
        <div class="text-xs text-ios-gray mt-1">To'lanmagan zakazlar</div>
      </div>
      <!-- Fixed expenses -->
      <div class="card p-5">
        <div class="text-xs text-ios-gray mb-1">Doimiy xarajatlar</div>
        <div class="text-2xl font-bold text-ios-red" x-text="fmt(kpi.doimiy)"></div>
        <div class="text-xs text-ios-gray mt-1">Bu oy</div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div class="card p-5">
        <div class="text-sm font-semibold mb-4">Kunlik daromad (joriy oy)</div>
        <canvas id="dailyChart" height="160"></canvas>
      </div>
      <div class="card p-5">
        <div class="text-sm font-semibold mb-4">Top 5 xarajat</div>
        <canvas id="expChart" height="160"></canvas>
      </div>
    </div>

    <!-- Recent operations -->
    <div class="card overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <span class="text-sm font-semibold">So'nggi 10 operatsiya</span>
      </div>
      <div class="overflow-x-auto">
        <table>
          <thead><tr><th>Sana</th><th>Turi</th><th>Summa</th><th>Hamyon</th><th>Manbalar</th><th>Izoh</th></tr></thead>
          <tbody>
            <template x-for="op in recentOps" :key="op._rowId">
              <tr>
                <td x-text="op.Sana"></td>
                <td><span class="badge" :class="op.Turi==='Kirim' ? 'badge-green' : 'badge-red'" x-text="op.Turi"></span></td>
                <td class="font-semibold" :class="op.Turi==='Kirim' ? 'text-ios-green' : 'text-ios-red'"
                    x-text="fmt(op.Summa)"></td>
                <td x-text="op.Hamyon"></td>
                <td x-text="op.Manbalar"></td>
                <td class="text-ios-gray" x-text="op.Izoh"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify**

Login → Dashboard loads.  
Expected: 6 KPI cards show data. Daily income bar chart renders. Top 5 expenses donut renders. Recent 10 operations table shows.  
Plan % shows green if income ≥ plan, orange if below.

- [ ] **Step 4: Commit**

```bash
git add pages/dashboard.js index.html
git commit -m "feat: Dashboard — KPI cards, DDS, profit, charts, recent ops"
```

---

## Task 14: GitHub Pages deploy

**Files:**
- Create: `.github/workflows/deploy.yml` (optional CI)
- Modify: nothing — files deploy as-is

- [ ] **Step 1: Create GitHub repository**

Go to github.com → New repository → name: `isomedia-finance` → Public → Create.

- [ ] **Step 2: Push code**

```bash
git remote add origin https://github.com/YOUR_USERNAME/isomedia-finance.git
git branch -M main
git push -u origin main
```

Verify `config.js` is NOT in the push (check `git status` before pushing).

- [ ] **Step 3: Enable GitHub Pages**

GitHub repo → Settings → Pages → Source: Deploy from branch → Branch: `main` → Folder: `/ (root)` → Save.

- [ ] **Step 4: Copy config.js to server**

Since `config.js` is gitignored, you must upload it manually to the GitHub Pages server OR use GitHub Secrets + Actions.

**Option A (simple):** Use a private repo + GitHub Pages. Upload `config.js` via GitHub UI (create file manually through the web interface, not committed via git).

**Option B (recommended for security):** Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create config.js
        run: |
          cat > config.js << 'EOF'
          const APPS_SCRIPT_URL = "${{ secrets.APPS_SCRIPT_URL }}";
          const USERS = ${{ secrets.USERS_JSON }};
          EOF
      - name: Deploy to Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

Then add secrets in GitHub: Settings → Secrets → `APPS_SCRIPT_URL` and `USERS_JSON`.

- [ ] **Step 5: Verify deployment**

Visit `https://YOUR_USERNAME.github.io/isomedia-finance/`  
Expected: Login page with ISOMEDIA logo appears. Login works. All 6 modules load data from Google Sheets.

- [ ] **Step 6: Final commit**

```bash
git add .github/
git commit -m "chore: GitHub Pages deployment workflow"
git push
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ 3 roles (admin, operator, viewer) with correct permissions
- ✅ Google Sheets 10 sheets, no monthly tab explosion
- ✅ Apps Script single endpoint with read/write/update/delete
- ✅ config.js gitignored, config.example.js committed
- ✅ Dashboard: 6 KPI cards including DDS, profit, fixed expenses, debtors
- ✅ Kassa: 2 tabs (operations + balances), last 10 days default, filter
- ✅ Zakaz: full order management, auto-price from DB_Xizmat, debtors
- ✅ Maosh: monthly navigator, auto-Jami calculation
- ✅ Hisobot: P&L + DDS + Doimiy xarajatlar tabs
- ✅ Ma'lumotnoma: all 6 DB tabs with CRUD
- ✅ iOS design: Inter font, #F2F2F7 bg, #5856D6 accent, 16px border-radius
- ✅ ISOMEDIA logo used in login + sidebar
- ✅ Uzbek Latin interface throughout
- ✅ Currency: Summa + Valyuta + Kurs stored per operation
- ✅ Reja sheet for plan tracking (monthPlan in dashboard)
- ✅ Chart.js for dashboard charts and P&L chart in Hisobot
