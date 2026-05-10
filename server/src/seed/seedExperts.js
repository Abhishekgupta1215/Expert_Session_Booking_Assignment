import { Expert } from "../models/Expert.js";

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getUpcomingDates(totalDays = 5) {
  const dates = [];
  const currentDate = new Date();

  for (let index = 1; index <= totalDays; index += 1) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + index);
    dates.push(formatDate(nextDate));
  }

  return dates;
}

export async function seedExperts() {
  const count = await Expert.countDocuments();
  if (count > 0) {
    return;
  }

  const dates = getUpcomingDates(6);
  const slotSets = [
    ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    ["10:00 AM", "12:00 PM", "03:00 PM", "05:00 PM"],
    ["09:30 AM", "01:00 PM", "03:30 PM", "06:00 PM"]
  ];

  const experts = [
    {
      name: "Aarav Mehta",
      category: "Business",
      experience: 9,
      rating: 4.8,
      bio: "Helps founders refine strategy, operations, and go-to-market execution.",
      availability: dates.map((date, index) => ({ date, slots: slotSets[index % slotSets.length] }))
    },
    {
      name: "Sara Khan",
      category: "Career",
      experience: 7,
      rating: 4.7,
      bio: "Guides professionals through interviews, resumes, and career transitions.",
      availability: dates.map((date, index) => ({ date, slots: slotSets[(index + 1) % slotSets.length] }))
    },
    {
      name: "Neha Iyer",
      category: "Design",
      experience: 11,
      rating: 4.9,
      bio: "Design leader focused on product thinking, UI systems, and portfolio reviews.",
      availability: dates.map((date, index) => ({ date, slots: slotSets[(index + 2) % slotSets.length] }))
    },
    {
      name: "Rohan Verma",
      category: "Technology",
      experience: 10,
      rating: 4.6,
      bio: "Backend architect specializing in API design, scalability, and deployment.",
      availability: dates.map((date, index) => ({ date, slots: slotSets[index % slotSets.length] }))
    },
    {
      name: "Priya Singh",
      category: "Marketing",
      experience: 8,
      rating: 4.7,
      bio: "Growth strategist for content, funnels, paid campaigns, and brand positioning.",
      availability: dates.map((date, index) => ({ date, slots: slotSets[(index + 1) % slotSets.length] }))
    },
    {
      name: "Kabir Shah",
      category: "Health",
      experience: 12,
      rating: 4.9,
      bio: "Wellness mentor supporting performance, habits, and sustainable routines.",
      availability: dates.map((date, index) => ({ date, slots: slotSets[(index + 2) % slotSets.length] }))
    }
  ];

  await Expert.insertMany(experts);
}