import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { colleges } from '../data/colleges';
import { supabase } from '../utils/supabaseClient'; // Corrected import path
// import { useClipboard } from '../hooks/useClipboard'; // Removed useClipboard hook

type Props = {
  open: boolean;
  onClose: () => void;
  // Optional integrations
  onAuthGoogle?: () => Promise<void>;
  onAuthEmail?: (email: string) => Promise<void>;
  onJoinWaitlist?: (name: string, college: string, authMethod: 'email' | 'google') => Promise<void>;
};

const STORAGE_CONSENT_KEY = 'mm.waitlist.consent';
// const STORAGE_COLLEGE_KEY = 'mm.waitlist.college'; // Removed as no longer needed
const STORAGE_PENDING_NAME = 'mm.pending.name';
const STORAGE_PENDING_COLLEGE = 'mm.pending.college';

const JoinWaitlistModal: React.FC<Props> = ({
  open,
  onClose,
  onAuthGoogle,
  onAuthEmail,
  onJoinWaitlist,
}) => {
  const [step, setStep] = useState(1); // 1: Auth, 2: College, 3: Done
  const [consent, setConsent] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [name, setName] = useState(''); // New state for name
  const [nameError, setNameError] = useState(''); // New state for name error
  const [collegeQuery, setCollegeQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [filteredColleges, setFilteredColleges] = useState<string[]>([]);
  const [authError, setAuthError] = useState<string | null>(null); // New state for auth errors
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New state for success messages
  const [showOtherCollegeInput, setShowOtherCollegeInput] = useState(false); // New state for 'Other' college input
  const [otherCollege, setOtherCollege] = useState(''); // New state for manual 'Other' college entry
  const [loadingGoogle, setLoadingGoogle] = useState(false); // New state for Google auth loading
  const [loadingEmail, setLoadingEmail] = useState(false); // New state for Email auth loading

  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null); // For initial focus
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null); // New ref for name input

  // Default onJoinWaitlist implementation to store data in Supabase profiles table
  const defaultOnJoinWaitlist = async (name: string, college: string, authMethod: 'email' | 'google') => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user for waitlist join (userError):', userError?.message);
    }
    if (!user) {
      console.error('Error getting user for waitlist join (user is null or undefined).');
      throw new Error('User not authenticated or session expired.');
    }

    console.log('User object from supabase.auth.getUser():', user);
    console.log('Data for profiles upsert:', { id: user.id, name, college, email: user.email, provider: authMethod });

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: name,
        college: college,
        email: user.email || '', // Use email from auth.user, provide fallback
        provider: authMethod,
      });

    if (error) {
      console.error('Error inserting into profiles:', error.message);
      throw new Error(`Failed to join waitlist: ${error.message}`);
    }
    console.log('Successfully joined waitlist and updated profile:', data);
  };

  // Load saved state from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_CONSENT_KEY);
    if (savedConsent === 'true') {
      setConsent(true);
    }


    if (open) {
      setStep(1); // Reset to first step when modal opens
      setName('');
      setNameError('');
      setCollegeQuery('');
      setSelectedCollege(null);
      setFilteredColleges([]);
      setShowOtherCollegeInput(false);
      setOtherCollege('');
      setEmail('');
      setEmailError('');
      setAuthError(null);
      setSuccessMessage(null);
      setConsent(false);
      setShowEmailInput(false);
      setLoadingGoogle(false);
      setLoadingEmail(false);

      // Check for pending Google auth data after redirect
      const pendingName = localStorage.getItem(STORAGE_PENDING_NAME);
      const pendingCollege = localStorage.getItem(STORAGE_PENDING_COLLEGE);

      if (open && pendingName && pendingCollege) {
        console.log('Detected pending Google auth data in localStorage.');
      }
    }
  }, [open]);

  // Listen for Supabase auth state changes to directly process sign-ins within the modal
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('JoinWaitlistModal Auth state change detected:', event, session);
      if (open && event === 'SIGNED_IN' && session) {
        // Retrieve pending data from localStorage
        const storedName = localStorage.getItem(STORAGE_PENDING_NAME);
        const storedCollege = localStorage.getItem(STORAGE_PENDING_COLLEGE);

        if (storedName && storedCollege) {
          console.log('User signed in, processing stored data for profile upsert...', { storedName, storedCollege });
          setLoadingGoogle(true); // Assuming Google is the primary trigger for this path
          try {
            await (onJoinWaitlist || defaultOnJoinWaitlist)(storedName, storedCollege, 'google');
            setSuccessMessage('Successfully joined waitlist!');
            setStep(3); // Show confetti page
            localStorage.removeItem(STORAGE_PENDING_NAME); // Clear stored data
            localStorage.removeItem(STORAGE_PENDING_COLLEGE); // Clear stored data
          } catch (err: any) {
            setAuthError(err.message || 'An unknown error occurred after sign-in.');
          } finally {
            setLoadingGoogle(false);
          }
        } else {
          console.warn('User signed in but stored name or college data is missing, cannot upsert profile.');
          // If the modal is open due to a new sign-in, but no pending data,
          // it means it was an email sign-in or a direct sign-in without opening the modal first.
          // In this case, we should still show the confetti if possible.
          if (name && (selectedCollege || otherCollege)) {
            const currentFinalCollege = showOtherCollegeInput ? otherCollege : selectedCollege;
            if (currentFinalCollege) {
              console.log('Email sign-in detected, processing current modal data.');
              setLoadingEmail(true); // Assume email for this path if no pending Google data
              try {
                await (onJoinWaitlist || defaultOnJoinWaitlist)(name, currentFinalCollege, 'email');
                setSuccessMessage('Successfully joined waitlist!');
                setStep(3);
              } catch (err: any) {
                setAuthError(err.message || 'An unknown error occurred after email sign-in.');
              } finally {
                setLoadingEmail(false);
              }
            }
          }
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [open, name, selectedCollege, otherCollege, showOtherCollegeInput, onJoinWaitlist, defaultOnJoinWaitlist, email]); // Added email to dependencies

  // Handle consent checkbox change
  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsent(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem(STORAGE_CONSENT_KEY, 'true');
    } else {
      localStorage.removeItem(STORAGE_CONSENT_KEY);
    }
  };

  // Close modal logic
  const handleClose = useCallback(() => {
    onClose();
    // Reset state when closing
    setTimeout(() => {
      setStep(1);
      setConsent(false);
      setShowEmailInput(false);
      setEmail('');
      setEmailError('');
      setName(''); // Reset name
      setNameError(''); // Reset name error
      setCollegeQuery('');
      setSelectedCollege(null);
      setFilteredColleges([]);
      setAuthError(null); // Reset auth error on close
      setSuccessMessage(null); // Reset success message on close
      setShowOtherCollegeInput(false); // Reset 'Other' college input visibility
      setOtherCollege(''); // Reset 'Other' college value
      setLoadingGoogle(false); // Reset individual loading states
      setLoadingEmail(false);
    }, 300); // Small delay to allow modal close animation
  }, [onClose]); // Removed loading from dependency array

  // A11y: Trap focus inside modal and close on ESC
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
      // Implement focus trap
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!focusableElements.length) return; // No focusable elements

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus on open or focus on email/phone/name input if shown
    if (showEmailInput && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (nameInputRef.current) {
      nameInputRef.current.focus();
    } else {
      initialFocusRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleClose, showEmailInput]); // Removed showPhoneInput to dependencies

  // Handle click outside to close modal
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDialogElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  }, [handleClose]);

  // Mock authentication function - REMOVED
  // New mock phone authentication function
  // const mockAuthPhone = async () => { // Removed as phone auth is no longer used
  //   setLoadingPhone(true); // Use specific loading state
  //   return new Promise<void>((resolve) => {
  //     setTimeout(() => {
  //       setLoadingPhone(false); // Use specific loading state
  //       resolve();
  //     }, 600);
  //   });
  // };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // const validatePhoneNumber = (phone: string) => { // Removed as phone auth is no longer used
  //   // Basic validation: at least 7 digits, optional + and spaces/dashes
  //   return /^\+?\d[\d\s-]{7,}\d$/.test(phone);
  // };

  // Render content based on step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!consent) {
              alert('Please agree to receive early-access updates.');
              return;
            }
            if (!name) {
              setNameError('Please enter your name.');
              return;
            }
            const finalCollege = showOtherCollegeInput ? otherCollege : selectedCollege;
            if (!finalCollege) {
              alert('Please select or enter your college.'); // Using alert for simplicity, could be a dedicated error message
              return;
            }

            // setLoading(true); // Replaced with specific loading states below
            setAuthError(null);
            setSuccessMessage(null);

            try {
              if (showEmailInput && validateEmail(email)) {
                setLoadingEmail(true); // Set specific loading state
             handleClose(); // Close modal immediately after Google sign-in
                await (onJoinWaitlist || defaultOnJoinWaitlist)(name, finalCollege, 'email');
                setSuccessMessage('Successfully joined waitlist with email!');
              } else { // Removed phone authentication condition
                // This case should ideally not be reached if buttons are disabled correctly
                setAuthError('Please sign in with an authentication method.');
                return;
              }
              setStep(3); // Advance to done screen after successful auth and waitlist join
            } catch (err: any) {
              setAuthError(err.message || 'An unknown error occurred during sign-in or waitlist join.');
            } finally {
              setLoadingEmail(false); // Reset specific loading state
              // setLoadingPhone(false); // Removed
              // setLoading(false); // Removed
            }
          }} className="space-y-4">
            <h3 className="text-xl font-semibold" id="jw-title">Join the Waitlist</h3>
            <p className="text-sm text-neutral-600">Get early access to MealMood!</p>

            {authError && <p data-testid="auth-error" className="text-sm text-red-600 text-center">{authError}</p>}
            {successMessage && <p data-testid="success-message" className="text-sm text-green-600 text-center">{successMessage}</p>}

            {/* Name Input */}
            <div className="space-y-1">
              <label htmlFor="name-input" className="sr-only">Name</label>
              <input
                id="name-input"
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                ref={nameInputRef}
                data-testid="name-input"
              />
              {nameError && <p className="text-xs text-red-600">{nameError}</p>}
            </div>

            {/* College Input */}
            <div className="relative space-y-1">
              <label htmlFor="college-search-input" className="sr-only">College</label>
              <input
                id="college-search-input"
                type="text"
                placeholder="Your College"
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                value={collegeQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  setCollegeQuery(query);
                  setSelectedCollege(null);
                  setShowOtherCollegeInput(false); // Hide other input if typing in main search

                  if (query.length > 0) { // Changed from query.length > 1 to query.length > 0
                    const currentColleges = [...colleges, "Other (please specify)"];
                    setFilteredColleges(currentColleges.filter(c =>
                      c.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 6));
                  } else {
                    // When query is empty, show all colleges + "Other"
                    setFilteredColleges([...colleges, "Other (please specify)"]);
                  }
                }}
                onFocus={() => {
                  // Show all colleges and "Other" when input is focused and empty
                  if (!collegeQuery && filteredColleges.length === 0) {
                    setFilteredColleges([...colleges, "Other (please specify)"]);
                  }
                }}
                onBlur={() => {
                  // Hide suggestions after a short delay to allow click on list item
                  setTimeout(() => {
                    setFilteredColleges([]);
                    // If "Other" was selected and no custom college entered, reset
                    if (selectedCollege === "Other" && !otherCollege) {
                      setSelectedCollege(null);
                      setShowOtherCollegeInput(false);
                      setCollegeQuery('');
                    }
                  }, 200);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredColleges.length > 0) {
                    const selected = filteredColleges[0];
                    if (selected === "Other (please specify)") {
                      setShowOtherCollegeInput(true);
                      setCollegeQuery("Other (please specify)"); // Fill the main input with "Other (please specify)"
                      setSelectedCollege("Other"); // Set to "Other" string
                      setFilteredColleges([]);
                    } else {
                      setSelectedCollege(selected);
                      setCollegeQuery(selected);
                      setFilteredColleges([]);
                    }
                    e.preventDefault();
                  }
                }}
                data-testid="college-input"
                aria-autocomplete="list"
                aria-controls="college-suggestions"
                autoComplete="off"
              />
              {filteredColleges.length > 0 && (
                <ul id="college-suggestions" role="listbox" className="absolute z-10 w-full bg-white border border-neutral-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                  {filteredColleges.map((college, idx) => (
                    <li
                      key={idx}
                      role="option"
                      aria-selected={selectedCollege === college}
                      className="px-3 py-2 hover:bg-neutral-100 cursor-pointer rounded-lg"
                      onClick={() => {
                        if (college === "Other (please specify)") {
                          setShowOtherCollegeInput(true);
                          setCollegeQuery("Other (please specify)"); // Fill the main input with "Other (please specify)"
                          setSelectedCollege("Other"); // Set to "Other" string
                          setFilteredColleges([]);
                        } else {
                          setSelectedCollege(college);
                          setCollegeQuery(college);
                          setFilteredColleges([]);
                        }
                      }}
                    >
                      {college}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Other College Input (conditional) */}
            {showOtherCollegeInput && (
              <div className="space-y-1 mt-4">
                <label htmlFor="other-college-input" className="sr-only">Specify your college</label>
                <input
                  id="other-college-input"
                  type="text"
                  placeholder="e.g., University of Mumbai"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  value={otherCollege}
                  onChange={(e) => setOtherCollege(e.target.value)}
                  data-testid="other-college-input"
                />
              </div>
            )}

            {/* Google Button */}
            <button
              data-testid="btn-google"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 border border-neutral-200 bg-white text-neutral-800 rounded-full font-bold transition-all ${!consent || loadingGoogle || loadingEmail || !name || (selectedCollege === "Other" && !otherCollege) || (!selectedCollege && !otherCollege) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-100'}`}
              onClick={async () => {
                if (!consent) {
                  alert('Please agree to receive early-access updates.');
                  return;
                }
                if (!name) {
                  setNameError('Please enter your name.');
                  return;
                }
                const finalCollege = selectedCollege === "Other" ? otherCollege : selectedCollege;
                if (!finalCollege) {
                  alert('Please select or enter your college.');
                  return;
                }

                // Store name and college in localStorage before redirect
                localStorage.setItem(STORAGE_PENDING_NAME, name);
                localStorage.setItem(STORAGE_PENDING_COLLEGE, finalCollege);

                setLoadingGoogle(true); // Set specific loading state for Google
                setAuthError(null); // Clear previous errors
                setSuccessMessage(null); // Clear previous success messages
                try {
                  await (onAuthGoogle ? onAuthGoogle() : Promise.resolve()); // Use onAuthGoogle or resolve immediately
                  // The actual joinWaitlist and setStep(3) will happen in the onAuthStateChange listener
                  // after the Google redirect and successful sign-in.
                  // No need to call onJoinWaitlist directly here.
                  // If onAuthGoogle doesn't redirect, we need a fallback here or handle it in onAuthGoogle.
                } catch (err: any) {
                  setAuthError(err.message || 'An unknown error occurred during Google sign-in.');
                  setLoadingGoogle(false); // Reset loading on error if no redirect happened
                  localStorage.removeItem(STORAGE_PENDING_NAME);
                  localStorage.removeItem(STORAGE_PENDING_COLLEGE);
                }
              }}
              disabled={!consent || loadingGoogle || loadingEmail || !name || (selectedCollege === "Other" && !otherCollege) || (!selectedCollege && !otherCollege)}
              ref={initialFocusRef}
              type="button"
            >
              {(loadingGoogle && onAuthGoogle) ? <Loader2 size={20} className="mr-2 animate-spin" /> : null}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.0001 4.5V11.9997H19.5001C19.5001 16.0357 16.6831 19.5003 12.0001 19.5003C7.6111 19.5003 4.0001 15.8893 4.0001 11.5C4.0001 7.11074 7.6111 3.5 12.0001 3.5C14.3891 3.5 16.3471 4.30612 17.7811 5.67137L20.4851 2.96737C18.6731 1.25937 16.3881 0.5 12.0001 0.5C5.9251 0.5 0.816101 5.37875 0.500101 11.5C0.184101 17.6212 5.06285 22.5 11.5001 22.5C17.5751 22.5 22.6841 17.6212 22.5001 11.5V11.5H12.0001V4.5Z" fill="#4285F4"/>
                <path d="M22.5 11.5H19.5V11.5H12.0V14.5H19.5C19.5 15.825 19.0125 17.075 18.175 18.05L20.485 20.359C21.791 19.068 22.5 17.375 22.5 15.5V11.5Z" fill="#34A853"/>
                <path d="M12 22.5C15.65 22.5 18.775 20.738 20.485 18.05L18.175 15.741C17.019 16.738 15.619 17.5 12 17.5C8.381 17.5 5.262 15.738 3.553 13.05L1.244 15.359C3.12 18.309 7.281 20.5 12 20.5C15.65 20.5 18.775 18.738 20.485 15.741V11.5H12V22.5Z" fill="#FBBC05"/>
                <path d="M12 0.5C15.65 0.5 18.775 2.262 20.485 4.952L18.175 7.261C17.019 6.262 15.619 5.5 12 5.5C8.381 5.5 5.262 7.262 3.553 9.952L1.244 7.643C3.12 4.692 7.281 2.5 12 2.5C15.65 2.5 18.775 4.262 20.485 7.261V11.5H12V0.5Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            {/* Email Button */}
            <button
              data-testid="btn-email"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#D9534F] text-white rounded-full font-bold transition-all ${!consent || loadingGoogle || loadingEmail || !name || (selectedCollege === "Other" && !otherCollege) || (!selectedCollege && !otherCollege) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#C9302C]'}`}
              onClick={() => { if (consent && !loadingGoogle && !loadingEmail && name && (selectedCollege || otherCollege)) { setShowEmailInput(true); setEmailError(''); setAuthError(null); setSuccessMessage(null); } }}
              disabled={!consent || loadingGoogle || loadingEmail || !name || (selectedCollege === "Other" && !otherCollege) || (!selectedCollege && !otherCollege)}
              type="button"
            >
              <Mail size={20} />
              Sign in with email
            </button>

            {/* Phone Button - REMOVED */}
            {/* <button
              data-testid="btn-phone"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#5CB85C] text-white rounded-full font-bold transition-all ${!consent || loadingGoogle || loadingEmail || loadingPhone || !name || (selectedCollege === "Other" && !otherCollege) || (!selectedCollege && !otherCollege) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4CAE4C]'}`}
              onClick={() => { if (consent && !loadingGoogle && !loadingEmail && !loadingPhone && name && (selectedCollege || otherCollege)) { setShowPhoneInput(true); setShowEmailInput(false); setPhoneNumberError(''); setAuthError(null); setSuccessMessage(null); } }}
              disabled={!consent || loadingGoogle || loadingEmail || loadingPhone || !name || (selectedCollege === "Other" && !otherCollege) || (!selectedCollege && !otherCollege)}
              type="button"
            >
              <Phone size={20} />
              Sign in with phone
            </button> */}

            {/* Email Input (conditional) */}
            <div className={`transition-all duration-200 ease-out overflow-hidden ${showEmailInput ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              {showEmailInput && (
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    ref={emailInputRef}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const finalCollege = selectedCollege === "Other" ? otherCollege : selectedCollege;
                        if (consent && validateEmail(email) && name && finalCollege) {
                          setLoadingEmail(true); // Use specific loading state
                          setAuthError(null); // Clear previous errors
                          setSuccessMessage(null); // Clear previous success messages
                          try {
                            await (onAuthEmail ? onAuthEmail(email) : Promise.resolve());
                            await (onJoinWaitlist || defaultOnJoinWaitlist)(name, finalCollege, 'email');
                            setSuccessMessage('Successfully joined waitlist with email!');
                            setStep(3); // Advance to done screen after successful auth and waitlist join
                          } catch (err: any) {
                            setEmailError(err.message || 'An unknown error occurred during email sign-in or waitlist join.');
                          } finally {
                            setLoadingEmail(false); // Reset specific loading state
                          }
                        } else if (!validateEmail(email)) {
                          setEmailError('Please enter a valid email address.');
                        } else if (!name) {
                          setNameError('Please enter your name.');
                        } else if (!finalCollege) {
                          alert('Please select or enter your college.');
                        }
                      }
                    }}
                  />
                  {emailError && <p className="text-xs text-red-600">{emailError}</p>}
                  <button
                    className={`w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-full font-bold transition-all ${!email || !validateEmail(email) || loadingGoogle || loadingEmail || !name || (selectedCollege === "Other" && !otherCollege) || (!selectedCollege && !otherCollege) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    onClick={async () => {
                      const finalCollege = selectedCollege === "Other" ? otherCollege : selectedCollege;
                      if (!email || !validateEmail(email) || loadingGoogle || loadingEmail || !name || !finalCollege) {
                        if (!validateEmail(email)) setEmailError('Please enter a valid email address.');
                        if (!name) setNameError('Please enter your name.');
                        if (!finalCollege) alert('Please select or enter your college.');
                        return;
                      }
                      setLoadingEmail(true); // Use specific loading state
                      setAuthError(null); // Clear previous errors
                      setSuccessMessage(null); // Clear previous success messages
                      try {
                        await (onAuthEmail ? onAuthEmail(email) : Promise.resolve()); // Use onAuthEmail or resolve immediately
                        await (onJoinWaitlist || defaultOnJoinWaitlist)(name, finalCollege, 'email');
                        setSuccessMessage('Successfully joined waitlist with email!');
                        setStep(3); // Advance to done screen after successful auth and waitlist join
                      } catch (err: any) {
                        setEmailError(err.message || 'An unknown error occurred during email sign-in or waitlist join.');
                      } finally {
                        setLoadingEmail(false); // Reset specific loading state
                      }
                    }}
                    disabled={!email || !validateEmail(email) || loadingGoogle || loadingEmail || !name || (selectedCollege === "Other" && !otherCollege) || (!selectedCollege && !otherCollege)}
                    type="button"
                  >
                    {(loadingEmail && showEmailInput) ? <Loader2 size={20} className="mr-2 animate-spin" /> : null}
                    Continue
                  </button>
                </div>
              )}
            </div>

            {/* Consent Checkbox */}
            <label data-testid="consent-checkbox" className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={consent}
                onChange={handleConsentChange}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              I agree to receive early-access updates from MealMood.
            </label>
          </form>
        );
      case 3:
        return (
          <div className="space-y-4 text-center p-4">
            <div className="confetti-container">
              {Array.from({ length: 50 }).map((_, i) => {
                const duration = `${2 + Math.random() * 3}s`;
                const delay = `${Math.random() * 2}s`;
                const size = `${5 + Math.random() * 10}px`;
                const color = [`#FFC0CB`, `#FFD700`, `#ADFF2F`, `#87CEEB`, `#DA70D6`][Math.floor(Math.random() * 5)];
                const left = `${Math.random() * 100}%`;
                const top = `${Math.random() * 100}%`;
                const rotationStart = `${Math.random() * 360}deg`;
                const rotationEnd = `${360 + Math.random() * 720}deg`;
                const borderRadius = Math.random() > 0.5 ? '50%' : '0%'; // Randomly make some circles, some squares
                return (
                  <div
                    key={i}
                    className="confetti"
                    style={{
                      '--duration': duration,
                      '--delay': delay,
                      '--size': size,
                      '--color': color,
                      '--left': left,
                      '--top': top,
                      '--rotation-start': rotationStart,
                      '--rotation-end': rotationEnd,
                      '--border-radius': borderRadius,
                    } as React.CSSProperties}
                  ></div>
                );
              })}
            </div>
            <CheckCircle2 size={48} className="text-[#00C896] mx-auto mb-4 animate-bounce" />
            <h3 className="text-3xl font-bold text-orange-600 mb-2">Welcome to the MealMood Family!</h3>
            <p className="text-base text-neutral-700 leading-relaxed">
              You&apos;re officially on the list! Get ready to explore a world where delicious food meets delightful moods. 
              We&apos;ll notify you with exclusive early access and updates when MealMood is live.
            </p>
            <p className="text-sm text-neutral-500 mt-4">Keep an eye on your inbox! 🧡</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <dialog
      role="dialog"
      aria-modal="true"
      aria-labelledby="jw-title"
      open={open}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white shadow-xl rounded-2xl w-full max-w-sm md:max-w-md p-5 md:p-6 relative transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
          aria-label="Close waitlist modal"
          type="button"
        >
          <X size={20} />
        </button>
        {renderStepContent()}
      </div>
    </dialog>
  );
};

export default JoinWaitlistModal;
