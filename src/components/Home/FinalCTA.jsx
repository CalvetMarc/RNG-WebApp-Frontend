import { Link } from 'react-router-dom';
import Tooltip from '../Tooltip';

export default function FinalCTA() {
  return (
    <section className="py-4 px-6 text-center mb-10">
      <h2 className="text-3xl md:text-3xl font-bold text-gray-800 mb-6">
        Explore all the features
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-base md:text-lg"> 
        Explore and customize all the options the Visualizer has to offer, 
        from observing the PRNG’s own optimization to listening to music generated directly from its numbers. If you prefer a quick result, head over 
        to the Generator, where you can input your own data to produce a truly random output. 
      </p>      
      <div className="flex flex-row justify-center space-x-4">
        <Link to="/visualizer" className="inline-block">
          <button className="button2 w-40">Try Visualizer</button>
        </Link>
        <Link to="/generator" className="button2 w-40 h-12 inline-flex items-center justify-center select-none touch-manipulation">
              Quick Generation
          </Link>
      </div>
    </section>
  );
}
