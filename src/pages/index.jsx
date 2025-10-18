import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import CreateProof from "./CreateProof";

import PublicProof from "./PublicProof";

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

import Watchlist from "./Watchlist";

import ExpertDashboard from "./ExpertDashboard";

import ApplyExpert from "./ApplyExpert";

import Profile from "./Profile";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    CreateProof: CreateProof,
    
    PublicProof: PublicProof,
    
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
    
    Watchlist: Watchlist,
    
    ExpertDashboard: ExpertDashboard,
    
    ApplyExpert: ApplyExpert,
    
    Profile: Profile,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Landing />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/CreateProof" element={<CreateProof />} />
                
                <Route path="/PublicProof" element={<PublicProof />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/AIMentor" element={<AIMentor />} />
                
                <Route path="/Gallery" element={<Gallery />} />
                
                <Route path="/Marketplace" element={<Marketplace />} />
                
                <Route path="/AdminPanel" element={<AdminPanel />} />
                
                <Route path="/MindVaultIPWhitePaper" element={<MindVaultIPWhitePaper />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/WalletSecurity" element={<WalletSecurity />} />
                
                <Route path="/Messages" element={<Messages />} />
                
                <Route path="/Watchlist" element={<Watchlist />} />
                
                <Route path="/ExpertDashboard" element={<ExpertDashboard />} />
                
                <Route path="/ApplyExpert" element={<ApplyExpert />} />
                
                <Route path="/Profile" element={<Profile />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}