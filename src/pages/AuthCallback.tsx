import React, { useEffect } from 'react';
import { supabase } from '/src/utils/supabaseClient';
import { markJoinSuccess } from '../lib/joinSuccess';

const AuthCallback: React.FC = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check for Supabase session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Check for pending waitlist data
        const pendingName = localStorage.getItem('mm.pending.name');
        const pendingCollege = localStorage.getItem('mm.pending.college');
        
        if (pendingName && pendingCollege) {
          try {
            // Complete the waitlist join now that user is authenticated
            const { data, error } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                name: pendingName,
                college: pendingCollege,
                email: session.user.email || '',
                provider: 'email',
              });

            if (error) {
              console.error('Error completing waitlist join:', error.message);
            } else {
              console.log('Successfully completed waitlist join:', data);
              markJoinSuccess();
            }
            
            // Clear pending data
            localStorage.removeItem('mm.pending.name');
            localStorage.removeItem('mm.pending.college');
          } catch (err) {
            console.error('Error during waitlist completion:', err);
          }
        }
        
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

