import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "sonner";

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
          <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <Link href="/" className="group">
                  <h1 className="font-serif text-3xl font-bold tracking-tight transition-colors group-hover:text-accent">
                    The Chronicle
                  </h1>
                </Link>
                <nav className="flex items-center gap-8">
                  <Link 
                    href="/" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/posts/create" 
                    className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    New Post
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>

          <Toaster position="top-right" richColors={true} closeButton={true} />
          
          <footer className="border-t border-border/40 mt-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  © 2026 The Chronicle. All rights reserved.
                </p>
                <p className="text-sm text-muted-foreground">
                  Built with Next.js, React, TypeScript & Tailwind CSS
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}