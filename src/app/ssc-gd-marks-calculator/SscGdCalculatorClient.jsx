'use client';

import { useState } from 'react';
import Card from '../../components/ui/Card';
import {
  Calculator,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Calendar,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Target,
  BarChart3,
  Shield,
  Users,
  MessageCircle,
  Link as LinkIcon,
  Info,
  Award,
  TrendingUp,
  Send,
} from 'lucide-react';

/* ─────────────── Cutoff Data ─────────────── */
const cutoffData = [
  { category: 'General (UR)', min: 128, max: 136, color: 'bg-indigo-500' },
  { category: 'OBC', min: 124, max: 132, color: 'bg-violet-500' },
  { category: 'EWS', min: 122, max: 130, color: 'bg-purple-500' },
  { category: 'SC', min: 112, max: 118, color: 'bg-fuchsia-500' },
  { category: 'ST', min: 102, max: 110, color: 'bg-pink-500' },
];

/* ─────────────── FAQ Data ─────────────── */
const faqItems = [
  {
    q: 'What is the marking scheme for SSC GD 2026?',
    a: 'SSC GD 2026 follows a marking scheme of +2 marks for every correct answer and −0.25 marks for every incorrect answer. There is no penalty for unattempted questions. The exam consists of 80 questions worth a maximum of 160 marks.',
  },
  {
    q: 'How is negative marking calculated?',
    a: 'For each wrong answer, 0.25 marks are deducted from your total score. If you answer 4 questions incorrectly, you lose 1 full mark. The formula is: Raw Score = (Correct × 2) − (Incorrect × 0.25). Unattempted questions carry zero marks.',
  },
  {
    q: 'What is the expected cutoff for SSC GD 2026?',
    a: 'Based on analysis of difficulty level, vacancy count (39,481 posts), and previous year trends, the expected cutoffs are: General (UR) 128–136, OBC 124–132, EWS 122–130, SC 112–118, and ST 102–110. These are approximate and may change after SSC applies normalization across shifts.',
  },
  {
    q: 'When will SSC GD 2026 result be declared?',
    a: 'SSC GD 2026 results are expected to be declared within 2–3 months after the answer key challenge window closes. Candidates can check their results on the official SSC website at ssc.gov.in. WeeklyNaukri will also publish instant result updates.',
  },
  {
    q: 'How does SSC normalize marks across shifts?',
    a: 'SSC uses a multi-shift normalization formula developed by IIT Delhi to equalize difficulty differences. The normalized score is computed using the mean and standard deviation of marks of all candidates in each shift. This ensures no candidate is disadvantaged due to a harder or easier question paper.',
  },
  {
    q: 'Can I download my SSC GD response sheet?',
    a: 'Yes, SSC releases individual candidate response sheets on ssc.gov.in after releasing the provisional answer key. You need to log in with your registration number and password to access it. You can also raise objections against answer keys during the challenge window.',
  },
];

