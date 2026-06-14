import FAQClient from './FAQClient';

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
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
