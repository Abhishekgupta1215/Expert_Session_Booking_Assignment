import { Booking } from "../models/Booking.js";
import { Expert } from "../models/Expert.js";
import { emitBookingStatusUpdated, emitSlotBooked } from "../socket.js";

function isValidDateString(dateValue) {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateValue);
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function findAvailabilityMatch(expert, date, timeSlot) {
  return expert.availability.find((day) => day.date === date)?.slots.includes(timeSlot) ?? false;
}

export async function createBooking(req, res, next) {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes = "" } = req.body;

    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ message: "All required booking fields must be provided" });
    }

    if (!isValidDateString(date)) {
      return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
    }

    const expert = await Expert.findById(expertId).lean();
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    if (!findAvailabilityMatch(expert, date, timeSlot)) {
      return res.status(400).json({ message: "Selected time slot is not available for this expert" });
    }

    const booking = await Booking.create({
      expertId,
      name: name.trim(),
      email: normalizeEmail(email),
      phone: phone.trim(),
      date,
      timeSlot,
      notes: notes.trim(),
      status: "Pending"
    });

    const populatedBooking = await Booking.findById(booking._id).populate("expertId", "name category rating");

    emitSlotBooked({
      expertId,
      date,
      timeSlot,
      bookingId: booking._id,
      expertName: expert.name
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "This expert, date, and time slot has already been booked"
      });
    }

    next(error);
  }
}

export async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true }).populate(
      "expertId",
      "name category rating"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    emitBookingStatusUpdated({
      bookingId: booking._id,
      status: booking.status,
      expertId: booking.expertId?._id?.toString() ?? booking.expertId?.toString() ?? null
    });

    res.json({
      message: "Booking status updated successfully",
      booking
    });
  } catch (error) {
    next(error);
  }
}

export async function getBookingsByEmail(req, res, next) {
  try {
    const { email } = req.query;

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }

    const bookings = await Booking.find({ email: normalizeEmail(email) })
      .populate("expertId", "name category rating")
      .sort({ date: -1, timeSlot: 1 })
      .lean();

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}