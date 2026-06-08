import { prisma } from "../../lib/prisma";
import { CreateVideoInput, UpdateVideoInput } from "./video.interface";

// Create video
const createVideo = async (payload: CreateVideoInput) => {
  const result = await prisma.video.create({
    data: payload as any,
  });
  return result;
};

// Get all videos
const getVideos = async (isPublished?: boolean) => {
  const result = await prisma.video.findMany({
    where: {
      ...(isPublished !== undefined && { isPublished }),
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
  return result;
};

// Update video
const updateVideo = async (id: string, payload: UpdateVideoInput) => {
  const result = await prisma.video.update({
    where: { id },
    data: payload as any,
  });
  return result;
};

// Delete video
const deleteVideo = async (id: string) => {
  const result = await prisma.video.delete({
    where: { id },
  });
  return result;
};

export const VideoService = {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
};
