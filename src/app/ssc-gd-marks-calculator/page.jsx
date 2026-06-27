import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SscGdCalculatorClient from './SscGdCalculatorClient';

export const metadata = {
  title: 'SSC GD Marks Calculator 2026 — Calculate Raw Score & Cutoff | WeeklyNaukri',
  description:
    'Use the free SSC GD Marks Calculator to calculate your raw marks with negative marking. Instantly check your SSC GD raw marks, SSC GD score calculator results, and compare against 2026 category-wise cutoffs.',
  alternates: {
    canonical: '/ssc-gd-marks-calculator',
  },
  openGraph: {
    title: 'SSC GD Marks Calculator 2026 — Calculate Raw Score & Cutoff | WeeklyNaukri',
    description:
      'Free SSC GD Marks Calculator 2026 — enter correct & incorrect answers to get your raw score instantly. Compare your SSC GD score against expected category cutoffs.',
    url: '/ssc-gd-marks-calculator',
    type: 'website',
    siteName: 'WeeklyNaukri.com',
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SSC GD Marks Calculator 2026 — WeeklyNaukri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SSC GD Marks Calculator 2026 — Calculate Raw Score & Cutoff | WeeklyNaukri',
    description:
      'Free SSC GD Marks Calculator 2026 — enter correct & incorrect answers to get your raw score instantly.',
    images: ['/og-image.png'],
  },
};

const faqData = [
  {
    question: 'What is the marking scheme for SSC GD 2026?',
    answer:
      'SSC GD 2026 follows a marking scheme of +2 marks for every correct answer and -0.25 marks for every incorrect answer. There is no penalty for unattempted questions. The exam has 80 questions, making the maximum possible score 160 marks.',
  },
  {
    question: 'How is negative marking calculated in SSC GD?',
    answer:
      'For each incorrect answer, 0.25 marks are deducted from your total score. So if you answer 4 questions wrong, you lose 1 mark in total. The formula is: Raw Score = (Correct × 2) − (Incorrect × 0.25).',
  },
  {
    question: 'What is the expected cutoff for SSC GD 2026?',
    answer:
      'Based on previous year trends and difficulty level, expected cutoffs are: General (UR) 128-136, OBC 124-132, EWS 122-130, SC 112-118, and ST 102-110. These are approximate and may vary after normalization.',
  },
  {
    question: 'When will SSC GD 2026 result be declared?',
    answer:
      'SSC GD 2026 results are expected to be declared within 2-3 months after the answer key challenge window closes. Candidates can check their results on the official SSC website at ssc.gov.in.',
  },
  {
    question: 'How does SSC normalize marks across shifts?',
    answer:
      'SSC uses a multi-shift normalization formula to equalize difficulty differences across exam shifts. The normalized score is calculated using the mean and standard deviation of marks in each shift, ensuring fairness for all candidates regardless of which shift they appeared in.',
  },
  {
    question: 'Can I download my SSC GD response sheet?',
    answer:
      'Yes, SSC releases candidate response sheets on the official website ssc.gov.in. Log in with your registration number and password to download your response sheet and verify your answers against the official answer key.',
  },
];

export default function SscGdMarksCalculatorPage() {
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SSC GD Marks Calculator 2026',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    url: 'https://weeklynaukri.com/ssc-gd-marks-calculator',
    description:
      'Free online calculator to estimate your SSC GD Constable 2026 raw marks with negative marking. Compare your score against category-wise expected cutoffs.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2340',
      bestRating: '5',
      worstRating: '1',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WeeklyNaukri.com',
      url: 'https://weeklynaukri.com',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full font-sans antialiased text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full" id="main-content">
        <SscGdCalculatorClient />
      </main>
      <Footer />

      {/* JSON-LD: SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      {/* JSON-LD: FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
