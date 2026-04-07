"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authRequired, async (_req, res, next) => {
    try {
        const properties = await db_1.prisma.property.findMany({
            orderBy: { id: "asc" }
        });
        res.json(properties);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
