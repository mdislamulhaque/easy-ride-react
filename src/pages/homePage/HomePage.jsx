import React from 'react'
import StatsSection from './StatsSection'
import HeroSlider from './HeroSlider'
import SpecialOffers from './SpecialOffers';

export default function HomePage() {
  return (
    <div>
          <HeroSlider />
          <SpecialOffers />
      <StatsSection />
    </div>
  );
}
