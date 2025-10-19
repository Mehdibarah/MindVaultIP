// Feature flags for MindVaultIP
// This allows us to easily enable/disable features without code changes

// AI Mentor feature flag
export const FEATURE_AI_MENTOR = import.meta.env.VITE_FEATURE_AI_MENTOR === "true";

// Messages feature flag  
export const FEATURE_MESSAGES = import.meta.env.VITE_FEATURE_MESSAGES === "true";

// Marketplace feature flag
export const FEATURE_MARKETPLACE = import.meta.env.VITE_FEATURE_MARKETPLACE === "true";

// Expert Dashboard feature flag
export const FEATURE_EXPERT_DASHBOARD = import.meta.env.VITE_FEATURE_EXPERT_DASHBOARD === "true";

// Admin Panel feature flag
export const FEATURE_ADMIN_PANEL = import.meta.env.VITE_FEATURE_ADMIN_PANEL === "true";

// All feature flags for easy iteration
export const FEATURE_FLAGS = {
  AI_MENTOR: FEATURE_AI_MENTOR,
  MESSAGES: FEATURE_MESSAGES,
  MARKETPLACE: FEATURE_MARKETPLACE,
  EXPERT_DASHBOARD: FEATURE_EXPERT_DASHBOARD,
  ADMIN_PANEL: FEATURE_ADMIN_PANEL,
};

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (featureName) => {
  return FEATURE_FLAGS[featureName] || false;
};

// Helper function to get all enabled features
export const getEnabledFeatures = () => {
  return Object.keys(FEATURE_FLAGS).filter(key => FEATURE_FLAGS[key]);
};

// Helper function to get all disabled features
export const getDisabledFeatures = () => {
  return Object.keys(FEATURE_FLAGS).filter(key => !FEATURE_FLAGS[key]);
};

// Debug function to log feature flag status
export const logFeatureFlags = () => {
  console.log('🚩 Feature Flags Status:');
  Object.entries(FEATURE_FLAGS).forEach(([name, enabled]) => {
    console.log(`  ${enabled ? '✅' : '❌'} ${name}: ${enabled}`);
  });
  console.log(`📊 Enabled: ${getEnabledFeatures().length}, Disabled: ${getDisabledFeatures().length}`);
};
