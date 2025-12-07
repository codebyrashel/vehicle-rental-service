import { Router } from "express";
import { bookingController } from "./booking.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth(["admin", "customer"]), bookingController.createBooking);
router.get("/", requireAuth(["admin", "customer"]), bookingController.getBookings);

router.put(
  "/:bookingId",
  requireAuth(["admin", "customer"]),
  bookingController.updateBookingStatus
);

export default router;