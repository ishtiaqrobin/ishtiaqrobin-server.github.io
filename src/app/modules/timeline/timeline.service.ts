import { prisma } from "../../lib/prisma";
import { CreateTimelineInput, UpdateTimelineInput } from "./timeline.interface";

// Create timeline entry
const createTimeline = async (payload: CreateTimelineInput) => {
  const result = await prisma.timeline.create({
    data: payload,
  });

  return result;
};

// Get all timeline entries
const getTimelines = async () => {
  const result = await prisma.timeline.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return result;
};

// Get single timeline entry
const getTimeline = async (timelineId: string) => {
  const result = await prisma.timeline.findUnique({
    where: { id: timelineId },
  });

  return result;
};

// Update timeline entry
const updateTimeline = async (
  timelineId: string,
  payload: UpdateTimelineInput,
) => {
  const result = await prisma.timeline.update({
    where: { id: timelineId },
    data: payload,
  });

  return result;
};

// Delete timeline entry
const deleteTimeline = async (timelineId: string) => {
  const result = await prisma.timeline.delete({
    where: { id: timelineId },
  });

  return result;
};

export const TimelineService = {
  createTimeline,
  getTimelines,
  getTimeline,
  updateTimeline,
  deleteTimeline,
};
