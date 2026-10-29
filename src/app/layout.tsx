import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "Toko Sample BBN — Mudah, Aman & Terpercaya",
  description: "Belanja produk berkualitas di Toko Sample BBN. Koleksi lengkap dengan harga terjangkau. Pengiriman cepat ke seluruh Indonesia.",
  keywords: "toko sample bbn, toko online, e-commerce, belanja online",
  openGraph: {
    title: "Toko Sample BBN",
    description: "Belanja produk berkualitas di Toko Sample BBN — Mudah, Aman & Terpercaya",
    type: "website",
    locale: "id_ID",
    siteName: "Toko Sample BBN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
