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
                }, { onConflict: 'id' });
import { supabase } from '../lib/supabase';
              if (error && !error.message.includes('duplicate') && !error.message.includes('unique')) {
                console.error('Error completing waitlist join:', error.message);
              } else {
                console.log('Successfully completed waitlist join:', data);
                markJoinSuccess();
              }
    const handleAuthCallback = async () => {
              // Clear pending data
              localStorage.removeItem('mm.pending.name');
              localStorage.removeItem('mm.pending.college');
            } catch (err) {
              console.error('Error during waitlist completion:', err);
            }
          console.error('Auth exchange error:', exchangeError.message);
          window.location.href = '/';
          return;
        }
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }

        // Get redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        // Get redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || '/';
        
        // Redirect to intended destination
        window.location.href = redirectTo;
      } catch (err) {
        console.error('Auth callback error:', err);
        window.location.href = '/';
      }
    };

    handleAuthCallback();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF7EB]">
        <div className="text-center p-6">
          <p className="text-lg font-semibold text-red-600 mb-4">Authentication Error</p>
          <p className="text-gray-600">{error}</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to home
          </a>
        // Get session after exchange
        </div>
        const { data: { session } } = await supabase.auth.getSession();
          if (pendingName && pendingCollege) {
  return (
      <p className="text-lg font-semibold">Processing authentication...</p>