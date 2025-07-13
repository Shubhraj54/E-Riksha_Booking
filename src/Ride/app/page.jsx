import '../Style/common.css';
import { Outlet } from 'react-router-dom';
import RideHeroSection from '../components/RideHeroSection'
import RideServicesSection from '../components/RideServicesSection'
import RideSafetySection from '../components/RideSafetySection'
import RideAboutSection from '../components/RideAboutSection'
import RideDownloadSection from '../components/RideDownloadSection'
import RideContactSection from '../components/RideContactSection'
import RideFooter from '../components/RideFooter'
import RideNavbarx from '../components/RideNavbarx'

export default function RideHome() {
  return (
    <main className="ride_main">
      <RideNavbarx />
      <RideHeroSection />
      <RideServicesSection />
      <RideSafetySection />
      <RideAboutSection />
      <RideDownloadSection />
      <RideContactSection />
      <RideFooter />
    </main>
  )
} 