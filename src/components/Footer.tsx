import React from 'react';
import { Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-[#1C1C1C] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h3 className="text-2xl font-bold font-['Poppins'] mb-6">
            MealMood — Built by students, for students.
          </h3>
          
          <div className="flex justify-center gap-6 mb-8">
            <a 
              href="#" 
              className="p-3 bg-[#FF5722] rounded-full hover:bg-[#FF5DA2] transition-colors transform hover:scale-110"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="#" 
              className="p-3 bg-[#FF5722] rounded-full hover:bg-[#FF5DA2] transition-colors transform hover:scale-110"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={24} />
            </a>
          </div>

          <div className="text-[#1C1C1C]/60 text-sm space-y-2">
            <p>© 2025 MealMood. All rights reserved.</p>
            <p>Made with 🧡 for hungry students everywhere.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;