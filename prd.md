# Product Requirements Document (PRD)

## HijrahStyle — Fashion Islami E-Commerce

**Dokumen:** Product Requirements Document (PRD)  
**Produk:** HijrahStyle  
**Tipe:** E-commerce pribadi / single-vendor  
**Kategori:** Fashion Islami  
**Platform:** Responsive Web Application  
**Status:** Product Planning  
**Versi:** 1.0  
**Bahasa utama:** Bahasa Indonesia  
**Identitas visual:** Ungu / Purple  

---

## 1. Ringkasan Produk

HijrahStyle adalah aplikasi e-commerce pribadi yang berfokus pada penjualan fashion Islami. Konsep pengalaman pengguna mengambil inspirasi dari marketplace modern seperti Shopee, tetapi sistem dibuat sebagai **single-vendor store**, sehingga seluruh produk, pesanan, pembayaran, promo, pengiriman, pelanggan, dan laporan dikelola oleh satu pihak/admin toko.

Tujuan utama produk adalah menyediakan proses belanja fashion Islami yang sederhana, aman, responsif, dan nyaman, mulai dari pengguna menemukan produk sampai pesanan diterima dan pelanggan memberikan ulasan.

> Tagline: **Belanja Fashion Islami — Mudah, Aman & Terpercaya.**

---

## 2. Tujuan Produk

### 2.1 Tujuan Bisnis

1. Membuat kanal penjualan online khusus fashion Islami.
2. Memudahkan pemilik toko mengelola katalog dan pesanan dari satu dashboard.
3. Mengurangi proses pemesanan manual melalui chat.
4. Menyediakan pembayaran online melalui payment gateway.
5. Menyediakan data penjualan dan laporan untuk membantu pengambilan keputusan.
6. Membangun identitas brand HijrahStyle yang konsisten dengan tema warna ungu.

### 2.2 Tujuan Pengguna

1. Menemukan produk fashion Islami dengan cepat.
2. Melihat informasi produk secara lengkap.
3. Memilih ukuran, warna, dan jumlah produk.
4. Menyimpan alamat pengiriman.
5. Melakukan checkout dengan mudah.
6. Membayar menggunakan metode pembayaran yang tersedia.
7. Memantau status pesanan dan pengiriman.
8. Memberikan rating dan review setelah barang diterima.

---

## 3. Target Pengguna

### 3.1 Customer

Target utama:

- Wanita Muslim remaja hingga dewasa.
- Pria Muslim yang mencari fashion Islami.
- Orang tua yang membeli produk fashion Islami untuk keluarga.
- Masyarakat umum yang mencari pakaian Islami berkualitas.

### 3.2 Admin / Owner

Pemilik atau pengelola HijrahStyle yang bertanggung jawab terhadap seluruh operasional toko.

### 3.3 Model Bisnis

**Single Vendor / Private Store**

Tidak ada seller eksternal seperti marketplace. Seluruh produk berasal dari HijrahStyle dan seluruh transaksi diproses oleh sistem toko.

---

# 4. Scope Produk

## 4.1 Dalam Scope

- Landing page / homepage.
- Registrasi dan login customer.
- Login admin.
- Katalog produk.
- Kategori produk.
- Search dan filter produk.
- Detail produk.
- Varian produk.
- Keranjang.
- Checkout.
- Manajemen alamat.
- Pilihan pengiriman.
- Payment gateway.
- Status pembayaran.
- Manajemen pesanan.
- Status pengiriman.
- Tracking nomor resi.
- Wishlist.
- Voucher / promo.
- Rating dan review.
- Notifikasi transaksi.
- Chat customer dengan admin.
- Dashboard admin.
- CRUD produk.
- CRUD kategori.
- Manajemen stok.
- Manajemen customer.
- Manajemen voucher.
- Laporan penjualan.
- Pengaturan toko.
- Keamanan aplikasi.

## 4.2 Di Luar Scope MVP

Fitur berikut dapat dikembangkan setelah versi MVP stabil:

- Multi-vendor marketplace.
- Aplikasi Android/iOS native.
- Live shopping.
- Affiliate system.
- Loyalty point kompleks.
- AI recommendation engine.
- Pembayaran cicilan internal.
- Seller center untuk pihak ketiga.

---

# 5. Fitur Customer

## 5.1 Beranda

Homepage harus menampilkan:

- Logo HijrahStyle.
- Search bar.
- Banner promosi.
- Kategori produk.
- Produk terbaru.
- Produk terlaris.
- Produk promo.
- Rekomendasi produk.
- Tombol wishlist.
- Tombol keranjang.
- CTA menuju katalog.

