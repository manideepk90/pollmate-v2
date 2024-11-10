export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8 prose prose-lg max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using PollMate ("the Service"), you agree to be bound
          by these Terms and Conditions. If you do not agree to these terms,
          please do not use the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. User Registration</h2>
        <p>
          To access certain features of PollMate, you must register for an
          account. You agree to:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized access</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          3. Poll Creation and Content
        </h2>
        <p>When creating polls, you agree to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>
            Not create polls containing offensive, illegal, or harmful content
          </li>
          <li>Not violate any third-party rights</li>
          <li>Accept responsibility for all poll content you create</li>
          <li>
            Allow PollMate to remove any content that violates these terms
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Advertising</h2>
        <p>
          PollMate may display advertisements. By using the Service, you agree:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Not to block or interfere with advertisements</li>
          <li>That we may display ads alongside your content</li>
          <li>That ad revenue belongs to PollMate unless otherwise agreed</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Data and Privacy</h2>
        <p>
          Your use of PollMate is also governed by our Privacy Policy. You agree
          that:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>
            We may collect and use data as described in our Privacy Policy
          </li>
          <li>Poll responses may be used for analytics and improvements</li>
          <li>Public polls may be visible to all users</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          6. Intellectual Property
        </h2>
        <p>
          You retain rights to content you create, but grant PollMate a license
          to:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Display and distribute your polls</li>
          <li>Use poll data for analytics and improvements</li>
          <li>Feature polls in promotional materials</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
        <p>PollMate reserves the right to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Suspend or terminate accounts that violate these terms</li>
          <li>Remove content that violates these terms</li>
          <li>Modify or discontinue the Service at any time</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of PollMate after
          changes constitutes acceptance of new terms.
        </p>
      </section>

      <footer className="mt-12 text-sm text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>Contact us at: pollmate4u@gmail.com</p>
      </footer>
    </div>
  );
}
