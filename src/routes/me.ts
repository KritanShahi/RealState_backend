import { Router } from "express";
import { prisma } from "../db";
import { authRequired } from "../middleware/auth";
import { ApiError } from "../utils/http";

const router = Router();

router.get("/", authRequired, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
