import React from 'react'
import HeroSection from '../components/home/HeroSection';
import Categories from '../components/home/Categories';
import FeaturedProducts from '../components/home/Featured';
import Testimonials from '../components/home/Testimonials';
import Blog from '../components/home/Blog';
import AboutSection from '../components/home/About';

const Home = () => {
  return (
    <main>
        
        <HeroSection />
        <AboutSection />
        <Categories />
        <Testimonials />
        <Blog />
      </main>
  )
}

export default Home