import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ProductSection from '../components/ProductSection';
import LimitedOffer from '../components/LimitedOffer';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <ProductSection title="Bestselling items" />
      <LimitedOffer />
      <ProductSection title="Latest items" />
    </>
  );
};

export default HomePage;