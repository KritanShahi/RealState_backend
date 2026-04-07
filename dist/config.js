"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnv(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}
exports.config = {
    port: Number(getEnv("PORT", "4000")),
    jwtSecret: getEnv("JWT_SECRET"),
    corsOrigin: getEnv("CORS_ORIGIN", "http://localhost:3000")
};