### Acceptance Criteria

- Homepage dapat dibuka tanpa login.
- Produk dapat diklik menuju halaman detail.
- Search dapat digunakan dari homepage.
- Layout responsif pada desktop, tablet, dan mobile.

---

## 5.2 Registrasi

Customer dapat membuat akun menggunakan:

- Nama lengkap.
- Email.
- Nomor telepon.
- Password.
- Konfirmasi password.

Opsional:

- Verifikasi email.
- Login melalui OAuth/social login.

### Validasi

- Email harus valid dan unik.
- Password memenuhi minimum security requirement.
- Nomor telepon tervalidasi.
- Field wajib tidak boleh kosong.

---

## 5.3 Login

Customer dapat login menggunakan email/nomor telepon dan password.

Fitur pendukung:

- Remember session.
- Logout.
- Forgot password.
- Reset password.
- Session expiration.

---

## 5.4 Katalog Produk

Customer dapat melihat:

- Semua produk.
- Produk berdasarkan kategori.
- Produk berdasarkan koleksi.
- Produk terbaru.
- Produk terlaris.
- Produk promo.

### Filter

- Harga minimum/maksimum.
- Kategori.
- Warna.
- Ukuran.
- Ketersediaan stok.
- Rating.

### Sorting

- Terbaru.
- Harga terendah.
- Harga tertinggi.
- Terlaris.
- Rating tertinggi.

---

## 5.5 Search Produk

Search harus mendukung pencarian berdasarkan:

- Nama produk.
- SKU.
- Kategori.
- Tag produk.

Contoh:

`"gamis hitam"` → menampilkan produk relevan seperti Gamis Hitam Premium.

---

## 5.6 Detail Produk

Informasi minimal:

- Foto produk.
- Nama produk.
- Harga.
- Harga diskon jika ada.
- Stok.
- SKU.
- Deskripsi.
- Material.
- Panduan ukuran.
- Warna.
- Ukuran.
- Rating.
- Review pelanggan.
- Produk terkait.

Customer dapat:

- Pilih varian.
- Pilih jumlah.
- Tambah ke keranjang.
- Tambah ke wishlist.
- Beli sekarang.

---

## 5.7 Wishlist

Customer dapat menyimpan produk ke wishlist.

Fungsi:

- Add wishlist.
- Remove wishlist.
- Move wishlist ke cart.
- Menampilkan status stok.

---

## 5.8 Keranjang

Keranjang menampilkan:

- Produk.
- Varian.
- Harga satuan.
- Jumlah.
- Subtotal produk.
- Voucher.
- Ongkos kirim jika sudah tersedia.
- Total pembayaran.

Customer dapat:

- Menambah jumlah.
- Mengurangi jumlah.
- Menghapus produk.
- Memilih produk yang akan checkout.

---

# 6. Checkout Flow

## 6.1 Data Checkout

Checkout terdiri dari:

1. Review barang.
2. Alamat pengiriman.
3. Kurir / metode pengiriman.
4. Voucher.
5. Ringkasan biaya.
6. Metode pembayaran.
7. Konfirmasi.

### Ringkasan biaya

```text
Subtotal Produk
- Diskon/Voucher
+ Ongkos Kirim
----------------
Total Pembayaran
```

---

## 6.2 Manajemen Alamat

Customer dapat:

- Tambah alamat.
- Edit alamat.
- Hapus alamat.
- Set alamat utama.

Field:

- Nama penerima.
- Nomor telepon.
- Provinsi.
- Kota/Kabupaten.
- Kecamatan.
- Kode pos.
- Detail alamat.
- Catatan untuk kurir.

---

## 6.3 Pengiriman

Sistem harus mendukung integrasi layanan kurir melalui shipping provider/API sesuai kebutuhan bisnis.

Informasi yang diperlukan:

- Kurir.
- Service.
- Estimasi pengiriman.
- Ongkos kirim.
- Nomor resi.

---

# 7. Payment Gateway

## 7.1 Tujuan

Payment gateway digunakan untuk menangani pembayaran online secara aman tanpa menyimpan data kartu secara langsung di aplikasi.

Contoh provider yang dapat digunakan:

- Midtrans.
- Xendit.

Implementasi final harus memilih satu provider utama terlebih dahulu untuk MVP.

## 7.2 Metode Pembayaran

Tergantung dukungan provider yang dipilih, sistem dapat menyediakan:

- Virtual Account.
- Kartu kredit/debit.
- E-Wallet.
- QRIS.
- Retail outlet.
- Metode lain yang tersedia pada provider.

## 7.3 Payment Flow

