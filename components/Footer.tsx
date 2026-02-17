export default function Footer() {
  return (
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
  )
}
