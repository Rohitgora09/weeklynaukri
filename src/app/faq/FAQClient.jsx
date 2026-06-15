'use client';

import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is WeeklyNaukri.com?",
    answer: "WeeklyNaukri.com is an independent Indian job portal dedicated to providing weekly aggregates of the latest government job notifications (Sarkari Naukri), private IT job referrals, syllabus details, exam calendars, admit cards, and results."
  },
  {
    question: "Is WeeklyNaukri.com affiliated with the Government?",
    answer: "No, WeeklyNaukri.com is an independent platform and has no affiliation with any government organization, department, or recruitment board. We only compile public recruitment advertisements for convenience."
  },
  {
    question: "How often are the job postings updated?",
    answer: "Our automated scraper monitors official portals and updates Sarkari results, admit cards, and job listings weekly. Private jobs and referrals are posted in real-time as shared by the community."
  },
  {
    question: "How do I apply for a job featured on the site?",
    answer: "Click on any job listing to see the complete details, eligibility, fees, and important dates. At the bottom of the page, click the direct official application links to apply directly on the official recruitment portal."
  },
  {
    question: "How do community job referrals work?",
    answer: "Under the 'Referrals' tab, verified users can post open job vacancies at their respective companies. Other users can view these postings and apply using the provided referral links to get referred."
  },
  {
    question: "Is there any charge to use WeeklyNaukri.com?",
    answer: "No, all resources on WeeklyNaukri.com, including the job search engine, exam calendar, syllabus check, and community referrals, are 100% free of charge."
  },
  {
    question: "How can I check my Sarkari Result or download an Admit Card?",
    answer: "Go to the homepage and select either the 'Results' or 'Admit Cards' tab. Find your specific exam and click it to get the direct official login and download links."
  }
];

export default function FAQClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />

      {/* JSON-LD Schema for Google FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="text-center mb-10">
          <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about WeeklyNaukri, job listings, and referrals.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search FAQs (e.g. apply, referral, results)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <Card key={index} padding="p-0 overflow-hidden" hover={false}>
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-semibold text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-6 py-4 border-t border-gray-150 text-sm text-gray-700 leading-relaxed bg-white">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500">
              No matching questions found for "{searchTerm}".
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
