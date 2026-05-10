import mongoose from "mongoose";

const dailyAvailabilitySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },
    slots: {
      type: [String],
      required: true,
      default: []
    }
  },
  {
    _id: false
  }
);

const expertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    bio: {
      type: String,
      required: true,
      trim: true
    },
    availability: {
      type: [dailyAvailabilitySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Expert = mongoose.model("Expert", expertSchema);