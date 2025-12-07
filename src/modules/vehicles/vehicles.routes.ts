import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();



router.post("/", requireAuth(["admin"]), vehicleController.createVehicle);
router.get("/", vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getVehicleById);
router.put("/:vehicleId", requireAuth(["admin"]), vehicleController.updateVehicleById);
router.delete("/:vehicleId", requireAuth(["admin"]), vehicleController.deleteVehicleById);

export default router;