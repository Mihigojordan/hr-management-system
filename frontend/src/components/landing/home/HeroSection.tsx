import React, { useState, useEffect } from 'react';
import { Fish, Waves, Droplets, Award, Users, TrendingUp, Mail, Globe, MapPin, ChevronDown } from 'lucide-react';
import image1 from '../../../assets/image1.jpg'
import image2 from '../../../assets/image2.jpg'

const FineFishHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // const interval = setInterval(() => {
    //   setCurrentSlide((prev) => (prev + 1) % 3);
    // }, 5000);
    // return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      title: "Certified Hatchery Excellence",
      subtitle: "Supplying Millions of Healthy Fingerlings Nationwide",
      stat: "200+ Cages",
      statLabel: "Advanced Infrastructure",
      image: image1
    },
    {
      title: "Pioneering Sustainable Aquaculture",
      subtitle: "Premium Nile Tilapia from Lake Kivu's Crystal Waters",
      stat: "90+ Tonnes",
      statLabel: "Monthly Production",
      image: "https://images.unsplash.com/photo-1541441056316-443fff347c40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Empowering Communities",
      subtitle: "Building Rwanda's Blue Economy Together",
      stat: "Vision 2050",
      statLabel: "Sustainable Future",
      image: image2
    }
  ];

  const features = [
    { icon: Fish, title: "Cage Farming", desc: "200+ floating cages on Lake Kivu & Muhazi" },
    { icon: Droplets, title: "Certified Hatchery", desc: "Millions of fingerlings annually" },
    { icon: Waves, title: "Eco-Friendly", desc: "Deep-water methods preserve biodiversity" },
    { icon: Users, title: "Community Focus", desc: "Training & job opportunities" }
  ];

  const stats = [
    { icon: TrendingUp, value: "90+", label: "Tonnes Monthly", color: "from-primary-500 to-primary-600" },
    { icon: Fish, value: "200+", label: "Floating Cages", color: "from-primary-500 to-teal-600" },
    { icon: Award, value: "2035", label: "Vision Goal", color: "from-teal-500 to-primary-600" },
    { icon: Users, value: "1000s", label: "Fingerlings", color: "from-primary-500 to-primary-700" }
  ];

  return (
    <div className="relative min-h-screen bg-primary-50 overflow-hidden">
      {/* Hero Slider with Images */}
      <div className="relative h-screen">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-slate-900/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className=" mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  {/* Logo/Brand */}
                  <div className={`flex items-center gap-3 mb-8 transition-all duration-1000 delay-200 ${
                    currentSlide === index && isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}>
                    <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl">
                      <Fish className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Fine Fish Ltd</h1>
                      <p className="text-primary-400 text-sm">Rwanda's Aquaculture Leader</p>
                    </div>
                  </div>

                  {/* Main Title */}
                  <h2 className={`text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-300 ${
                    currentSlide === index && isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}>
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p className={`text-lg lg:text-xl text-primary-300 mb-8 transition-all duration-1000 delay-400 ${
                    currentSlide === index && isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}>
                    {slide.subtitle}
                  </p>

                  {/* Stat Badge */}
                  <div className={`inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-8 py-4 mb-10 transition-all duration-1000 delay-500 ${
                    currentSlide === index && isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}>
                    <div>
                      <div className="text-4xl font-bold text-white">{slide.stat}</div>
                      <div className="text-primary-300 text-sm">{slide.statLabel}</div>
                    </div>
                    <div className="w-px h-12 bg-white/20"></div>
                    <Waves className="w-12 h-12 text-primary-400" />
                  </div>

                  {/* CTA Buttons */}
                  <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-600 ${
                    currentSlide === index && isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}>
                    <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary-600/30">
                      Explore Our Services
                    </button>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Indicators */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-12 bg-primary-600' : 'w-2 bg-primary-300'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -tranprimary-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-primary-600" />
        </div>
      </div>

    </div>
  );
};

export default FineFishHero;