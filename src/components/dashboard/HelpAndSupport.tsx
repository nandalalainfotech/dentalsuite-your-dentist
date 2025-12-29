import React, { useState } from 'react';

interface HelpAndSupportProps {
  onContactSupport: () => void;
  onSubmitFeedback: () => void;
}

export const HelpAndSupport: React.FC<HelpAndSupportProps> = ({
  onContactSupport,
  onSubmitFeedback
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'feedback'>('faq');

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by clicking the "Book Appointment" button in the header, or through the Quick Search widget to find available dentists.'
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time through the Upcoming Appointments section.'
    },
    {
      question: 'How do I add family members?',
      answer: 'Click the "Add Member" button in the Family Members section to add and manage profiles for your family members.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, debit cards, and health insurance payments. Payment methods can be managed in the Payments section.'
    },
    {
      question: 'How do I download my invoices?',
      answer: 'You can download invoices from the Payments Summary or Appointment History sections by clicking the invoice icon next to each payment.'
    }
  ];

  const supportOptions = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone Support',
      description: 'Call us at 1800-DENTIST',
      action: 'Call Now'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Support',
      description: 'Get help via email',
      action: 'Send Email'
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Help & Support</h2>

      <div className="flex space-x-1 mb-4 sm:mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${activeTab === 'faq'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          FAQ
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${activeTab === 'contact'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Contact
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${activeTab === 'feedback'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Feedback
        </button>
      </div>

      {activeTab === 'faq' && (
<div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Frequently Asked Questions
            </h3>

            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-3 sm:px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 pr-2">{faq.question}</span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transform transition-transform flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedFaq === index && (
                  <div className="px-3 sm:px-4 pb-3 pt-0">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}

            <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All FAQs
            </button>
          </div>
      )}

      {activeTab === 'contact' && (
<div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Contact Support
            </h3>

            {supportOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={onContactSupport}
              >
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">{option.title}</h4>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">Support Hours</p>
                  <p className="text-xs text-yellow-700">Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM</p>
                </div>
              </div>
            </div>
          </div>
      )}

      {activeTab === 'feedback' && (
<div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Share Your Feedback
            </h3>

            <p className="text-sm text-gray-600">
              Help us improve your experience by sharing your thoughts and suggestions.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm">
                  <option>General Feedback</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>Complaint</option>
                  <option>Compliment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="p-1 text-gray-300 hover:text-yellow-400 transition-colors"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={onSubmitFeedback}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
              >
                Submit Feedback
              </button>
            </div>
          </div>
      )}
    </div>
  );
};