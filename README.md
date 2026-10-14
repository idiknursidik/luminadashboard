# Lumina — Dashboard Premium 🌤️

Dashboard analitik premium bertema **biru langit**, dibuat dengan HTML/CSS/JS murni — **tanpa dependensi, tanpa build step**.

## Fitur
- Tema gelap/terang dengan efek glassmorphism & glow
- Kartu KPI dengan angka animasi + sparkline SVG
- Chart pendapatan interaktif (hover tooltip), donut sumber pendapatan, bar aktivitas, progres target
- Dropdown menu profil & notifikasi (outside-click, Escape, mark-read)
- Ganti rentang waktu: 7 Hari / 30 Hari / 12 Bulan
- Tabel pesanan terbaru + feed aktivitas
- Responsif (sidebar off-canvas di mobile)

## Cara Menjalankan

**Prasyarat:** Node.js ≥ 18 (atau Python 3).

```bash
# Dengan Node
npm start          # atau: node server.mjs

# Alternatif dengan Python
python3 -m http.server 3000 --directory public
```

Buka **http://localhost:3000**

## Struktur

```
├── public/
│   ├── landing.html   # Halaman landing (beranda situs)
│   ├── login.html     # Halaman masuk (validasi form → dashboard)
│   ├── index.html     # Dashboard analitik premium
│   ├── pages.css      # Style khusus landing & login
│   ├── pages.js       # Interaksi landing & login
│   ├── styles.css     # Tema & komponen bersama
│   └── app.js         # Data, chart SVG, interaksi dashboard
├── server.mjs         # Server statis (opsional, nol dependensi)
├── package.json       # Script npm
└── README.md
```

## Alur Halaman

`landing.html` → **Coba Gratis / Masuk** → `login.html` → **form tervalidasi** → `index.html` (dashboard)

- `/` → dashboard (`index.html`)
- `/landing.html` → halaman landing
- `/login.html` → halaman login

## Kustomisasi
- Warna aksen: ubah `--accent`, `--accent-2`, `--accent-glow` di bagian `:root` (`styles.css`)
- Data dashboard: edit objek `DATA`, `DONUT`, `GOALS`, `ORDERS`, `FEED` di `app.js`

Dibuat dengan Codebuff 🤖
