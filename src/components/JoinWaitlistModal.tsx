import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader2, CheckCircle2, Copy, Mail, Phone } from 'lucide-react';
import { colleges } from '../data/colleges';
import { buildReferralLink, getMockPosition } from '../utils/referral';
import { useClipboard } from '../hooks/useClipboard';

type Props = {
  open: boolean;
  onClose: () => void;
  // Optional integrations
  onAuthGoogle?: () => Promise<void>;
  onAuthEmail?: (email: string) => Promise<void>;
  onAuthPhone?: (phoneNumber: string) => Promise<void>; // New prop for phone auth
  getPosition?: () => Promise<number>;
  buildReferralLink?: (userId?: string) => string;
};

const STORAGE_CONSENT_KEY = 'mm.waitlist.consent';
const STORAGE_COLLEGE_KEY = 'mm.waitlist.college';

const JoinWaitlistModal: React.FC<Props> = ({
  open,
  onClose,
  onAuthGoogle,
  onAuthEmail,
  onAuthPhone, // Destructure new prop
  getPosition: getPositionProp,
  buildReferralLink: buildReferralLinkProp,
}) => {
  const [step, setStep] = useState(1); // 1: Auth, 2: College, 3: Done
  const [consent, setConsent] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false); // New state
  const [phoneNumber, setPhoneNumber] = useState(''); // New state
  const [phoneNumberError, setPhoneNumberError] = useState(''); // New state
  const [collegeQuery, setCollegeQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [filteredColleges, setFilteredColleges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [referralLink, setReferralLink] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null); // For initial focus
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null); // New ref for phone input

  const { isCopied, copyError, copyToClipboard } = useClipboard();

  // Load saved state from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_CONSENT_KEY);
    const savedCollege = localStorage.getItem(STORAGE_COLLEGE_KEY);
    if (savedConsent === 'true') {
      setConsent(true);
      if (savedCollege) {
        setSelectedCollege(savedCollege);
        setStep(3); // If already consented and has college, go to done screen
      }
    }
  }, [open]);

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
    if (!loading) {
      onClose();
      // Reset state when closing
      setTimeout(() => {
        setStep(1);
        setConsent(false);
        setShowEmailInput(false);
        setEmail('');
        setEmailError('');
        setShowPhoneInput(false); // Reset new state
        setPhoneNumber(''); // Reset new state
        setPhoneNumberError(''); // Reset new state
        setCollegeQuery('');
        setSelectedCollege(null);
        setFilteredColleges([]);
        setLoading(false);
        setPosition(null);
        setReferralLink('');
      }, 300); // Small delay to allow modal close animation
    }
  }, [onClose, loading]);

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

    // Initial focus on open or focus on email/phone input if shown
    if (showEmailInput && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (showPhoneInput && phoneInputRef.current) {
      phoneInputRef.current.focus();
    } else {
      initialFocusRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleClose, showEmailInput, showPhoneInput]); // Add showPhoneInput to dependencies

  // Handle click outside to close modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  // Mock authentication function
  const mockAuth = async () => {
    setLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 600);
    });
  };

  // New mock phone authentication function
  const mockAuthPhone = async () => {
    setLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 600);
    });
  };

  // Mock get position function
  const mockGetPosition = async (): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockPosition());
      }, 600);
    });
  };

  // Mock build referral link function
  const mockBuildReferralLink = (userId?: string): string => {
    // Use the prop function if provided, otherwise use the utility function
    return buildReferralLinkProp?.(userId) ?? buildReferralLink(userId);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic validation: at least 7 digits, optional + and spaces/dashes
    return /^\+?\d[\d\s-]{7,}\d$/.test(phone);
  };

  // Render content based on step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (showEmailInput && consent && validateEmail(email)) {
              (onAuthEmail ? onAuthEmail(email) : mockAuth()).then(() => setStep(2));
            } else if (showPhoneInput && consent && validatePhoneNumber(phoneNumber)) {
              (onAuthPhone ? onAuthPhone(phoneNumber) : mockAuthPhone()).then(() => setStep(2));
            }
          }} className="space-y-4">
            <h3 className="text-xl font-semibold" id="jw-title">Join the Waitlist</h3>
            <p className="text-sm text-neutral-600">Get early access to MealMood!</p>

            {/* Google Button */}
            <button
              data-testid="btn-google"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 border border-neutral-200 bg-white text-neutral-800 rounded-full font-bold transition-all ${!consent || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-100'}`}
              onClick={async () => {
                if (!consent || loading) return;
                setLoading(true);
                await (onAuthGoogle ? onAuthGoogle() : mockAuth());
                setLoading(false);
                setStep(2);
              }}
              disabled={!consent || loading}
              ref={initialFocusRef}
              type="button"
            >
              {/* Google icon SVG */}
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
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#D9534F] text-white rounded-full font-bold transition-all ${!consent || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#C9302C]'}`}
              onClick={() => { if (consent && !loading) { setShowEmailInput(true); setShowPhoneInput(false); setEmailError(''); } }}
              disabled={!consent || loading}
              type="button"
            >
              <Mail size={20} />
              Sign in with email
            </button>

            {/* Phone Button */}
            <button
              data-testid="btn-phone"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#5CB85C] text-white rounded-full font-bold transition-all ${!consent || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4CAE4C]'}`}
              onClick={() => { if (consent && !loading) { setShowPhoneInput(true); setShowEmailInput(false); setPhoneNumberError(''); } }}
              disabled={!consent || loading}
              type="button"
            >
              <Phone size={20} />
              Sign in with phone
            </button>

            {/* Email Input (conditional) */}
            <div className={`transition-all duration-200 ease-out overflow-hidden ${showEmailInput ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (consent && validateEmail(email)) {
                          (onAuthEmail ? onAuthEmail(email) : mockAuth()).then(() => setStep(2));
                        } else if (!validateEmail(email)) {
                          setEmailError('Please enter a valid email address.');
                        }
                      }
                    }}
                  />
                  {emailError && <p className="text-xs text-red-600">{emailError}</p>}
                  <button
                    className={`w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-full font-bold transition-all ${!email || !validateEmail(email) || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    onClick={async () => {
                      if (!email || !validateEmail(email) || loading) {
                        if (!validateEmail(email)) setEmailError('Please enter a valid email address.');
                        return;
                      }
                      setLoading(true);
                      await (onAuthEmail ? onAuthEmail(email) : mockAuth());
                      setLoading(false);
                      setStep(2);
                    }}
                    disabled={!email || !validateEmail(email) || loading}
                    type="button"
                  >
                    {loading && !onAuthGoogle ? <Loader2 size={20} className="animate-spin" /> : null}
                    Continue
                  </button>
                </div>
              )}
            </div>

            {/* Phone Input (conditional) */}
            <div className={`transition-all duration-200 ease-out overflow-hidden ${showPhoneInput ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              {showPhoneInput && (
                <div className="space-y-4">
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setPhoneNumberError('');
                    }}
                    ref={phoneInputRef}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (consent && validatePhoneNumber(phoneNumber)) {
                          (onAuthPhone ? onAuthPhone(phoneNumber) : mockAuthPhone()).then(() => setStep(2));
                        } else if (!validatePhoneNumber(phoneNumber)) {
                          setPhoneNumberError('Please enter a valid phone number.');
                        }
                      }
                    }}
                  />
                  {phoneNumberError && <p className="text-xs text-red-600">{phoneNumberError}</p>}
                  <button
                    className={`w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-full font-bold transition-all ${!phoneNumber || !validatePhoneNumber(phoneNumber) || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                    onClick={async () => {
                      if (!phoneNumber || !validatePhoneNumber(phoneNumber) || loading) {
                        if (!validatePhoneNumber(phoneNumber)) setPhoneNumberError('Please enter a valid phone number.');
                        return;
                      }
                      setLoading(true);
                      await (onAuthPhone ? onAuthPhone(phoneNumber) : mockAuthPhone());
                      setLoading(false);
                      setStep(2);
                    }}
                    disabled={!phoneNumber || !validatePhoneNumber(phoneNumber) || loading}
                    type="button"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : null}
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
      case 2:
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (selectedCollege && !loading) {
              setLoading(true);
              (getPositionProp ? getPositionProp() : mockGetPosition()).then(pos => {
                setPosition(pos);
                setReferralLink(mockBuildReferralLink(`mm${pos}`));
                setLoading(false);
                setStep(3);
                localStorage.setItem(STORAGE_COLLEGE_KEY, selectedCollege);
              });
            }
          }} className="space-y-4">
            <h3 className="text-xl font-semibold">College</h3>
            <p className="text-sm text-neutral-600">Start typing your college…</p>

            {/* College Type-ahead Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Start typing your college…"
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                value={collegeQuery}
                onChange={(e) => {
                  setCollegeQuery(e.target.value);
                  if (e.target.value.length > 1) {
                    setFilteredColleges(colleges.filter(c =>
                      c.toLowerCase().includes(e.target.value.toLowerCase())
                    ).slice(0, 6));
                  } else {
                    setFilteredColleges([]);
                  }
                  setSelectedCollege(null); // Deselect if query changes
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredColleges.length > 0) {
                    setSelectedCollege(filteredColleges[0]);
                    setCollegeQuery(filteredColleges[0]);
                    setFilteredColleges([]);
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
                        setSelectedCollege(college);
                        setCollegeQuery(college);
                        setFilteredColleges([]);
                      }}
                    >
                      {college}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className={`w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3 rounded-full font-bold transition-all ${!selectedCollege || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              disabled={!selectedCollege || loading}
              data-testid="btn-continue-college"
              type="submit"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              Continue
            </button>
          </form>
        );
      case 3:
        return (
          <div className="space-y-4 text-center">
            <CheckCircle2 size={48} className="text-[#00C896] mx-auto mb-4" />
            <h3 className="text-xl font-semibold">🎉 You&apos;re in! #{position}</h3>
            <p className="text-sm text-neutral-600">Share this link to move up the list.</p>
            
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-neutral-300 bg-neutral-50 outline-none text-sm"
                data-testid="referral-link-input"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full transition-all hover:opacity-90"
                onClick={() => copyToClipboard(referralLink)}
                data-testid="btn-copy-referral"
                aria-label="Copy referral link"
                type="button"
              >
                {isCopied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              </button>
            </div>
            {isCopied && <p className="text-xs text-green-600">Link copied!</p>}
            {copyError && <p className="text-xs text-red-600">Failed to copy link.</p>}
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
