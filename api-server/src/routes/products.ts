import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, or, and } from "drizzle-orm";
import { ListProductsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/products/featured", async (req, res) => {
  try {
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.isFeatured, true))
      .limit(8);

    const mapped = products.map(mapProduct);
    res.json(mapped);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch featured products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/stats", async (req, res) => {
  try {
    const allProducts = await db.select().from(productsTable);
    const categories = await db.select().from(categoriesTable);

    const inStockCount = allProducts.filter((p) => p.inStock).length;
    const prices = allProducts.map((p) => parseFloat(p.price));
    const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

    const categoryMap: Record<string, number> = {};
    for (const p of allProducts) {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    }

    const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));

    res.json({
      totalProducts: allProducts.length,
      totalCategories: categories.length,
      inStockCount,
      averagePrice: Math.round(avgPrice * 100) / 100,
      categoryBreakdown,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch product stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const parsed = ListProductsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};

    let query = db.select().from(productsTable);
    const conditions = [];

    if (params.category) {
      conditions.push(ilike(productsTable.category, params.category));
    }

    if (params.search) {
      conditions.push(
        or(
          ilike(productsTable.name, `%${params.search}%`),
          ilike(productsTable.partNumber, `%${params.search}%`),
          ilike(productsTable.description, `%${params.search}%`)
        )!
      );
    }

    let products = await (conditions.length > 0 ? query.where(and(...conditions)) : query);

    if (params.sort === "price_asc") {
      products = products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (params.sort === "price_desc") {
      products = products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (params.sort === "popular") {
      products = products.sort((a, b) => b.viewCount - a.viewCount);
    } else {
      products = products.sort(
        (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    }

    res.json(products.map(mapProduct));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product) { res.status(404).json({ error: "Not found" }); return; }

    // Increment view count
    await db
      .update(productsTable)
      .set({ viewCount: product.viewCount + 1 })
      .where(eq(productsTable.id, id));

    res.json(mapProduct(product));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch product");
    res.status(500).json({ error: "Internal server error" });
  }
});

function mapProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    category: p.category,
    partNumber: p.partNumber,
    imageUrl: p.imageUrl,
    imageUrls: p.imageUrls,
    inStock: p.inStock,
    stockCount: p.stockCount,
    condition: p.condition,
    compatibleModels: p.compatibleModels,
    mileage: p.mileage,
    yearFrom: p.yearFrom,
    yearTo: p.yearTo,
    isFeatured: p.isFeatured,
    viewCount: p.viewCount,
  };
}

export default router;
