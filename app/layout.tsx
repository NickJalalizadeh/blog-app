import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The Chronicle - A Modern Blog",
  description: "Thoughtful writing on technology, culture, and ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased grain">
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster position="top-right" richColors={true} closeButton={true} />
          <Footer />
        </div>
      </body>
    </html>
  );
}