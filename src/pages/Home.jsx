import Navbar from '../components/Navbar';
import Hero from '../components/Home/Hero';
import WhyTrust from '../components/Home/WhyTrust';
import FinalCTA from '../components/Home/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <WhyTrust />       
        <FinalCTA />  
      </main>
      <Footer />
    </div>
  );
}

