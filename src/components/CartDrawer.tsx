import React from "react";
import { Link } from "wouter";
import { Cart } from "@workspace/api-client-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useRemoveFromCart, useClearCart } from "@workspace/api-client-react";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCartQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer({ open, onOpenChange, cart }: { open: boolean, onOpenChange: (open: boolean) => void, cart?: Cart }) {
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleRemove = (productId: number) => {
    removeFromCart.mutate({ productId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({
          title: "Teil entfernt",
          description: "Das Teil wurde aus Ihrer Anfrageliste entfernt.",
        });
      }
    });
  };

  const handleClear = () => {
    clearCart.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast({
          title: "Liste geleert",
          description: "Alle Teile wurden aus Ihrer Anfrageliste entfernt.",
        });
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Ihre Anfrageliste</SheetTitle>
            {cart && cart.items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={clearCart.isPending} className="text-muted-foreground hover:text-destructive h-8 px-2">
                Alles löschen
              </Button>
            )}
          </div>
          <SheetDescription>
            Teile, über die Sie ein Angebot anfragen möchten.
          </SheetDescription>
        </SheetHeader>

        
        <div className="flex-1 flex flex-col overflow-hidden mt-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-muted-foreground text-2xl font-mono">0</span>
              </div>
              <p className="text-muted-foreground font-medium mb-4">Ihre Anfrageliste ist leer.</p>
              <Button onClick={() => onOpenChange(false)} asChild variant="outline">
                <Link href="/products">Zum Teilekatalog</Link>
              </Button>
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="h-16 w-16 bg-muted rounded-md overflow-hidden shrink-0 border">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-mono">–</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{item.product.name}</p>
                      <p className="font-mono text-xs text-muted-foreground mt-1">{item.product.partNumber}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-mono text-sm font-semibold">€{item.lineTotal.toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Menge: {item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-destructive"
                            onClick={() => handleRemove(item.productId)}
                            disabled={removeFromCart.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        {cart && cart.items.length > 0 && (
          <div className="pt-4 border-t mt-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-muted-foreground">Gesamtbetrag</span>
              <span className="font-mono font-bold text-lg">€{cart.total.toFixed(2)}</span>
            </div>
            <Button className="w-full font-bold bg-primary hover:bg-primary/90" onClick={() => {
              onOpenChange(false);
            }} asChild>
              <Link href="/contact">Angebot anfragen</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