/* ════════════════ MAIN COMPONENT ════════════════ */
export default function SscGdCalculatorClient() {
  /* ── Calculator State ── */
  const [correct, setCorrect] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const [score, setScore] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState('');
  const [attempted, setAttempted] = useState(null);
  const [unattempted, setUnattempted] = useState(null);

  /* ── FAQ accordion state ── */
  const [openFaq, setOpenFaq] = useState(null);

  /* ── Calculate handler ── */
  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    setScore(null);

    const c = parseInt(correct) || 0;
    const inc = parseInt(incorrect) || 0;
    const total = c + inc;

    if (c < 0 || inc < 0) {
      setError('Values cannot be negative.');
      return;
    }
    if (total > 80) {
      setError('Total attempted (Correct + Incorrect) cannot exceed 80.');
      return;
    }

    const calculatedScore = c * 2 - inc * 0.25;
    const calculatedAccuracy = total > 0 ? Math.round((c / total) * 100) : 0;

    setScore(calculatedScore);
    setAccuracy(calculatedAccuracy);
    setAttempted(total);
    setUnattempted(80 - total);
  };

  /* ── Reset handler ── */
  const handleReset = () => {
    setCorrect('');
    setIncorrect('');
    setScore(null);
    setAccuracy(null);
    setError('');
    setAttempted(null);
    setUnattempted(null);
  };

  /* ── Status alert logic ── */
  const getStatusAlert = () => {
    if (score === null) return null;
    if (score >= 128) {
      return {
        title: 'Strong Chance of Selection!',
        text: 'Your predicted score is above the general cutoff range (~128–136). Start preparing for the Physical Efficiency Test (PET/PST) immediately!',
        bg: 'bg-emerald-50 border-emerald-200',
        textColor: 'text-emerald-800',
        icon: CheckCircle2,
        iconColor: 'text-emerald-600',
      };
    } else if (score >= 112) {
      return {
        title: 'Moderate Chance of Selection',
        text: 'Your raw score is in the moderate buffer range. You have good chances for OBC/EWS/SC category posts. Begin light physical training while waiting for normalized results.',
        bg: 'bg-amber-50 border-amber-200',
        textColor: 'text-amber-800',
        icon: AlertCircle,
        iconColor: 'text-amber-600',
      };
    } else {
      return {
        title: 'Borderline — Keep Trying!',
        text: 'Your score is below the predicted threshold. However, normalization across shifts could still improve your final score. Keep preparing for other upcoming SSC exams.',
        bg: 'bg-sky-50 border-sky-200',
        textColor: 'text-sky-800',
        icon: Info,
        iconColor: 'text-sky-600',
      };
    }
  };

  const status = getStatusAlert();
  const scorePercent = score !== null ? Math.min(Math.max((score / 160) * 100, 0), 100) : 0;

  return (
    <div className="space-y-12">
      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-8 md:p-14 shadow-2xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-6 right-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        <div className="absolute top-20 right-32 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-12 right-20 w-1 h-1 bg-indigo-300 rounded-full animate-pulse delay-700" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-200 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Free Score Calculator
          </span>

          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            SSC GD Constable 2026
            <br />
            <span className="bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Marks Calculator
            </span>
          </h1>

          <p className="text-indigo-200 text-sm md:text-base leading-relaxed max-w-2xl">
            Calculate your SSC GD raw score instantly with the official marking scheme — +2 for correct,
            −0.25 for incorrect answers. Compare against expected category-wise cutoffs and understand your
            chances before the result is declared.
          </p>
        </div>
      </section>

      {/* ═══════ MAIN GRID ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Left Column: Calculator + Results ─── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Calculator Form */}
          <Card padding="p-0" className="border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 md:px-8 py-5">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-indigo-200" />
                Calculate Your Raw Score
              </h2>
              <p className="text-indigo-100 text-xs mt-1">
                Enter correct &amp; incorrect answers below. Total questions = 80 (Max marks = 160).
              </p>
            </div>

            <div className="p-6 md:p-8">
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Correct */}
                  <div>
                    <label htmlFor="calc-correct" className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        Correct Answers
                      </span>
                    </label>
                    <input
                      type="number"
                      id="calc-correct"
                      value={correct}
                      onChange={(e) => setCorrect(e.target.value)}
                      placeholder="e.g. 60"
                      min="0"
                      max="80"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900 bg-gray-50/50"
                      required
                    />
                    <span className="text-[11px] text-gray-400 mt-1 block">+2 marks each</span>
                  </div>

                  {/* Incorrect */}
                  <div>
                    <label htmlFor="calc-incorrect" className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                        Incorrect Answers
                      </span>
                    </label>
                    <input
                      type="number"
                      id="calc-incorrect"
                      value={incorrect}
                      onChange={(e) => setIncorrect(e.target.value)}
                      placeholder="e.g. 12"
                      min="0"
                      max="80"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900 bg-gray-50/50"
                      required
                    />
                    <span className="text-[11px] text-gray-400 mt-1 block">−0.25 marks each</span>
                  </div>

                  {/* Total (fixed) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                        Total Questions
                      </span>
                    </label>
                    <input
                      type="text"
                      value="80"
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 font-bold text-gray-500 cursor-not-allowed"
                    />
                    <span className="text-[11px] text-gray-400 mt-1 block">Fixed (MCQ)</span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/25 cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    Calculate Score
                  </button>
                  {score !== null && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-3.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all font-semibold text-sm cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>

              {/* ─── Results Section ─── */}
              {score !== null && (
                <div className="mt-10 border-t border-gray-100 pt-8 space-y-6 animate-[fadeIn_0.4s_ease-out]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Your Scoring Summary
                  </h3>

                  {/* Score summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-center">
                      <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Attempted</span>
                      <strong className="text-xl font-extrabold text-gray-800">{attempted}<span className="text-sm text-gray-400">/80</span></strong>
                    </div>
                    <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl text-center">
                      <span className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">Correct</span>
                      <strong className="text-xl font-extrabold text-emerald-700">{correct}</strong>
                    </div>
                    <div className="bg-red-50/60 border border-red-100 p-4 rounded-xl text-center">
                      <span className="block text-[10px] font-semibold text-red-600 uppercase tracking-wider mb-1">Incorrect</span>
                      <strong className="text-xl font-extrabold text-red-700">{incorrect}</strong>
                    </div>
                    <div className="bg-slate-50/60 border border-slate-200 p-4 rounded-xl text-center">
                      <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Unattempted</span>
                      <strong className="text-xl font-extrabold text-slate-700">{unattempted}</strong>
                    </div>
                    <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-xl text-center">
                      <span className="block text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mb-1">Accuracy</span>
                      <strong className="text-xl font-extrabold text-indigo-700">{accuracy}%</strong>
                    </div>
                  </div>

                  {/* Large score display */}
                  <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white p-6 md:p-8 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
                      <div>
                        <span className="block text-xs text-indigo-300 uppercase tracking-wider font-semibold mb-1">
                          Your Estimated Raw Score
                        </span>
                        <div className="flex items-baseline gap-2">
                          <strong className="text-4xl md:text-5xl font-black tracking-tight">{score}</strong>
                          <span className="text-indigo-300 text-lg font-semibold">/ 160</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold">
                          Provisional Score
                        </span>
                        <span className="text-[11px] text-indigo-300">
                          Before normalization
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6 relative z-10">
                      <div className="flex justify-between text-[10px] text-indigo-300 font-medium mb-1.5">
                        <span>0</span>
                        <span>{Math.round(scorePercent)}% of maximum</span>
                        <span>160</span>
                      </div>
                      <div className="w-full h-3 bg-indigo-800/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${scorePercent}%`,
                            background: scorePercent >= 80 ? 'linear-gradient(90deg, #34d399, #10b981)' :
                                        scorePercent >= 70 ? 'linear-gradient(90deg, #a78bfa, #8b5cf6)' :
                                        scorePercent >= 50 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' :
                                        'linear-gradient(90deg, #f87171, #ef4444)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cutoff comparison table */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" />
                      Category-wise Cutoff Comparison
                    </h4>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-100">
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Expected Cutoff</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Your Score</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cutoffData.map((cat, i) => {
                            const above = score >= cat.min;
                            return (
                              <tr key={cat.category} className={`border-b border-gray-50 last:border-0 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                                <td className="py-3 px-4 font-semibold text-gray-800 flex items-center gap-2">
                                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                                  {cat.category}
                                </td>
                                <td className="py-3 px-4 text-center text-gray-600 font-medium">{cat.min} – {cat.max}</td>
                                <td className="py-3 px-4 text-center font-bold text-gray-900">{score}</td>
                                <td className="py-3 px-4 text-center">
                                  {above ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                      <CheckCircle2 className="w-3 h-3" /> Above
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                                      <AlertCircle className="w-3 h-3" /> Below
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 italic">
                      *Cutoff ranges are estimated based on vacancy count and previous year trends. Actual cutoffs depend on normalization.
                    </p>
                  </div>

                  {/* Status Alert */}
                  {status && (
                    <div className={`p-5 border rounded-2xl flex gap-4 ${status.bg} ${status.textColor}`}>
                      <status.icon className={`w-6 h-6 shrink-0 mt-0.5 ${status.iconColor}`} />
                      <div>
                        <h4 className="font-extrabold text-base mb-1">{status.title}</h4>
                        <p className="text-sm leading-relaxed opacity-90">{status.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* ═══════ NORMALIZATION SECTION ═══════ */}
          <section>
            <Card padding="p-6 md:p-8" className="border-gray-200 shadow-sm bg-white rounded-2xl">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                How SSC Normalization Works
              </h2>

              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  SSC conducts the GD Constable exam across <strong>multiple shifts and days</strong> to
                  accommodate lakhs of candidates. Since different shifts may have varying difficulty levels,
                  SSC applies a <strong>normalization formula</strong> to equalize scores across shifts so
                  that no candidate is unfairly advantaged or disadvantaged.
                </p>

                <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-5">
                  <h3 className="font-bold text-indigo-900 text-sm mb-2">The Normalization Formula</h3>
                  <p className="text-indigo-800 text-sm leading-relaxed">
                    SSC uses a formula based on <strong>mean (average)</strong> and{' '}
                    <strong>standard deviation</strong> of marks scored by all candidates in each shift.
                    Your raw marks are adjusted relative to the overall performance of candidates in your
                    specific shift, then mapped to a common scale.
                  </p>
                </div>

                <h3 className="font-bold text-gray-900 text-base mt-4">Key Points to Know:</h3>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Same difficulty = same score</strong> — if your shift was of average difficulty,
                      your normalized score will be close to your raw score.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Harder shift = score boost</strong> — if your shift had a tougher paper, your
                      normalized score may increase compared to raw marks.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Easier shift = score reduction</strong> — candidates from an easier shift may
                      see a slight decrease after normalization.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Formula transparency</strong> — SSC publishes the normalization method on
                      its official website and the formula has been validated by IIT Delhi experts.
                    </span>
                  </li>
                </ul>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 text-amber-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    <strong>Important:</strong> The calculator above gives you an estimated raw score{' '}
                    <em>before</em> normalization. Your final normalized score may differ by ±3–8 marks
                    depending on shift difficulty.
                  </span>
                </div>
              </div>
            </Card>
          </section>

          {/* ═══════ FAQ SECTION ═══════ */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-indigo-600" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqItems.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                      isOpen ? 'border-indigo-200 shadow-md shadow-indigo-500/5' : 'border-gray-200 shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-3 p-5 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-sm text-gray-900 leading-snug">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-indigo-600' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ─── Right Sidebar ─── */}
        <aside className="space-y-6">
          {/* Recruitment Overview */}
          <Card padding="p-6" className="border-gray-200 shadow-sm bg-white rounded-2xl sticky top-6">
            <h3 className="font-bold text-gray-900 text-base mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Recruitment Overview
            </h3>
            <ul className="space-y-3.5 text-xs text-gray-600 font-medium">
              <li className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span>Authority</span>
                <span className="font-bold text-gray-900">Staff Selection Commission</span>
              </li>
              <li className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span>Total Vacancies</span>
                <span className="font-bold text-emerald-700">39,481 Posts</span>
              </li>
              <li className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span>Post Name</span>
                <span className="font-bold text-gray-900">Constable (GD) CAPFs</span>
              </li>
              <li className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span>Exam Date</span>
                <span className="font-bold text-gray-900">Feb – Mar 2026</span>
              </li>
              <li className="flex justify-between items-center py-1.5">
                <span>Answer Key</span>
                <span className="font-bold text-gray-900">15 June 2026</span>
              </li>
            </ul>
          </Card>

          {/* Quick Links */}
          <Card padding="p-6" className="border-gray-200 shadow-sm bg-white rounded-2xl">
            <h3 className="font-bold text-gray-900 text-base mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-indigo-600" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="/ssc-gd-2026"
                  className="flex items-center gap-2.5 text-sm text-indigo-700 hover:text-indigo-900 font-semibold hover:bg-indigo-50 px-3 py-2.5 rounded-lg transition-colors group"
                >
                  <Shield className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                  SSC GD 2026 Answer Key & Details
                  <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="/results"
                  className="flex items-center gap-2.5 text-sm text-indigo-700 hover:text-indigo-900 font-semibold hover:bg-indigo-50 px-3 py-2.5 rounded-lg transition-colors group"
                >
                  <Award className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                  Latest Sarkari Results 2026
                  <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="/admit-cards"
                  className="flex items-center gap-2.5 text-sm text-indigo-700 hover:text-indigo-900 font-semibold hover:bg-indigo-50 px-3 py-2.5 rounded-lg transition-colors group"
                >
                  <Calendar className="w-4 h-4 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                  Download Admit Cards
                  <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
                </a>
              </li>
            </ul>
          </Card>

          {/* Join Channels */}
          <Card padding="p-0" className="border-gray-200 shadow-sm bg-white rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-200" />
                Join Our Community
              </h3>
              <p className="text-indigo-100 text-[11px] mt-0.5">
                Get instant exam updates &amp; result alerts
              </p>
            </div>
            <div className="p-5 space-y-3">
              <a
                href="https://t.me/weekly_naukri"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-semibold text-sm px-4 py-3 rounded-xl transition-all group"
              >
                <Send className="w-4 h-4 text-sky-500" />
                Join Telegram Channel
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>
              <a
                href="https://chat.whatsapp.com/GeHRdlojdjU7hurA2QCIT7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-sm px-4 py-3 rounded-xl transition-all group"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                Join WhatsApp Group
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>
            </div>
          </Card>

          {/* Cutoff sidebar card */}
          <Card padding="p-6" className="border-gray-200 shadow-sm bg-white rounded-2xl">
            <h3 className="font-bold text-gray-900 text-base mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Expected Cutoffs (Out of 160)
            </h3>
            <div className="space-y-3 text-xs">
              {cutoffData.map((cat) => (
                <div key={cat.category} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0 font-medium">
                  <span className="text-gray-700 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                    {cat.category}
                  </span>
                  <strong className="text-gray-900">{cat.min} – {cat.max}</strong>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-500 italic leading-relaxed">
              *Estimated thresholds for PET/PST shortlisting. Final cutoffs depend on normalization.
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
