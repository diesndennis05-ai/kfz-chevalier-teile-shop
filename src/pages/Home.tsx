import { useListFeaturedProducts, useGetProductStats, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShieldCheck, Truck, Cog, ArrowRight, Activity, Box } from "lucide-react";

export default function Home() {
  const { data: featuredProducts, isLoading: featuredLoading } = useListFeaturedProducts();
  const { data: stats, isLoading: statsLoading } = useGetProductStats();
  const { data: categories, isLoading: categoriesLoading } = useListCategories();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center bg-sidebar overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="KFZ Werkstatt" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar via-sidebar/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-sidebar/60 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary border border-primary/30 font-mono text-xs rounded mb-6 tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Zertifizierte Original VAG Teile</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-sidebar-foreground leading-[1.1]">
              Qualität.<br/><span className="text-primary">Ohne Kompromisse.</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/60 mb-8 max-w-xl leading-relaxed">
              Original OEM Motoren, Getriebe und Aggregate für Volkswagen, Audi, Seat und Skoda. Geprüft, zertifiziert und bereit für Ihre Werkstatt.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="font-bold tracking-wide bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/products">ZUM KATALOG <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="font-bold tracking-wide border-sidebar-border text-sidebar-foreground bg-sidebar-accent/50 hover:bg-sidebar-accent hover:text-sidebar-foreground" asChild>
                <Link href="/categories">KATEGORIEN</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom red bar accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
      </section>

      {/* Trust Badges */}
      <section className="border-y bg-card py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col items-center p-8 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Nur Original OEM</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Keine Nachbauteile. Ausschließlich echte VAG Originalteile direkt aus Deutschland.</p>
            </div>
            <div className="flex flex-col items-center p-8 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-4">
                <Cog className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Geprüft & Zertifiziert</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Jedes Teil wird von unseren Kfz-Meistern vor der Aufnahme in den Katalog geprüft.</p>
            </div>
            <div className="flex flex-col items-center p-8 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Schneller Versand</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Sicherer Speditionsversand für schwere Teile wie Motoren und Getriebe weltweit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {!statsLoading && stats && (
        <section className="py-10 bg-sidebar border-b border-sidebar-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-12 md:gap-20">
              <div className="flex items-center gap-4">
                <Box className="w-8 h-8 text-primary opacity-80" />
                <div>
                  <div className="text-3xl font-mono font-bold text-sidebar-foreground">{stats.totalProducts.toLocaleString('de-DE')}</div>
                  <div className="text-xs text-sidebar-foreground/50 uppercase tracking-widest mt-1">Teile verfügbar</div>
                </div>
              </div>
              <div className="w-px bg-sidebar-border hidden md:block"></div>
              <div className="flex items-center gap-4">
                <Activity className="w-8 h-8 text-primary opacity-80" />
                <div>
                  <div className="text-3xl font-mono font-bold text-sidebar-foreground">{stats.inStockCount.toLocaleString('de-DE')}</div>
                  <div className="text-xs text-sidebar-foreground/50 uppercase tracking-widest mt-1">Sofort auf Lager</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="w-12 h-0.5 bg-primary mb-3"></div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Ausgewählte Teile</h2>
              <p className="text-muted-foreground">Aktuell besonders gefragte Motoren und Aggregate aus unserem Lager.</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex text-primary hover:text-primary hover:bg-primary/10">
              <Link href="/products">Alle anzeigen <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          
          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-sm"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-8 flex justify-center md:hidden">
            <Button variant="outline" asChild className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/products">Alle Teile anzeigen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-sidebar border-t border-sidebar-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="w-12 h-0.5 bg-primary mx-auto mb-3"></div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-sidebar-foreground">Nach Kategorie suchen</h2>
            <p className="text-sidebar-foreground/60">Finden Sie das passende OEM-Teil nach Fahrzeugsystem sortiert.</p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/3] bg-sidebar-accent animate-pulse rounded-sm"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories?.slice(0, 4).map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="font-bold tracking-wide border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground" asChild>
              <Link href="/categories">ALLE KATEGORIEN</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ihr Teil nicht dabei?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Kontaktieren Sie uns direkt – wir beschaffen fast alle VW-Gruppe Original-Teile auf Anfrage.</p>
          <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-bold tracking-wide" asChild>
            <Link href="/contact">ANFRAGE STELLEN</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
