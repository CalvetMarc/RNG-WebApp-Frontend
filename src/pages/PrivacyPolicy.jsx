export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl lg:max-w-7xl mx-auto px-6 py-8 text-gray-700 text-justify">

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-6 text-sm text-gray-500">Last updated: September 1, 2025</p>

      <p className="mb-4">
        This Privacy Policy explains how <strong>Free PRNG</strong> (“we”, “us”, or “our”) collects, uses, and safeguards
        personal data when you access our website, dashboard, and API (collectively, the “Services”).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1) Data Controller & Contact</h2>
      <p className="mb-4">
        For the purposes of the EU General Data Protection Regulation (GDPR), the data controller is Free PRNG. 
        If you have any questions or requests regarding this policy or your data, contact us at:{" "}
        <a href="mailto:marc200102@gmail.com" className="!text-blue-700 underline hover:!text-purple-800">marc200102@gmail.com</a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2) What Personal Data We Collect</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li><strong>Account & Contact Data:</strong> e.g., email address and any information you provide when registering or contacting us.</li>
        <li><strong>Usage & Technical Data:</strong> IP address, device/browser information, timestamps, API usage logs (e.g., endpoint called, response codes, request metadata), and pages visited.</li>
        <li><strong>Support Data:</strong> messages you send us (email or forms) and related metadata.</li>
        <li><strong>Cookies/Similar Tech:</strong> if and when used, strictly necessary cookies to keep you signed in and secure. We do not use marketing cookies. Any analytics cookies (if added in the future) will be disclosed and consented where required.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3) Purposes of Processing</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li>Provide and maintain the Services (authentication, session management, API requests handling).</li>
        <li>Improve reliability, performance, and security (monitoring, debugging, preventing abuse/fraud).</li>
        <li>Respond to inquiries and provide customer support.</li>
        <li>Comply with legal obligations and enforce our Terms of Service.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">4) Legal Bases (GDPR)</h2>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li><strong>Performance of a contract</strong> (Art. 6(1)(b)): to provide the Services you request (e.g., account, API access).</li>
        <li><strong>Legitimate interests</strong> (Art. 6(1)(f)): to secure, monitor, and improve the Services, prevent abuse, and understand usage patterns in a privacy-preserving way.</li>
        <li><strong>Legal obligations</strong> (Art. 6(1)(c)): to comply with applicable laws, including security and record-keeping duties.</li>
        <li><strong>Consent</strong> (Art. 6(1)(a)): only where required (e.g., non-essential cookies, if implemented in the future).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">5) Data Sharing & Processors</h2>
      <p className="mb-4">
        We do not sell your personal data. We may share limited personal data with trusted service providers
        (e.g., hosting, error monitoring, email delivery) strictly to operate the Services, under data protection agreements.
        We may disclose data if required by law or to protect our rights, users, or the public.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6) International Transfers</h2>
      <p className="mb-4">
        If data is transferred outside the EEA/UK, we implement appropriate safeguards (e.g., Standard Contractual Clauses)
        to protect your personal data in accordance with GDPR requirements.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7) Data Retention</h2>
      <p className="mb-4">
        We retain personal data only as long as necessary for the purposes described above. Typical retention periods are:
      </p>
      <ul className="list-disc ml-6 mb-4 space-y-2">
        <li><strong>Account data:</strong> kept while your account is active and for a reasonable period after closure for security, audit, and legal purposes.</li>
        <li><strong>API logs & technical records:</strong> kept for a limited period to ensure security, troubleshoot issues, and maintain service integrity.</li>
        <li><strong>Support communications:</strong> kept as needed to resolve issues and maintain records.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">8) Security</h2>
      <p className="mb-4">
        We use reasonable technical and organizational measures to protect personal data against unauthorized access, loss, or misuse.
        However, no system can be completely secure; please use strong, unique passwords and protect your credentials.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9) Your Rights (EEA/UK)</h2>
      <p className="mb-4">
        Subject to conditions and exceptions in law, you may have the right to access, rectify, erase, or port your data; 
        to restrict or object to processing; and to withdraw consent where processing is based on consent. 
        To exercise these rights, contact{" "}
        <a href="mailto:marc200102@gmail.com" className="!text-blue-700 underline hover:!text-purple-800">marc200102@gmail.com</a>. 
        You can also lodge a complaint with your local data protection authority.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10) Children’s Privacy</h2>
      <p className="mb-4">
        The Services are not directed to children under 16. We do not knowingly collect personal data from children.
        If you believe a child has provided personal data, please contact us to delete it.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">11) Cookies & Analytics</h2>
      <p className="mb-4">
        We currently use only strictly necessary cookies required to operate the Services (e.g., keeping you signed in).
        If we later introduce analytics or other non-essential cookies, we will update this Policy and, where required, request your consent.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">12) Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Changes will be posted here with an updated “Last updated” date.
        If the changes are material, we will provide additional notice where appropriate.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">13) Contact</h2>
      <p>
        For any questions about this Privacy Policy or our data practices, contact{" "}
        <a href="mailto:marc200102@gmail.com" className="!text-blue-700 underline hover:!text-purple-800">marc200102@gmail.com</a>.
      </p>
    </div>
  );
}
