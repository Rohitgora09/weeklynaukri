'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  PlusCircle, 
  Building2, 
  User, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Link2
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Tag from '../../components/ui/Tag';
import { api } from '../../services/api';

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Forms states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null); // ID of expanded comment section
  const [commentTexts, setCommentTexts] = useState({}); // Key: post ID, Value: comment text

  // Load referrals on mount
  const loadReferrals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/referrals?sort=recent');
      if (res.success) {
        setReferrals(res.data);
      }
    } catch (err) {
      setError('Failed to fetch referrals board entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReferrals();
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch (e) {}
    }
  }, []);

  const handlePostReferral = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be signed in to post referrals!');
      return;
    }

    try {
      const res = await api.post('/api/referrals', {
        company,
        role,
        description,
        link,
        author: currentUser.name
      });
      if (res.success) {
        setCompany('');
        setRole('');
        setDescription('');
        setLink('');
        setShowAddForm(false);
        loadReferrals();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit referral posting');
    }
  };

  const handleAddComment = async (e, refId) => {
    e.preventDefault();
    const commentText = commentTexts[refId] || '';
    if (!commentText.trim()) return;

    if (!currentUser) {
      alert('You must be signed in to comment!');
      return;
    }

    try {
      const res = await api.post(`/api/referrals/${refId}/comments`, {
        text: commentText,
        author: currentUser.name
      });
      if (res.success) {
        setCommentTexts(prev => ({ ...prev, [refId]: '' }));
        loadReferrals();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit comment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Top heading */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Referral Board</h1>
            <p className="text-gray-500 text-sm mt-1">Request and share employee referrals inside top hiring organizations.</p>
          </div>
          
          {currentUser ? (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Share a Referral
            </button>
          ) : (
            <Link 
              href="/login" 
              className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors inline-block"
            >
              Sign in to Post
            </Link>
          )}
        </div>

        {/* Add Referral Form Modal/View */}
        {showAddForm && (
          <Card padding="p-6" className="mb-8 border-blue-100 bg-blue-50/10" hover={false}>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" /> Share Referral Details
            </h3>
            
            <form onSubmit={handlePostReferral} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-650">Company Name</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google India"
                    className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-gray-400"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-650">Hiring Role / Title</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. SDE-2 (React/Node)"
                    className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-650">Job Description / Notes</label>
                <textarea
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share details about the vacancy, links to apply, or resume filters..."
                  className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-gray-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-650">Careers URL / Link (Must start with https://)</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://careers.google.com/..."
                  className="block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none bg-white focus:border-gray-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Publish Posting
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Board Listings */}
        {loading ? (
          <div className="text-center py-20">
            <span className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin inline-block"></span>
            <p className="text-gray-400 text-xs mt-3">Loading referral board postings...</p>
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-150 p-8">
            <p className="text-gray-500 font-medium">No referrals shared yet.</p>
            <p className="text-gray-400 text-xs mt-1">Be the first to post a referral opening for others!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {referrals.map((post) => (
              <Card key={post.id} padding="p-6" hover={false}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-semibold uppercase tracking-wide bg-blue-50 px-2.5 py-1 rounded-md mb-3">
                      <Building2 className="w-3.5 h-3.5" /> {post.company}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{post.role}</h3>
                  </div>
                  <span className="text-[10px] text-gray-450 font-medium">
                    {new Date(post.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                </div>

                <p className="text-sm text-gray-650 mt-3 whitespace-pre-line leading-relaxed">
                  {post.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-4 h-4 text-gray-400" /> Posted by: <strong className="text-gray-800">{post.author}</strong>
                  </span>
                  
                  <div className="flex items-center gap-3">
                    {post.link && (
                      <a 
                        href={post.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <Link2 className="w-3.5 h-3.5" /> Job Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    
                    <button
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="text-gray-700 hover:text-black font-semibold flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Comments ({post.comments?.length || 0})
                      {expandedPost === post.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Comment Box */}
                {expandedPost === post.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Discussion</h4>
                    
                    {/* Comments list */}
                    {post.comments?.length === 0 ? (
                      <p className="text-xs text-gray-450 italic py-2">No comments yet. Start the conversation!</p>
                    ) : (
                      <div className="space-y-3.5 mb-4 max-h-[200px] overflow-y-auto pr-1">
                        {post.comments.map((comm) => (
                          <div key={comm.id} className="bg-white border border-gray-100 rounded-xl p-3 text-xs shadow-sm shadow-black/[0.005]">
                            <div className="flex justify-between items-center text-gray-400 mb-1">
                              <span className="font-semibold text-gray-700">{comm.author}</span>
                              <span>{new Date(comm.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-gray-650 leading-relaxed">{comm.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add comment form */}
                    {currentUser ? (
                      <form 
                        onSubmit={(e) => handleAddComment(e, post.id)}
                        className="flex gap-2 items-center"
                      >
                        <input
                          type="text"
                          required
                          value={commentTexts[post.id] || ''}
                          onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Type a message or ask a question..."
                          className="flex-1 px-3.5 py-2 border border-gray-200 bg-white rounded-xl text-xs outline-none focus:border-gray-400"
                        />
                        <button
                          type="submit"
                          className="bg-black text-white p-2 rounded-xl hover:bg-gray-800 cursor-pointer shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-gray-450 text-center py-2">
                        You must <Link href="/login" className="text-blue-600 hover:underline font-bold">sign in</Link> to contribute comments.
                      </p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
