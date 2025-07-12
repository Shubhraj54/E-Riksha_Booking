import HeroSection from '../components/HeroSection'
import ServicesSection from '../components/ServicesSection'
import SafetySection from '../components/SafetySection'
import AboutSection from '../components/AboutSection'
import DownloadSection from '../components/DownloadSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import Navbarx from '../components/Navbarx'
import './globals.css';
export default function RideHome() {
  return (
    <main>
      <Navbarx />
      <HeroSection />
      <ServicesSection />
      <SafetySection />
      <AboutSection />
      <DownloadSection />
      <ContactSection />
      <Footer />
    </main>
  )
} 