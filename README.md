# CuffnCode Web - Blood Pressure Monitoring Simulation

CuffnCode Web adalah mini project berbasis web untuk mensimulasikan sistem monitoring tekanan darah digital.

Project ini dibuat sesuai kebutuhan tugas: program dapat diunggah ke GitHub repository dan halaman dokumentasi dapat dijadikan GitHub Pages.

## Fitur

- Dashboard web realtime.
- Simulasi sensor tekanan darah.
- Konversi ADC ke tegangan dan tekanan.
- Estimasi nilai sistolik dan diastolik.
- Perhitungan MAP dan BPM.
- Klasifikasi status tekanan darah:
  - Normal
  - Pra-Hipertensi
  - Hipertensi
- Grafik sinyal tekanan.
- Log pengukuran.
- Dokumentasi GitHub Pages di folder `docs`.

## Struktur Folder

```text
cuffncode-web-project/
├── index.html
├── style.css
├── script.js
├── README.md
├── GITHUB_UPLOAD_GUIDE.md
├── SCRIPT_VIDEO_DEMO.md
├── docs/
│   ├── index.html
│   └── docs.css
└── assets/
    └── gambar pendukung
```

## Cara Menjalankan

1. Ekstrak folder project.
2. Buka file `index.html` menggunakan browser.
3. Klik tombol `Mulai`.
4. Pilih mode pasien:
   - Normal
   - Pra-Hipertensi
   - Hipertensi
5. Lihat hasil pada dashboard.

## Cara Upload ke GitHub

```bash
git init
git add .
git commit -m "upload cuffncode web project"
git branch -M main
git remote add origin https://github.com/username/nama-repository.git
git push -u origin main
```

## Cara Mengaktifkan GitHub Pages

1. Buka repository di GitHub.
2. Masuk ke menu `Settings`.
3. Pilih `Pages`.
4. Pada bagian `Build and deployment`, pilih:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: `/root` jika ingin menampilkan web utama
5. Klik `Save`.

Jika ingin dokumentasi saja yang tampil sebagai GitHub Pages, pilih folder `/docs`.

## Penjelasan Singkat

Sistem ini mensimulasikan alur CuffnCode:

Sensor tekanan → penguat AD620 → pengondisian sinyal TLC2272 → ADC → logic code → output dashboard web.
