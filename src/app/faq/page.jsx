import FAQClient from './FAQClient';

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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
};

export const metadata = {
  title: 'Sarkari Exam FAQ: Help & FAQs — WeeklyNaukri',
  description: 'Find answers to FAQs about Sarkari Results, admit card downloads, online application, syllabus updates, and referrals at WeeklyNaukri.com.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'Sarkari Exam FAQ: Help & FAQs — WeeklyNaukri',
    description: 'Find answers to FAQs about Sarkari Results, admit card downloads, online application, syllabus updates, and referrals at WeeklyNaukri.com.',
    url: '/faq',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'WeeklyNaukri FAQ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarkari Exam FAQ: Help & FAQs — WeeklyNaukri',
    description: 'Find answers to FAQs about Sarkari Results, admit card downloads, online application, syllabus updates, and referrals at WeeklyNaukri.com.',
    images: ['/og-image.png'],
  },
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQClient />
    </>
  );
}