```text
Customer Checkout
       ↓
Buat Order
       ↓
Generate Payment Transaction
       ↓
Redirect / Show Payment UI
       ↓
Customer Memilih Metode Pembayaran
       ↓
Customer Melakukan Pembayaran
       ↓
Payment Gateway Memproses
       ↓
Callback / Webhook ke Backend
       ↓
Backend Validasi Signature
       ↓
Update Status Payment
       ↓
Update Status Order
       ↓
Kirim Notifikasi Customer
```

## 7.4 Status Pembayaran

Minimal status:

- `pending`
- `paid`
- `failed`
- `expired`
- `cancelled`
- `refunded`

## 7.5 Webhook / Callback

Backend harus menyediakan endpoint khusus webhook.

Contoh:

`POST /api/payments/webhook`

Webhook wajib:

- Memvalidasi signature/hash dari provider.
- Memastikan order benar-benar ada.
- Menghindari duplicate processing.
- Menggunakan transaction database saat update status.
- Menyimpan payment event untuk audit.

---

# 8. Order Management

## 8.1 Status Order

```text
PENDING_PAYMENT
      ↓
PAID
      ↓
PROCESSING
      ↓
PACKED
      ↓
SHIPPED
      ↓
DELIVERED
      ↓
COMPLETED
```

Status tambahan:

- `CANCELLED`
- `PAYMENT_FAILED`
- `EXPIRED`
- `REFUNDED`
- `RETURN_REQUESTED`
- `RETURNED`

## 8.2 Pesanan Customer

Customer dapat melihat:

- Nomor order.
- Tanggal order.
- Produk.
- Total pembayaran.
- Status pembayaran.
- Status pesanan.
- Kurir.
- Nomor resi.
- Timeline order.

---

# 9. Tracking Pengiriman

Customer dapat melihat timeline:

```text
Pesanan dibuat
      ↓
Pembayaran dikonfirmasi
      ↓
Pesanan diproses
      ↓
Pesanan dikemas
      ↓
Pesanan dikirim
      ↓
Paket dalam perjalanan
      ↓
Paket diterima
      ↓
Pesanan selesai
```

Admin dapat memasukkan atau memperbarui nomor resi.

Integrasi tracking otomatis dengan provider logistik dapat ditambahkan setelah MVP.

---

# 10. Review & Rating

Customer dapat memberikan review setelah order berstatus `DELIVERED` atau `COMPLETED`.

Data review:

- Rating 1–5.
- Komentar.
- Foto produk (opsional).

Aturan:

- Satu order item hanya dapat direview sesuai kebijakan toko.
- Customer harus memiliki transaksi yang valid.
- Admin dapat melakukan moderasi review.

---

# 11. Voucher & Promo

Admin dapat membuat:

- Voucher diskon persen.
- Voucher potongan harga tetap.
- Minimal pembelian.
- Maksimal diskon.
- Kuota voucher.
- Periode aktif.
- Produk/kategori target.

Contoh:

```text
Kode: HIJRAH20
Diskon: 20%
Minimum Belanja: Rp150.000
Maksimal Diskon: Rp50.000
Periode: 01-30 September 2026
```

---

# 12. Notifikasi

Notifikasi dapat digunakan untuk:

- Registrasi berhasil.
- Pesanan dibuat.
- Pembayaran berhasil.
- Pembayaran gagal.
- Pembayaran kedaluwarsa.
- Pesanan diproses.
- Pesanan dikirim.
- Pesanan diterima.
- Promo/voucher.
- Chat customer.

Channel tahap awal:

- In-app notification.
- Email.

Pengembangan berikutnya dapat menambahkan WhatsApp notification.

---

# 13. Customer Service / Chat

Customer dapat menghubungi admin melalui sistem chat sederhana.

MVP dapat berupa:

```text
Customer → Kirim pesan → Admin → Balas
```

Fitur:

- Daftar percakapan.
- Pesan masuk.
- Status dibaca.
- Timestamp.
- Attachment opsional.

---

# 14. Fitur Admin

## 14.1 Login Admin

Admin login melalui halaman khusus.

Contoh:

`/admin/login`

Security:

- Password hashing.
- Session/token management.
- Rate limiting.
- Optional 2FA.
- Role-based access control.

---

## 14.2 Dashboard

Dashboard menampilkan:

- Total penjualan.
- Pesanan hari ini.
- Pesanan pending.
- Pesanan diproses.
- Produk hampir habis.
- Customer baru.
- Pendapatan.
- Produk terlaris.
- Grafik penjualan.

Contoh KPI:

```text
Total Sales
Total Orders
Average Order Value
Conversion Rate
Low Stock Products
New Customers
```

