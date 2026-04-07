"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = require("../db");
const config_1 = require("../config");
const http_1 = require("../utils/http");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    name: zod_1.z.string().min(2, "Name must be at least 2 characters")
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase(),
    password: zod_1.z.string().min(1, "Password is required")
});
function signToken(userId, role) {
    return jsonwebtoken_1.default.sign({ userId, role }, config_1.config.jwtSecret, { expiresIn: "1d" });
}
router.post("/register", async (req, res, next) => {
    try {
        const input = registerSchema.parse(req.body);
        const existing = await db_1.prisma.user.findUnique({ where: { email: input.email } });
        if (existing) {
            throw new http_1.ApiError(409, "Email is already registered");
        }
        const passwordHash = await bcryptjs_1.default.hash(input.password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                name: input.name
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });
        const token = signToken(user.id, user.role);
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
        res.status(201).json({ user });
    }
    catch (error) {
        next(error);
    }
});
router.post("/login", async (req, res, next) => {
    try {
        const input = loginSchema.parse(req.body);
        const user = await db_1.prisma.user.findUnique({ where: { email: input.email } });
        if (!user) {
            throw new http_1.ApiError(401, "Invalid credentials");
        }
        const ok = await bcryptjs_1.default.compare(input.password, user.passwordHash);
        if (!ok) {
            throw new http_1.ApiError(401, "Invalid credentials");
        }
        const token = signToken(user.id, user.role);
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        next(error);
    }
});
router.post("/logout", (_req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});
exports.default = router;
