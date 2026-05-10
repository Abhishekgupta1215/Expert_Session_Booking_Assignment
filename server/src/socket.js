let ioInstance = null;

export function setSocketServer(io) {
  ioInstance = io;
}

export function emitSlotBooked(payload) {
  ioInstance?.emit("slot-booked", payload);
}

export function emitBookingStatusUpdated(payload) {
  ioInstance?.emit("booking-status-updated", payload);
}