---

## 14.3 Manajemen Produk

Admin dapat:

- Tambah produk.
- Edit produk.
- Hapus/nonaktifkan produk.
- Upload foto.
- Mengatur harga.
- Mengatur diskon.
- Mengatur SKU.
- Mengatur stok.
- Mengatur kategori.
- Mengatur ukuran.
- Mengatur warna.
- Mengatur deskripsi.
- Mengatur status aktif/nonaktif.

### Struktur Produk

```text
Product
├── Basic Information
├── Images
├── Category
├── Price
├── Variants
│   ├── Size
│   └── Color
├── Stock
├── SKU
└── Description
```

---

## 14.4 Manajemen Kategori

Admin dapat CRUD:

- Nama kategori.
- Slug.
- Deskripsi.
- Icon/image.
- Status aktif.
- Urutan tampilan.

Contoh:

- Gamis.
- Hijab.
- Abaya.
- Koko.
- Tunik.
- Dress Muslimah.
- Mukena.
- Aksesoris.

---

## 14.5 Manajemen Stok

Admin dapat memonitor:

- Stok tersedia.
- Stok terjual.
- Stok minimum.
- Produk habis.
- Riwayat perubahan stok.

Sistem harus mengurangi stok secara aman ketika order berhasil dibayar atau pada tahap yang ditentukan oleh strategi inventory.

---

## 14.6 Manajemen Pesanan

Admin dapat:

- Melihat seluruh pesanan.
- Filter berdasarkan status.
- Melihat detail order.
- Verifikasi pembayaran.
- Mengubah status order.
- Input nomor resi.
- Memilih kurir.
- Membatalkan order sesuai aturan.
- Memproses refund sesuai dukungan payment gateway.

---

## 14.7 Manajemen Pembayaran

Admin dapat melihat:

- Order ID.
- Payment ID.
- Metode pembayaran.
- Nominal.
- Status.
- Waktu transaksi.
- Payment provider.
- Event webhook.

---

## 14.8 Manajemen Customer

Admin dapat melihat:

- Nama.
- Email.
- Nomor telepon.
- Jumlah pesanan.
- Total belanja.
- Tanggal registrasi.
- Status akun.

Admin tidak boleh melihat password dalam bentuk plaintext.

---

## 14.9 Manajemen Voucher

CRUD voucher dengan:

- Kode.
- Jenis diskon.
- Nilai diskon.
- Minimum pembelian.
- Maksimum diskon.
- Kuota.
- Periode.
- Scope produk/kategori.
- Status aktif.

---

## 14.10 Laporan

Dashboard laporan menyediakan:

- Penjualan harian.
- Penjualan mingguan.
- Penjualan bulanan.
- Penjualan per kategori.
- Produk terlaris.
- Produk paling sedikit terjual.
- Customer dengan transaksi terbanyak.
- Total pembayaran.
- Total diskon.
- Total ongkir.

Export:

- CSV.
- Excel/PDF sebagai pengembangan lanjutan.

---

# 15. Alur Utama Customer

```text
┌───────────────┐
│ Landing Page  │
└───────┬───────┘
        ↓
┌──────────────────┐
│ Register / Login │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Jelajah Produk   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Detail Produk    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Pilih Varian     │
│ Size/Color       │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Tambah Keranjang │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Checkout         │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Pilih Alamat     │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Pilih Pengiriman │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Pilih Pembayaran │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ Payment Gateway  │
└────────┬─────────┘
         ↓
    ┌───────────┐
    │ Berhasil? │
    └───┬───┬───┘
       Ya  Tidak
        ↓     ↓
┌────────────┐ ┌─────────────┐
│ Paid       │ │ Failed/     │
│            │ │ Pending     │
└─────┬──────┘ └─────────────┘
      ↓
┌──────────────┐
│ Admin Proses │
└──────┬───────┘
       ↓
┌──────────────┐
│ Paket Dikirim│
└──────┬───────┘
       ↓
┌──────────────┐
│ Diterima     │
└──────┬───────┘
       ↓
┌──────────────┐
│ Review       │
└──────┬───────┘
       ↓
┌──────────────┐
│ Selesai      │
└──────────────┘
```

---

# 16. Alur Utama Admin

```text
┌──────────────┐
│ Admin Login  │
└──────┬───────┘
       ↓
┌──────────────┐
│ Dashboard    │
└──────┬───────┘
       ↓
┌────────────────────────────┐
│ Manajemen Produk & Stok    │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Manajemen Order            │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Verifikasi Payment Gateway │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Proses Pesanan             │
│ Paid → Processing → Packed │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Input Kurir & Nomor Resi   │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Shipped                     │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Delivered / Completed      │
└─────────────┬──────────────┘
              ↓
┌────────────────────────────┐
│ Laporan & Analytics        │
└────────────────────────────┘
```

