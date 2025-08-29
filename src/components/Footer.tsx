import React from 'react';
import { Instagram, Twitter, Youtube, Mail, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#141414] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
        
        {/* Company Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div className="flex items-center space-x-2">
            <Zap size={28} className="text-[#00C896]" />
            <span className="text-3xl font-bold font-['Poppins']">MealMood</span>
          </div>
          <p className="text-sm text-gray-400 max-w-xs">
            The Gen-Z food app that matches your mood to perfect meals. No more endless scrolling, just instant food vibes.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="p-3 bg-[#FF5722] rounded-full hover:bg-[#FF5DA2] transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" className="p-3 bg-[#FF5722] rounded-full hover:bg-[#FF5DA2] transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" className="p-3 bg-[#FF5722] rounded-full hover:bg-[#FF5DA2] transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
            <a href="#" className="p-3 bg-[#FF5722] rounded-full hover:bg-[#FF5DA2] transition-colors" aria-label="Email"><Mail size={20} /></a>
          </div>
        </div>

        {/* Features & Support Links */}
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16 text-center md:text-left">
          <div>
            <h5 className="font-bold text-lg mb-4">Features</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Recipe Matching</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Delivery Shortcuts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dineout Vibes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mood Detection</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-lg mb-4">Support</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        {/* App Store Links */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <p className="text-gray-400">Available on:</p>
          <div className="flex space-x-4">
            <a href="#" className="bg-[#2D2D2D] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">App Store</a>
            <a href="#" className="bg-[#2D2D2D] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
              Google Play
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-12 pt-8 border-t border-gray-800">
        <p>© 2024 MealMood. Made with <span role="img" aria-label="heart">💜</span> for the food-confused generation.</p>
      </div>
    </footer>
  );
};

export default Footer;