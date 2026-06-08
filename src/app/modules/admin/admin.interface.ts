export interface DashboardStats {
  // Users
  totalUsers: number;
  totalAdmins: number;
  totalVerifiedUsers: number;
  totalUnverifiedUsers: number;

  // Core Portfolio
  totalProjects: number;
  totalSkills: number;
  totalCategories: number;
  totalServices: number;
  totalExperiences: number;
  totalEducations: number;
  totalCertificates: number;
  totalReviews: number;
  totalGallery: number;
  totalVideos: number;
  totalTimelines: number;

  // Blog
  totalBlogs: number;
  totalPublishedBlogs: number;
  totalDraftBlogs: number;
  totalBlogTags: number;
  totalBlogComments: number;

  // Contacts & Appointments
  totalContacts: number;
  totalUnreadContacts: number;
  totalAppointments: number;
  totalPendingAppointments: number;

  // Store
  totalProducts: number;
  totalOrders: number;
  totalPaidOrders: number;

  // Analytics & Engagement
  totalPageViews: number;
  // totalChatbotLogs: number;

  // Open Source & Packages
  totalNpmPackages: number;
  totalOpenSourceContributions: number;

  // RSS
  totalRssSubscribers: number;

  // Translations
  totalTranslations: number;
}
