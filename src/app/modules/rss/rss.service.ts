import { prisma } from "../../lib/prisma";
import {
  RssConfig,
  CreateSubscriberInput,
  UpdateSubscriberInput,
} from "./rss.interface";
import { randomUUID } from "crypto";
import { sendEmail } from "../../utils/email";
import { env } from "../../config/env";

const SINGLETON_ID = "singleton";

// ─── RSS Config ───

const getConfig = async () => {
  const config = await prisma.rssConfig.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });

  return config;
};

const updateConfig = async (payload: Partial<RssConfig>) => {
  const result = await prisma.rssConfig.upsert({
    where: { id: SINGLETON_ID },
    update: payload,
    create: { id: SINGLETON_ID, ...payload },
  });

  return result;
};

// ─── RSS Subscribers ────

// Subscribe — create subscriber with a verify token
const subscribe = async (payload: CreateSubscriberInput) => {
  const verifyToken = randomUUID();

  const result = await prisma.rssSubscriber.create({
    data: {
      email: payload.email,
      verifyToken,
    },
  });

  // Send confirmation/verify email
  try {
    const config = await prisma.rssConfig.findUnique({
      where: { id: SINGLETON_ID },
    });

    const verifyUrl = `${env.FRONTEND_URL}/rss/verify?token=${verifyToken}`;

    await sendEmail({
      to: payload.email,
      subject: `Confirm your subscription to Ishtiaq Robin's blog`,
      templateName: "rss-verify",
      templateData: {
        blogTitle: config?.title || "Ishtiaq Robin's Blog",
        verifyUrl,
      },
    });
  } catch (err) {
    console.error("Failed to send RSS verify email:", err);
  }

  return result;
};

// Verify email via token
const verifySubscriber = async (verifyToken: string) => {
  const result = await prisma.rssSubscriber.update({
    where: { verifyToken },
    data: {
      isVerified: true,
      verifyToken: null,
    },
  });

  return result;
};

// Unsubscribe via token
const unsubscribe = async (unsubscribeToken: string) => {
  const result = await prisma.rssSubscriber.update({
    where: { unsubscribeToken },
    data: {
      unsubscribedAt: new Date(),
    },
  });

  return result;
};

// Get all subscribers
const getSubscribers = async () => {
  const result = await prisma.rssSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  return result;
};

// Delete subscriber
const deleteSubscriber = async (subscriberId: string) => {
  const result = await prisma.rssSubscriber.delete({
    where: { id: subscriberId },
  });

  return result;
};

export const RssService = {
  getConfig,
  updateConfig,
  subscribe,
  verifySubscriber,
  unsubscribe,
  getSubscribers,
  deleteSubscriber,
};
