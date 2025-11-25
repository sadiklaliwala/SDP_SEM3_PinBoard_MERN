import React from 'react';
import Hero from '../Components/Hero';
import SearchIdeas from '../Components/SearchIdeas';
import SaveIdeas from '../Components/SaveIdeas';
import SeeIdeas from '../Components/SeeIdeas';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen text-gray-900 dark:text-gray-100">
      <Hero />
      <SearchIdeas />
      <SaveIdeas />
      <SeeIdeas />
    </div>
  );
};

export default LandingPage;