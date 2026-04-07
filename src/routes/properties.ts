import { Router } from "express";
import { prisma } from "../db";
import { authRequired } from "../middleware/auth";

const router = Router();

router.get("/", authRequired, async (_req, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { id: "asc" }
    });
    res.json(properties);
  } catch (error) {
    next(error);
  }
});

export default router;
