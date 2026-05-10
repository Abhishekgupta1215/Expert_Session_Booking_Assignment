import { Router } from "express";
import {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus
} from "../controllers/bookingsController.js";

const bookingsRoutes = Router();

bookingsRoutes.get("/", getBookingsByEmail);
bookingsRoutes.post("/", createBooking);
bookingsRoutes.patch("/:id/status", updateBookingStatus);

export default bookingsRoutes;