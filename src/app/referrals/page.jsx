import ReferralsClient from './ReferralsClient';

export const metadata = {
  title: 'Job Referrals & Employee Networking Board — WeeklyNaukri',
  description: 'Connect with employees at top tech companies like TCS, Wipro, Infosys, Cognizant, and Google for job referrals. Request or share open roles.',
  keywords: ['Job Referrals India', 'Tech Referrals Board', 'Wipro Referrals', 'TCS Referrals', 'LinkedIn Referrals', 'WeeklyNaukri Community'],
  alternates: {
    canonical: '/referrals',
  },
  openGraph: {
    title: 'Job Referrals & Employee Networking Board — WeeklyNaukri',
    description: 'Connect with employees at top tech companies like TCS, Wipro, Infosys, Cognizant, and Google for job referrals. Request or share open roles.',
    url: '/referrals',
    type: 'website',
  },
};

export default function ReferralsPage() {
  return <ReferralsClient />;
}
