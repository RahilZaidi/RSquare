import { Upload } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-orange flex items-center justify-center">
            <Upload className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">PrintCraft</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors">
            Products
          </a>
          <a href="#upload" className="text-muted-foreground hover:text-foreground transition-colors">
            Design
          </a>
          <a href="#quote" className="text-muted-foreground hover:text-foreground transition-colors">
            Quote
          </a>
        </nav>
      </div>
    </header>
  );
};