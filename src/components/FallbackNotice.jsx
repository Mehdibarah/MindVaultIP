import React from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

const FallbackNotice = ({ 
  title = "Feature Not Available", 
  details = "This feature is currently under development.",
  type = "info" // "info", "error", "warning", "offline"
}) => {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-8 h-8 text-red-400" />;
      case "warning":
        return <AlertCircle className="w-8 h-8 text-yellow-400" />;
      case "offline":
        return <WifiOff className="w-8 h-8 text-gray-400" />;
      default:
        return <Wifi className="w-8 h-8 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "error":
        return "bg-red-900/20 border-red-500/30";
      case "warning":
        return "bg-yellow-900/20 border-yellow-500/30";
      case "offline":
        return "bg-gray-900/20 border-gray-500/30";
      default:
        return "bg-blue-900/20 border-blue-500/30";
    }
  };

  return (
    <div className={`min-h-[400px] flex items-center justify-center p-8`}>
      <div className={`max-w-md mx-auto text-center p-8 rounded-xl border backdrop-blur-sm ${getBgColor()}`}>
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {details}
        </p>
      </div>
    </div>
  );
};

export default FallbackNotice;
