import { prisma } from "../../lib/prisma";
import { DashboardStats } from "./admin.interface";

// Get all users with optional role filter
const getAllUsers = async (role?: string) => {
  const whereClause: any = {};

  if (role) {
    whereClause.role = role;
  }

  const result = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      isActive: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Ban user
const banUser = async (userId: string) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { isBanned: true },
    select: {
      id: true,
      name: true,
      email: true,
      isBanned: true,
    },
  });

  return result;
};

// Unban user
const unbanUser = async (userId: string) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { isBanned: false },
    select: {
      id: true,
      name: true,
      email: true,
      isBanned: true,
    },
  });

  return result;
};

// Get dashboard statistics
const getDashboardStats = async (): Promise<DashboardStats> => {
  return await prisma.$transaction(async (tx) => {
    const [
      grandTotalUsers,
      totalUsers,
      totalAdmins,
      totalVerifiedUsers,
      totalUnverifiedUsers,

      totalProjects,
      totalCategories,
      totalReviews,

      totalContacts,
      totalUnreadContacts,

      totalPageViews,
    ] = await Promise.all([
      tx.user.count(),
      tx.user.count({ where: { role: "USER" } }),
      tx.user.count({ where: { role: "ADMIN" } }),
      tx.user.count({ where: { emailVerified: true } }),
      tx.user.count({ where: { emailVerified: false } }),

      tx.project.count(),
      tx.category.count(),
      tx.review.count(),

      tx.contact.count(),
      tx.contact.count({ where: { status: "UNREAD" } }),

      tx.pageView.count(),
    ]);

    return {
      grandTotalUsers,
      totalUsers,
      totalAdmins,
      totalVerifiedUsers,
      totalUnverifiedUsers,

      totalProjects,
      totalSkills: 0,
      totalCategories,
      totalServices: 0,
      totalExperiences: 0,
      totalEducations: 0,
      totalCertificates: 0,
      totalReviews,
      totalGallery: 0,
      totalVideos: 0,
      totalTimelines: 0,

      totalBlogs: 0,
      totalPublishedBlogs: 0,
      totalDraftBlogs: 0,
      totalBlogTags: 0,
      totalBlogComments: 0,

      totalContacts,
      totalUnreadContacts,
      totalAppointments: 0,
      totalPendingAppointments: 0,

      totalProducts: 0,
      totalOrders: 0,
      totalPaidOrders: 0,

      totalPageViews,
      totalNpmPackages: 0,
      totalOpenSourceContributions: 0,
      totalRssSubscribers: 0,
      totalTranslations: 0,
    };
  });
};

export const AdminService = {
  getAllUsers,
  banUser,
  unbanUser,
  getDashboardStats,
};
