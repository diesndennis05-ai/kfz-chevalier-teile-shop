import React from "react";
import { Link } from "wouter";
import { ShoppingCart, Menu, Search, Phone, Wrench, Youtube } from "lucide-react";
import { useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "./CartDrawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey() } });
  
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-sidebar text-sidebar-foreground border-sidebar-border">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors">Startseite</Link>
                <Link href="/products" className="text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors">Katalog</Link>
                <Link href="/categories" className="text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors">Kategorien</Link>
                <Link href="/youtube" className="text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-primary" /> YouTube
                </Link>
                <Link href="/contact" className="text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors">Kontakt</Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-sm">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">KFZ <span className="text-sidebar-foreground">CHEVALIER</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sidebar-foreground/70 ml-6">
            <Link href="/products" className="hover:text-sidebar-primary transition-colors tracking-wide uppercase text-xs font-semibold">Katalog</Link>
            <Link href="/categories" className="hover:text-sidebar-primary transition-colors tracking-wide uppercase text-xs font-semibold">Kategorien</Link>
            <Link href="/youtube" className="hover:text-primary transition-colors tracking-wide uppercase text-xs font-semibold flex items-center gap-1.5 text-primary/80 border border-primary/20 px-2 py-1 rounded-sm hover:bg-primary/10">
              <Youtube className="h-3.5 w-3.5" /> YouTube
            </Link>
            <Link href="/contact" className="hover:text-sidebar-primary transition-colors tracking-wide uppercase text-xs font-semibold">Kontakt</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-sm text-sidebar-foreground/60 mr-4 border-r border-sidebar-border pr-6">
            <Phone className="h-4 w-4" />
            <span className="font-mono text-sidebar-foreground/80">+49 89 123 456</span>
          </div>

          <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {cart?.itemCount ? (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-primary text-primary-foreground border-0">
                {cart.itemCount}
              </Badge>
            ) : null}
          </Button>
        </div>
      </div>
      
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} cart={cart} />
    </header>
  );
}
