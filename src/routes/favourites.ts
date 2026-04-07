import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { authRequired } from "../middleware/auth";
import { ApiError } from "../utils/http";

const router = Router();

const paramsSchema = z.object({
  propertyId: z.coerce.number().int().positive()
});

router.get("/", authRequired, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const favourites = await prisma.favourite.findMany({
      where: { userId },
      include: { property: true },
      orderBy: { createdAt: "desc" }
    });

    res.json(favourites.map((favourite) => favourite.property));
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
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    await prisma.favourite.create({
      data: { userId, propertyId }
    });

    res.status(201).json({ message: "Added to favourites" });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      next(new ApiError(409, "Property already in favourites"));
      return;
    }
    next(error);
  }
});

router.delete("/:propertyId", authRequired, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const { propertyId } = paramsSchema.parse(req.params);
    const favourite = await prisma.favourite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId }
      }
    });

    if (!favourite) {
      throw new ApiError(404, "Favourite not found");
    }

    await prisma.favourite.delete({
      where: {
        userId_propertyId: { userId, propertyId }
      }
    });

    res.json({ message: "Removed from favourites" });
  } catch (error) {
    next(error);
  }
});

export default router;
