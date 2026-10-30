import type { Metadata } from "next";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "HijrahStyle — Butik Busana Muslimah Modern & Elegan",
  description: "Belanja busana muslimah, gamis, dan mukena berkualitas butik di HijrahStyle. Bahan premium, jahitan rapi, dan pengiriman kilat ke seluruh Indonesia dari Kota Serang.",
  keywords: "hijrahstyle, butik muslimah, gamis modern, mukena premium, hijab serang, fashion syar'i",
  openGraph: {
    title: "HijrahStyle — Butik Busana Muslimah",
    description: "Koleksi busana muslimah, mukena, dan gamis modern berkualitas butik dari Kota Serang, Banten.",
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
