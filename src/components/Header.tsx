import { Upload } from "lucide-react";
import logoSrc from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logoSrc} alt="Logo" className="h-16 w-16 object-contain" />
          <span className="text-xl font-bold text-primary">
            R Square Digital & Print Services
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#products"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Products
          </a>
          <a
            href="#upload"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Design
          </a>
          <a
            href="#quote"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Quote
          </a>
        </nav>
      </div>
    </header>
  );
};
