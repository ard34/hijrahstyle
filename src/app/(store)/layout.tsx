import Navbar from '@/components/store/Navbar';
import Footer from '@/components/store/Footer';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#070b14] text-slate-100 min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
