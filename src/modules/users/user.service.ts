import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/dotenv.config";

const SALT_ROUNDS = 10;

const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}) => {
  const { name, email, password, phone, role } = payload;

  console.log("Hashing password...");
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  console.log("Password hashed.");

  console.log("Executing database query...");
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role, created_at`,
    [name, email.toLowerCase(), hashed, phone || null, role || "customer"]
  );
  console.log("Database query executed.");

  return result;
};

// Login function
const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]);

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    ENV.jwtSecret,
    { expiresIn: "1d" }
  );

  return { user, token };
};

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role, created_at FROM users ORDER BY id ASC`
  );
  return result;
};

const getUserById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return result;
};

const updateUserById = async (
  payload: { name?: string; phone?: string; role?: string },
  id: number
) => {
  const { name, phone, role } = payload;

  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         phone = COALESCE($2, phone),
         role = COALESCE($3, role)
     WHERE id = $4
     RETURNING id, name, email, phone, role, created_at`,
    [name || null, phone || null, role || null, id]
  );

  return result;
};

const deleteUserById = async (id: number) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userService = {
  createUser,
  loginUser,  
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};