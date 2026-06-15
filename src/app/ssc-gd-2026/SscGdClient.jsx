'use client';

import { useState } from 'react';
import Card from '../../components/ui/Card';
import { 
  Calculator, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function SscGdClient() {
  const [correct, setCorrect] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const [score, setScore] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState('');
  const [attempted, setAttempted] = useState(null);

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
      setError('Total attempted questions (Correct + Incorrect) cannot exceed the maximum count of 80.');
      return;
    }

    const calculatedScore = (c * 2) - (inc * 0.25);
    const calculatedAccuracy = total > 0 ? Math.round((c / total) * 100) : 0;

    setScore(calculatedScore);
    setAccuracy(calculatedAccuracy);
    setAttempted(total);
  };

  const getStatusAlert = () => {
    if (score === null) return null;
    if (score >= 128) {
      return {
        type: 'success',
        title: 'Strong Chance of Selection!',
        text: 'Your predicted score is above the general cutoff range (~128-136). You should immediately start preparing for the Physical Efficiency Test (PET/PST)!',
        bg: 'bg-green-50 border-green-200 text-green-800',
        icon: CheckCircle2
      };
    } else if (score >= 112) {
      return {
        type: 'warning',
        title: 'Moderate Chance of Selection',
        text: 'Your raw score is in the moderate buffer range. You have high chances of qualifying for state/category relaxed posts. Start light physical training while waiting for normalized results.',
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        icon: AlertCircle
      };
    } else {
      return {
        type: 'info',
        title: 'Borderline Score',
        text: 'Your score is below the predicted general threshold. Normalization across shifts could still increase your final score. Keep preparing for other upcoming SSC exams!',
        bg: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: HelpCircle
      };
    }
  };

  const status = getStatusAlert();

  return (
    <div className="space-y-10">
      {/* Active Trend Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1 bg-blue-500/25 border border-blue-400/30 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-400" /> Currently Active &amp; Trending
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
            SSC GD Constable 2026 <br />
            Answer Key &amp; Score Estimator
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
            Download your official response sheet from ssc.gov.in and calculate your raw negative marks instantly. Get immediate cutoff analysis based on category thresholds.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://ssc.gov.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white text-blue-950 hover:bg-gray-100 font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4 text-blue-600" />
              Download Response Sheet at ssc.gov.in
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input & Result Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="p-6 md:p-8" className="border-gray-200 shadow-sm bg-white rounded-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Calculate Raw Score &amp; Accuracy
            </h2>

            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="correct" className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Correct Answers (+2 marks each)
                  </label>
                  <input
                    type="number"
                    id="correct"
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                    placeholder="e.g. 60"
                    min="0"
                    max="80"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="incorrect" className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Incorrect Answers (-0.25 marks each)
                  </label>
                  <input
                    type="number"
                    id="incorrect"
                    value={incorrect}
                    onChange={(e) => setIncorrect(e.target.value)}
                    placeholder="e.g. 12"
                    min="0"
                    max="80"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md cursor-pointer text-center"
              >
                Calculate Score
              </button>
            </form>

            {/* Calculations Result Block */}
            {score !== null && (
              <div className="mt-10 border-t border-gray-100 pt-8 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Scoring Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl text-center">
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Attempted</span>
                    <strong className="text-xl font-extrabold text-gray-800">{attempted} / 80</strong>
                  </div>
                  <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl text-center">
                    <span className="block text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Correct</span>
                    <strong className="text-xl font-extrabold text-green-800">{correct}</strong>
                  </div>
                  <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl text-center">
                    <span className="block text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">Incorrect</span>
                    <strong className="text-xl font-extrabold text-red-800">{incorrect}</strong>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-center">
                    <span className="block text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Accuracy</span>
                    <strong className="text-xl font-extrabold text-blue-800">{accuracy}%</strong>
                  </div>
                </div>

                <div className="bg-blue-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div>
                    <span className="block text-xs text-blue-200 uppercase tracking-wider font-semibold">Your Estimated Raw Marks</span>
                    <strong className="text-3xl md:text-4xl font-black tracking-tight">{score}</strong>
                    <span className="text-xs text-blue-200 block mt-1">Out of 160 Maximum Marks</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold">
                      Provisional Score
                    </span>
                  </div>
                </div>

                {status && (
                  <div className={`p-6 border rounded-2xl flex gap-4 ${status.bg}`}>
                    <status.icon className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-base mb-1">{status.title}</h4>
                      <p className="text-sm leading-relaxed opacity-95">{status.text}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Key Details & Cut-offs */}
        <div className="space-y-6">
          <Card padding="p-6" className="border-gray-200 shadow-sm bg-white rounded-2xl">
            <h3 className="font-bold text-gray-900 text-base mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Recruitment Overview
            </h3>
            <ul className="space-y-3.5 text-xs text-gray-600 font-medium">
              <li className="flex justify-between items-center py-1 border-b border-gray-50">
                <span>Authority</span>
                <span className="font-bold text-gray-900">Staff Selection Commission</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-gray-50">
                <span>Total Vacancies</span>
                <span className="font-bold text-gray-900 text-green-700">39,481 Posts</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-gray-50">
                <span>Post Name</span>
                <span className="font-bold text-gray-900">Constable (GD) CAPFs</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span>Answer Key Release</span>
                <span className="font-bold text-gray-900">15 June 2026</span>
              </li>
            </ul>
          </Card>

          <Card padding="p-6" className="border-gray-200 shadow-sm bg-white rounded-2xl">
            <h3 className="font-bold text-gray-900 text-base mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Predicted Cut-offs (Out of 160)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-50 font-medium">
                <span className="text-gray-700">General (UR)</span>
                <strong className="text-gray-900">128 – 136 Marks</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50 font-medium">
                <span className="text-gray-700">OBC</span>
                <strong className="text-gray-900">124 – 132 Marks</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50 font-medium">
                <span className="text-gray-700">EWS</span>
                <strong className="text-gray-900">122 – 130 Marks</strong>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-50 font-medium">
                <span className="text-gray-700">SC</span>
                <strong className="text-gray-900">112 – 118 Marks</strong>
              </div>
              <div className="flex justify-between items-center py-1 font-medium">
                <span className="text-gray-700">ST</span>
                <strong className="text-gray-900">102 – 110 Marks</strong>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-500 italic leading-relaxed">
              *Estimated score thresholds for shortlisting in PET/PST physical tests. Final result subject to normalization.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
