import FAQClient from './FAQClient';

export const metadata = {
  title: 'Sarkari Exam Help & FAQ: Frequently Asked Questions — WeeklyNaukri',
  description: 'Find answers to frequently asked questions about Sarkari Results, admit card downloads, applying online, syllabus updates, and company referrals at WeeklyNaukri.com.',
  keywords: [
    'Sarkari Result FAQ',
    'How to check result',
    'How to apply online',
    'WeeklyNaukri Support',
    'Exam Help Desk'
  ],
  alternates: {
    canonical: '/faq',
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
