"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
exports.notFound = notFound;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
class ApiError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.ApiError = ApiError;
function notFound(_req, _res, next) {
    next(new ApiError(404, "Route not found"));
}
function errorHandler(error, _req, res, _next) {
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            message: "Validation failed",
            details: error.flatten()
        });
        return;
    }
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            message: error.message,
            details: error.details
        });
        return;
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
}
