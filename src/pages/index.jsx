import Layout from "./Layout.jsx";
import Ping from "@/components/Ping";
import ToastDismisser from "@/components/ToastDismisser";

import Dashboard from "./Dashboard";
import CreateProof from "./CreateProof";
import Landing from "./Landing";
import AIMentor from "./AIMentor";
import Gallery from "./Gallery";
import Marketplace from "./Marketplace";
import AdminPanel from "./AdminPanel";
import MindVaultIPWhitePaper from "./MindVaultIPWhitePaper";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";
import WalletSecurity from "./WalletSecurity";
import Messages from "./Messages";
import Chat from "./Chat";
import MultimindAwards from "./MultimindAwards";
import NewAward from "./NewAward";
import Watchlist from "./Watchlist";
import ExpertDashboard from "./ExpertDashboard";
import ApplyExpert from "./ApplyExpert";
import Profile from "./Profile";
import Signup from "./Signup";


import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  FEATURE_AI_MENTOR,
  FEATURE_MESSAGES,
  FEATURE_MARKETPLACE,
  FEATURE_EXPERT_DASHBOARD,
  FEATURE_ADMIN_PANEL,
} from "@/utils/featureFlags";
import { FeatureGuard } from "@/components/common/FeatureGuard";

const PAGES = {
  Dashboard: Dashboard,
  CreateProof: CreateProof,
  Landing: Landing,
  AIMentor: AIMentor,
  Gallery: Gallery,
  Marketplace: Marketplace,
  AdminPanel: AdminPanel,
  MindVaultIPWhitePaper: MindVaultIPWhitePaper,
  TermsOfService: TermsOfService,
  PrivacyPolicy: PrivacyPolicy,
  WalletSecurity: WalletSecurity,
  Messages: Messages,
  Chat: Chat,
  MultimindAwards: MultimindAwards,
  NewAward: NewAward,
  Watchlist: Watchlist,
  ExpertDashboard: ExpertDashboard,
  ApplyExpert: ApplyExpert,
  Profile: Profile,
  Signup: Signup,
};

function _getCurrentPage(url) {
  if (url.endsWith("/")) url = url.slice(0, -1);
  let urlLastPart = url.split("/").pop();
  if (urlLastPart.includes("?")) urlLastPart = urlLastPart.split("?")[0];
  const pageName = Object.keys(PAGES).find(
    (page) => page.toLowerCase() === urlLastPart.toLowerCase()
  );
  return pageName || Object.keys(PAGES)[0];
}

function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);

  return (
    <Layout currentPageName={currentPage}>
      <Ping />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/CreateProof" element={<CreateProof />} />
        <Route path="/Landing" element={<Landing />} />
        <Route
          path="/AIMentor"
          element={
            <FeatureGuard feature={FEATURE_AI_MENTOR}>
              <AIMentor />
            </FeatureGuard>
          }
        />
        <Route path="/Gallery" element={<Gallery />} />
        <Route
          path="/Marketplace"
          element={
            <FeatureGuard feature={FEATURE_MARKETPLACE}>
              <Marketplace />
            </FeatureGuard>
          }
        />
        <Route
          path="/AdminPanel"
          element={
            <FeatureGuard feature={FEATURE_ADMIN_PANEL}>
              <AdminPanel />
            </FeatureGuard>
          }
        />
        <Route
          path="/MindVaultIPWhitePaper"
          element={<MindVaultIPWhitePaper />}
        />
        <Route path="/TermsOfService" element={<TermsOfService />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/WalletSecurity" element={<WalletSecurity />} />
        <Route
          path="/Messages"
          element={
            <FeatureGuard feature={FEATURE_MESSAGES}>
              <Messages />
            </FeatureGuard>
          }
        />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/MultimindAwards" element={<MultimindAwards />} />
        <Route path="/MultimindAwards/new" element={<NewAward />} />
        <Route path="/Watchlist" element={<Watchlist />} />
        <Route
          path="/ExpertDashboard"
          element={
            <FeatureGuard feature={FEATURE_EXPERT_DASHBOARD}>
              <ExpertDashboard />
            </FeatureGuard>
          }
        />
        <Route path="/ApplyExpert" element={<ApplyExpert />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Signup" element={<Signup />} />

        {/* برای مسیرهای ناشناخته */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function Pages() {
  return (
    <Router>
      <ToastDismisser />
      <PagesContent />
    </Router>
  );
}