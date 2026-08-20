import React from 'react';

export const metadata = {
  title: 'Refund Policy & Request | Sathi Project',
  description: 'Learn about our refund policy or submit a request.',
};

export default function RefundPage() {
  const contactEmail = 'sathiproject@devbhujel.com';

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Refund Policy & Support
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            We want you to be satisfied with your experience. If you need a refund or have questions, we’re here to help.
          </p>
        </header>

        {/* Policy Section */}
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
            Our Refund Guidelines
          </h2>
          
          <ul className="list-disc pl-5 space-y-3 text-sm sm:text-base text-gray-700">
            <li>
              <strong>Eligible Timeframe:</strong> Refund requests must be submitted within <strong>14 days</strong> of purchase/subscription.
            </li>
            <li>
              <strong>Processing Time:</strong> Once approved, refunds typically take <strong>5–10 business days</strong> to reflect in your original payment method.
            </li>
            <li>
              <strong>Non-refundable Items:</strong> Custom services, fully consumed resources, or non-refundable promotional offers may not be eligible.
            </li>
          </ul>
        </section>

        {/* Contact/Request Section */}
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
            Request a Refund
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            To initiate a request, please send an email to our support team with your order ID, account details, and the reason for your request.
          </p>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="block text-xs uppercase tracking-wider font-semibold text-indigo-600">
                Support Email
              </span>
              <a
                href={`mailto:${contactEmail}?subject=Refund%20Request`}
                className="text-lg font-bold text-indigo-900 hover:underline break-all"
              >
                {contactEmail}
              </a>
            </div>

            <a
              href={`mailto:${contactEmail}?subject=Refund%20Request`}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors w-full sm:w-auto text-center"
            >
              Send Email Request
            </a>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="text-center text-xs text-gray-500">
          <p>
            Have general questions? Reach out to us at{' '}
            <a href={`mailto:${contactEmail}`} className="underline">
              {contactEmail}
            </a>
          </p>
        </footer>

      </div>
    </main>
  );
}