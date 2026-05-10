import { Expert } from "../models/Expert.js";
import { Booking } from "../models/Booking.js";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createBookedSlotMap(bookings) {
  return bookings.reduce((map, booking) => {
    map.set(`${booking.date}::${booking.timeSlot}`, booking);
    return map;
  }, new Map());
}

function buildAvailabilitySnapshot(expert, bookedSlots) {
  return expert.availability.map((day) => ({
    date: day.date,
    slots: day.slots.map((timeSlot) => {
      const booking = bookedSlots.get(`${day.date}::${timeSlot}`);
      return {
        timeSlot,
        booked: Boolean(booking),
        bookingId: booking?._id ?? null
      };
    })
  }));
}

export async function getExperts(req, res, next) {
  try {
    const {
      search = "",
      category = "",
      page = "1",
      limit = "6"
    } = req.query;

    const pageNumber = Math.max(Number.parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(Number.parseInt(limit, 10) || 6, 1), 24);

    const filters = {};

    if (search.trim()) {
      filters.name = { $regex: escapeRegex(search.trim()), $options: "i" };
    }

    if (category.trim()) {
      filters.category = category.trim();
    }

    const [experts, total] = await Promise.all([
      Expert.find(filters)
        .sort({ rating: -1, experience: -1, name: 1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Expert.countDocuments(filters)
    ]);

    res.json({
      experts,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getExpertById(req, res, next) {
  try {
    const { id } = req.params;
    const expert = await Expert.findById(id).lean();

    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    const bookings = await Booking.find({ expertId: id }).select("date timeSlot status").lean();
    const bookedSlots = createBookedSlotMap(bookings);

    res.json({
      expert,
      availability: buildAvailabilitySnapshot(expert, bookedSlots)
    });
  } catch (error) {
    next(error);
  }
}