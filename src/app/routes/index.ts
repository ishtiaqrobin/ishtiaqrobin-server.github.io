import { Router } from "express";

import { AuthRouter } from "../modules/auth/auth.route";
import { UserRouter } from "../modules/user/user.route";
import { AdminRouter } from "../modules/admin/admin.route";
import { ReviewRouter } from "../modules/review/review.route";
import { CategoryRouter } from "../modules/category/category.route";
import { SettingRouter } from "../modules/setting/setting.route";
import { ProjectRouter } from "../modules/project/project.route";
import { ContactRouter } from "../modules/contact/contact.route";
import { AboutRouter } from "../modules/about/about.route";
import { AnalyticsRouter } from "../modules/analytics/analytics.route";
import { ChatbotRouter } from "../modules/chatbot/chatbot.route";
import { ExperienceRouter } from "../modules/experience/experience.route";
import { AwardRouter } from "../modules/award/award.route";
import { FaqRouter } from "../modules/faq/faq.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/admins", AdminRouter);
router.use("/reviews", ReviewRouter);
router.use("/categories", CategoryRouter);
router.use("/settings", SettingRouter);
router.use("/about", AboutRouter);
router.use("/analytics", AnalyticsRouter);
router.use("/chatbot", ChatbotRouter);
router.use("/projects", ProjectRouter);
router.use("/contacts", ContactRouter);
router.use("/experiences", ExperienceRouter);
router.use("/awards", AwardRouter);
router.use("/faqs", FaqRouter);

// router.use("/blogs", BlogRouter);

export const IndexRoutes = router;
