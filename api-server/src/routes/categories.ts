import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable);
    const allProducts = await db.select().from(productsTable);

    const productCountByCategory: Record<string, number> = {};
    for (const p of allProducts) {
      productCountByCategory[p.category] = (productCountByCategory[p.category] || 0) + 1;
    }

    const result = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      productCount: productCountByCategory[c.name] || 0,
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
