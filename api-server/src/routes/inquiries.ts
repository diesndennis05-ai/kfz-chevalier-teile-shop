import { Router } from "express";
import { db } from "@workspace/db";
import { inquiriesTable } from "@workspace/db";
import { CreateInquiryBody } from "@workspace/api-zod";

const router = Router();

router.post("/inquiries", async (req, res) => {
  try {
    const parsed = CreateInquiryBody.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

    const { name, email, phone, message, productId } = parsed.data;

    const [inquiry] = await db
      .insert(inquiriesTable)
      .values({
        name,
        email,
        phone: phone ?? null,
        message,
        productId: productId ?? null,
      })
      .returning();

    res.status(201).json({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone ?? undefined,
      message: inquiry.message,
      productId: inquiry.productId ?? null,
      createdAt: inquiry.createdAt?.toISOString() ?? new Date().toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create inquiry");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
