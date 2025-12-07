import { pool } from "../../config/db";

export interface VehiclePayload {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status?: "available" | "booked";
}

const createVehicle = async (payload: VehiclePayload) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status || "available"]
  );

  return result;
};


const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id ASC`);
  return result;
};


const getVehicleById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};

const updateVehicleById = async (
  id: number,
  payload: Partial<VehiclePayload>
) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `UPDATE vehicles
       SET vehicle_name       = COALESCE($1, vehicle_name),
           type               = COALESCE($2, type),
           registration_number = COALESCE($3, registration_number),
           daily_rent_price   = COALESCE($4, daily_rent_price),
           availability_status = COALESCE($5, availability_status),
           updated_at          = NOW()
     WHERE id = $6
     RETURNING *`,
    [
      vehicle_name || null,
      type || null,
      registration_number || null,
      daily_rent_price || null,
      availability_status || null,
      id,
    ]
  );

  return result;
};


const deleteVehicleById = async (id: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const activeRes = await client.query(
      `SELECT id
         FROM bookings
        WHERE vehicle_id = $1 AND status = 'active'`,
      [id]
    );

    if (activeRes.rows.length > 0) {
      throw new Error("Cannot delete vehicle with active bookings");
    }

    const result = await client.query(
      `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
      [id]
    );

    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};