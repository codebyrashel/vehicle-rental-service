import { Pool } from "pg";
import { ENV } from "../config/dotenv.config";

export const pool = new Pool({
  connectionString: ENV.connectionString,
  ssl: { rejectUnauthorized: false },
});

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
     id SERIAL PRIMARY KEY,
     vehicle_name VARCHAR(100) NOT NULL,
     type VARCHAR(20) NOT NULL,
     registration_number VARCHAR(50) UNIQUE NOT NULL,
     daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
     availability_status VARCHAR(10) NOT NULL DEFAULT 'available',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

    console.log("Database initialized successfully");
  } catch (error: any) {
    console.error("Error initializing database:", error);
  }
};

export default pool;
