import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";
import { bookingService } from "../bookings/booking.service";

// Admin: create vehicle
const createVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    // validation
    if (!vehicle_name || !type || !registration_number || !daily_rent_price) {
      return res.status(400).json({
        success: false,
        message: "vehicle_name, type, registration_number, and daily_rent_price are required",
      });
    }

    const result = await vehicleService.createVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    });

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: get all vehicles
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    await bookingService.autoReturnExpiredBookings();
    const result = await vehicleService.getAllVehicles();
    res.status(200).json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: get vehicle by ID
const getVehicleById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.vehicleId!, 10);
    const result = await vehicleService.getVehicleById(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: update vehicle
const updateVehicleById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.vehicleId!, 10);
    const result = await vehicleService.updateVehicleById(id, req.body);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: delete vehicle
const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.vehicleId!, 10);
    const result = await vehicleService.deleteVehicleById(id);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
};