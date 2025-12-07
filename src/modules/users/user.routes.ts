import { Router } from "express";
import { userController } from "./user.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth(["admin"]), userController.getAllUsers);
router.get("/:userId", requireAuth(["admin", "customer"]), userController.getUserById);
router.put("/:userId", requireAuth(["admin", "customer"]), userController.updateUserById);
router.delete("/:userId", requireAuth(["admin"]), userController.deleteUserById);

export default router;