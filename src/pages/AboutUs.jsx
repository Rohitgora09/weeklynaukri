import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Users } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>About Us — WeeklyNaukri.com</title>
        <meta name="description" content="Learn more about WeeklyNaukri.com, India's #1 weekly job portal for government and private sector jobs." />
        <link rel="canonical" href="https://weeklynaukri.com/about" />
        <meta property="og:title" content="About Us — WeeklyNaukri.com" />
        <meta property="og:description" content="Learn more about WeeklyNaukri.com, India's #1 weekly job portal." />
        <meta property="og:url" content="https://weeklynaukri.com/about" />
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
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">About Us</h1>
          </div>
          <p className="text-gray-500 text-sm">Empowering millions of job seekers across India.</p>
        </div>

        {/* ─── Content ────────────────────────────────────── */}
        <div className="animate-fade-in-up space-y-10" style={{ animationDelay: '0.2s' }}>

          <section>
            <p className="text-gray-600 text-sm leading-relaxed">
              Welcome to WeeklyNaukri.com, your number one source for all job notifications. We're dedicated to giving you the very best updates, with a focus on dependability, customer service, and uniqueness.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              We started WeeklyNaukri.com with a single goal: to simplify the job search process for millions of Indian youth. Navigating through multiple government portals to find the latest updates on SSC, UPSC, Banking, and Defense jobs can be overwhelming. We streamline this process by providing:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                Real-time updates on latest government and private jobs.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                Quick access to Admit Cards, Answer Keys, and Exam Results.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                Syllabus and Exam Preparation materials all in one place.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Do</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our team works around the clock, continuously monitoring official notifications, news websites, and various other authentic sources to ensure you get accurate information as quickly as possible. Whether it's a new recruitment drive, exam date postponement, or final result declaration—you'll find it here first.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Get in Touch</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We hope you enjoy our platform as much as we enjoy offering it to you. If you have any questions or comments, please don't hesitate to contact us.
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
              <strong className="text-gray-500">Disclaimer:</strong> WeeklyNaukri.com is a private entity and is not affiliated with any government organization. All job information, results, admit cards, and answer keys are sourced from official government websites and public sources. We recommend verifying all information from official sources before taking any action.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
