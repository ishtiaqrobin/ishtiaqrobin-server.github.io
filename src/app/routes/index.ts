import { Router } from "express";

import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.route";
import { AdminRouter } from "../modules/admin/admin.route";
import { ReviewRouter } from "../modules/review/review.route";
import { CategoryRouter } from "../modules/category/category.route";
import { SettingRouter } from "../modules/setting/setting.route";
import { StatsRouter } from "../modules/stats/stats.route";
import { SkillRouter } from "../modules/skill/skill.route";
import { ServiceRouter } from "../modules/service/service.route";
import { ProjectRouter } from "../modules/project/project.route";
import { GalleryRouter } from "../modules/gallery/gallery.route";
import { ExperienceRouter } from "../modules/experience/experience.route";
import { EducationRouter } from "../modules/education/education.route";
import { VideoRouter } from "../modules/video/video.route";
import { ContactRouter } from "../modules/contact/contact.route";
import { AboutRouter } from "../modules/about/about.route";
import { CertificateRouter } from "../modules/certificate/certificate.route";
import { BlogRouter } from "../modules/blog/blog.route";
import { AnalyticsRouter } from "../modules/analytics/analytics.route";
import { AppointmentRouter } from "../modules/appointment/appointment.route";
import { GithubRouter } from "../modules/github/github.route";
import { NpmRouter } from "../modules/npm/npm.route";
import { StoreRouter } from "../modules/store/store.route";
import { TimelineRouter } from "../modules/timeline/timeline.route";
import { RssRouter } from "../modules/rss/rss.route";
import { ChatbotRouter } from "../modules/chatbot/chatbot.route";
import { TranslationRouter } from "../modules/translation/translation.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/admins", AdminRouter);
router.use("/reviews", ReviewRouter);
router.use("/categories", CategoryRouter);
router.use("/settings", SettingRouter);
router.use("/public-stats", StatsRouter);

router.use("/about", AboutRouter);
router.use("/certificates", CertificateRouter);
router.use("/blogs", BlogRouter);
router.use("/analytics", AnalyticsRouter);
router.use("/appointments", AppointmentRouter);
router.use("/github", GithubRouter);
router.use("/npm", NpmRouter);
router.use("/store", StoreRouter);
router.use("/timeline", TimelineRouter);
router.use("/rss", RssRouter);
router.use("/chatbot", ChatbotRouter);
router.use("/translations", TranslationRouter);

router.use("/skills", SkillRouter);
router.use("/services", ServiceRouter);
router.use("/projects", ProjectRouter);
router.use("/galleries", GalleryRouter);
router.use("/experiences", ExperienceRouter);
router.use("/educations", EducationRouter);
router.use("/videos", VideoRouter);
router.use("/contacts", ContactRouter);

export const IndexRoutes = router;
