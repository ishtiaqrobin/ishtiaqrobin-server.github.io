import { NextFunction, Request, Response } from "express";
import { AppointmentService } from "./appointment.service";

// ─── Appointment Slot Controllers ───

// Create a slot
const createAppointmentSlot = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AppointmentService.createAppointmentSlot(req.body);

    res.status(201).json({
      success: true,
      message: "Appointment slot created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all slots
const getAppointmentSlots = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AppointmentService.getAppointmentSlots();

    res.status(200).json({
      success: true,
      message: "Retrieved all appointment slots successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get available slots only
const getAvailableSlots = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AppointmentService.getAvailableSlots();

    res.status(200).json({
      success: true,
      message: "Retrieved available slots successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update a slot
const updateAppointmentSlot = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slotId } = req.params;
    const result = await AppointmentService.updateAppointmentSlot(
      slotId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Appointment slot updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a slot
const deleteAppointmentSlot = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slotId } = req.params;
    const result = await AppointmentService.deleteAppointmentSlot(
      slotId as string,
    );

    res.status(200).json({
      success: true,
      message: "Appointment slot deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Appointment Controllers ───

// Book an appointment
const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AppointmentService.createAppointment(req.body);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all appointments
const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AppointmentService.getAppointments();

    res.status(200).json({
      success: true,
      message: "Retrieved all appointments successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single appointment by ID
const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { appointmentId } = req.params;
    const result = await AppointmentService.getAppointmentById(
      appointmentId as string,
    );

    res.status(200).json({
      success: true,
      message: "Retrieved appointment successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update appointment details
const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { appointmentId } = req.params;
    const result = await AppointmentService.updateAppointment(
      appointmentId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update appointment status
const updateAppointmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { appointmentId } = req.params;
    const result = await AppointmentService.updateAppointmentStatus(
      appointmentId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete an appointment
const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { appointmentId } = req.params;
    const result = await AppointmentService.deleteAppointment(
      appointmentId as string,
    );

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const AppointmentController = {
  createAppointmentSlot,
  getAppointmentSlots,
  getAvailableSlots,
  updateAppointmentSlot,
  deleteAppointmentSlot,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};
