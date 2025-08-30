import React, { useEffect } from 'react';
import { supabase } from '/src/utils/supabaseClient';

const AuthCallback: React.FC = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check for Supabase session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // User is authenticated, redirect to the home page or dashboard
        window.location.href = '/'; 
      } else {
        // Handle cases where no session is found (e.g., error, or user closed popup)
        // You might want to show an error message or redirect to a login page
        console.error('No Supabase session found after callback.');
        window.location.href = '/'; // Redirect to home even on error for now
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF7EB]">
      <p className="text-lg font-semibold">Loading authentication...</p>
    </div>
  );
};

export default AuthCallback;

