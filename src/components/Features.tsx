import React from 'react';
import { Heart, ChefHat, Smartphone, MapPin } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Heart size={32} />,
      title: 'Mood-Based Recs',
      description: 'Tap how you feel → get 1 idea instantly.',
      bgColor: 'bg-pink-100',
      iconColor: 'text-[#FF5DA2]'
    },
    {
      icon: <ChefHat size={32} />,
      title: 'Recipe Mode',
      description: 'Cook hostel-friendly meals when broke.',
      bgColor: 'bg-green-100',
      iconColor: 'text-[#00C896]'
    },
    {
      icon: <Smartphone size={32} />,
      title: 'Zomato/Swiggy Shortcut',
      description: 'Skip 20 mins of scrolling → direct shortcut.',
      bgColor: 'bg-orange-100',
      iconColor: 'text-[#FF5722]'
    },
    {
      icon: <MapPin size={32} />,
      title: 'Dineout Vibes',
      description: 'Where to go when hostel food isn\'t hitting.',
      bgColor: 'bg-purple-100',
      iconColor: 'text-[#7B61FF]'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-['Poppins'] text-[#1C1C1C] mb-4">
            Why Students Are Obsessed 🎭
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`${feature.bgColor} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className={`${feature.iconColor} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1C1C1C] mb-3 font-['Poppins']">
                🎭 {feature.title}
              </h3>
              <p className="text-[#1C1C1C]/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;