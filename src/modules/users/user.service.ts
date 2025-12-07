import { pool } from "../../config/db";

// to check if a user has active bookings
const hasActiveBookings = async (userId: number) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS active_count
       FROM bookings
      WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );
  return Number(result.rows[0].active_count) > 0;
};


const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role, created_at
       FROM users
      ORDER BY id ASC`
  );
  return result;
};


const getUserById = async (id: number) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role, created_at
       FROM users
      WHERE id = $1`,
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
        SET name  = COALESCE($1, name),
            phone = COALESCE($2, phone),
            role  = COALESCE($3, role)
      WHERE id = $4
      RETURNING id, name, email, phone, role, created_at`,
    [name || null, phone || null, role || null, id]
  );
  return result;
};


const deleteUserById = async (id: number) => {
  const activeBookings = await hasActiveBookings(id);
  if (activeBookings) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};