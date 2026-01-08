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
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<string>('General Feedback');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

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

  const feedbackTypes = [
    'General Feedback',
    'Bug Report',
    'Feature Request',
    'Complaint',
    'Compliment'
  ];

  const Icons = {
    Help: () => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleStarClick = (rating: number) => {
    setFeedbackRating(rating);
  };

  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleFeedbackTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFeedbackType(e.target.value);
  };

  const handleFeedbackMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackMessage(e.target.value);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackMessage.trim()) {
      alert('Please enter your feedback message');
      return;
    }

    setIsSubmittingFeedback(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Prepare feedback data
      const feedbackData = {
        type: feedbackType,
        rating: feedbackRating,
        message: feedbackMessage,
        timestamp: new Date().toISOString()
      };

      console.log('Feedback submitted:', feedbackData);

      // Call parent handler
      onSubmitFeedback();

      // Show success state
      setFeedbackSubmitted(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFeedbackRating(0);
        setFeedbackMessage('');
        setFeedbackType('General Feedback');
        setFeedbackSubmitted(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const resetFeedbackForm = () => {
    setFeedbackRating(0);
    setFeedbackMessage('');
    setFeedbackType('General Feedback');
    setFeedbackSubmitted(false);
  };

  const getRatingDescription = (rating: number) => {
    const descriptions = [
      'Select rating',
      'Poor',
      'Fair',
      'Good',
      'Very Good',
      'Excellent'
    ];
    return descriptions[rating];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        <div className="p-2 bg-gray-900 rounded-xl text-white">
          <Icons.Help />
        </div>
        Help & Support
      </h2>

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
          onClick={() => {
            setActiveTab('feedback');
            resetFeedbackForm();
          }}
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

          {feedbackSubmitted ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800">Thank You!</p>
                  <p className="text-sm text-green-700">Your feedback has been submitted successfully.</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback Type
                </label>
                <select
                  value={feedbackType}
                  onChange={handleFeedbackTypeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  disabled={isSubmittingFeedback}
                >
                  {feedbackTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  value={feedbackMessage}
                  onChange={handleFeedbackMessageChange}
                  rows={4}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 resize-none"
                  disabled={isSubmittingFeedback}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                  <span className="text-gray-400 font-normal ml-2">
                    ({getRatingDescription(feedbackRating)})
                  </span>
                </label>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      className="p-1 transition-colors disabled:opacity-50"
                      disabled={isSubmittingFeedback}
                    >
                      <svg
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${star <= (hoverRating || feedbackRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 fill-gray-100"
                          }`}
                        stroke="currentColor"
                        strokeWidth={star <= (hoverRating || feedbackRating) ? 0 : 1.5}
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  ))}
                  {/* Rating number stays gray */}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {feedbackRating > 0 ? `${feedbackRating}.0` : ''}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetFeedbackForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmittingFeedback}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmittingFeedback}
                >
                  {isSubmittingFeedback ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};