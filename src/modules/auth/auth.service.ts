import { pool } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/dotenv.config";

const SALT_ROUNDS = 10;

// Signup
const signup = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}) => {
  const { name, email, password, phone, role } = payload;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role, created_at`,
    [name, email.toLowerCase(), hashedPassword, phone || null, role || "customer"]
  );

  return result.rows[0];
};

// Signin
const signin = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()]);
  if (result.rows.length === 0) throw new Error("Invalid email or password");

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign({ userId: user.id, role: user.role }, ENV.jwtSecret, { expiresIn: "1d" });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

export const authService = { signup, signin };