import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';

export const metadata = {
  title: 'Privacy Policy — WeeklyNaukri.com',
  description: 'Read the privacy policy of WeeklyNaukri.com to learn how we protect your personal details.'
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Privacy Policy</h1>
        
        <Card padding="p-6 md:p-8 space-y-6 text-sm text-gray-700 leading-relaxed" hover={false}>
          <p className="text-xs text-gray-400">Last Updated: June 12, 2026</p>
          
          <p>
            At <strong className="text-gray-900">WeeklyNaukri.com</strong>, accessible from https://weeklynaukri.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by WeeklyNaukri and how we use it.
          </p>

          <h3 className="text-lg font-bold text-gray-900">1. Information We Collect</h3>
          <p>
            We collect personal details that you voluntarily submit to us (such as name, email, and password during signup or contact form submissions). We also track lightweight web metrics (pageviews, browser details, and device category) to display dashboard traffic trends.
          </p>

          <h3 className="text-lg font-bold text-gray-900">2. Privacy & IP Anonymization</h3>
          <p>
            To protect user identities, client IP addresses are hashed using a secure daily salt before storing them in our database. We do not persist raw, cleartext IP addresses.
          </p>

          <h3 className="text-lg font-bold text-gray-900">3. Cookies</h3>
          <p>
            Like any other website, WeeklyNaukri uses cookies to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h3 className="text-lg font-bold text-gray-900">4. Third-Party Services</h3>
          <p>
            We integrate standard third-party tools such as Google Analytics (GA4) for aggregated site analytics. These external services set cookies and have their own respective privacy terms.
          </p>

          <h3 className="text-lg font-bold text-gray-900">5. Security</h3>
          <p>
            We employ standard cryptographic measures (including bcrypt password hashing and JSON Web Tokens) to secure user authentication sessions.
          </p>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
