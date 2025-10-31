import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function ToastDismisser() {
  const location = useLocation();
  const { dismissAll } = useToast();

  useEffect(() => {
    // Dismiss all toasts on route change
    dismissAll();
  }, [location.pathname]);

  return null; // This component doesn't render anything
}
