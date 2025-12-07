import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }
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

// Get a specific user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const result = await userService.getUserById(userId as any);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user by ID
const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId!, 10);
    const result = await userService.updateUserById(req.body, userId);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user by ID
const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId!, 10);
    await userService.deleteUserById(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const userController = { createUser, loginUser, getAllUsers, getUserById, updateUserById, deleteUserById };
