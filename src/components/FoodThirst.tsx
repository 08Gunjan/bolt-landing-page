import React, { useState, useEffect } from 'react';

const FoodThirst = () => {
  const [visibleItems, setVisibleItems] = useState(new Set());

  const foodItems = [
    {
      image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
      caption: 'Hostel Recipe Hack 🍳',
      alt: 'Homemade curry in a bowl with spices and herbs'
    },
    {
      image: 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg',
      caption: 'Sweet Cravings Solved 🍩',
      alt: 'Fresh chocolate donuts on a wooden table'
    },
    {
      image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
      caption: 'Dineout Vibes 🌿',
      alt: 'Modern restaurant interior with green plants and natural lighting'
    },
    {
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      caption: 'Late-night Delivery 🚗',
      alt: 'Delicious lasagna with melted cheese and herbs'
    },
    {
      image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
      caption: 'Shortcut Meals 🥪',
      alt: 'Fresh submarine sandwich with vegetables and meat'
    },
    {
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      caption: 'Zomato Scroll, Skipped 🍕',
      alt: 'Hot pizza slice with melted cheese in delivery box'
    },
    {
      image: 'https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg',
      caption: 'Cultural Vibe Dining 🪔',
      alt: 'Traditional Indian restaurant with warm lighting and cultural decor'
    },
    {
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      caption: 'Global Taste 🌎',
      alt: 'Vibrant Mexican restaurant interior with colorful decorations'
    },
    {
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
      caption: 'Student Staple 🥟',
      alt: 'Steamed momos dumplings on a plate with dipping sauce'
    },
    {
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      caption: 'Broke Student Recipe 🍝',
      alt: 'Colorful masala pasta with Indian spices and herbs'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set(prev).add(parseInt(entry.target.getAttribute('data-index') || '0')));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.food-item');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#FFF7EB] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-['Poppins'] text-[#1C1C1C] mb-4">
            What's Your Food Mood? 👀
          </h2>
          <p className="text-xl text-[#1C1C1C]/70 font-medium">
            Real cravings. Real decisions. No filters.
          </p>
        </div>

        {/* Mobile: Vertical Carousel */}
        <div className="md:hidden overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {foodItems.map((item, index) => (
              <div
                key={index}
                data-index={index}
                className={`food-item relative w-64 h-80 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-700 ${
                  visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-[#FF5722] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg neon-badge">
                    {item.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 2-Row Masonry Grid */}
        <div className="hidden md:grid grid-cols-5 gap-4 h-96">
          {foodItems.map((item, index) => (
            <div
              key={index}
              data-index={index}
              className={`food-item relative rounded-2xl overflow-hidden shadow-lg transform transition-all duration-700 hover:scale-105 ${
                index % 2 === 0 ? 'row-span-1' : 'row-span-1'
              } ${
                visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-[#FF5722] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg neon-badge">
                  {item.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodThirst;