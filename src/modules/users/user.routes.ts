import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/signup", userController.createUser);
router.post("/signin", userController.loginUser);
router.get("/", userController.getAllUsers);

export default router;
