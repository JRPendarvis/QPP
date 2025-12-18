'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does Quilt Planner Pro work?',
    answer: 'Simply upload 2-8 photos of your fabrics, select your skill level, and our AI analyzes the colors and patterns to generate a custom quilt design with step-by-step instructions.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'We support JPG and PNG image formats. For best results, upload clear, well-lit photos of your fabrics.',
  },
  {
    question: 'How many fabrics can I upload?',
    answer: 'You can upload between 2 and 8 fabric images per pattern generation. This range gives the AI enough variety to create interesting designs while keeping patterns manageable.',
  },
  {
    question: 'Can I choose a specific pattern type?',
    answer: 'Yes! You can either let our AI choose the best pattern for your skill level and fabrics, or manually select from patterns appropriate for your skill level.',
  },
  {
    question: 'What skill levels do you support?',
    answer: 'We support five skill levels: Beginner, Advanced Beginner, Intermediate, Advanced, and Expert. Each level offers patterns matched to your abilities, and you can challenge yourself with patterns one level up!',
  },
  {
    question: 'How many patterns can I generate?',
    answer: 'Pattern generation limits depend on your subscription tier: Free (3/month), Hobbyist (5/month), Enthusiast (15/month), or Pro (50/month).'
  },
  {
    question: 'Can I download my patterns?',
    answer: 'Yes! All subscription tiers allow you to download your patterns as PDFs. Download limits vary by tier.',
  },
  {
    question: 'Can I save patterns for later?',
    answer: 'Not Yet! Your pattern history is saved and we are working on displaying them. This is a feature that is COMING SOON!',
  },
  {
    question: 'What if I\'m not happy with the generated pattern?',
    answer: 'You can regenerate patterns as many times as you want (within your plan limits). Try adjusting your fabric selection, skill level, or pattern choice for different results.',
  },
  {
    question: 'Can I upgrade or downgrade my subscription?',
    answer: 'Yes, you can change your subscription tier at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.',
  },
  {
    question: 'How can I cancel my subscription?',
    answer: 'You can cancel your subscription at any time from your Profile page. Your access will continue until the end of your current billing period, and you won\'t be charged again.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes! We use Stripe for payment processing, which is PCI-DSS compliant. We never store your credit card information on our servers.',
  },
  {
    question: 'Can I use the patterns commercially?',
    answer: 'Patterns generated for personal use are yours to keep. For commercial use (selling quilts or patterns), please upgrade to our Professional tier.',
  },
  {
    question: 'Do you provide quilting supplies or fabrics?',
    answer: 'No, Quilt Planner Pro is a digital pattern generation tool. We help you design quilts using your own fabric collection, but we don\'t sell physical materials.',
  },
  {
    question: 'How accurate are the fabric colors in the pattern?',
    answer: 'Our AI does its best to match your fabric colors, but results depend on photo quality and lighting. For best results, photograph fabrics in natural daylight.',
  },
  {
    question: 'Can I share my patterns with friends?',
    answer: 'Patterns are for personal use only. Each person should have their own account to generate patterns. Consider gifting a subscription!',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #FEF2F2 0%, #F0FDFA 50%, #FFFBEB 100%)'}}>
      <Navigation />

      {/* Hero Section */}
      <div className="py-12 px-4" style={{backgroundColor: '#B91C1C'}}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-red-100">
            Find answers to common questions about Quilt Planner Pro
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">


          {/* FAQ List */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-4 bg-white hover:bg-gray-50 flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <span className="text-2xl text-gray-500 shrink-0">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="bg-linear-to-r from-red-100 to-teal-100 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-700 mb-6">
              Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
            </p>
            <div className="flex gap-4">
              <Link
                href="/feedback"
                className="px-6 py-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
              >
                About Us
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
