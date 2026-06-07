import { useListCategories } from "@workspace/api-client-react";
import { CategoryCard } from "@/components/CategoryCard";
import { Box } from "lucide-react";

export default function Categories() {
  const { data: categories, isLoading } = useListCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mb-12">
        <div className="w-10 h-0.5 bg-primary mb-3"></div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Teile nach Kategorie</h1>
        <p className="text-xl text-muted-foreground">
          Durchsuchen Sie unser umfangreiches Lager an zertifizierten VW-Gruppe Original-Teilen – sortiert nach Fahrzeugsystem.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-sm"></div>
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/30 rounded-sm border border-dashed">
          <Box className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Keine Kategorien gefunden</h3>
          <p className="text-muted-foreground">Unser Lager wird gerade aktualisiert.</p>
        </div>
      )}
    </div>
  );
}
