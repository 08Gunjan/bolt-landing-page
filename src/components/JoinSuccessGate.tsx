import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { shouldShowJoinSuccess, clearJoinSuccess } from '../lib/joinSuccess';

const JoinSuccessGate: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if we should show the success modal
    if (shouldShowJoinSuccess()) {
      setShowModal(true);
      
      // Fire confetti after a short delay
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Fire more confetti bursts
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
        }, 200);
        
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 400);
      }, 300);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    clearJoinSuccess();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
          aria-label="Close success modal"
        >
          <X size={20} />
        </button>
        
        <div className="text-center space-y-4">
          <CheckCircle2 size={48} className="text-[#00C896] mx-auto animate-bounce" />
          <h3 className="text-2xl font-bold text-[#FF5722]">
            Welcome to the MealMood Family!
          </h3>
          <p className="text-gray-700 leading-relaxed">
            You're on the list! We'll email you early-access updates when MealMood is live.
          </p>
          <button
            onClick={handleClose}
            className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinSuccessGate;