


export function createPageUrl(pageName: string) {
    // Map page names to their actual routes
    const pageRouteMap: { [key: string]: string } = {
        'Landing': '/',
        'Dashboard': '/dashboard',
        'CreateProof': '/createproof',
        'Gallery': '/gallery',
        'Watchlist': '/watchlist',
        'Profile': '/profile',
        'ExpertDashboard': '/expertdashboard',
        'Messages': '/messages',
        'AIMentor': '/aimentor',
        'Marketplace': '/marketplace',
        'WalletSecurity': '/walletsecurity',
        'AdminPanel': '/adminpanel',
        'MultimindAwards': '/multimindawards',
        'NewAward': '/multimindawards/new',
        'Chat': '/chat',
        'TermsOfService': '/termsofservice',
        'PrivacyPolicy': '/privacypolicy',
        'ApplyExpert': '/applyexpert',
        'Signup': '/signup',
        'WhitePaper': '/whitepaper'
    };
    
    // Return mapped route or fallback to lowercase conversion
    return pageRouteMap[pageName] || '/' + pageName.toLowerCase().replace(/ /g, '-');
}