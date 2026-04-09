import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { authRequired } from "../middleware/auth";
import { ApiError } from "../utils/http";

const router = Router();
const paramsSchema = z.object({
  propertyId: z.string().uuid()
});

function normalizeImageUrl(url: string, baseUrl: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${baseUrl}${url}`;
}

router.get("/", authRequired, async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const properties = await prisma.property.findMany({
      include: { images: true },
      orderBy: { id: "asc" }
    });
    res.json(
      properties.map((property) => ({
        ...property,
        price: property.price ? Number(property.price) : null,
        images: property.images.map((image) => ({
          ...image,
          imageUrl: normalizeImageUrl(image.imageUrl, baseUrl)
        }))
      }))
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:propertyId", authRequired, async (req, res, next) => {
  try {
    const { propertyId } = paramsSchema.parse(req.params);
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { images: true }
    });

    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    res.json({
      ...property,
      price: property.price ? Number(property.price) : null,
      images: property.images.map((image) => ({
        ...image,
        imageUrl: normalizeImageUrl(image.imageUrl, baseUrl)
      }))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
