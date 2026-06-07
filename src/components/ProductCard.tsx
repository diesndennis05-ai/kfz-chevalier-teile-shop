import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart.mutate({ data: { productId: product.id, quantity: 1 } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({
          title: "Zur Anfrage hinzugefügt",
          description: `${product.partNumber} wurde Ihrer Anfrageliste hinzugefügt.`,
        });
      }
    });
  };

  const getConditionLabel = (condition: string) => {
    switch(condition) {
      case 'new': return 'Neu OEM';
      case 'used_excellent': return 'Gebraucht – Sehr Gut';
      case 'used_good': return 'Gebraucht – Gut';
      default: return 'Gebraucht';
    }
  };

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'new': return 'bg-primary text-primary-foreground';
      case 'used_excellent': return 'bg-sidebar text-sidebar-foreground';
      case 'used_good': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full flex flex-col group hover:shadow-lg transition-all cursor-pointer overflow-hidden border-border/60 hover:border-primary/40">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm bg-sidebar/10">
              KEIN BILD
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-primary text-primary-foreground font-bold tracking-wider text-[10px]">EMPFOHLEN</Badge>
            </div>
          )}
          <div className="absolute bottom-2 right-2">
            <Badge className={`font-mono text-[10px] backdrop-blur ${getConditionColor(product.condition)}`}>
              {getConditionLabel(product.condition)}
            </Badge>
          </div>
        </div>
        
        <CardContent className="flex-1 p-4">
          <div className="text-xs text-muted-foreground font-mono mb-1 flex items-center justify-between">
            <span className="truncate">{product.category}</span>
            {product.inStock ? (
              <span className="text-emerald-600 flex items-center gap-1 shrink-0 ml-2"><Check className="w-3 h-3"/> Auf Lager</span>
            ) : (
              <span className="text-destructive shrink-0 ml-2">Nicht verfügbar</span>
            )}
          </div>
          
          <h3 className="font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="font-mono text-xs bg-muted/70 px-2 py-1 rounded inline-block text-foreground border border-border/50">
            {product.partNumber}
          </div>
          
          {product.mileage && (
            <div className="text-xs text-muted-foreground mt-2">
              Laufleistung: {product.mileage.toLocaleString('de-DE')} km
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto border-t border-border/30">
          <div className="font-mono font-bold text-xl text-foreground">
            €{product.price.toFixed(2)}
          </div>
          <Button 
            size="icon" 
            className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors border border-primary/20"
            onClick={handleAddToCart}
            disabled={!product.inStock || addToCart.isPending}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
