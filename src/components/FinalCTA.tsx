import React from 'react';
import { Clock } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#FF5722]/10 via-[#FFF7EB] to-[#FF5DA2]/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black font-sans">
            Food &gt; Exams.
          </h2>
          <br />
          <span className="text-[#FF5722]">Get it in 5 seconds.</span>
        </div>
        
        <p className="text-xl md:text-2xl text-[#1C1C1C]/80 mb-8 leading-relaxed">
          Only <span className="font-bold text-[#FF5722]">100 free beta spots</span> left. 
          Don't miss out while your friends save time.
        </p>

        <button className="bg-[#FF5722] hover:bg-[#FF5DA2] text-white font-bold text-xl px-10 py-5 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-gentle mb-6 uppercase tracking-wide">
          Join the Waitlist 🚀
        </button>

        <div className="flex items-center justify-center gap-2 text-[#00C896] font-semibold">
          <span className="text-2xl">🔒</span>
          Free forever in beta
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-[#1C1C1C]/60">
          <Clock size={16} />
          <span>Limited time offer • Join 500+ students already waitlisted</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;