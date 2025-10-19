import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Feature Guard Component
// Redirects users away from disabled features
export function FeatureGuard({ feature, children, fallbackPath = '/' }) {
  if (!feature) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glow-card p-8 rounded-2xl text-center max-w-md"
        >
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Feature Unavailable
          </h2>
          <p className="text-gray-400 mb-6">
            This feature is currently disabled. Please check back later or contact support if you believe this is an error.
          </p>
          <Button
            onClick={() => window.location.href = fallbackPath}
            className="glow-button text-white font-semibold"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return children;
}

// Higher-order component for feature protection
export function withFeatureGuard(feature, fallbackPath = '/') {
  return function FeatureGuardedComponent(Component) {
    return function GuardedComponent(props) {
      if (!feature) {
        return <Navigate to={fallbackPath} replace />;
      }
      return <Component {...props} />;
    };
  };
}

// Route guard hook
export function useFeatureGuard(feature, fallbackPath = '/') {
  if (!feature) {
    return <Navigate to={fallbackPath} replace />;
  }
  return null;
}
