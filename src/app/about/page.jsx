import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';

export const metadata = {
  title: 'About Us — WeeklyNaukri.com',
  description: 'Learn more about WeeklyNaukri.com, India\'s #1 weekly government and private job notification portal.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us — WeeklyNaukri.com',
    description: 'Learn more about WeeklyNaukri.com, India\'s #1 weekly government and private job notification portal.',
    url: '/about',
    type: 'website',
  },
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">About WeeklyNaukri.com</h1>
        
        <Card padding="p-6 md:p-8 space-y-6 text-sm text-gray-700 leading-relaxed" hover={false}>
          <p>
            Welcome to <strong className="text-gray-900">WeeklyNaukri.com</strong>, India's leading job alert and sarkari result aggregation portal. Our mission is simple: to connect job seekers across the nation with real, verified employment opportunities in both public and private sectors.
          </p>

          <h3 className="text-lg font-bold text-gray-900">Our Story</h3>
          <p>
            WeeklyNaukri was founded with the vision of streamlining the scattered job alerts landscape in India. We observed that candidates spent hours navigating complicated, slow government portals to locate notices, admit cards, or declared results. We decided to simplify this process by scraping, gathering, and organizing all this data into a clean, modern, and lightning-fast portal.
          </p>

          <h3 className="text-lg font-bold text-gray-900">What We Offer</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Latest Government Jobs:</strong> Real-time feeds of central, state, banking, railways, defence, and state PSC exams.</li>
            <li><strong>Admit Cards & Results:</strong> Quick links to download hall tickets and check result notifications.</li>
            <li><strong>Private Careers Board:</strong> Curated job postings from top tech and private enterprises matching active resumes.</li>
            <li><strong>Referrals Board:</strong> Community-driven request forum to solicit job referrals inside prominent organizations.</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900">Our Commitment</h3>
          <p>
            We are dedicated to accuracy, speed, and privacy. While we gather and compile notices from official government departments, we are an independent organization and not affiliated with any government body. Candidates are always advised to verify the details on the respective official portals.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
