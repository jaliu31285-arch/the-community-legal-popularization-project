import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Cyberbullying from "@/pages/Cyberbullying";
import Fraud from "@/pages/Fraud";
import Consumption from "@/pages/Consumption";
import Activities from "@/pages/Activities";
import Resources from "@/pages/Resources";
import Achievements from "@/pages/Achievements";
import About from "@/pages/About";
import NewsDetail from "@/pages/NewsDetail";
import AnnouncementDetail from "@/pages/AnnouncementDetail";
import ActivityReview from "@/pages/ActivityReview";
import StudentWorks from "@/pages/StudentWorks";
import PromiseWall from "@/pages/PromiseWall";
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/Layout";
import Dashboard from "@/pages/admin/Dashboard";
import BannerAdmin from "@/pages/admin/BannerAdmin";
import NewsAdmin from "@/pages/admin/NewsAdmin";
import ActivityAdmin from "@/pages/admin/ActivityAdmin";
import ResourceAdmin from "@/pages/admin/ResourceAdmin";
import TeamAdmin from "@/pages/admin/TeamAdmin";
import AchievementAdmin from "@/pages/admin/AchievementAdmin";
import UploadAdmin from "@/pages/admin/UploadAdmin";
import TopicAdmin from "@/pages/admin/TopicAdmin";
import AdvisorAdmin from "@/pages/admin/AdvisorAdmin";
import PartnerAdmin from "@/pages/admin/PartnerAdmin";
import StatsAdmin from "@/pages/admin/StatsAdmin";
import SiteSettingsAdmin from "@/pages/admin/SiteSettingsAdmin";
import NavAdmin from "@/pages/admin/NavAdmin";
import AnnouncementAdmin from "@/pages/admin/AnnouncementAdmin";
import QuickLinkAdmin from "@/pages/admin/QuickLinkAdmin";
import FooterSectionAdmin from "@/pages/admin/FooterSectionAdmin";
import SidebarWidgetAdmin from "@/pages/admin/SidebarWidgetAdmin";
import PageSectionAdmin from "@/pages/admin/PageSectionAdmin";
import ConfigMap from "@/pages/admin/ConfigMap";
import ChangeLogAdmin from "@/pages/admin/ChangeLogAdmin";
import PageBlockAdmin from "@/pages/admin/PageBlockAdmin";
import ActivityReviewAdmin from "@/pages/admin/ActivityReviewAdmin";
import StudentWorksAdmin from "@/pages/admin/StudentWorksAdmin";
import PromiseWallAdmin from "@/pages/admin/PromiseWallAdmin";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 前台页面 */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col bg-slate-50">
              <Navbar />
              <main className="flex-1 pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/news/:id" element={<NewsDetail />} />
                  <Route path="/announcements/:id" element={<AnnouncementDetail />} />
                  <Route path="/cyberbullying" element={<Cyberbullying />} />
                  <Route path="/fraud" element={<Fraud />} />
                  <Route path="/consumption" element={<Consumption />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/activity-review" element={<ActivityReview />} />
                  <Route path="/student-works" element={<StudentWorks />} />
                  <Route path="/promise-wall" element={<PromiseWall />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />

        {/* 后台管理 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="config-map" element={<ConfigMap />} />
          <Route path="site-settings" element={<SiteSettingsAdmin />} />
          <Route path="nav" element={<NavAdmin />} />
          <Route path="footer-sections" element={<FooterSectionAdmin />} />
          <Route path="banners" element={<BannerAdmin />} />
          <Route path="news" element={<NewsAdmin />} />
          <Route path="announcements" element={<AnnouncementAdmin />} />
          <Route path="activities" element={<ActivityAdmin />} />
          <Route path="resources" element={<ResourceAdmin />} />
          <Route path="topics" element={<TopicAdmin />} />
          <Route path="page-sections" element={<PageSectionAdmin />} />
          <Route path="team" element={<TeamAdmin />} />
          <Route path="advisors" element={<AdvisorAdmin />} />
          <Route path="partners" element={<PartnerAdmin />} />
          <Route path="stats" element={<StatsAdmin />} />
          <Route path="achievements" element={<AchievementAdmin />} />
          <Route path="quick-links" element={<QuickLinkAdmin />} />
          <Route path="sidebar-widgets" element={<SidebarWidgetAdmin />} />
          <Route path="upload" element={<UploadAdmin />} />
          <Route path="change-logs" element={<ChangeLogAdmin />} />
          <Route path="page-blocks" element={<PageBlockAdmin />} />
          <Route path="activity-review" element={<ActivityReviewAdmin />} />
          <Route path="student-works" element={<StudentWorksAdmin />} />
          <Route path="promise-wall" element={<PromiseWallAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}
