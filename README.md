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


Sensor tekanan → penguat AD620 → pengondisian sinyal TLC2272 → ADC → logic code → output dashboard web.
