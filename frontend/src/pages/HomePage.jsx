import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ProductSection from '../components/ProductSection';
import LimitedOffer from '../components/LimitedOffer';
import BookLists from '../components/BookLists';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <ProductSection title="Best selling items" />
      <LimitedOffer />
      <BookLists/>

    </>
  );
};

export default HomePage;