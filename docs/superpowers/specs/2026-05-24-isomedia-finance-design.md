# ISOMEDIA Moliyaviy Boshqaruv Tizimi — Dizayn Spetsifikatsiyasi

**Sana:** 2026-05-24  
**Holat:** Tasdiqlangan  
**Til:** Interfeys — O'zbek (lotin), Muloqot — Rus tili

---

## 1. Loyiha haqida

ISOMEDIA video-prodakshn studiyasi uchun moliyaviy boshqaruv tizimi. Hozirgi Excel fayllarini (Kassa, Zakaz, Maosh, hisobotlar) brauzerda ishlaydigan veb-ilovaga o'tkazish. Google Sheets — ma'lumotlar bazasi, GitHub Pages — hosting.

**Asosiy fayllar (o'rganilgan):**
- `Oylik hisobot archive.xlsx` — oylik hisobotlar arxivi
- `_ISOMEDIA_ Baza.xlsx` — asosiy baza (P&L, CF, nazorat paneli)
- `_ISOMEDIA_ Maosh boshqaruvi.xlsx` — maosh, zakaz, reja boshqaruvi
- `_ISOMEDIA_ operator.xlsx` — operator interfeysi (soddalashtirilgan)

---

## 2. Texnik stek

| Komponent | Texnologiya |
|-----------|-------------|
| Frontend | Alpine.js (CDN) + Tailwind CSS (CDN) |
| Backend/API | Google Apps Script (doGet/doPost) |
| Ma'lumotlar bazasi | Google Sheets (1 fayl, 9 varaq) |
| Hosting | GitHub Pages |
| Autentifikatsiya | config.js (hardcoded, .gitignore) |

**Build jarayoni yo'q** — fayllarni to'g'ridan-to'g'ri GitHub Pages-ga yuklash mumkin.

---

## 3. Fayl tuzilmasi

```
/
├── index.html              # Login + router
├── config.js               # Foydalanuvchilar, rollar, Apps Script URL (.gitignore)
├── app.js                  # Alpine.js asosiy mantiq, routing, sessiya
├── api.js                  # Barcha Google Apps Script so'rovlari
├── pages/
│   ├── dashboard.js        # Dashboard mantiq va komponentlar
│   ├── kassa.js            # Kassa mantiq
│   ├── zakaz.js            # Zakaz mantiq
│   ├── maosh.js            # Maosh mantiq
│   ├── hisobot.js          # Hisobotlar mantiq
│   └── db.js               # Ma'lumotnoma mantiq
├── assets/
│   ├── isomedia_black.png  # Logo (qoʻngʻir fon uchun)
│   └── isomedia_white.png  # Logo (toʻq fon uchun)
└── .gitignore              # config.js ni istisno qiladi
```

---

## 4. Autentifikatsiya va rollar

### config.js tuzilmasi
```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/...";

const USERS = [
  { username: "admin",    password: "...", role: "admin"    },
  { username: "operator", password: "...", role: "operator" },
  { username: "viewer",   password: "...", role: "viewer"   }
];
```

### Rol huquqlari

| Bo'lim | Admin | Operator | Viewer |
|--------|-------|----------|--------|
| Dashboard | ✅ | ✅ | ✅ |
| Kassa (ko'rish) | ✅ | ✅ | ❌ |
| Kassa (qo'shish/o'chirish) | ✅ | ✅ | ❌ |
| Zakaz (ko'rish) | ✅ | ✅ | ❌ |
| Zakaz (qo'shish/tahrirlash) | ✅ | ✅ | ❌ |
| Maosh | ✅ | ✅ | ❌ |
| Hisobot | ✅ | ❌ | ✅ |
| Ma'lumotnoma | ✅ | ✅ | ❌ |
| Foydalanuvchi boshqaruvi | ✅ | ❌ | ❌ |

### Sessiya
- Parol `USERS` massivi bilan lokal tekshiriladi
- `sessionStorage`-da saqlanadi (brauzer yopilsa o'chadi)
- Har bir sahifa rolni tekshiradi — ruxsat yo'q → login sahifasiga yo'naltiradi

---

## 5. Google Sheets tuzilmasi

**Bitta fayl, 10 ta varaq — hech qachon yangi varaq qo'shilmaydi.**  
Oylar bo'yicha filtrlash brauzerda `Sana` ustuni orqali amalga oshiriladi.

### Kassa
```
Sana | Turi | Summa | Valyuta | Kurs | Hamyon |
Manbalar | Yo'nalish | Bo'lim | Aktiv | Passiv | Izoh | Xodim
```
- `Turi`: `Kirim` yoki `Chiqim`
- `Valyuta`: `USD` yoki `So'm`
- `Kurs`: Operator har operatsiya uchun kiritadi

### Zakaz
```
Sana | Mijoz | Sub-mijoz | Yo'nalish | Ish_turi | Soni |
Narxi($) | Jami($) | Avans($) | Qoldiq($) |
Operator1 | Operator2 | Montajchi | Status | Izoh
```
- `Status`: `To'landi` / `To'lanmadi` / `Qisman`

### Maosh
```
Oy | Xodim | Avans | Operator($) | Arenda($) |
Montaj($) | PM | Bonus | Jami($) | Status | Izoh
```
- `Oy` formati: `YYYY-MM` (masalan `2025-09`)
- `Status`: `Tolandi` / `To'lanmadi`

### DB_Manbalar
```
Nomi | Turi | Xarakat_turi | Doimiy | Izoh
```
- `Doimiy`: `true`/`false` — oylik doimiy xarajat belgisi

### DB_Xodimlar
```
Nomi | Lavozim | Telefon | Status
```
- `Status`: `aktiv` / `noaktiv`

### DB_Hamyon
```
Nomi | Valyuta | Status
```
Mavjud hamyonlar: Alliance Uzcard, Ipoteka Humo, Karta (Shahzodbek), USD, Bank h/r, Naqd

### DB_Kontragent
```
Nomi | Turi | Telefon | Izoh
```
- `Turi`: `aktiv` / `passiv`

### DB_Xizmat
```
Nomi | Yo'nalish | Ish_turi | Narxi($) | Narxi(sum)
```
Mavjud narxlar: Reels $35, YouTube $60-90, Podcast x2 $200, x3 $250, x4 $300

### DB_Yo'nalish
```
Nomi | Izoh
```
Mavjud: Reels, YouTube, Podcast x2, Podcast x3, Podcast x4, Studiya ijarasi, Seminar

### Reja
```
Oy | Kunlik_reja($) | Oylik_reja($)
```
- `Oy` formati: `YYYY-MM`
- Admin tomonidan kiritiladi, Dashboard "fakt vs reja" kartasi shu yerdan o'qiydi
- Mavjud oy uchun yozuv yo'q bo'lsa — reja ko'rsatilmaydi (0 sifatida)

---

## 6. Google Apps Script API

Bitta URL, barcha so'rovlar `action` parametri orqali:

```
GET  ?action=read&sheet=Kassa&month=2025-09
GET  ?action=read&sheet=DB_Xodimlar
GET  ?action=read&sheet=Kassa&dateFrom=2026-05-01&dateTo=2026-05-10
POST { action: "write",  sheet: "Kassa",  data: {...} }
POST { action: "update", sheet: "Zakaz",  rowId: 42, data: {...} }
POST { action: "delete", sheet: "Kassa",  rowId: 15 }
```

Apps Script JSON formatida javob qaytaradi:
```json
{ "success": true, "data": [...] }
{ "success": false, "error": "..." }
```

---

## 7. Bo'limlar (sahifalar) tuzilmasi

### Dashboard
Joriy oy uchun bir ekranda maksimal ma'lumot:

**Yuqori qator — 6 ta karta:**
1. `Umumiy qoldiq` — barcha hamyonlar jami
2. `Oylik daromad` — fakt vs reja
3. `Oylik foyda` — Daromad − Xarajat
4. `DDS` — ochilish balans → yopilish balans
5. `Debitorlik` — to'lanmagan zakazlar
6. `Doimiy xarajatlar` — `DB_Manbalar.Doimiy = true` bo'lgan yig'indi

**Pastki qator:**
- Kunlik daromad grafigi (joriy oy)
- Top 5 xarajat moddalari (donut chart)
- So'nggi 10 operatsiya (Kassa jadval)

---

### Kassa
**2 ta tab:**

**Operatsiyalar tab:**
- Standart ko'rinish: so'nggi 10 kun
- Filtr: sana oralig'i, hamyon, manbalar, turi (kirim/chiqim)
- `+ Kirim` va `+ Chiqim` tugmalari
- Forma maydonlari: Sana, Summa, Valyuta, Kurs, Hamyon, Manbalar, Yo'nalish, Aktiv/Passiv kontragent, Xodim, Izoh

**Hamyon qoldiqlari tab:**
- Har bir hamyon uchun: nomi, valyuta, joriy qoldiq
- Qoldiq = barcha Kirim − barcha Chiqim (sana filtrisiz, jami)

---

### Zakaz
- Filtr: oy, status, yo'nalish, mijoz
- Jadval: barcha Zakaz ustunlari
- `+ Zakaz` tugmasi — to'liq forma
- Narx `DB_Xizmat`dan avtomatik to'ldiriladi
- Qoldiq = Jami − Avans avtomatik hisoblanadi

---

### Maosh
- Oy tanlovchi: `← Aprel 2026 | May 2026 | Iyun 2026 →`
- Xodimlar jadvali: Avans, Operator, Arenda, Montaj, PM, Bonus, Jami, Status
- `+ Maosh` — yangi yozuv qo'shish
- Jami oylik xarajat summasi — pastda

---

### Hisobot
**3 ta tab:**

**P&L tab:**
- Oylar bo'yicha jadval: Daromad | Xarajat | Foyda
- Grafik: oylik dinamika

**DDS tab:**
- Oylar bo'yicha: Ochilish qoldiq | Kirim | Chiqim | Yopilish qoldiq
- Hamyon kesimida ham ko'rsatish

**Doimiy xarajatlar tab:**
- `DB_Manbalar.Doimiy = true` bo'lgan moddalar
- Har oy bu moddalardagi haqiqiy xarajat summasi
- Reja vs fakt taqqoslash

---

### Ma'lumotnoma
**6 ta tab:** Manbalar | Xodimlar | Hamyon | Kontragent | Xizmat | Yo'nalish  
Har birida: ko'rish, qo'shish, tahrirlash, o'chirish (faolsizlashtirish)

---

## 8. UI/UX tizimi

### Rang palitrasi
```
Fon:          #F2F2F7  (iOS tizim kul rangi)
Kartalar:     #FFFFFF
Asosiy matn:  #1C1C1E
Qo'shimcha:   #8E8E93
Aksent:       #5856D6  (iOS binafsha)
Muvaffaqiyat: #34C759  (iOS yashil)
Xato:         #FF3B30  (iOS qizil)
Ogohlantirish:#FF9500  (iOS to'q sariq)
```

### Tipografiya
- Shrift: **Inter** (Google Fonts CDN)
- Sarlavha: 600 weight
- Asosiy matn: 400 weight
- Raqamlar: 700 weight (katta ko'rsatkichlar uchun)

### Komponentlar
- Kartalar: `border-radius: 16px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`
- Jadval qatorlari: hover effekti, qattiq chegara yo'q
- Tugmalar: `border-radius: 10px`, birlamchi — aksent rangi
- Formalar: `border-radius: 12px` inputlar, label yuqorida

### Navigatsiya
- Chap sidebar: 240px
- Logo: `isomedia_blackPNG.png` (ochiq fon uchun)
- Faol element: aksent rangi bilan belgilangan
- Mobil: sidebar hamburger menyu orqali

---

## 9. Valyuta va kurs logikasi

- **Asosiy valyuta:** USD
- Har bir Kassa operatsiyasi uchun operator `Kurs`ni qo'lda kiritadi
- `Summa` + `Valyuta` + `Kurs` — uchala maydon saqlanadi
- Ko'rsatish: so'm va dollar parallel ko'rsatiladi
- DDS hisobotida: kurs farqini hisobga olmasdan, har bir operatsiya o'z kursi bilan konvertatsiya qilinadi

---

## 10. Amalga oshirish bosqichlari (yuqori darajada)

1. Google Sheets fayli yaratish — 9 varaq, sarlavhalar
2. Google Apps Script yozish va deploy qilish
3. GitHub repozitoriyasi — `index.html`, `.gitignore`, fayl tuzilmasi
4. `config.js` namunasi (`config.example.js` sifatida repo-da)
5. Login sahifasi + routing + sessiya boshqaruvi
6. Ma'lumotnoma (DB) moduli — boshqa modullar uchun asos
7. Dashboard moduli
8. Kassa moduli
9. Zakaz moduli
10. Maosh moduli
11. Hisobot moduli
12. Sinov + GitHub Pages deploy
