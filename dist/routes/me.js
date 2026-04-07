"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const http_1 = require("../utils/http");
const router = (0, express_1.Router)();
router.get("/", auth_1.authRequired, async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new http_1.ApiError(401, "Unauthorized");
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true }
        });
        if (!user) {
            throw new http_1.ApiError(404, "User not found");
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
