import { Link } from "wouter";
import { Category } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden h-full border-border/60 hover:border-primary/40">
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
          {category.imageUrl ? (
            <img 
              src={category.imageUrl} 
              alt={category.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-sidebar text-sidebar-foreground/60 font-mono text-sm">
              {category.name}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
              <div className="text-white/70 font-mono text-xs">
                {category.productCount} Teile verfügbar
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
