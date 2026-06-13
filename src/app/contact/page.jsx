import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact Us — WeeklyNaukri.com',
  description: 'Get in touch with WeeklyNaukri.com for questions, feedback, or job inquiries.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
