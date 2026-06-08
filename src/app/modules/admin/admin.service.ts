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
      // Users
      grandTotalUsers,
      totalUsers,
      totalAdmins,
      totalVerifiedUsers,
      totalUnverifiedUsers,

      // Core Portfolio
      totalProjects,
      totalSkills,
      totalCategories,
      totalServices,
      totalExperiences,
      totalEducations,
      totalCertificates,
      totalReviews,
      totalGallery,
      totalVideos,
      totalTimelines,

      // Blog
      totalBlogs,
      totalPublishedBlogs,
      totalDraftBlogs,
      totalBlogTags,
      totalBlogComments,

      // Contacts & Appointments
      totalContacts,
      totalUnreadContacts,
      totalAppointments,
      totalPendingAppointments,

      // Store
      totalProducts,
      totalOrders,
      totalPaidOrders,

      // Analytics & Engagement
      totalPageViews,
      // totalChatbotLogs,

      // Open Source & Packages
      totalNpmPackages,
      totalOpenSourceContributions,

      // RSS
      totalRssSubscribers,

      // Translations
      totalTranslations,
    ] = await Promise.all([
      // Users
      tx.user.count(),
      tx.user.count({ where: { role: "USER" } }),
      tx.user.count({ where: { role: "ADMIN" } }),
      tx.user.count({ where: { emailVerified: true } }),
      tx.user.count({ where: { emailVerified: false } }),

      // Core Portfolio
      tx.project.count(),
      tx.skill.count(),
      tx.category.count(),
      tx.service.count(),
      tx.experience.count(),
      tx.education.count(),
      tx.certificate.count(),
      tx.review.count(),
      tx.gallery.count(),
      tx.video.count(),
      tx.timeline.count(),

      // Blog
      tx.blog.count(),
      tx.blog.count({ where: { status: "PUBLISHED" } }),
      tx.blog.count({ where: { status: "DRAFT" } }),
      tx.blogTag.count(),
      tx.blogComment.count(),

      // Contacts & Appointments
      tx.contact.count(),
      tx.contact.count({ where: { status: "UNREAD" } }),
      tx.appointment.count(),
      tx.appointment.count({ where: { status: "PENDING" } }),

      // Store
      tx.product.count(),
      tx.order.count(),
      tx.order.count({ where: { status: "PAID" } }),

      // Analytics & Engagement
      tx.pageView.count(),
      // tx.chatbotLog.count(),

      // Open Source & Packages
      tx.npmPackage.count(),
      tx.openSourceContribution.count(),

      // RSS
      tx.rssSubscriber.count(),

      // Translations
      tx.translation.count(),
    ]);

    return {
      // Users
      grandTotalUsers,
      totalUsers,
      totalAdmins,
      totalVerifiedUsers,
      totalUnverifiedUsers,

      // Core Portfolio
      totalProjects,
      totalSkills,
      totalCategories,
      totalServices,
      totalExperiences,
      totalEducations,
      totalCertificates,
      totalReviews,
      totalGallery,
      totalVideos,
      totalTimelines,

      // Blog
      totalBlogs,
      totalPublishedBlogs,
      totalDraftBlogs,
      totalBlogTags,
      totalBlogComments,

      // Contacts & Appointments
      totalContacts,
      totalUnreadContacts,
      totalAppointments,
      totalPendingAppointments,

      // Store
      totalProducts,
      totalOrders,
      totalPaidOrders,

      // Analytics & Engagement
      totalPageViews,
      // totalChatbotLogs,

      // Open Source & Packages
      totalNpmPackages,
      totalOpenSourceContributions,

      // RSS
      totalRssSubscribers,

      // Translations
      totalTranslations,
    };
  });
};

export const AdminService = {
  getAllUsers,
  banUser,
  unbanUser,
  getDashboardStats,
};
