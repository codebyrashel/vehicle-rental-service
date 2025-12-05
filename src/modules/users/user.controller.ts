import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    console.log("Attempting to create user...");
    const result = await userService.createUser(req.body);
    console.log("User created successfully, sending response.");
    res.status(201).json({ success: true, data: result.rows[0], message: "User registered successfully" });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.status(200).json({ success: true, data: result.user, token: result.token, message: "Login successful" });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userController = { createUser, loginUser, getAllUsers };
