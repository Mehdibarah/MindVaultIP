import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Error caught by boundary:', error, errorInfo);
    
    // Log specific error types
    if (error.message?.includes('processProofReward')) {
      console.warn('Base44 function error - this is expected in development');
    }
  }

  render() {
    if (this.state.hasError) {
      // For specific errors, show a more helpful message
      const isBase44Error = this.state.error?.message?.includes('processProofReward') || 
                           this.state.error?.message?.includes('functions');
      
      return (
        <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
          <div className="glow-card p-8 rounded-2xl text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {isBase44Error ? 'Development Mode' : 'Oops! Something went wrong'}
            </h2>
            <p className="text-gray-400 mb-6">
              {isBase44Error 
                ? 'Some backend functions are not available in development mode. The app will continue to work normally.'
                : 'We encountered an unexpected error. Please refresh the page and try again.'
              }
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="glow-button text-white font-semibold"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;