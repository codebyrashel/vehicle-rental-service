import { pool } from "../../config/db";

// Fetch all users (admin‑only)
const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role, created_at
     FROM users
     ORDER BY id ASC`
  );
  return result;
};

// Fetch a single user by id
const getUserById = async (id: number) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result;
};

// Update selected fields for a user
const updateUserById = async (
  payload: { name?: string; phone?: string; role?: string },
  id: number
) => {
  const { name, phone, role } = payload;

  const result = await pool.query(
    `UPDATE users
       SET name  = COALESCE($1, name),
           phone = COALESCE($2, phone),
           role  = COALESCE($3, role)
     WHERE id = $4
     RETURNING id, name, email, phone, role, created_at`,
    [name || null, phone || null, role || null, id]
  );
  return result;
};

// Delete user (admin‑only)
const deleteUserById = async (id: number) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};