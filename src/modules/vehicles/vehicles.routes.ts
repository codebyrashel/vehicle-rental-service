import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

/**
 * ROUTE SUMMARY
 * POST   /api/v1/vehicles           -> Admin only, create vehicle
 * GET    /api/v1/vehicles           -> Public, list all vehicles
 * GET    /api/v1/vehicles/:vehicleId -> Public, view a single vehicle
 * PUT    /api/v1/vehicles/:vehicleId -> Admin only, update vehicle
 * DELETE /api/v1/vehicles/:vehicleId -> Admin only, delete vehicle
 */

// Admin only: create new vehicle
router.post("/", requireAuth(["admin"]), vehicleController.createVehicle);

// Public: list all vehicles
router.get("/", vehicleController.getAllVehicles);

// Public: get specific vehicle
router.get("/:vehicleId", vehicleController.getVehicleById);

// Admin only: update vehicle
router.put("/:vehicleId", requireAuth(["admin"]), vehicleController.updateVehicleById);

// Admin only: delete vehicle
router.delete("/:vehicleId", requireAuth(["admin"]), vehicleController.deleteVehicleById);

export default router;