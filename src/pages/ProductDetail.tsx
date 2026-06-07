import { useParams, Link } from "wouter";
import { useGetProduct, getGetProductQueryKey, useAddToCart, getGetCartQueryKey, useListProducts } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, ShieldAlert, Car, ShoppingCart, Activity, ShieldCheck, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: product, isLoading, isError } = useGetProduct(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProductQueryKey(id)
    }
  });

  const { data: relatedProducts } = useListProducts(
    { category: product?.category, sort: 'popular' },
    { query: { enabled: !!product?.category } }
  );

  const addToCart = useAddToCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product) return;
    addToCart.mutate({ data: { productId: product.id, quantity: 1 } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({
          title: "Zur Anfrageliste hinzugefügt",
          description: `${product.partNumber} wurde hinzugefügt.`,
        });
      }
    });
  };

  const getConditionBadge = (condition: string) => {
    switch(condition) {
      case 'new': return <Badge className="bg-primary hover:bg-primary text-primary-foreground">Neu OEM</Badge>;
      case 'used_excellent': return <Badge className="bg-sidebar text-sidebar-foreground hover:bg-sidebar">Gebraucht – Sehr Gut</Badge>;
      case 'used_good': return <Badge variant="secondary">Gebraucht – Gut</Badge>;
      default: return <Badge variant="outline">Gebraucht</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-4 w-24 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-sm" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Teil nicht gefunden</h2>
        <p className="text-muted-foreground mb-8">Das gesuchte Teil existiert nicht oder wurde entfernt.</p>
        <Button asChild className="bg-primary hover:bg-primary/90"><Link href="/products">Zurück zum Katalog</Link></Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/products" className="hover:text-primary flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Katalog
          </Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-primary capitalize transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground">{product.partNumber}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-sm overflow-hidden border border-border/50">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono">KEIN BILD</div>
              )}
            </div>
            {product.imageUrls && product.imageUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                <div className="aspect-square bg-border rounded-sm cursor-pointer border-2 border-primary overflow-hidden">
                   {product.imageUrl && <img src={product.imageUrl} className="w-full h-full object-cover" />}
                </div>
                {product.imageUrls.map((url, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-sm cursor-pointer border-2 border-transparent hover:border-primary/50 transition-colors overflow-hidden">
                    <img src={url} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                {getConditionBadge(product.condition)}
                <Badge variant="outline" className="font-mono text-xs">{product.category}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-mono bg-muted px-2 py-1 rounded text-muted-foreground border text-xs">
                  TN: {product.partNumber}
                </span>
                {product.inStock ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-medium"><Check className="w-4 h-4"/> Auf Lager ({product.stockCount || 1})</span>
                ) : (
                  <span className="text-destructive font-medium">Nicht verfügbar</span>
                )}
              </div>
            </div>

            <div className="text-4xl font-mono font-bold text-primary mb-2">
              €{product.price.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mb-8">zzgl. MwSt. & Versandkosten</div>

            <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
              {product.description}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {product.mileage !== null && product.mileage !== undefined && (
                <div className="bg-muted/50 p-3 rounded-sm border flex items-center gap-3">
                  <Activity className="text-primary w-5 h-5" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Laufleistung</div>
                    <div className="font-mono font-bold text-sm">{product.mileage.toLocaleString('de-DE')} km</div>
                  </div>
                </div>
              )}
              {(product.yearFrom || product.yearTo) && (
                <div className="bg-muted/50 p-3 rounded-sm border flex items-center gap-3">
                  <Car className="text-primary w-5 h-5" />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Baujahr</div>
                    <div className="font-mono font-bold text-sm">{product.yearFrom || '...'} – {product.yearTo || '...'}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t">
              <Button 
                size="lg" 
                className="flex-1 font-bold tracking-wide h-14 text-base bg-primary hover:bg-primary/90"
                onClick={handleAddToCart}
                disabled={!product.inStock || addToCart.isPending}
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> 
                {addToCart.isPending ? "Wird hinzugefügt..." : "Zur Anfrageliste"}
              </Button>
              <Button size="lg" variant="outline" className="flex-1 font-bold tracking-wide h-14 text-base border-primary/30 text-primary hover:bg-primary/10" asChild>
                <Link href={`/contact?part=${product.partNumber}&id=${product.id}`}>
                  <Mail className="w-5 h-5 mr-2" /> Direkt anfragen
                </Link>
              </Button>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-primary"/> Zertifizierte Teile</span>
              <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4 text-primary"/> Gewährleistung inklusive</span>
            </div>
          </div>
        </div>

        {/* Info Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="compatibility" className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none mb-6">
              <TabsTrigger 
                value="compatibility" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-semibold text-base"
              >
                Fahrzeugkompatibilität
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 font-semibold text-base"
              >
                Technische Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="compatibility" className="bg-card p-6 rounded-sm border">
              <h3 className="font-semibold mb-4 text-sm">Bekannte kompatible Fahrzeuge für {product.partNumber}:</h3>
              {product.compatibleModels && product.compatibleModels.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                  {product.compatibleModels.map((model, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{model}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">Bitte prüfen Sie die Teilenummer anhand Ihrer Fahrzeugdaten oder kontaktieren Sie uns zur Verifikation.</p>
              )}
            </TabsContent>
            <TabsContent value="details" className="bg-card p-6 rounded-sm border">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex justify-between py-2 border-b text-sm">
                   <span className="text-muted-foreground">Teilenummer</span>
                   <span className="font-mono font-medium">{product.partNumber}</span>
                 </div>
                 <div className="flex justify-between py-2 border-b text-sm">
                   <span className="text-muted-foreground">Zustand</span>
                   <span className="font-medium">{product.condition === 'new' ? 'Neu OEM' : product.condition === 'used_excellent' ? 'Gebraucht – Sehr Gut' : 'Gebraucht – Gut'}</span>
                 </div>
                 <div className="flex justify-between py-2 border-b text-sm">
                   <span className="text-muted-foreground">Kategorie</span>
                   <span className="font-medium">{product.category}</span>
                 </div>
                 <div className="flex justify-between py-2 border-b text-sm">
                   <span className="text-muted-foreground">Verfügbarkeit</span>
                   <span className="font-medium">{product.inStock ? 'Auf Lager' : 'Nicht verfügbar'}</span>
                 </div>
               </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 1 && (
          <div className="mt-20 border-t pt-12">
            <div className="w-10 h-0.5 bg-primary mb-3"></div>
            <h2 className="text-2xl font-bold mb-8">Weitere {product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
