import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import { useListProducts, useListCategories, ListProductsSort } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, X, Box } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";

export default function Products() {
  const searchString = useSearch();
  const searchParams = useMemo(() => new URLSearchParams(searchString), [searchString]);
  
  const categoryFilter = searchParams.get('category') || undefined;
  const searchFilter = searchParams.get('search') || undefined;
  const sortFilter = (searchParams.get('sort') as ListProductsSort) || 'newest';

  const [localSearch, setLocalSearch] = useState(searchFilter || "");

  const { data: products, isLoading } = useListProducts({
    category: categoryFilter,
    search: searchFilter,
    sort: sortFilter,
  });

  const { data: categories } = useListCategories();

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchString);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', localSearch || null);
  };

  const clearFilters = () => {
    setLocalSearch("");
    window.history.pushState({}, '', window.location.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  const hasFilters = categoryFilter || searchFilter || sortFilter !== 'newest';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-b pb-8">
        <div className="w-10 h-0.5 bg-primary mb-3"></div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Teilekatalog</h1>
        <p className="text-muted-foreground">Original OEM Teile für VW-Gruppe Fahrzeuge.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold mb-4 text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-2">
              <Search className="w-4 h-4" /> Suche
            </h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input 
                placeholder="Teilenummer oder Name..." 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="font-mono text-sm"
              />
            </form>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-xs tracking-widest uppercase text-muted-foreground flex items-center gap-2">
              <Filter className="w-4 h-4" /> Kategorie
            </h3>
            <RadioGroup 
              value={categoryFilter || "all"} 
              onValueChange={(val) => updateFilters('category', val === "all" ? null : val)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="cat-all" />
                <Label htmlFor="cat-all" className="cursor-pointer">Alle Kategorien</Label>
              </div>
              {categories?.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={cat.slug} id={`cat-${cat.slug}`} />
                  <Label htmlFor={`cat-${cat.slug}`} className="cursor-pointer flex-1 flex justify-between">
                    <span>{cat.name}</span>
                    <span className="text-muted-foreground text-xs font-mono">{cat.productCount}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {hasFilters && (
            <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" /> Filter zurücksetzen
            </Button>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filter & Top Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filter</SheetTitle>
                  </SheetHeader>
                  <div className="py-6 space-y-8">
                     <div>
                      <Label className="mb-2 block">Suche</Label>
                      <form onSubmit={(e) => { handleSearch(e); }} className="flex gap-2">
                        <Input 
                          placeholder="Teilenummer oder Name..." 
                          value={localSearch}
                          onChange={(e) => setLocalSearch(e.target.value)}
                        />
                        <Button type="submit">Los</Button>
                      </form>
                    </div>

                    <div>
                      <Label className="mb-4 block">Kategorie</Label>
                      <RadioGroup 
                        value={categoryFilter || "all"} 
                        onValueChange={(val) => updateFilters('category', val === "all" ? null : val)}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <RadioGroupItem value="all" id="cat-all-mobile" />
                          <Label htmlFor="cat-all-mobile">Alle Kategorien</Label>
                        </div>
                        {categories?.map((cat) => (
                          <div key={cat.id} className="flex items-center space-x-2 mb-3">
                            <RadioGroupItem value={cat.slug} id={`cat-${cat.slug}-mobile`} />
                            <Label htmlFor={`cat-${cat.slug}-mobile`}>{cat.name}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                  <SheetFooter>
                     <Button variant="outline" className="w-full" onClick={clearFilters}>
                        Filter zurücksetzen
                      </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <div className="text-sm text-muted-foreground font-mono">
                {isLoading ? "..." : products?.length || 0} Teile gefunden
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <Select 
                value={sortFilter} 
                onValueChange={(val) => updateFilters('sort', val)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sortieren" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Neueste zuerst</SelectItem>
                  <SelectItem value="price_asc">Preis: aufsteigend</SelectItem>
                  <SelectItem value="price_desc">Preis: absteigend</SelectItem>
                  <SelectItem value="popular">Beliebteste</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[400px] bg-muted animate-pulse rounded-sm"></div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-24 bg-muted/30 rounded-sm border border-dashed">
              <Box className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Keine Teile gefunden</h3>
              <p className="text-muted-foreground mb-6">Passen Sie Ihre Filter oder Suchanfrage an.</p>
              <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90">Filter zurücksetzen</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
