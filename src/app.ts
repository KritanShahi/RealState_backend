import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { config } from "./config";
import authRoutes from "./routes/auth";
import meRoutes from "./routes/me";
import propertiesRoutes from "./routes/properties";
import favouritesRoutes from "./routes/favourites";
import inquiriesRoutes from "./routes/inquiries";
import reviewsRoutes from "./routes/reviews";
import { errorHandler, notFound } from "./utils/http";

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  "/property-images",
  express.static(path.join(process.cwd(), "src", "properties"))
);
app.use(
  "/property-images",
  express.static(path.join(process.cwd(), "..", "realstate_front", "public", "property-images"))
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/properties", propertiesRoutes);
app.use("/favourites", favouritesRoutes);
app.use("/inquiries", inquiriesRoutes);
app.use("/reviews", reviewsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
