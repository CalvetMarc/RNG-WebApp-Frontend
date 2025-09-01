import { Link } from 'react-router-dom';
import Tooltip from '../Tooltip';

export default function FinalCTA() {
  return (
    <section className="py-4 px-6 text-center mb-10">
      <h2 className="text-3xl md:text-3xl font-bold text-gray-800 mb-6">
        Explore all the features
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-base md:text-lg">
        Try out everything the dashboard has to offer — from simple random number generation to real-time visualization. 
        Create a free account to unlock personalized tools and exclusive features based on your generation history.
      </p>
      
      <div className="flex flex-row justify-center space-x-4">
        <Link to="/dashboard" className="inline-block">
          <button className="button2 w-40">Try Dashboard</button>
        </Link>

        <Tooltip text="Coming soon" from="down">
          <Link to="" className="inline-block">
            <button className="button2 w-40">Log In</button>
          </Link>
        </Tooltip>
      </div>
    </section>
  );
}
