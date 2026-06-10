import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Briefcase, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Privacy Policy — WeeklyNaukri.com</title>
        <meta name="description" content="Read the Privacy Policy of WeeklyNaukri.com. Learn how we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://weeklynaukri.com/privacy-policy" />
        <meta property="og:title" content="Privacy Policy — WeeklyNaukri.com" />
        <meta property="og:description" content="Read the Privacy Policy of WeeklyNaukri.com." />
        <meta property="og:url" content="https://weeklynaukri.com/privacy-policy" />
        <meta property="og:site_name" content="WeeklyNaukri.com" />
      </Helmet>
      {/* ─── Nav ──────────────────────────────────────────── */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="WeeklyNaukri Logo" width="80" height="80" className="h-16 w-16 md:h-20 md:w-20 object-cover object-center rounded-full shadow-md shrink-0" />
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12 pb-20">
        {/* ─── Header ─────────────────────────────────────── */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-950">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-500 text-sm">Last updated: June 6, 2026</p>
        </div>

        {/* ─── Content ────────────────────────────────────── */}
        <div className="animate-fade-in-up space-y-10" style={{ animationDelay: '0.2s' }}>

          <section>
            <p className="text-gray-600 text-sm leading-relaxed">
              Welcome to WeeklyNaukri.com. We are committed to protecting your privacy. This Privacy Policy outlines the types of personal information that is received and collected by WeeklyNaukri.com and how it is used.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Information We Collect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              When you visit our website, register on our site, subscribe to our newsletter, or fill a form, we may collect the following information:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                Personal identification information (name, email address, phone number, etc.)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                Demographic information (age, gender, etc.)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                Browser and device information (IP address, browser type, etc.)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                Usage data (pages visited, time spent on site, etc.)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How We Use Your Information</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              The information we collect is used in the following ways:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                To personalize your experience and deliver content relevant to your interests
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                To improve our website based on your feedback and usage patterns
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                To send periodic emails with job updates, results, and admit card notifications
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                To respond to your inquiries, questions, and other requests
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              WeeklyNaukri.com uses cookies to enhance your browsing experience. Cookies are small files that a site transfers to your computer's hard drive through your web browser (if you allow) that enables the site to recognize your browser and capture certain information. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies via your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Third-Party Services</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may use third-party services such as Google Analytics and Google AdSense that collect, monitor, and analyze usage data to improve our service. These third-party service providers have their own privacy policies addressing how they use such information. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Data Security</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">External Links</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our website may contain links to external sites such as official government job portals (SSC, UPSC, Railway, etc.). WeeklyNaukri.com is not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of every site you visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Children's Privacy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              WeeklyNaukri.com reserves the right to update this privacy policy at any time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. You are advised to review this page periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-700 font-medium">WeeklyNaukri.com</p>
              <p className="text-sm text-gray-500 mt-1">
                Email: <a href="mailto:contact@weeklynaukri.com" className="text-black font-medium hover:underline">contact@weeklynaukri.com</a>
              </p>
              <Link
                to="/contact"
                className="inline-block mt-4 bg-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/20"
              >
                Contact Us
              </Link>
            </div>
          </section>

          {/* ─── Disclaimer ──────────────────────────────── */}
          <section className="border-t border-gray-200 pt-8">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-500">Disclaimer:</strong> WeeklyNaukri.com is not affiliated with any government organization. All job information, results, admit cards, and answer keys are sourced from official government websites and public sources. We recommend verifying all information from official sources before taking any action. WeeklyNaukri.com is not responsible for any errors or omissions in the content provided.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
