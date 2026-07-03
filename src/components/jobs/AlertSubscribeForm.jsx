'use client';

import { useState } from 'react';
import { Bell, CheckCircle2, Loader2 } from 'lucide-react';
import { useLanguage, T } from '../../lib/LanguageContext';

const CATEGORIES = [
  { id: 'latestJobs', en: 'Latest Jobs', hi: 'नवीनतम नौकरियां' },
  { id: 'results', en: 'Results', hi: 'रिजल्ट' },
  { id: 'admitCards', en: 'Admit Cards', hi: 'एडमिट कार्ड' },
  { id: 'answerKeys', en: 'Answer Keys', hi: 'आंसर की' },
];

export default function AlertSubscribeForm() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState(['latestJobs']);
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');

  const toggleCategory = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (state === 'loading') return;
    setState('loading');
    setError('');
    try {
      const res = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, categories: selected }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Subscription failed');
      }
      setState('done');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div className="bg-white border border-green-200 rounded-2xl p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto text-ok mb-2" size={28} />
        <p className="font-bold text-ink text-sm">
          <T en="You're subscribed!" hi="सब्सक्रिप्शन हो गया!" />
        </p>
        <p className="text-xs text-slatebody mt-1">
          <T
            en="You'll get an email digest when new listings match your categories."
            hi="आपकी चुनी श्रेणियों में नई भर्ती आने पर ईमेल मिलेगा।"
          />
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
      aria-label="Job alert email subscription"
      data-testid="alert-subscribe-form"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="grid place-items-center w-8 h-8 rounded-lg bg-blue-50 text-action shrink-0">
          <Bell size={16} />
        </span>
        <h3 className="font-heading font-bold text-ink text-sm">
          <T en="Free Email Job Alerts" hi="फ्री ईमेल जॉब अलर्ट" />
        </h3>
      </div>
      <p className="text-xs text-slatebody mb-3">
        <T
          en="Get a daily digest of new listings in the categories you pick. Unsubscribe any time."
          hi="चुनी हुई श्रेणियों की नई भर्तियों का डेली ईमेल पाएं। कभी भी अनसब्सक्राइब करें।"
        />
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3" role="group" aria-label="Alert categories">
        {CATEGORIES.map((c) => {
          const active = selected.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCategory(c.id)}
              aria-pressed={active}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                active
                  ? 'bg-action text-white border-action'
                  : 'bg-white text-slatebody border-slate-200 hover:border-action hover:text-action'
              }`}
            >
              {lang === 'hi' ? c.hi : c.en}
            </button>
          );
        })}
      </div>

      <div className="flex items-center border border-slate-200 rounded-full overflow-hidden focus-within:border-action focus-within:ring-2 focus-within:ring-action/20 transition">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={lang === 'hi' ? 'आपका ईमेल पता' : 'Your email address'}
          className="w-full px-4 py-2.5 text-sm outline-none bg-transparent"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={state === 'loading' || selected.length === 0}
          className="bg-brand text-white text-xs font-bold px-5 py-3 hover:bg-action transition-colors cursor-pointer disabled:opacity-60 shrink-0 flex items-center gap-1.5"
        >
          {state === 'loading' && <Loader2 size={13} className="animate-spin" />}
          <T en="Subscribe" hi="सब्सक्राइब" />
        </button>
      </div>

      {state === 'error' && (
        <p className="text-xs text-alert mt-2" role="alert">{error}</p>
      )}
    </form>
  );
}
