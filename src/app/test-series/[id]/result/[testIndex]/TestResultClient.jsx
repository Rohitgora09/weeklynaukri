'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronLeft, 
  RotateCcw, 
  BookOpen, 
  BarChart2, 
  ChevronDown, 
  ChevronUp,
  Info,
  Flame,
  ThumbsUp,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import Card from '../../../../../components/ui/Card';

export default function TestResultClient({ series, test, attemptId }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedSolutions, setExpandedSolutions] = useState({});

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('mock_test_attempts');
      if (savedHistory) {
        const attempts = JSON.parse(savedHistory);
        let currentAttempt = null;

        if (attemptId) {
          currentAttempt = attempts.find(a => a.id === attemptId);
        }

        // Fallback to latest attempt for this test if not specified or not found
        if (!currentAttempt) {
          currentAttempt = attempts.find(
            a => a.seriesId === series.id && a.testIndex === test.index
          );
        }

        if (currentAttempt) {
          setAttempt(currentAttempt);
          
          // Pre-expand explanations for incorrect/unattempted questions for faster learning
          const initialExpanded = {};
          test.questions.forEach(q => {
            const userAns = currentAttempt.answers[q.id];
            if (userAns === undefined || userAns !== q.correctIndex) {
              initialExpanded[q.id] = true;
            }
          });
          setExpandedSolutions(initialExpanded);
        }
      }
    } catch (e) {
      console.error("Failed to load attempt details:", e);
    } finally {
      setLoading(false);
    }
  }, [attemptId, series.id, test.index, test.questions]);

  // Simulated Percentile calculation helper
  const getSimulatedPercentile = (score, totalMarks) => {
    if (score <= 0) return (Math.max(0.5, 5 + score * 2)).toFixed(1);
    const pct = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    if (pct >= 95) return (99.0 + (pct - 95) * 0.18).toFixed(1);
    if (pct >= 85) return (95.0 + (pct - 85) * 0.4).toFixed(1);
    if (pct >= 70) return (80.0 + (pct - 70) * 1.0).toFixed(1);
    if (pct >= 50) return (55.0 + (pct - 50) * 1.25).toFixed(1);
    if (pct >= 30) return (30.0 + (pct - 30) * 1.25).toFixed(1);
    return Math.max(5.0, (pct * 1.0)).toFixed(1);
  };

  const getPacingText = (seconds, count) => {
    if (count <= 0 || seconds <= 0) return "N/A";
    const avgSec = seconds / count;
    if (avgSec < 60) return `${Math.round(avgSec)}s / question`;
    const avgMin = (avgSec / 60).toFixed(1);
    return `${avgMin}m / question`;
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSolution = (qId) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const toggleAllSolutions = (expand) => {
    const updated = {};
    test.questions.forEach(q => {
      updated[q.id] = expand;
    });
    setExpandedSolutions(updated);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 animate-spin">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-gray-500 font-bold text-sm">Compiling Scorecard Analysis...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="bg-white min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 border border-amber-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-blue-950 mb-2">No Attempt History Found</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            We couldn't locate any submission record for this mock test on this device. Please return to the details page and attempt the test first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href={`/test-series/${series.id}`}
              className="flex-1 bg-black hover:bg-gray-800 text-white text-xs font-bold py-3 px-6 rounded-xl text-center transition-colors"
            >
              Go Back to Syllabus
            </Link>
            <Link
              href="/test-series"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-3 px-6 rounded-xl text-center transition-colors"
            >
              All Test Series
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Group stats calculation
  const totalQuestions = test.questions.length;
  const attemptedCount = totalQuestions - attempt.unattempted;
  const percentile = getSimulatedPercentile(attempt.score, attempt.totalMarks);

  // Sectional Analysis calculations
  const sections = test.sections || [...new Set(test.questions.map(q => q.section))];
  const sectionalStats = sections.map(secName => {
    const secQuestions = test.questions.filter(q => q.section === secName);
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    secQuestions.forEach(q => {
      const ans = attempt.answers[q.id];
      if (ans === undefined) unattempted++;
      else if (ans === q.correctIndex) correct++;
      else incorrect++;
    });

    const score = parseFloat((correct * series.marksPerQuestion - incorrect * series.negativeMark).toFixed(2));
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

    return {
      name: secName,
      total: secQuestions.length,
      correct,
      incorrect,
      unattempted,
      score,
      maxScore: secQuestions.length * series.marksPerQuestion,
      accuracy
    };
  });

  // Filtered Solution Questions
  const filteredQuestions = test.questions.filter(q => {
    const userAns = attempt.answers[q.id];
    const isCorrect = userAns === q.correctIndex;
    const isUnattempted = userAns === undefined;

    const matchesSection = selectedSection === 'All' || q.section === selectedSection;
    
    let matchesStatus = true;
    if (statusFilter === 'Correct') matchesStatus = userAns !== undefined && isCorrect;
    else if (statusFilter === 'Incorrect') matchesStatus = userAns !== undefined && !isCorrect;
    else if (statusFilter === 'Unattempted') matchesStatus = isUnattempted;

    return matchesSection && matchesStatus;
  });

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col w-full font-sans select-none">
      <Navbar />

      {/* Scoreboard Hero Header */}
      <section className="bg-gradient-to-b from-blue-950 to-blue-900 text-white px-6 py-10 shadow-md">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/test-series/${series.id}`}
            className="inline-flex items-center gap-1 text-xs text-blue-200 hover:text-white font-semibold mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Test Pack
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-800 text-blue-200 border border-blue-700 px-3 py-1 rounded-full">
                {series.category} &bull; MOCK TEST COMPLETED
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3 mb-2">{series.title}</h1>
              <p className="text-xs text-blue-200 font-semibold flex items-center gap-2">
                <span>{test.title}</span> &bull; 
                <span>Attempted on {new Date(attempt.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/test-series/${series.id}/take/${test.index}`}
                className="bg-blue-850 hover:bg-blue-800 border border-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-blue-300" /> Re-Attempt Test
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Analysis Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">

        {/* 1. Core Analytics Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card: Total Score */}
          <Card padding="p-6" hover={false} className="border-blue-100/60 bg-gradient-to-br from-blue-50/10 to-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Your Score</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-extrabold text-blue-950">{attempt.score}</span>
                <span className="text-sm font-semibold text-gray-400">/ {attempt.totalMarks} Marks</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3.5 mt-4 flex items-center gap-2 text-[10px] text-gray-500 font-semibold">
              <span className="text-green-600 font-bold">+{attempt.correctAnswers * series.marksPerQuestion} Pos</span>
              <span>&bull;</span>
              <span className="text-red-500 font-bold">-{parseFloat((attempt.incorrectAnswers * series.negativeMark).toFixed(2))} Neg</span>
            </div>
          </Card>

          {/* Card: Simulated Percentile */}
          <Card padding="p-6" hover={false} className="border-indigo-100/60 bg-gradient-to-br from-indigo-50/10 to-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Simulated Percentile</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-extrabold text-indigo-600">{percentile}%</span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">Ranked</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3.5 mt-4 text-[10px] text-gray-500 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <span>Outperformed {percentile}% of aspirants</span>
            </div>
          </Card>

          {/* Card: Accuracy */}
          <Card padding="p-6" hover={false} className={`bg-gradient-to-br from-white to-white flex flex-col justify-between ${
            attempt.accuracy >= 85 ? 'border-green-100' : attempt.accuracy >= 65 ? 'border-amber-100' : 'border-red-100'
          }`}>
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Accuracy Rate</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-4xl font-extrabold ${
                  attempt.accuracy >= 85 ? 'text-green-600' : attempt.accuracy >= 65 ? 'text-amber-500' : 'text-red-500'
                }`}>{attempt.accuracy}%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {attempt.accuracy >= 85 ? 'High' : attempt.accuracy >= 65 ? 'Moderate' : 'Low Accuracy'}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3.5 mt-4 text-[10px] text-gray-500 font-semibold flex items-center gap-1.5">
              <ThumbsUp className={`w-3.5 h-3.5 ${attempt.accuracy >= 75 ? 'text-green-500' : 'text-gray-400'}`} />
              <span>{attempt.correctAnswers} Correct out of {attemptedCount} attempted</span>
            </div>
          </Card>

          {/* Card: Time Spent */}
          <Card padding="p-6" hover={false} className="border-gray-100 bg-gradient-to-br from-gray-50/30 to-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Time Spent</span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-extrabold text-gray-800">{formatTime(attempt.timeSpentSeconds)}</span>
                <span className="text-sm font-semibold text-gray-400">/ {test.durationMinutes}:00</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3.5 mt-4 text-[10px] text-gray-500 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Pacing: {getPacingText(attempt.timeSpentSeconds, attemptedCount)}</span>
            </div>
          </Card>

        </div>

        {/* 2. Visual Segmented Progress Bar */}
        <Card padding="p-6" hover={false} className="border-gray-200/80 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-900" /> Question Attempt Analysis
          </h3>

          <div className="space-y-4">
            {/* The multi-segment progress bar */}
            <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
              <div 
                style={{ width: `${(attempt.correctAnswers / totalQuestions) * 100}%` }}
                className="h-full bg-green-500 hover:opacity-90 transition-all duration-300"
                title={`Correct: ${attempt.correctAnswers}`}
              ></div>
              <div 
                style={{ width: `${(attempt.incorrectAnswers / totalQuestions) * 100}%` }}
                className="h-full bg-red-500 hover:opacity-90 transition-all duration-300"
                title={`Incorrect: ${attempt.incorrectAnswers}`}
              ></div>
              <div 
                style={{ width: `${(attempt.unattempted / totalQuestions) * 100}%` }}
                className="h-full bg-gray-300 hover:opacity-90 transition-all duration-300"
                title={`Unattempted: ${attempt.unattempted}`}
              ></div>
            </div>

            {/* Legend showing count & percentages */}
            <div className="grid grid-cols-3 gap-4 text-center mt-2">
              <div className="bg-green-50/40 rounded-xl p-3 border border-green-100/55">
                <span className="block text-xs font-bold text-gray-400">Correct</span>
                <span className="block text-lg font-extrabold text-green-600 mt-0.5">{attempt.correctAnswers}</span>
                <span className="text-[10px] text-green-500/80 font-bold">({Math.round((attempt.correctAnswers / totalQuestions) * 100)}%)</span>
              </div>
              <div className="bg-red-50/40 rounded-xl p-3 border border-red-100/55">
                <span className="block text-xs font-bold text-gray-400">Incorrect</span>
                <span className="block text-lg font-extrabold text-red-500 mt-0.5">{attempt.incorrectAnswers}</span>
                <span className="text-[10px] text-red-500/80 font-bold">({Math.round((attempt.incorrectAnswers / totalQuestions) * 100)}%)</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-150">
                <span className="block text-xs font-bold text-gray-400">Unattempted</span>
                <span className="block text-lg font-extrabold text-gray-500 mt-0.5">{attempt.unattempted}</span>
                <span className="text-[10px] text-gray-400/80 font-bold">({Math.round((attempt.unattempted / totalQuestions) * 100)}%)</span>
              </div>
            </div>
          </div>
        </Card>



        {/* 4. Detailed Solution Key Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-5">
            <div>
              <h2 className="font-extrabold text-blue-950 text-lg">Solution Key & Explanations</h2>
              <p className="text-xs text-gray-500 mt-1">Review correct options, your choices, and step-by-step logic details.</p>
            </div>
            
            <div className="flex items-center gap-3.5">
              <button 
                onClick={() => toggleAllSolutions(true)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
              >
                Expand All
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={() => toggleAllSolutions(false)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Solutions Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filters */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
              {['All', 'Correct', 'Incorrect', 'Unattempted'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Question List container */}
          <div className="space-y-6">
            {filteredQuestions.map((q, idx) => {
              const globalIdx = test.questions.findIndex(tq => tq.id === q.id);
              const userAns = attempt.answers[q.id];
              const isCorrect = userAns === q.correctIndex;
              const isUnattempted = userAns === undefined;
              const isExpanded = !!expandedSolutions[q.id];

              let statusCardBorder = 'border-gray-200';
              let statusBadgeBg = 'bg-gray-100 text-gray-650';
              let statusBadgeText = 'Unattempted';
              
              if (!isUnattempted && isCorrect) {
                statusCardBorder = 'border-green-150';
                statusBadgeBg = 'bg-green-50 text-green-700';
                statusBadgeText = `Correct (+${series.marksPerQuestion} Marks)`;
              } else if (!isUnattempted && !isCorrect) {
                statusCardBorder = 'border-red-150';
                statusBadgeBg = 'bg-red-50 text-red-600';
                statusBadgeText = `Incorrect (-${series.negativeMark} Marks)`;
              }

              return (
                <Card 
                  key={q.id} 
                  padding="p-0" 
                  hover={false} 
                  className={`border overflow-hidden shadow-sm transition-all duration-200 ${statusCardBorder}`}
                >
                  {/* Card Header Info */}
                  <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between border-b border-gray-100 gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        Question {globalIdx + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusBadgeBg}`}>
                        {statusBadgeText}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSolution(q.id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? "Hide Solution" : "View Solution"}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-5">
                    {/* Question Text */}
                    <p className="text-gray-900 font-bold text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {q.questionText}
                    </p>

                    {/* Option Choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {q.options.map((option, optIdx) => {
                        const isChosen = userAns === optIdx;
                        const isCorrectOpt = q.correctIndex === optIdx;

                        let optStyles = 'border-gray-200 bg-white';
                        let badgeStyles = 'border-gray-300 text-gray-450 bg-gray-50';
                        let iconNode = null;

                        if (isCorrectOpt) {
                          optStyles = 'border-green-500 bg-green-50/20';
                          badgeStyles = 'bg-green-600 border-green-600 text-white';
                          iconNode = <CheckCircle className="w-4 h-4 text-green-600 shrink-0 ml-auto" />;
                        } else if (isChosen && !isCorrectOpt) {
                          optStyles = 'border-red-500 bg-red-50/20';
                          badgeStyles = 'bg-red-500 border-red-500 text-white';
                          iconNode = <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-auto" />;
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all text-xs font-semibold ${optStyles}`}
                          >
                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-extrabold shrink-0 ${badgeStyles}`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-gray-800 leading-snug">{option}</span>
                            {iconNode}
                          </div>
                        );
                      })}
                    </div>

                    {/* Collapsible Detailed Explanation */}
                    {isExpanded && (
                      <div className="border-t border-dashed border-gray-150 pt-5 mt-4 space-y-3 animate-fade-in">
                        <div className="flex items-center gap-1.5 text-xs text-blue-900 font-extrabold">
                          <Info className="w-4 h-4" /> Explanation & Concept
                        </div>
                        <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-4 text-xs sm:text-sm text-gray-650 leading-relaxed font-semibold whitespace-pre-line">
                          {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}

            {filteredQuestions.length === 0 && (
              <div className="py-12 text-center bg-white border border-dashed border-gray-200 rounded-2xl">
                <p className="text-sm text-gray-450 font-medium">No questions match the selected status filter.</p>
              </div>
            )}
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
