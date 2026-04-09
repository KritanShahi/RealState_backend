import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { authRequired } from "../middleware/auth";
import { ApiError } from "../utils/http";

const router = Router();

const createInquirySchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().min(5, "Message must be at least 5 characters")
});

const paramsSchema = z.object({
  propertyId: z.string().uuid()
});

router.post("/", authRequired, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const input = createInquirySchema.parse(req.body);
    const property = await prisma.property.findUnique({ where: { id: input.propertyId } });
    if (!property) {
      throw new ApiError(404, "Property not found");
    }

    await prisma.inquiry.create({
      data: {
        userId,
        propertyId: input.propertyId,
        message: input.message
      }
    });

    res.status(201).json({ message: "Inquiry submitted successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/:propertyId", authRequired, async (req, res, next) => {
  try {
    const { propertyId } = paramsSchema.parse(req.params);
    const inquiries = await prisma.inquiry.findMany({
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

    res.json(inquiries);
  } catch (error) {
    next(error);
  }
});

export default router;
