export default function Terms() {
  return (
    <div className="max-w-3xl lg:max-w-7xl mx-auto px-6 py-8 text-gray-700 text-justify">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-6 text-sm text-gray-500">Last updated: September 28, 2025</p>

      <p className="mb-4">
        These Terms of Service (“Terms”) govern your access to and use of <strong>Free PRNG</strong> (“we”, “us”, or “our”),
        including our website, the public <strong>Showcase</strong> and the <strong>Generator</strong> section (together, the “Services”).
        Free PRNG is a non-commercial demonstration of a random number generator. We do not offer user accounts or an API.
        By accessing or using the Services, you agree to these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1) Eligibility</h2>
      <p className="mb-4">
        You may use the Services only if you are at least 16 years old and legally capable of entering into a binding contract
        under applicable law. If you use the Services on behalf of an organization, you represent that you have authority to bind
        that organization to these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2) Service Description</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>
          <strong>Generator:</strong> renders long PRNG sequences as visual and musical patterns and displays related
          performance charts/metrics. It is a demonstration for educational and illustrative purposes only.
        </li>
        <li>
          <strong>Showcase:</strong> small interactive demos (e.g., dice, coin flips, roulette/slot visuals) that
          illustrate the RNG output. These demos are not tools for professional use.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3) Acceptable Use</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>Do not use the Services for unlawful, fraudulent, or abusive purposes.</li>
        <li>Do not interfere with or attempt to compromise the security or integrity of the Services.</li>
        <li>Do not scrape, overload, or reverse engineer the Services beyond what applicable law permits.</li>
        <li>You are responsible for complying with applicable laws when using the Services.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">4) Intellectual Property & Content</h2>
      <p className="mb-4">
        The Services (including software, design, audiovisual assets, and content) are owned or licensed by us and protected by
        intellectual property laws. We grant you a limited, non-exclusive, non-transferable license to access and use the Services
        for personal, non-commercial purposes in accordance with these Terms. If we publish any code under an open-source license,
        that license governs that code.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5) Feedback</h2>
      <p className="mb-4">
        If you send ideas, suggestions, or feedback, you grant us a perpetual, irrevocable, worldwide, royalty-free license to use
        and incorporate them without obligation to you.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6) Availability</h2>
      <p className="mb-4">
        We strive to keep the Services available and reliable but do not guarantee uninterrupted or error-free operation. We may
        modify, suspend, or discontinue any part of the Services at any time without liability.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7) No Gambling / No Production Use</h2>
      <p className="mb-4">
        The Generator, showcase, and demos are for demonstration and educational purposes only. They are not certified for gambling
        or any regulated, commercial, or safety-critical use. Do not rely on RNG outputs for real-money gaming, compliance, or
        production systems.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8) Disclaimers</h2>
      <p className="mb-4">
        The Services are provided “as is” and “as available,” without warranties of any kind, express or implied, including but not
        limited to merchantability, fitness for a particular purpose, accuracy, and non-infringement.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9) Limitation of Liability</h2>
      <p className="mb-4">
        To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or
        punitive damages, or for loss of profits, revenues, data, or goodwill arising out of or related to your use of or inability
        to use the Services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10) Indemnification</h2>
      <p className="mb-4">
        You agree to indemnify and hold us harmless from claims, liabilities, damages, losses, and expenses (including reasonable
        legal fees) arising from your use of the Services or your violation of these Terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">11) Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms from time to time. Changes will be posted here with an updated “Last updated” date. Your continued
        use of the Services after changes are posted constitutes acceptance of the revised Terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">12) Governing Law & Jurisdiction</h2>
      <p className="mb-4">
        These Terms are governed by the laws of Spain and applicable European Union law. Any disputes shall be subject to the exclusive
        jurisdiction of the courts located in Barcelona, Spain.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">13) Contact</h2>
      <p>
        For questions about these Terms, contact{" "}
        <a href="mailto:marc200102@gmail.com" className="!text-blue-700 underline hover:!text-purple-800">
          marc200102@gmail.com
        </a>.
      </p>
    </div>
  );
}
