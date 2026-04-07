"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const http_1 = require("../utils/http");
const router = (0, express_1.Router)();
const paramsSchema = zod_1.z.object({
    propertyId: zod_1.z.coerce.number().int().positive()
});
router.get("/", auth_1.authRequired, async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new http_1.ApiError(401, "Unauthorized");
        }
        const favourites = await db_1.prisma.favourite.findMany({
            where: { userId },
            include: { property: true },
            orderBy: { createdAt: "desc" }
        });
        res.json(favourites.map((favourite) => favourite.property));
    }
    catch (error) {
        next(error);
    }
});
router.post("/:propertyId", auth_1.authRequired, async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new http_1.ApiError(401, "Unauthorized");
        }
        const { propertyId } = paramsSchema.parse(req.params);
        const property = await db_1.prisma.property.findUnique({ where: { id: propertyId } });
        if (!property) {
            throw new http_1.ApiError(404, "Property not found");
        }
        await db_1.prisma.favourite.create({
            data: { userId, propertyId }
        });
        res.status(201).json({ message: "Added to favourites" });
    }
    catch (error) {
        if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
            next(new http_1.ApiError(409, "Property already in favourites"));
            return;
        }
        next(error);
    }
});
router.delete("/:propertyId", auth_1.authRequired, async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new http_1.ApiError(401, "Unauthorized");
        }
        const { propertyId } = paramsSchema.parse(req.params);
        const favourite = await db_1.prisma.favourite.findUnique({
            where: {
                userId_propertyId: { userId, propertyId }
            }
        });
        if (!favourite) {
            throw new http_1.ApiError(404, "Favourite not found");
        }
        await db_1.prisma.favourite.delete({
            where: {
                userId_propertyId: { userId, propertyId }
            }
        });
        res.json({ message: "Removed from favourites" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
