import { pool } from "../../config/db";

const calculateTotalPrice = (dailyRate: number, start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffInDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffInDays * dailyRate;
};

const createBooking = async (payload: {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const vehicleRes = await client.query(
      "SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'",
      [payload.vehicle_id]
    );
    if (vehicleRes.rows.length === 0) {
      throw new Error("Vehicle not available for booking");
    }

    const vehicle = vehicleRes.rows[0];
    const totalPrice = calculateTotalPrice(
      Number(vehicle.daily_rent_price),
      payload.rent_start_date,
      payload.rent_end_date
    );

    const bookingRes = await client.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
      [
        payload.customer_id,
        payload.vehicle_id,
        payload.rent_start_date,
        payload.rent_end_date,
        totalPrice,
      ]
    );

    await client.query(
      "UPDATE vehicles SET availability_status = 'booked' WHERE id = $1",
      [payload.vehicle_id]
    );

    await client.query("COMMIT");
    return bookingRes.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


const getBookings = async (role: string, userId: number) => {
  if (role === "admin") {

    const result = await pool.query(
      `SELECT 
          b.id, b.customer_id, b.vehicle_id,
          b.rent_start_date, b.rent_end_date, b.total_price, b.status,
          u.name AS customer_name, u.email AS customer_email,
          v.vehicle_name, v.registration_number
       FROM bookings b
       JOIN users    u ON b.customer_id = u.id
       JOIN vehicles v ON b.vehicle_id  = v.id
      ORDER BY b.id ASC`
    );
    return result.rows;
  }

  const result = await pool.query(
    `SELECT 
        b.id, b.vehicle_id,
        b.rent_start_date, b.rent_end_date, 
        b.total_price, b.status,
        v.vehicle_name, v.registration_number, v.type
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id ASC`,
    [userId]
  );
  return result.rows;
};

const updateBookingStatus = async (
  bookingId: number,
  status: "cancelled" | "returned"
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const bookingRes = await client.query(
      "SELECT * FROM bookings WHERE id = $1",
      [bookingId]
    );
    if (bookingRes.rows.length === 0) throw new Error("Booking not found");

    const booking = bookingRes.rows[0];

    await client.query("UPDATE bookings SET status = $1 WHERE id = $2", [
      status,
      bookingId,
    ]);

    if (status === "returned" || status === "cancelled") {
      await client.query(
        "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
        [booking.vehicle_id]
      );
    }

    await client.query("COMMIT");
    return { ...booking, status };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const autoReturnExpiredBookings = async () => {
  const result = await pool.query(`
      UPDATE bookings
         SET status = 'returned'
       WHERE status = 'active'
         AND rent_end_date < CURRENT_DATE
      RETURNING vehicle_id;
    `);

  const vehiclesToFree = result.rows.map(r => r.vehicle_id);
  if (vehiclesToFree.length > 0) {
    await pool.query(
      `UPDATE vehicles
          SET availability_status = 'available'
        WHERE id = ANY($1::int[])`,
      [vehiclesToFree]
    );
  }
  return { autoReturned: vehiclesToFree.length };
};

export const bookingService = {
  createBooking,
  getBookings,
  updateBookingStatus,
  autoReturnExpiredBookings,
};