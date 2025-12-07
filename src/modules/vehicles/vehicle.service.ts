import { pool } from "../../config/db";

export interface VehiclePayload {
  vehicle_name: string;
  type: "car" | "bike" | "van" | "SUV";
  registration_number: string;
  daily_rent_price: number;
  availability_status?: "available" | "booked";
}

// Create a new vehicle
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

// Get all vehicles
const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles ORDER BY id ASC`);
  return result;
};

// Get a single vehicle by ID
const getVehicleById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};

// Update vehicle details
const updateVehicleById = async (
  id: number,
  payload: Partial<VehiclePayload>
) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `UPDATE vehicles
     SET vehicle_name = COALESCE($1, vehicle_name),
         type = COALESCE($2, type),
         registration_number = COALESCE($3, registration_number),
         daily_rent_price = COALESCE($4, daily_rent_price),
         availability_status = COALESCE($5, availability_status),
         updated_at = NOW()
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

// Delete vehicle
const deleteVehicleById = async (id: number) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1 RETURNING *`, [id]);
  return result;
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};