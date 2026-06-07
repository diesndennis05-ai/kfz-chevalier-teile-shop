import { Link } from "wouter";
import { Phone, Mail, MapPin, Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sidebar border-t border-sidebar-border text-sidebar-foreground py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-sm">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">KFZ <span className="text-sidebar-foreground">CHEVALIER</span></span>
          </Link>
          <p className="text-sidebar-foreground/60 text-sm leading-relaxed max-w-xs">
            Original OEM Ersatzteile für Volkswagen, Audi, Seat und Skoda. Qualität aus Deutschland für Ihre Werkstatt.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-sidebar-foreground mb-4 uppercase text-xs tracking-wider">Navigation</h3>
          <ul className="space-y-2 text-sm text-sidebar-foreground/60">
            <li><Link href="/products" className="hover:text-primary transition-colors">Gesamtkatalog</Link></li>
            <li><Link href="/categories" className="hover:text-primary transition-colors">Kategorien</Link></li>
            <li><Link href="/products?sort=newest" className="hover:text-primary transition-colors">Neu eingetroffen</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Anfragen</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-sidebar-foreground mb-4 uppercase text-xs tracking-wider">Kategorien</h3>
          <ul className="space-y-2 text-sm text-sidebar-foreground/60">
            <li><Link href="/products?category=motoren" className="hover:text-primary transition-colors">Motoren</Link></li>
            <li><Link href="/products?category=getriebe" className="hover:text-primary transition-colors">Getriebe & DSG</Link></li>
            <li><Link href="/products?category=turbolader" className="hover:text-primary transition-colors">Turbolader</Link></li>
            <li><Link href="/products?category=katalysatoren" className="hover:text-primary transition-colors">Katalysatoren</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold text-sidebar-foreground mb-4 uppercase text-xs tracking-wider">Kontakt</h3>
          <ul className="space-y-3 text-sm text-sidebar-foreground/60">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-primary" />
              <span>Industriestraße 42<br/>80807 München<br/>Deutschland</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-mono">+49 89 123 456 78</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>parts@kfz-chevalier.de</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-sidebar-border text-xs text-sidebar-foreground/40 flex flex-col md:flex-row items-center justify-between">
        <p>&copy; {new Date().getFullYear()} KFZ Chevalier GmbH. Alle Rechte vorbehalten.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/datenschutz" className="hover:text-sidebar-foreground">Datenschutz</Link>
          <Link href="/agb" className="hover:text-sidebar-foreground">AGB</Link>
          <Link href="/impressum" className="hover:text-sidebar-foreground">Impressum</Link>
        </div>
      </div>
    </footer>
  );
}
