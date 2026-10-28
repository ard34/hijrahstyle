import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "HijrahStyle — Fashion Islami | Mudah, Aman & Terpercaya",
  description: "Belanja fashion Islami berkualitas — gamis, hijab, koko, abaya, dan aksesoris muslimah. Koleksi lengkap dengan harga terjangkau. Pengiriman cepat ke seluruh Indonesia.",
  keywords: "fashion islami, gamis, hijab, koko, abaya, muslimah, toko online, e-commerce islam",
  openGraph: {
    title: "HijrahStyle — Fashion Islami",
    description: "Belanja fashion Islami — Mudah, Aman & Terpercaya",
    type: "website",
    locale: "id_ID",
    siteName: "HijrahStyle",
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
