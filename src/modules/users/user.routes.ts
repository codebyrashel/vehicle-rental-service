import { Router } from "express";
import { userController } from "./user.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

// Admin‑only: view all users
router.get("/", requireAuth(["admin"]), userController.getAllUsers);

// Admin or customer (self) can view/update individual user
router.get("/:userId", requireAuth(["admin", "customer"]), userController.getUserById);
router.put("/:userId", requireAuth(["admin", "customer"]), userController.updateUserById);

// Admin‑only: delete user
router.delete("/:userId", requireAuth(["admin"]), userController.deleteUserById);

export default router;