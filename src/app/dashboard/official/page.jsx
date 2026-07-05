'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
  Loader2,
  Inbox,
  Radar,
} from 'lucide-react';

const CATEGORY_COLORS = {
  latestJobs: 'bg-blue-50 text-action border-blue-100',
  results: 'bg-green-50 text-green-700 border-green-100',
  admitCards: 'bg-amber-50 text-amber-600 border-amber-100',
  answerKeys: 'bg-purple-50 text-purple-700 border-purple-100',
};

export default function OfficialDraftsPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(null); // draft id being acted on
  const [message, setMessage] = useState('');

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  });

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/official/drafts?status=draft', { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setDrafts(data.drafts);
      else setMessage(data.error || 'Could not load drafts — are you logged in as admin?');
    } catch (e) {
      setMessage('Could not load drafts.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const runScan = async () => {
    setScanning(true);
    setMessage('');
    try {
      const res = await fetch('/api/official/scan', { method: 'POST', headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setMessage(`Scan complete — ${data.added} new notice${data.added === 1 ? '' : 's'} found.`);
        loadDrafts();
      } else {
        setMessage(data.error || 'Scan failed.');
      }
    } catch (e) {
      setMessage('Scan failed.');
    }
    setScanning(false);
  };

  const act = async (id, action) => {
    setBusy(id);
    try {
      const res = await fetch('/api/official/drafts', {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.success) {
        setDrafts((prev) => prev.filter((d) => d.id !== id));
        if (action === 'publish' && data.url) setMessage(`Published: ${data.url}`);
      } else {
        setMessage(data.error || 'Action failed.');
      }
    } catch (e) {
      setMessage('Action failed.');
    }
    setBusy(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slatebody hover:text-ink">
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center gap-1.5 bg-brand text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-action transition-colors cursor-pointer disabled:opacity-60"
          >
            {scanning ? <Loader2 size={13} className="animate-spin" /> : <Radar size={13} />}
            {scanning ? 'Scanning sources…' : 'Scan sources now'}
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-heading font-bold text-2xl text-ink">Official Notices — Review Queue</h1>
          <button onClick={loadDrafts} aria-label="Refresh list" className="text-slatebody hover:text-ink cursor-pointer p-2">
            <RefreshCw size={16} />
          </button>
        </div>
        <p className="text-sm text-slatebody mb-6">
          New notices detected on UPSC, IBPS and RPSC official sites. Publish sends a notice live on the
          site; reject hides it permanently.
        </p>

        {message && (
          <div className="mb-4 text-sm bg-blue-50 border border-blue-100 text-ink rounded-xl px-4 py-3" role="status">
            {message}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slatebody">
            <Loader2 className="animate-spin mx-auto mb-2" size={24} /> Loading…
          </div>
        ) : drafts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <Inbox className="mx-auto text-slate-300 mb-3" size={36} />
            <p className="font-semibold text-ink">Queue is empty</p>
            <p className="text-sm text-slatebody mt-1">
              Run a scan, or wait for the cron to detect new notices.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((d) => (
              <div
                key={d.id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-ink">{d.title}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 bg-slate-100 text-slatebody border border-slate-200">
                      {d.source}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 border ${
                        CATEGORY_COLORS[d.category] || CATEGORY_COLORS.latestJobs
                      }`}
                    >
                      {d.category}
                    </span>
                    <a
                      href={d.notice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-action hover:underline"
                    >
                      View official notice <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => act(d.id, 'publish')}
                    disabled={busy === d.id}
                    className="flex items-center gap-1.5 bg-ok text-white text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 size={13} /> Publish
                  </button>
                  <button
                    onClick={() => act(d.id, 'reject')}
                    disabled={busy === d.id}
                    className="flex items-center gap-1.5 bg-white text-alert border border-red-200 text-xs font-bold px-4 py-2 rounded-full hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <XCircle size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
