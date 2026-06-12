'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import { api } from '../../services/api';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/api/contact', {
        name,
        email,
        subject,
        message
      });
      if (res.success) {
        setSuccess(res.message || 'Your message has been received!');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit contact form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="text-gray-500 text-sm mt-2">Have a question or feedback? Drop us a line below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="md:col-span-8">
            <Card padding="p-6 md:p-8" hover={false}>
              {error && <div className="mb-6 p-4 bg-red-50 text-red-750 text-xs rounded-xl border border-red-100">{error}</div>}
              {success && <div className="mb-6 p-4 bg-green-50 text-green-750 text-xs rounded-xl border border-green-100">{success}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-750">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-gray-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-750">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-750">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Feedback, Job Inquiry, etc."
                    className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-gray-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-750">Message</label>
                  <textarea
                    required
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message details..."
                    className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-gray-800 text-white py-3.5 rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Sending Message...' : 'Send Message'} <Send className="w-4 h-4" />
                </button>
              </form>
            </Card>
          </div>

          {/* Quick info */}
          <div className="md:col-span-4 space-y-6">
            <Card padding="p-5" hover={false} className="bg-blue-50/10 border-blue-50">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" /> Quick Support
              </h3>
              <div className="space-y-4 text-xs text-gray-650">
                <p className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-gray-850 block">Email</strong>
                    support@weeklynaukri.com
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-gray-850 block">Telegram Updates</strong>
                    @weeklynaukri
                  </span>
                </p>
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-gray-850 block">Office location</strong>
                    New Delhi, India
                  </span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
