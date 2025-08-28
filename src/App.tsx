import React from 'react';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import FoodThirst from './components/FoodThirst';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-[#FFF7EB] text-[#1C1C1C] font-['Inter'] overflow-x-hidden">
      <Hero />
      <ProblemSolution />
      <Features />
      <FoodThirst />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;