import Link from "next/link";
import { Button } from "./ui/button";

export default function NavBar() {
  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="group">
            <h1 className="font-serif text-3xl font-bold tracking-tight transition-colors group-hover:text-accent">
              The Chronicle
            </h1>
          </Link>
          <nav className="flex items-center gap-8">
            <Button asChild variant="link" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild>
              <Link href="/posts/create">New Post</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}