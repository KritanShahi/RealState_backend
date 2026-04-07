"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequired = authRequired;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const http_1 = require("../utils/http");
function authRequired(req, _res, next) {
    const bearer = req.header("authorization");
    const tokenFromHeader = bearer?.startsWith("Bearer ") ? bearer.slice(7) : undefined;
    const token = req.cookies?.token ?? tokenFromHeader;
    if (!token) {
        next(new http_1.ApiError(401, "Unauthorized"));
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.user = {
            userId: payload.userId,
            role: payload.role
        };
        next();
    }
    catch (_error) {
        next(new http_1.ApiError(401, "Invalid or expired token"));
    }
}
