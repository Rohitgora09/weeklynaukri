import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MessageCircle, Send, Briefcase, PlusCircle, Building2, UserCircle, ExternalLink, Clock, Filter } from 'lucide-react';

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('recent'); // 'recent' or 'all'
  
  // Modals state
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  
  // Form state
  const [postForm, setPostForm] = useState({ company: '', role: '', description: '', link: '', author: '' });
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    } catch (e) {
      console.warn("Failed to parse current user:", e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('adminPassword');
    setCurrentUser(null);
    window.location.reload();
  };

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/referrals${filter === 'recent' ? '?sort=recent' : ''}`);
      const data = await res.json();
      if (data.success) {
        setReferrals(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch referrals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [filter]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowPostModal(false);
        setPostForm({ company: '', role: '', description: '', link: '', author: '' });
        fetchReferrals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e, id) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`/api/referrals/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText, author: commentAuthor })
      });
      const data = await res.json();
      if (data.success) {
        setCommentText('');
        fetchReferrals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins || 1}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>Community Referrals — WeeklyNaukri.com</title>
        <meta name="description" content="Connect with professionals, ask for job referrals, and view open positions posted by our community." />
      </Helmet>

      {/* ─── Nav ──────────────────────────────────────────── */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="WeeklyNaukri Logo" width="48" height="48" className="h-10 w-10 md:h-12 md:w-12 object-cover object-center rounded-full shadow-sm shrink-0" />
            <span className="font-bold text-gray-900 tracking-tight hidden sm:block">WeeklyNaukri</span>
          </Link>
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-705 hidden sm:inline">
                  Hi, {currentUser.name}
                </span>
                {currentUser.role === 'admin' && (
                  <Link to="/dashboard" className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-250 px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer border border-gray-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black">Login</Link>
            )}
            <button 
              onClick={() => setShowPostModal(true)}
              className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post Referral</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-amber-500" />
            Community Referrals
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Help others get hired! Post open roles at your company, or comment below posts to request a referral.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 flex items-center justify-between animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setFilter('recent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'recent' ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Recent Referrals
            </button>
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              All Posts
            </button>
          </div>
          <div className="px-3">
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">Loading referrals...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No referrals yet</h3>
              <p className="text-gray-500 text-sm mb-6">Be the first to share an open role at your company!</p>
              <button 
                onClick={() => setShowPostModal(true)}
                className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors inline-block"
              >
                Post a Referral
              </button>
            </div>
          ) : (
            referrals.map((post, idx) => (
              <div 
                key={post.id} 
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up"
                style={{animationDelay: `${0.1 + (idx * 0.05)}s`}}
              >
                {/* Post Header */}
                <div className="p-5 sm:p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-amber-100 rounded-full flex items-center justify-center shrink-0">
                        <UserCircle className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{post.author || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{post.role}</h3>
                  <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mb-4">
                    <Building2 className="w-4 h-4" />
                    {post.company}
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {post.description}
                  </p>
                  
                  {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-lg transition-colors w-fit">
                      View Job Post <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Comments Section */}
                <div className="bg-gray-50/50 p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                      {post.comments?.length || 0} Comments
                    </h4>
                    <button 
                      onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      {activeCommentId === post.id ? 'Hide Comments' : 'Add Comment'}
                    </button>
                  </div>

                  {/* Comment List */}
                  {post.comments?.length > 0 && (
                    <div className="space-y-4 mb-4">
                      {post.comments.map(c => (
                        <div key={c.id} className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900">{c.author || 'Anonymous'}</span>
                            <span className="text-[10px] text-gray-400">{formatDate(c.createdAt)}</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Form */}
                  {activeCommentId === post.id && (
                    <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex flex-col gap-3 mt-4 animate-fade-in-up">
                      <input 
                        type="text" 
                        placeholder="Your Name (Optional)" 
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          required
                          placeholder="Write a comment... (e.g. Interested! Sent you a DM)" 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        />
                        <button type="submit" className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Post a Referral</h2>
              <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handlePostSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Your Name</label>
                  <input type="text" placeholder="e.g. Aman Kumar" value={postForm.author} onChange={e => setPostForm({...postForm, author: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 hover:bg-white transition-colors" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Company Name *</label>
                  <input type="text" required placeholder="e.g. TCS, Amazon" value={postForm.company} onChange={e => setPostForm({...postForm, company: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 hover:bg-white transition-colors" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Role / Title *</label>
                  <input type="text" required placeholder="e.g. Software Engineer" value={postForm.role} onChange={e => setPostForm({...postForm, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 hover:bg-white transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Job Link (Optional)</label>
                <input type="url" placeholder="https://..." value={postForm.link} onChange={e => setPostForm({...postForm, link: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 hover:bg-white transition-colors" />
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Description / Details *</label>
                <textarea required rows={4} placeholder="What are the requirements? How should people contact you?" value={postForm.description} onChange={e => setPostForm({...postForm, description: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 hover:bg-white transition-colors resize-none"></textarea>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-amber-500 text-white font-medium py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/30">
                  Post to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
