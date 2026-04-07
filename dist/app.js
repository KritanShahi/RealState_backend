"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const auth_1 = __importDefault(require("./routes/auth"));
const me_1 = __importDefault(require("./routes/me"));
const properties_1 = __importDefault(require("./routes/properties"));
const favourites_1 = __importDefault(require("./routes/favourites"));
const http_1 = require("./utils/http");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.config.corsOrigin,
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/auth", auth_1.default);
app.use("/me", me_1.default);
app.use("/properties", properties_1.default);
app.use("/favourites", favourites_1.default);
app.use(http_1.notFound);
app.use(http_1.errorHandler);
exports.default = app;
