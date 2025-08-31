import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: 'Shivangi Jain',
      school: 'IIM Shillong, MBA 2025',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      sentiment: 'positive',
      quote: '“MealMood nailed my vibe during exam prep. Instead of scrolling Zomato, I had food sorted in seconds.”',
      alt: 'Shivangi Jain',
      bgColor: 'bg-gradient-to-br from-cream-start to-cream-end',
      customStyle: 'shivangi'
    },
    {
      name: 'Valay Nirmal',
      school: 'IIM Shillong, MBA 2025',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      sentiment: 'positive',
      quote: '“I used to waste 20 minutes scrolling Zomato. MealMood gave me a quick pick for late-night hunger.”',
      alt: 'Valay Nirmal',
      bgColor: 'bg-gradient-to-br from-mint-start to-mint-end'
    },
    {
      name: 'Sanyam Wadhwa',
      school: 'IIM Shillong, MBA 2025',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      sentiment: 'positive',
      quote: '“When deadlines pile up, I don’t want to think about food. MealMood takes that stress away.”',
      alt: 'Sanyam Wadhwa',
      bgColor: 'bg-gradient-to-br from-lavender-start to-lavender-end'
    },
    {
      name: 'Himanshu N.',
      school: 'MBBS Final Year, Muzaffarnagar',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      sentiment: 'neutral',
      quote: '“Some ideas don’t match my mood, but most are spot on—better than Swiggy scrolling at 1 AM.”',
      alt: 'Himanshu N.',
      bgColor: 'bg-gradient-to-br from-coral-start to-coral-end'
    },
    {
      name: 'Aakash S.',
      school: 'MBBS Final Year, Muzaffarnagar',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      sentiment: 'positive',
      quote: '“During night duties, MealMood’s quick picks actually save me. One recipe or shortcut and I’m done.”',
      alt: 'Aakash S.',
      bgColor: 'bg-gradient-to-br from-pink-start to-pink-end',
      isHighlightText: true
    },
    {
      name: 'Eshu R.',
      school: 'MBBS Final Year, Muzaffarnagar',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      sentiment: 'neutral-positive',
      quote: '“Not perfect, but it makes late-night decisions way easier between classes and duties.”',
      alt: 'Eshu R.',
      bgColor: 'bg-gradient-to-br from-peach-start to-peach-end',
      isHighlightText: true
    },
    {
      name: 'Shubham D.',
      school: 'MBBS Final Year, Muzaffarnagar',
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      sentiment: 'positive',
      quote: '“Hostel food gets boring fast. MealMood gave me new ideas without overthinking.”',
      alt: 'Shubham D.',
      bgColor: 'bg-gradient-to-br from-aqua-start to-aqua-end'
    }
  ];

  const getSentimentBadge = (sentiment: string) => {
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

  interface Testimonial {
    name: string;
    school: string;
    image: string;
    sentiment: string;
    quote: string;
    alt: string;
    bgColor: string;
    customStyle?: string;
    isHighlightText?: boolean;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };


  const FlipCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
    const badge = getSentimentBadge(testimonial.sentiment);
    
    return (
      <div
        data-index={index}
        className={`testimonial-card flip-card h-80 transform transition-all duration-700 opacity-100 translate-y-0`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="flip-card-inner">
          {/* Front of card */}
          <div 
            className={`flip-card-front relative rounded-2xl shadow-lg h-full overflow-hidden`}
            style={{
              backgroundImage: `url(${testimonial.image})`,
              backgroundSize: 'cover',
              backgroundPosition: testimonial.customStyle === 'shivangi' ? 'center' : 'top center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className={`absolute inset-0 w-full h-full relative z-10 flex flex-col items-center p-6 ${testimonial.isHighlightText ? 'pt-44 pb-8 bg-black bg-opacity-40' : 'pt-6 pb-8 bg-black bg-opacity-20'} rounded-2xl justify-start`}>
              <div className={`absolute top-4 right-4 ${badge.bg} ${badge.color} px-2 py-1 rounded-full text-xs font-bold`}>
                {badge.text}
              </div>
              <h4 className={`font-black ${testimonial.isHighlightText ? 'text-yellow-300' : 'text-white'} text-xl font-['Poppins'] mb-2`}>{testimonial.name}</h4>
              <p className={`text-sm ${testimonial.isHighlightText ? 'text-yellow-100' : 'text-white/90'} font-medium`}>{testimonial.school}</p>
            </div>
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