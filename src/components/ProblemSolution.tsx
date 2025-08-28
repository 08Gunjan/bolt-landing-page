import React from 'react';
import { Clock, Target } from 'lucide-react';

const ProblemSolution = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Problem */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-red-100 px-6 py-3 rounded-full mb-6">
            <Clock className="text-red-500" size={24} />
            <span className="text-red-700 font-semibold uppercase tracking-wide">The Struggle</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-['Poppins'] text-[#1C1C1C] mb-6 leading-tight">
            It's 1 AM. You're hungry. You've been scrolling Zomato for 
            <span className="text-[#FF5722]"> 20 minutes like a zombie.</span>
          </h2>
        </div>

        {/* Solution */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-[#00C896]/10 px-6 py-3 rounded-full mb-6">
            <Target className="text-[#00C896]" size={24} />
            <span className="text-[#00C896] font-semibold uppercase tracking-wide">The Solution</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-['Poppins'] text-[#1C1C1C] leading-tight">
            MealMood doesn't deliver food. It delivers 
            <span className="text-[#FF5DA2]"> food decisions</span>: 
            <br className="hidden md:block" />
            Recipe if you cook, Swiggy/Zomato if you order, or dine-out if you're social.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;