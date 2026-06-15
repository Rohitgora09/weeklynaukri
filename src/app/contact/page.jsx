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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact WeeklyNaukri.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — WeeklyNaukri.com',
    description: 'Get in touch with WeeklyNaukri.com for questions, feedback, or job inquiries.',
    images: ['/og-image.png'],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
