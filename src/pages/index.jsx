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
  
  // Handle special cases for nested routes
  if (urlLastPart === "new" && url.includes("/multimindawards/")) {
    return "NewAward";
  }
  
  // Map lowercase route paths to PascalCase page names
  const routeToPageMap = {
    "dashboard": "Dashboard",
    "createproof": "CreateProof", 
    "landing": "Landing",
    "aimentor": "AIMentor",
    "gallery": "Gallery",
    "marketplace": "Marketplace",
    "adminpanel": "AdminPanel",
    "mindvaultipwhitepaper": "MindVaultIPWhitePaper",
    "termsofservice": "TermsOfService",
    "privacypolicy": "PrivacyPolicy",
    "walletsecurity": "WalletSecurity",
    "messages": "Messages",
    "chat": "Chat",
    "multimindawards": "MultimindAwards",
    "watchlist": "Watchlist",
    "expertdashboard": "ExpertDashboard",
    "applyexpert": "ApplyExpert",
    "profile": "Profile",
    "signup": "Signup"
  };
  
  const pageName = routeToPageMap[urlLastPart.toLowerCase()];
  return pageName || "Landing";
}

function PagesContent() {
  const location = useLocation();
  const currentPage = _getCurrentPage(location.pathname);
  
  // Debug logging
  console.log('🔍 Router Debug:', {
    pathname: location.pathname,
    currentPage: currentPage,
    timestamp: new Date().toISOString()
  });

  return (
    <div>
      <div className="p-4 bg-yellow-600 text-black">
        🔍 Debug: Current Path: {location.pathname} | Current Page: {currentPage}
      </div>
      <div className="p-4 bg-red-600 text-white">
        🚨 ROUTES TEST - If you see this, routing is working!
      </div>
      <Routes>
        <Route path="/" element={<div className="p-8 text-white bg-blue-600">🏠 HOME PAGE - Landing Component</div>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test" element={<div className="p-8 text-white bg-green-600">✅ Test Route Working!</div>} />
        <Route path="/simple" element={<div className="p-8 text-white bg-blue-600">🔵 Simple Route Working!</div>} />
        <Route path="/createproof" element={<CreateProof />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/aimentor" element={<AIMentor />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route
          path="/mindvaultipwhitepaper"
          element={<MindVaultIPWhitePaper />}
        />
        <Route path="/termsofservice" element={<TermsOfService />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/walletsecurity" element={<WalletSecurity />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/multimindawards" element={<MultimindAwards />} />
        <Route path="/multimindawards/new" element={<NewAward />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/expertdashboard" element={<ExpertDashboard />} />
        <Route path="/applyexpert" element={<ApplyExpert />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />

        {/* برای مسیرهای ناشناخته - باید در انتها باشد */}
        <Route path="*" element={<div className="p-8 text-white bg-red-600">❌ 404 - Route not found: {location.pathname}</div>} />
      </Routes>
    </div>
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