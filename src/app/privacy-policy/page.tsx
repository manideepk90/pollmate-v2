export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 prose prose-lg max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <h3 className="text-xl font-semibold mb-2">1.1 Personal Information</h3>
        <p>When you use PollMate, we collect:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Email address (for account creation and authentication)</li>
          <li>Profile information (name, profile picture)</li>
          <li>Authentication data through Google sign-in</li>
          <li>User-generated content (polls, votes, comments)</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">1.2 Usage Information</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Poll interactions (views, votes, shares)</li>
          <li>Device information and IP address</li>
          <li>Browser type and version</li>
          <li>Time spent on platform</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Provide and improve PollMate services</li>
          <li>Generate analytics and poll insights</li>
          <li>Display relevant advertisements</li>
          <li>Prevent fraud and abuse</li>
          <li>Send service updates and notifications</li>
          <li>Respond to user support requests</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
        <p>Your data is stored securely using:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Firebase Authentication for user credentials</li>
          <li>Firebase Firestore for poll data and user content</li>
          <li>Firebase Storage for images and media</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Google Analytics for usage analysis</li>
          <li>Google AdSense for advertisement delivery</li>
          <li>Other users (for public polls and profiles)</li>
          <li>Law enforcement when required by law</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and associated data</li>
          <li>Export your poll data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
        <p>We use cookies and similar technologies to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Maintain user sessions</li>
          <li>Remember user preferences</li>
          <li>Analyze platform usage</li>
          <li>Deliver targeted advertisements</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
        <p>
          PollMate is not intended for children under 13. We do not knowingly collect
          information from children under 13. If you believe we have collected
          information from a child under 13, please contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to Privacy Policy</h2>
        <p>
          We may update this privacy policy periodically. We will notify users of any
          material changes via email or platform notification.
        </p>
      </section>

      <footer className="mt-12 text-sm text-gray-600">
        <p>Contact us at: pollmate4u@gmail.com</p>
        {/* <p>Address: [Your Business Address]</p> */}
      </footer>
    </div>
  );
} 