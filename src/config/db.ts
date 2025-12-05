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


    console.log("Database initialized successfully");
  } catch (error: any) {
    console.error("Error initializing database:", error);
  }
};


export default pool;