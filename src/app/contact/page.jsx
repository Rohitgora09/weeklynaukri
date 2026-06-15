import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us — WeeklyNaukri.com',
  description: 'Get in touch with WeeklyNaukri.com for questions, feedback, or job inquiries.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us — WeeklyNaukri.com',
    description: 'Get in touch with WeeklyNaukri.com for questions, feedback, or job inquiries.',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
