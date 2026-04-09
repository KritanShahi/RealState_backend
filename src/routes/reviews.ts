import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { authRequired } from "../middleware/auth";
import { ApiError } from "../utils/http";

const router = Router();

const paramsSchema = z.object({
  propertyId: z.string().uuid()
});

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3, "Comment must be at least 3 characters")
});

router.get("/:propertyId", async (req, res, next) => {
  try {
    const { propertyId } = paramsSchema.parse(req.params);

    const reviews = await prisma.review.findMany({
      where: { propertyId },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

router.post("/:propertyId", authRequired, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const { propertyId } = paramsSchema.parse(req.params);
    const { rating, comment } = createReviewSchema.parse(req.body);

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    const review = await prisma.review.create({
      data: {
        userId,
        propertyId,
        rating,
        comment
      }
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

export default router;
