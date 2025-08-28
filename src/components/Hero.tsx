import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5DA2]/10 via-transparent to-[#7B61FF]/10"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Social Proof Badge */}
        <div className={`inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full mb-8 shadow-lg border border-[#FF5DA2]/20 transform transition-all duration-1000 ${isVisible ? 'animate-wiggle' : ''}`}>
          <span className="text-xl">🔥</span>
          <span className="text-sm font-bold text-[#1C1C1C] uppercase tracking-wide">
            70 students joined this week
          </span>
          <div className="flex -space-x-1">
            <div className="w-4 h-4 bg-gradient-to-r from-[#FF5722] to-[#FF5DA2] rounded-full border border-white"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-[#00C896] to-[#7B61FF] rounded-full border border-white"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-[#7B61FF] to-[#FF5722] rounded-full border border-white"></div>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
          <span className="font-['Poppins'] bg-gradient-to-r from-[#1C1C1C] via-[#FF5722] to-[#1C1C1C] bg-clip-text text-transparent">
            No bae? No problem.
          </span>
          <br />
          <span className="font-['Poppins'] text-[#1C1C1C]">
            MealMood feeds your vibe.
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-[#1C1C1C]/80">
          Not a delivery app. A <span className="font-bold text-[#FF5722]">mood-first food guide</span> → 
          Recipe, Swiggy/Zomato shortcut, or dineout idea.
        </p>

        {/* CTA Button */}
        <button className="bg-[#FF5722] hover:bg-[#FF5DA2] text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 animate-pulse-gentle mb-6 uppercase tracking-wide">
          Join the Waitlist 🚀
        </button>

        {/* Trust Line */}
        <p className="text-[#00C896] font-semibold flex items-center justify-center gap-2">
          <span className="text-xl">✅</span>
          100% Free Beta – No Credit Card Required
        </p>
      </div>
    </section>
  );
};

export default Hero;