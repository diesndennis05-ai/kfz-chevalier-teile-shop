import { Router } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AddToCartBody } from "@workspace/api-zod";

const router = Router();

const SESSION_ID = "default-session";

async function buildCart() {
  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, SESSION_ID));

  const enriched = await Promise.all(
    items.map(async (item) => {
      const [product] = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.id, item.productId));

      if (!product) return null;

      const price = parseFloat(product.price);
      return {
        productId: item.productId,
        quantity: item.quantity,
        lineTotal: price * item.quantity,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price,
          category: product.category,
          partNumber: product.partNumber,
          imageUrl: product.imageUrl,
          imageUrls: product.imageUrls,
          inStock: product.inStock,
          stockCount: product.stockCount,
          condition: product.condition,
          compatibleModels: product.compatibleModels,
          mileage: product.mileage,
          yearFrom: product.yearFrom,
          yearTo: product.yearTo,
          isFeatured: product.isFeatured,
          viewCount: product.viewCount,
        },
      };
    })
  );

  const validItems = enriched.filter(Boolean) as NonNullable<(typeof enriched)[0]>[];
  const total = validItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    items: validItems,
    total: Math.round(total * 100) / 100,
    itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0),
  };
}

router.get("/cart", async (req, res) => {
  try {
    res.json(await buildCart());
  } catch (err) {
    req.log.error({ err }, "Failed to fetch cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const parsed = AddToCartBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

    const { productId, quantity } = parsed.data;

    const [existing] = await db
      .select()
      .from(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.sessionId, SESSION_ID),
          eq(cartItemsTable.productId, productId)
        )
      );

    if (existing) {
      await db
        .update(cartItemsTable)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({
        sessionId: SESSION_ID,
        productId,
        quantity,
      });
    }

    res.json(await buildCart());
  } catch (err) {
    req.log.error({ err }, "Failed to add to cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart", async (req, res) => {
  try {
    await db
      .delete(cartItemsTable)
      .where(eq(cartItemsTable.sessionId, SESSION_ID));
    res.json(await buildCart());
  } catch (err) {
    req.log.error({ err }, "Failed to clear cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) { res.status(400).json({ error: "Invalid productId" }); return; }

    await db
      .delete(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.sessionId, SESSION_ID),
          eq(cartItemsTable.productId, productId)
        )
      );

    res.json(await buildCart());
  } catch (err) {
    req.log.error({ err }, "Failed to remove from cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
