import { FaCheckCircle, FaCogs, FaSortNumericUp, FaSlidersH } from 'react-icons/fa';

export default function WhyTrust() {
  return (
    <section className="w-full bg-[#b0cad2] py-13 px-8 -translate-y-12 ">
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Why use this PRNG?</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12 text-justify">
          Our PRNG is built on top of PCG32, a modern alternative to outdated algorithms such as Mersenne Twister. It has been designed for seamless integration as a library across different environments, offering both continuous number generation and full control over the seed when manual reproducibility is required. This flexibility makes it suitable for a wide range of use cases, from games and simulations to research and testing. Its statistical robustness has been validated by successfully passing the BigCrush test suite, ensuring high-quality randomness.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 mt-16 md:pl-12">
          {/* Bloc 1 */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4">
            <FaCheckCircle className="text-green-500 text-2xl md:self-center" />
            <div>
              <h3 className="font-semibold text-gray-800">Tested randomness</h3>
              <p className="text-gray-600 text-sm">BigCrush passed</p>
            </div>
          </div>

          {/* Bloc 2 */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4">
            <FaCogs className="text-blue-500 text-2xl md:self-center" />
            <div>
              <h3 className="font-semibold text-gray-800">Easy integration</h3>
              <p className="text-gray-600 text-sm">Lightweight library</p>
            </div>
          </div>

          {/* Bloc 3 */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4">
            <FaSortNumericUp className="text-purple-500 text-2xl md:self-center" />
            <div>
              <h3 className="font-semibold text-gray-800">High-quality results</h3>
              <p className="text-gray-600 text-sm">32-bit output</p>
            </div>
          </div>

          {/* Bloc 4 (Flexibilitat) */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4">
            <FaSlidersH className="text-orange-500 text-2xl md:self-center" />
            <div>
              <h3 className="font-semibold text-gray-800">Flexible usage</h3>
              <p className="text-gray-600 text-sm">Seed control</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