---

# 17. Arsitektur Sistem

Arsitektur yang direkomendasikan untuk MVP:

```text
                        ┌──────────────────┐
                        │      Customer    │
                        │ Browser/Mobile   │
                        └────────┬─────────┘
                                 │ HTTPS
                                 ↓
                    ┌─────────────────────────┐
                    │ Frontend Web Application │
                    │ React.js / Next.js       │
                    └────────────┬────────────┘
                                 │ REST API
                                 ↓
                    ┌─────────────────────────┐
                    │ Backend API              │
                    │ Node.js / Express.js     │
                    └───────┬──────┬──────────┘
                            │      │
                ┌───────────┘      └────────────┐
                ↓                              ↓
      ┌──────────────────┐          ┌──────────────────┐
      │ MySQL/PostgreSQL │          │ Object Storage   │
      │ Database         │          │ Product Images   │
      └──────────────────┘          └──────────────────┘
                │
                │
                ├──────────────→ Payment Gateway
                │                Midtrans/Xendit
                │
                ├──────────────→ Shipping Provider
                │
                └──────────────→ Email/Notification
```

---

# 18. Technology Stack

## Frontend

Recommended:

- React.js / Next.js.
- TypeScript.
- Tailwind CSS.
- Responsive UI.
- Form validation library.
- Client-side state management sesuai kebutuhan.

## Backend

Recommended:

- Node.js.
- Express.js atau NestJS.
- TypeScript.
- REST API.
- JWT atau secure session-based authentication.
- Bcrypt/Argon2 untuk password hashing.

## Database

Pilihan utama:

- MySQL atau PostgreSQL.

Untuk proyek pribadi, MySQL dapat digunakan apabila sudah familiar dan tersedia pada hosting yang dipilih.

## Storage

- Cloudinary, S3-compatible storage, atau object storage lain.
- Jangan menyimpan file upload besar langsung di database.

## Hosting

Contoh:

- VPS.
- Cloud hosting.
- Managed hosting.
- Vercel/Cloudflare untuk frontend jika arsitektur mendukung.

---

# 19. Struktur Database

Struktur awal yang direkomendasikan:

```text
users
- id
- name
- email
- phone
- password_hash
- role
- status
- created_at
- updated_at

addresses
- id
- user_id
- recipient_name
- phone
- province
- city
- district
- postal_code
- address_detail
- note
- is_default
- created_at
- updated_at

categories
- id
- name
- slug
- description
- image_url
- status
- sort_order
- created_at
- updated_at

products
- id
- category_id
- name
- slug
- sku
- description
- material
- price
- compare_at_price
- status
- created_at
- updated_at

product_images
- id
- product_id
- image_url
- sort_order

product_variants
- id
- product_id
- sku
- color
- size
- price_override
- stock
- status

wishlists
- id
- user_id
- product_id
- created_at

carts
- id
- user_id
- created_at
- updated_at

cart_items
- id
- cart_id
- product_variant_id
- quantity
- created_at
- updated_at

orders
- id
- order_number
- user_id
- address_id
- subtotal
- discount_amount
- shipping_amount
- total_amount
- voucher_id
- status
- created_at
- updated_at

order_items
- id
- order_id
- product_variant_id
- product_name_snapshot
- variant_snapshot
- price
- quantity
- subtotal

payments
- id
- order_id
- provider
- provider_payment_id
- payment_method
- amount
- status
- paid_at
- expired_at
- created_at
- updated_at

payment_events
- id
- payment_id
- event_type
- provider_reference
- payload
- processed_at
- created_at

shipments
- id
- order_id
- courier
- service
- tracking_number
- shipping_cost
- estimated_delivery
- shipped_at
- delivered_at
- created_at
- updated_at

vouchers
- id
- code
- type
- value
- minimum_purchase
- maximum_discount
- usage_limit
- usage_count
- starts_at
- expires_at
- status
- created_at
- updated_at

reviews
- id
- user_id
- product_id
- order_item_id
- rating
- comment
- status
- created_at
- updated_at

notifications
- id
- user_id
- type
- title
- message
- read_at
- created_at

conversations
- id
- user_id
- status
- created_at
- updated_at

messages
- id
- conversation_id
- sender_id
- message
- attachment_url
- read_at
- created_at
```

---

# 20. Relasi Database Utama

