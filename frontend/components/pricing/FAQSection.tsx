/**
 * FAQ section component
 * Single Responsibility: Render FAQ grid
 */
export default function FAQSection() {
  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.'
    },
    {
      question: 'What happens to my patterns when I cancel?',
      answer: 'Your downloaded patterns remain yours forever. You just lose access to generating new ones.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer refunds within 30 days of purchase on a case-by-case basis. Contact support for assistance.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! All paid plans include a 14-day free trial. No credit card required to start.'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Frequently Asked Questions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
