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
    question: 'What are the subscription tiers and pricing?',
    answer: 'We offer 4 tiers: Free ($0/month - 3 patterns, 1 download), Hobbyist ($5.99/month or $59.99/year - 5 patterns, 2 downloads), Enthusiast ($9.99/month or $94.99/year - 15 patterns, 10 downloads), and Pro ($19.99/month or $199.99/year - 50 patterns, 25 downloads). All paid plans include access to our full pattern library.'
  },
  {
    question: 'Is there a free trial or free tier?',
    answer: 'Yes! Our Free tier lets you try Quilt Planner Pro with no credit card required. You get 3 pattern generations and 1 download to test our AI and see if it\'s right for you. Your generated patterns stay in your Library even if you don\'t download them right away.',
  },
  {
    question: 'Can I save money with annual billing?',
    answer: 'Yes! Annual subscriptions offer significant savings: Hobbyist saves ~17% ($59.99/year vs $71.88), Enthusiast saves ~21% ($94.99/year vs $119.88), and Pro saves ~17% ($199.99/year vs $239.88).',
  },
  {
    question: 'How many patterns can I generate?',
    answer: 'Pattern generation limits depend on your subscription tier: Free (3/month), Hobbyist (5/month), Enthusiast (15/month), or Pro (50/month).'
  },
  {
    question: 'Can I download my patterns?',
    answer: 'Yes! All subscription tiers allow you to download your patterns as PDFs. Download limits vary by tier: Free (1), Hobbyist (2/month), Enthusiast (10/month), Pro (25/month).',
  },
  {
    question: 'What is the Fabric Hold add-on?',
    answer: 'Fabric Hold is an optional add-on that lets you save fabric photos to your library for easy reuse. Instead of uploading the same fabrics every time, save them once and quickly select from your library when creating new patterns. Options: 10 fabrics ($2.99/month or $29/year), 25 fabrics ($5.99/month or $59/year), or 50 fabrics ($9.99/month or $99/year).',
  },
  {
    question: 'Why would I need Fabric Hold?',
    answer: 'Fabric Hold is perfect if you have a fabric stash you use regularly! Instead of re-uploading photos each time you design a quilt, save your fabrics once and mix-and-match them across different patterns. It\'s especially useful for quilters who work with the same collection, want to experiment with different combinations, or plan multiple projects with their stash. Note: Fabric Hold is designed as a quick reference tool for your favorite or frequently-used fabrics, not as a comprehensive inventory system.',
  },
  {
    question: 'What\'s the maximum number of fabrics I can save?',
    answer: 'The maximum is 50 fabrics. This limit keeps the feature focused on quick reference and easy selection. If you need to manage a larger fabric inventory, we recommend using dedicated fabric inventory software alongside Quilt Planner Pro for pattern generation.',
  },
  {
    question: 'Can I save patterns for later?',
    answer: 'Yes! All your generated patterns are automatically saved in your Library. You can view, download, and manage all your patterns from your account dashboard.',
  },
  {
    question: 'What if I\'m not happy with the generated pattern?',
    answer: 'You can regenerate patterns as many times as you want (within your plan limits). Try adjusting your fabric selection, skill level, or pattern choice for different results.',
  },
  {
    question: 'Can I upgrade or downgrade my subscription?',
    answer: 'Yes, you can change your subscription tier at any time from your Profile page. Upgrades take effect immediately and you\'ll be prorated for the remaining time. Downgrades take effect at the next billing cycle, so you keep your current benefits until then.',
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
      <div className="py-12 px-4" style={{backgroundImage: 'url(/QuiltPlannerProBackGround.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
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
