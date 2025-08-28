import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(new Set());

  const testimonials = [
    {
      name: 'Shivangi Jain',
      school: 'IIM Shillong, MBA 2025',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
      sentiment: 'positive',
      quote: 'Finally! No more spending 30 minutes deciding what to eat. MealMood gets my vibe instantly.',
      alt: 'Young female MBA student smiling confidently',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Valay Nirmal',
      school: 'IIM Shillong, MBA 2025',
      image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
      sentiment: 'positive',
      quote: 'The recipe mode saved my hostel budget. Actually learned to cook thanks to this app!',
      alt: 'Young male MBA student with books and laptop',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Sanyam Wadhwa',
      school: 'IIM Shillong, MBA 2025',
      image: 'https://images.pexels.com/photos/3778212/pexels-photo-3778212.jpeg',
      sentiment: 'positive',
      quote: 'Best food decision app for students. Period. My entire batch is using it now.',
      alt: 'Male student in casual wear with confident expression',
      bgColor: 'bg-pink-100'
    },
    {
      name: 'Himanshu N.',
      school: 'MBBS Final Year, Muzaffarnagar',
      image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg',
      sentiment: 'neutral',
      quote: 'Pretty decent app. Helps when I\'m too tired after clinical rotations to think about food.',
      alt: 'Medical student in white coat looking thoughtful',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Aakash S.',
      school: 'MBBS Final Year, Muzaffarnagar',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg',
      sentiment: 'positive',
      quote: 'MealMood understands student life better than my parents do. Quick decisions = more study time.',
      alt: 'Young medical student with stethoscope smiling',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Eshu R.',
      school: 'MBBS Final Year, Muzaffarnagar',
      image: 'https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg',
      sentiment: 'neutral-positive',
      quote: 'Good concept. The dineout suggestions actually helped me find some decent places near college.',
      alt: 'Female medical student studying with medical books',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Shubham D.',
      school: 'MBBS Final Year, Muzaffarnagar',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
      sentiment: 'positive',
      quote: 'Love how it cuts through the noise. Just tell it your mood and boom - perfect food choice.',
      alt: 'Male medical student in scrubs with positive expression',
      bgColor: 'bg-teal-100'
    }
  ];

  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return { bg: 'bg-[#00C896]', text: '✅ Positive', color: 'text-white' };
      case 'neutral':
        return { bg: 'bg-yellow-400', text: '😐 Neutral', color: 'text-black' };
      case 'neutral-positive':
        return { bg: 'bg-blue-400', text: '😊 Good', color: 'text-white' };
      default:
        return { bg: 'bg-gray-400', text: '🤔 Mixed', color: 'text-white' };
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.testimonial-card');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const FlipCard = ({ testimonial, index }) => {
    const badge = getSentimentBadge(testimonial.sentiment);
    
    return (
      <div
        data-index={index}
        className={`testimonial-card flip-card h-80 transform transition-all duration-700 ${
          visibleCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="flip-card-inner">
          {/* Front of card */}
          <div className={`flip-card-front ${testimonial.bgColor} p-6 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center text-center relative`}>
            <div className={`absolute top-4 right-4 ${badge.bg} ${badge.color} px-2 py-1 rounded-full text-xs font-bold`}>
              {badge.text}
            </div>
            <img
              src={testimonial.image}
              alt={testimonial.alt}
              className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-white shadow-md"
            />
            <h4 className="font-black text-[#1C1C1C] text-xl font-['Poppins'] mb-2">{testimonial.name}</h4>
            <p className="text-sm text-[#1C1C1C]/70 font-medium">{testimonial.school}</p>
          </div>
          
          {/* Back of card */}
          <div className={`flip-card-back ${testimonial.bgColor} p-6 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center text-center`}>
            <p className="text-[#1C1C1C] italic text-lg leading-relaxed font-['Inter']">
              "{testimonial.quote}"
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-[#FFF7EB]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-['Poppins'] text-[#1C1C1C] mb-4">
            Students Love It ❤️
          </h2>
          <p className="text-xl text-[#1C1C1C]/70">
            Real voices from IIM Shillong and Muzaffarnagar Medical College.
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <FlipCard testimonial={testimonial} index={index} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center items-center mt-8 gap-4">
            <button onClick={prevSlide} className="p-2 rounded-full bg-[#FF5722] text-white hover:bg-[#FF5DA2] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-[#1C1C1C]/70">
              {currentIndex + 1} / {testimonials.length}
            </span>
            <button onClick={nextSlide} className="p-2 rounded-full bg-[#FF5722] text-white hover:bg-[#FF5DA2] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Grid - 3 cards per row */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FlipCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;