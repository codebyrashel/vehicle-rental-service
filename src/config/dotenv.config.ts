import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

//? helper to validate env variables
const getENV = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const ENV = {
  port: getENV("PORT", "5000"),
  connectionString: getENV("DATABASE_URL"),
  jwtSecret: getENV("JWT_SECRET"),
};