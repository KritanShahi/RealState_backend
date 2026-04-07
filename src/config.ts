import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(getEnv("PORT", "4000")),
  jwtSecret: getEnv("JWT_SECRET"),
  corsOrigin: getEnv("CORS_ORIGIN", "http://localhost:3000")
};