```text
users 1 ──────── N addresses
users 1 ──────── N orders
users 1 ──────── N wishlists
users 1 ──────── N reviews
users 1 ──────── N notifications
users 1 ──────── N conversations

categories 1 ── N products
products 1 ───── N product_images
products 1 ───── N product_variants

orders 1 ─────── N order_items
orders 1 ─────── 1 payments
orders 1 ─────── 1 shipments

payments 1 ───── N payment_events

product_variants 1 ── N order_items

conversations 1 ── N messages
```

---

# 21. REST API Requirements

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

## Products

```http
GET    /api/products
GET    /api/products/:slug
POST   /api/admin/products
PATCH  /api/admin/products/:id
DELETE /api/admin/products/:id
```

## Categories

```http
GET    /api/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
DELETE /api/admin/categories/:id
```

## Cart

```http
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:id
DELETE /api/cart/items/:id
```

## Checkout / Orders

```http
POST /api/checkout
POST /api/orders
GET  /api/orders
GET  /api/orders/:orderNumber
POST /api/orders/:id/cancel
```

## Payment

```http
POST /api/payments/create
POST /api/payments/webhook
GET  /api/payments/:orderNumber
```

## Reviews

```http
GET  /api/products/:id/reviews
POST /api/orders/items/:id/review
```

---

# 22. Security Requirements

Keamanan merupakan requirement wajib karena aplikasi menangani akun, alamat, order, dan transaksi pembayaran.

## 22.1 Authentication

- Password tidak boleh disimpan plaintext.
- Gunakan Argon2id atau bcrypt.
- Session/token memiliki expiry.
- Logout harus invalidasi session sesuai arsitektur.

## 22.2 Authorization

Gunakan role-based access control:

```text
CUSTOMER
ADMIN
```

Customer tidak boleh mengakses endpoint admin.

## 22.3 Input Validation

Semua input harus divalidasi server-side.

Proteksi terhadap:

- SQL Injection.
- XSS.
- Command Injection.
- Parameter tampering.
- Mass assignment.
- Malicious file upload.

## 22.4 API Security

- HTTPS wajib untuk production.
- Rate limiting.
- CORS yang terkontrol.
- Secure headers.
- Request validation.
- Error response tidak membocorkan stack trace.
- Logging aktivitas penting.

## 22.5 Payment Security

- Jangan menyimpan CVV.
- Jangan menyimpan data kartu secara langsung.
- Validasi webhook/signature.
- Gunakan idempotency untuk event pembayaran.
- Status pembayaran ditentukan backend berdasarkan provider yang tervalidasi.

## 22.6 File Upload Security

Untuk foto produk atau attachment chat:

- Validasi MIME type.
- Validasi extension.
- Batas ukuran file.
- Randomized filename/object key.
- Jangan mengeksekusi upload sebagai kode.
- Pertimbangkan malware scanning untuk sistem yang lebih besar.

---

# 23. UI/UX Requirements

## 23.1 Identitas Visual

Tema utama:

- Primary: Purple.
- Secondary: White / neutral.
- Accent: soft purple.
- Text: dark neutral.

Style:

- Modern.
- Minimal.
- Elegan.
- Feminine namun tetap dapat digunakan untuk fashion Islami pria.
- Mobile-first.

## 23.2 Komponen Utama

- Navbar.
- Search bar.
- Product card.
- Category card.
- Banner carousel.
- Price component.
- Rating component.
- Cart drawer/page.
- Checkout stepper.
- Order timeline.
- Admin sidebar.
- Dashboard cards.
- Data table.
- Modal.
- Toast notification.

## 23.3 Halaman Customer

```text
/
├── /products
├── /products/:slug
├── /categories/:slug
├── /search
├── /wishlist
├── /cart
├── /checkout
├── /orders
├── /orders/:orderNumber
├── /profile
├── /addresses
├── /login
├── /register
└── /forgot-password
```

## 23.4 Halaman Admin

```text
/admin
├── /login
├── /dashboard
├── /products
├── /categories
├── /inventory
├── /orders
├── /payments
├── /customers
├── /vouchers
├── /reviews
├── /reports
├── /chat
└── /settings
```

---

# 24. Non-Functional Requirements

## Performance

Target awal:

- Halaman utama terasa responsif pada koneksi mobile normal.
- API mayoritas endpoint umum memiliki response time rendah dan stabil.
- Optimasi gambar produk wajib.
- Pagination digunakan untuk katalog dan data admin.

## Availability

Target MVP:

- Monitoring server.
- Backup database terjadwal.
- Health-check endpoint.

## Scalability

Arsitektur harus memungkinkan:

