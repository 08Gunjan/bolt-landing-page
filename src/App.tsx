import React, { useState } from 'react';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import FoodThirst from './components/FoodThirst';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import JoinWaitlistModal from './components/JoinWaitlistModal';
import JoinSuccessGate from './components/JoinSuccessGate';
import { supabase } from '/src/utils/supabaseClient';
import { signInWithGoogle, signInWithEmail } from '/src/utils/auth';

function App() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  // console.log('Supabase client:', supabase);

  return (
    <div className="bg-[#FFF7EB] text-[#1C1C1C] font-['Inter'] overflow-x-hidden">
      <Hero onJoinWaitlistClick={() => setIsWaitlistModalOpen(true)} />
      <ProblemSolution />
      <Features />
      <FoodThirst />
      <Testimonials />
      <FinalCTA onJoinWaitlistClick={() => setIsWaitlistModalOpen(true)} />
      <Footer />
      <JoinWaitlistModal
        open={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
        onAuthGoogle={signInWithGoogle}
        onAuthEmail={signInWithEmail}
      />
      <JoinSuccessGate />
    </div>
  );
}

export default App;