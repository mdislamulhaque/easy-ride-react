import React from 'react'
import StatsSection from './StatsSection'
import HeroSlider from './HeroSlider'
import SpecialOffers from './SpecialOffers';
import RentVehicle from './RentVehicle';

export default function HomePage() {
  return (
    <div>
          <HeroSlider />
      <SpecialOffers />
      <RentVehicle />
      <StatsSection />
    </div>
  );
}