- Penambahan Redis/cache.
- Queue/background jobs.
- Object storage.
- Search engine jika katalog berkembang.

## Maintainability

- TypeScript.
- Modular architecture.
- Environment variables.
- Code linting.
- Consistent naming convention.
- API documentation.
- Database migration.

---

# 25. Logging & Monitoring

Log aktivitas penting:

- Login gagal.
- Login berhasil.
- Perubahan password.
- Perubahan role.
- Order dibuat.
- Payment webhook diterima.
- Payment status berubah.
- Order status berubah.
- Refund.
- Perubahan stok.
- Aktivitas admin penting.

Jangan log:

- Password.
- CVV.
- Secret key.
- Access token secara sembarangan.
- Data pembayaran sensitif.

---

# 26. Error Handling

Sistem harus menyediakan pesan error yang mudah dipahami.

Contoh:

### Produk habis

> Produk yang Anda pilih sedang habis.

### Pembayaran gagal

> Pembayaran belum berhasil. Silakan gunakan metode pembayaran lain atau coba kembali.

### Session expired

> Sesi Anda telah berakhir. Silakan login kembali.

### Server error

> Terjadi kesalahan pada server. Silakan coba kembali beberapa saat lagi.

---

# 27. Acceptance Criteria Utama MVP

MVP dinyatakan siap apabila seluruh skenario berikut berhasil:

### Customer

- [ ] Customer dapat register.
- [ ] Customer dapat login.
- [ ] Customer dapat melihat katalog.
- [ ] Customer dapat melakukan search.
- [ ] Customer dapat filter produk.
- [ ] Customer dapat melihat detail produk.
- [ ] Customer dapat memilih varian.
- [ ] Customer dapat memasukkan produk ke cart.
- [ ] Customer dapat membuat alamat.
- [ ] Customer dapat checkout.
- [ ] Customer dapat memilih shipping.
- [ ] Customer dapat membayar melalui payment gateway.
- [ ] Webhook payment memperbarui status pembayaran.
- [ ] Customer dapat melihat order.
- [ ] Customer dapat melihat status pengiriman.
- [ ] Customer dapat memberikan review setelah order selesai.

### Admin

- [ ] Admin dapat login.
- [ ] Admin dapat melihat dashboard.
- [ ] Admin dapat CRUD produk.
- [ ] Admin dapat CRUD kategori.
- [ ] Admin dapat mengelola stok.
- [ ] Admin dapat melihat order.
- [ ] Admin dapat mengubah status order.
- [ ] Admin dapat melihat payment.
- [ ] Admin dapat mengatur nomor resi.
- [ ] Admin dapat mengelola voucher.
- [ ] Admin dapat melihat laporan dasar.

### Security

- [ ] Password di-hash.
- [ ] RBAC diterapkan.
- [ ] Endpoint admin dilindungi.
- [ ] Input tervalidasi.
- [ ] Payment webhook divalidasi.
- [ ] HTTPS aktif production.
- [ ] Rate limit aktif pada endpoint sensitif.
- [ ] Secret key tidak disimpan di source code.

---

# 28. Prioritas Fitur

## P0 — Wajib MVP

- Authentication.
- Product catalog.
- Product detail.
- Cart.
- Checkout.
- Address.
- Payment gateway.
- Order.
- Admin dashboard.
- Product management.
- Order management.
- Inventory dasar.
- Security dasar.

## P1 — Setelah MVP

- Wishlist.
- Voucher.
- Review.
- Notification.
- Customer chat.
- Shipping API.
- Analytics yang lebih lengkap.

## P2 — Pengembangan Lanjutan

- Mobile app.
- Push notification.
- Loyalty points.
- Affiliate.
- AI recommendation.
- Multi-vendor.
- Live shopping.

---

# 29. Roadmap Pengembangan

## Bulan 1 — Perencanaan & Desain

- Finalisasi requirement.
- User flow.
- Database design.
- Wireframe.
- UI/UX.
- Design system.
- Setup repository.

## Bulan 2–3 — Core Development

- Frontend.
- Backend.
- Authentication.
- Product catalog.
- Cart.
- Checkout.
- Admin dashboard.
- Database integration.

## Bulan 4 — Payment & Testing

- Integrasi payment gateway.
- Webhook.
- Shipping integration.
- Functional testing.
- Security testing.
- Usability testing.

## Bulan 5 — Launching

- Production deployment.
- Domain.
- SSL.
- Monitoring.
- Backup.
- Bug fixing.
- Soft launch.

## Bulan 6 — Enhancement

- Mobile/PWA enhancement.
- Promo lanjutan.
- Chat.
- Analytics lanjutan.
- Performance improvement.

