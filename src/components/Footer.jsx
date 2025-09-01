import { FaLinkedin, FaEnvelope, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-700 text-white py-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-center text-sm w-full gap-6 md:gap-0 relative">
        {/* Text centrat a dalt en mòbil */}
        <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Free PRNG. All rights reserved.</p>
        </div>

        {/* Bloc Esquerra */}
        <div className="flex gap-4 md:pl-10 justify-center md:justify-start">
          <Link to="/privacy-policy" className="hover:text-blue-400">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-blue-400">Terms of Service</Link>
          <Link to="/contact" className="hover:text-blue-400">Contact</Link>
        </div>

        {/* Bloc Dreta */}
        <div className="flex gap-6 md:pr-10 justify-center md:justify-end">
          <a
            href="https://www.linkedin.com/in/marc-calvet-palao/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:marc200102@gmail.com"
            className="hover:text-blue-400"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://github.com/CalvetMarc"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}
