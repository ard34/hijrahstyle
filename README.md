# 🛍️ Toko Sample BBN — Modern E-Commerce Platform

Aplikasi E-Commerce modern, full-stack, responsif, dan siap produksi (*production-ready*) yang dibangun dengan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Prisma ORM**, **Supabase PostgreSQL**, dan terintegrasi penuh dengan Payment Gateway **Duitku Sandbox**.

---

## 🌟 Ikhtisar Proyek (Overview)

- **Nama Toko:** Toko Sample BBN
- **Identitas Visual:** Modern, Sleek, Futuristic (*Electric Blue* & *Deep Slate*) dengan logo resmi **BBn DIGITAL FORGE**.
- **Model Bisnis:** *Single-Vendor Store* — Seluruh katalog produk, transaksi pembayaran, logistik, voucher promo, hingga laporan omset dikelola secara terpusat oleh pemilik toko / admin.
- **Tujuan:** Menyediakan pengalaman belanja online yang cepat, aman, responsif di semua perangkat, serta mudah dioperasikan dari sisi back-office admin.

---

## 🛠️ Tech Stack & Arsitektur

| Layer | Teknologi | Deskripsi |
|---|---|---|
| **Frontend Framework** | [Next.js 16 (Turbopack)](https://nextjs.org/) & [React 19](https://react.dev/) | App Router, Server & Client Components, Dynamic Routing |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/) | Desain kustom responsif, dark/light contrast, Plus Jakarta Sans |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | Keranjang belanja (*Cart*) & Wishlist dengan persistensi lokal |
| **Database & ORM** | [Prisma ORM 5](https://www.prisma.io/) & [Supabase PostgreSQL](https://supabase.com/) | Pooling PgBouncer, migrasi skema relasional terstruktur |
| **Payment Gateway** | [Duitku Payment Gateway](https://www.duitku.com/) | Mode Sandbox (Virtual Account, QRIS, E-Wallet, Webhook otomatis) |
| **Autentikasi & Keamanan** | JWT (JSON Web Token) & bcryptjs | Cookie HTTP-Only, enkripsi password, otorisasi berbasis Role |
| **Deployment** | [Vercel](https://vercel.com/) & GitHub | CI/CD otomatis, edge middleware, performa cepat |

---

## 🚀 Fitur-Fitur Utama

### 🛒 1. Pengalaman Belanja (Storefront)
- **Beranda Interaktif:** Flagship dark-gradient hero, grid kategori dinamis, penawaran kilat (*flash sale*), produk terlaris, dan 4 kartu pilar kepercayaan.
- **Katalog & Filter Produk:** Pencarian real-time, filter kategori, penyaring rentang harga, serta pemilihan swatch warna dan ukuran.
- **Detail Produk:** Galeri gambar, pemilih varian dinamis (*pill selector*), indikator stok real-time, badge garansi produk, dan tab ulasan pelanggan.
- **Keranjang Belanja:** Kontrol kuantitas instan, ringkasan harga langsung, dan penanganan stok produk.
- **Alur Checkout Terpadu:**
  - Pemilihan alamat pengiriman terdaftar.
  - Pilihan ekspedisi kurir (JNE, SiCepat, J&T, GoSend, dll.).
  - Input voucher diskon promo.
  - Pembayaran terintegrasi via **Duitku Sandbox**.
- **Riwayat Pesanan & Akun:** Status pesanan real-time (*Menunggu Pembayaran, Dibayar, Diproses, Dikirim, Selesai*), nomor resi kurir terlacak, dan profil akun pengguna.

### 💳 2. Integrasi Payment Gateway (Duitku)
- **Metode Pembayaran:** Virtual Account (BCA, Mandiri, BNI, BRI, Permata), QRIS, dan dompet digital.
- **Dukungan Modal POP & Redirect:** Pengguna dapat membayar langsung melalui antarmuka sandbox Duitku.
- **Webhook Callback Otomatis (`/api/payments/webhook`):**
  - Menerima notifikasi IPN/callback dari server Duitku secara real-time.
  - Verifikasi keamanan signature HMAC-SHA256 & MD5.
  - Otomatis memperbarui status pesanan menjadi `PAID` dan `PROCESSING`.

### 🛡️ 3. Admin Control Center (`/admin`)
- **Dashboard Ringkasan:** Statistik pendapatan omset, jumlah pesanan sukses, total pelanggan aktif, dan grafik penjualan SVG.
- **Manajemen Produk:** Tambah produk baru, kelola multi-varian (ukuran, warna, stok, SKU), dan harga.
- **Manajemen Pesanan:** Cek detail pesanan pelanggan, verifikasi bukti bayar, perbarui status pengiriman, dan input nomor resi kurir.
- **Manajemen Kategori:** Tambah dan kelompokkan kategori produk toko.
- **Manajemen Voucher Diskon:** Buat kupon promo berupa persentase (%) atau nominal potongan tetap (Rp) beserta minimal belanja.
- **Manajemen Pelanggan & Laporan:** Pantau data pelanggan dan ekspor/analisis penjualan toko.

---

## 📂 Struktur Direktori Proyek

```plaintext
├── prisma/
│   └── schema.prisma          # Skema database (User, Product, Order, Shipment, Voucher, dll.)
├── public/
│   ├── logo.png               # Logo resmi toko (BBn Digital Forge)
│   └── ...
├── src/
│   ├── app/
│   │   ├── (auth)/            # Halaman Login & Registrasi
│   │   ├── (store)/           # Halaman Storefront (Home, Products, Cart, Checkout, Orders, Profile)
│   │   ├── admin/             # Panel Administrasi (Dashboard, Products, Orders, Vouchers, dll.)
│   │   ├── api/               # Next.js Route Handlers (Auth, Checkout, Webhooks, Admin API)
│   │   ├── globals.css        # Tailwind Design Tokens, Fonts, dan Custom CSS Classes
│   │   └── layout.tsx         # Root Layout & Metadata Toko
│   ├── components/
│   │   ├── store/             # Komponen Navbar, Footer, ProductCard, dll.
│   │   └── ui/                # Reusable UI widgets
│   └── lib/
│       ├── auth.ts            # Logika JWT, session, dan password hash
│       ├── duitku.ts          # Integrasi SDK Duitku (Invoicing, Signature, Status check)
│       ├── prisma.ts          # Singleton Prisma Client
│       ├── store.ts           # Global State Zustand (Cart & Wishlist)
│       └── utils.ts           # Format Rupiah, helper tanggal, status mapper
├── .env.example               # Template environment variables
├── package.json
└── README.md
```

---

## ⚙️ Cara Menjalankan Proyek di Komputer Lokal

### 1. Clone Repositori
```bash
git clone https://github.com/ard34/hijrahstyle.git
cd hijrahstyle
```

### 2. Pasang Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env` lalu isi nilai yang sesuai:
```bash
cp .env.example .env
```

Isi variabel utama:
```env
# Database PostgreSQL Supabase
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Otentikasi & Aplikasi
JWT_SECRET="kunci_rahasia_jwt_anda"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Toko Sample BBN"

# Duitku Sandbox
DUITKU_MERCHANT_CODE="DSXXXXX"
DUITKU_API_KEY="api_key_duitku_anda"
DUITKU_ENV="sandbox"
NEXT_PUBLIC_DUITKU_ENV="sandbox"
```

### 4. Sinkronisasi Database Prisma
```bash
npx prisma db push
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🚢 Alur Transaksi Pembayaran (Payment Flow)

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Pelanggan
    participant Frontend as Toko Sample BBN (Web)
    participant Backend as Next.js API (/api/checkout)
    participant Duitku as Duitku Sandbox Server
    participant DB as PostgreSQL (Supabase)

    Customer->>Frontend: Pilih produk, isi alamat, & klik Bayar Sekarang
    Frontend->>Backend: POST /api/checkout (Data item, kurir, & metode)
    Backend->>DB: Buat order status PENDING_PAYMENT
    Backend->>Duitku: Request createInvoice (MerchantCode, Amount, Signature)
    Duitku-->>Backend: Return PaymentURL & Reference ID
    Backend-->>Frontend: Kirim Payment URL / Reference
    Frontend->>Customer: Buka pop-up / redirect Duitku Checkout
    Customer->>Duitku: Selesaikan simulasi bayar (VA/QRIS)
    Duitku->>Backend: Callback HTTP POST ke /api/payments/webhook
    Backend->>Backend: Validasi Signature MD5/HMAC
    Backend->>DB: Update order status menjadi PAID & PROCESSING
    Backend-->>Duitku: Respon 200 OK
    Customer->>Frontend: Pesanan terkonfirmasi otomatis & resi dapat dipantau
```

---

## 📄 Lisensi & Hak Cipta
Dikelola dan dikembangkan untuk keperluan portofolio e-commerce modern **Toko Sample BBN**.
