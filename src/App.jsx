import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Generator from './pages/Generator';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import Showcase from './pages/Showcase';

const DEBUG = false;
function App() {
  return (
    <>
      {DEBUG && (
        <div className="fixed inset-0 pointer-events-none z-10000">
          {/* línies de debug */}
          {/* línia vertical */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-500"></div>
          {/* línia horitzontal */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-red-500"></div>
        </div>
      )}

      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