---

# 30. Definition of Done

Sebuah fitur dianggap selesai apabila:

1. Requirement sudah diimplementasikan.
2. UI sudah responsive.
3. Validasi frontend dan backend tersedia.
4. Authorization sudah diterapkan.
5. Error handling sudah tersedia.
6. Database migration tersedia jika diperlukan.
7. API terdokumentasi.
8. Unit/integration test yang relevan tersedia.
9. Tidak ada bug kritis.
10. Fitur lolos pengujian pada environment staging.

---

# 31. Risiko Proyek

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Payment webhook tidak tervalidasi | Tinggi | Signature validation + idempotency |
| Stok tidak sinkron | Tinggi | Transaction/locking dan validasi stok |
| Kebocoran akun | Tinggi | Secure auth, hashing, rate limit |
| Gambar terlalu besar | Sedang | Image compression/CDN |
| Server down | Tinggi | Monitoring dan backup |
| Order double-submit | Tinggi | Idempotency key / unique order constraint |
| Perubahan API payment provider | Sedang | Adapter/service layer |
| Spam chat/form | Sedang | Rate limiting |

---

# 32. KPI Produk

Setelah produk live, metrik yang dapat dipantau:

- Jumlah visitor.
- Jumlah registered customer.
- Add-to-cart rate.
- Checkout rate.
- Payment success rate.
- Conversion rate.
- Average Order Value.
- Repeat purchase rate.
- Produk terlaris.
- Cart abandonment rate.
- Revenue per month.

---

# 33. Struktur Modul Backend

Contoh modular structure:

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── categories/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── payments/
│   ├── shipments/
│   ├── vouchers/
│   ├── reviews/
│   ├── notifications/
│   ├── chat/
│   └── reports/
├── middleware/
├── config/
├── database/
├── utils/
└── app.ts
```

---

# 34. Deployment Environment

## Development

```text
Developer
   ↓
Local Frontend
   ↓
Local API
   ↓
Local Database
```

## Staging

```text
Developer
   ↓
Git Repository
   ↓
CI/CD
   ↓
Staging Frontend
   ↓
Staging API
   ↓
Staging Database
   ↓
Sandbox Payment Gateway
```

## Production

```text
Customer
   ↓ HTTPS
Production Frontend
   ↓ HTTPS/API
Production Backend
   ↓
Production Database
   │
   ├── Payment Gateway
   ├── Shipping Provider
   ├── Email Service
   └── Object Storage
```

---

# 35. Environment Variables

Contoh:

```env
NODE_ENV=production

DATABASE_URL=

JWT_SECRET=
SESSION_SECRET=

PAYMENT_PROVIDER=
PAYMENT_SERVER_KEY=
PAYMENT_CLIENT_KEY=
PAYMENT_WEBHOOK_SECRET=

STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

EMAIL_HOST=
EMAIL_USER=
EMAIL_PASSWORD=

APP_URL=
API_URL=
```

Secret harus disimpan melalui environment/secret management dan tidak boleh di-commit ke repository.

---

# 36. Final Product Flow

```text
CUSTOMER
   │
   ├── Browse Product
   ├── Search / Filter
   ├── Product Detail
   ├── Cart
   ├── Checkout
   ├── Address
   ├── Shipping
   └── Payment
          │
          ↓
   PAYMENT GATEWAY
          │
          ↓ Webhook
       BACKEND
          │
          ├── Validate Payment
          ├── Update Payment
          ├── Update Order
          ├── Reduce/Reserve Stock
          └── Notify Customer
          │
          ↓
       ADMIN
          │
          ├── Process Order
          ├── Pack Order
          ├── Input Courier
          └── Input Tracking Number
          │
          ↓
      CUSTOMER
          │
          ├── Track Package
          ├── Receive Order
          ├── Review Product
          └── Repeat Order
```

---

# 37. Kesimpulan

HijrahStyle dirancang sebagai e-commerce fashion Islami **single-vendor** dengan pengalaman pengguna modern seperti marketplace, tetapi tetap sederhana untuk dioperasikan oleh satu pemilik toko. Sistem inti berpusat pada katalog produk, checkout, payment gateway, pengelolaan order, inventory, dan dashboard admin, kemudian dapat diperluas dengan voucher, wishlist, review, notifikasi, chat, shipping API, PWA/mobile app, serta fitur marketing lanjutan.

Prioritas implementasi harus dimulai dari **authentication → catalog → product detail → cart → checkout → payment gateway → order → admin processing → shipping → completion**, kemudian dilanjutkan dengan fitur P1/P2 setelah alur transaksi utama stabil.
