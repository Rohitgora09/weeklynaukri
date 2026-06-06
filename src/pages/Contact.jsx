import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  Briefcase,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Nav ──────────────────────────────────────────── */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="WeeklyNaukri Logo" className="h-16 w-16 md:h-20 md:w-20 object-cover object-center rounded-full shadow-md shrink-0" />
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-20">
        {/* ─── Header ─────────────────────────────────────── */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Have a question, suggestion, or need support? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Contact Info Cards ───────────────────────── */}
          <div className="lg:col-span-1 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-950">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-sm text-gray-500 mb-2">For general inquiries, support, or feedback</p>
              <a href="mailto:contact@weeklynaukri.com" className="text-sm font-medium text-black hover:underline">
                contact@weeklynaukri.com
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-950">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
              <p className="text-sm text-gray-500 mb-2">Mon – Sat, 9 AM to 6 PM IST</p>
              <a href="tel:+919876543210" className="text-sm font-medium text-black hover:underline">
                +91 98765 43210
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-950">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-sm text-gray-500">
                WeeklyNaukri.com<br />
                India
              </p>
            </div>
          </div>

          {/* ─── Contact Form ────────────────────────────── */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                    className="bg-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Send us a message</h2>
                  <p className="text-sm text-gray-500 mb-6">Fill in the form below and we'll respond as quickly as possible.</p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/10 bg-white cursor-pointer"
                      >
                        <option value="">Select a topic</option>
                        <option>General Inquiry</option>
                        <option>Report a Bug</option>
                        <option>Job Listing Issue</option>
                        <option>Advertising / Partnership</option>
                        <option>Feedback / Suggestion</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us how we can help..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-950 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-blue-900 transition-colors cursor-pointer flex items-center gap-2 shadow-md shadow-blue-950/20"
                    >
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ─── About Section ─────────────────────────────── */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-gray-50 rounded-2xl p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About WeeklyNaukri.com</h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                WeeklyNaukri.com is a trusted weekly job portal dedicated to helping Indian job seekers find the latest government and private sector employment opportunities. We aggregate job listings from official sources including SSC, UPSC, Railway, Banking, Defence, and State PSCs.
              </p>
              <p>
                Our team of experienced content writers and researchers updates the portal every week to ensure you have access to the most accurate and timely information about new vacancies, exam results, admit cards, answer keys, and admission notifications.
              </p>
              <h3 className="font-semibold text-gray-900 pt-2">Content Transparency</h3>
              <p>
                At WeeklyNaukri.com, we write articles based on thorough research, using information from reliable sources like official government websites, press releases, and verified news publications. We aim to provide accurate and trustworthy information, following strict guidelines for quality and fact-checking.
              </p>
              <p>
                If you have questions or want to suggest changes to any content on our website, please reach out to us at <a href="mailto:contact@weeklynaukri.com" className="font-medium text-black hover:underline">contact@weeklynaukri.com</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
