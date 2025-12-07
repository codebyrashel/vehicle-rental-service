import { Response } from "express";
import { userService } from "./user.service";
import { AuthRequest } from "../../middleware/auth.middleware"; 

// Admin: get all users
const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin or customer (self): get one user by ID
const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.userId!, 10);
    const requester = req.user!;

    // Customers may view only their own profile
    if (requester.role === "customer" && requester.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only view your own profile",
      });
    }

    const result = await userService.getUserById(userId);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin or customer (self): update one user
const updateUserById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.userId!, 10);
    const requester = req.user!;

    if (requester.role === "customer" && requester.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only update your own profile",
      });
    }

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

// Admin: delete user
const deleteUserById = async (req: AuthRequest, res: Response) => {
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

export const userController = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};