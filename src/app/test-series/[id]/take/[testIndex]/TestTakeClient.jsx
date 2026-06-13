'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  CheckCircle,
  AlertCircle,
  Bookmark,
  Menu,
  X,
  User
} from 'lucide-react';
import Card from '../../../../../components/ui/Card';

export default function TestTakeClient({ series, test }) {
  const router = useRouter();
  
  // Active states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
  const [visited, setVisited] = useState([test.questions[0]?.id]); // Array of question IDs visited
  const [marked, setMarked] = useState([]); // Array of question IDs marked for review
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [endTimestamp, setEndTimestamp] = useState(null);
  
  // UI States
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  
  const timerRef = useRef(null);
  const stateKey = `mock_in_progress_${series.id}_${test.index}`;

  // 1. Initial State Load (Recover from localStorage or initialize)
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(stateKey);
      if (savedState) {
        const state = JSON.parse(savedState);
        setAnswers(state.answers || {});
        setVisited(state.visited || [test.questions[0]?.id]);
        setMarked(state.marked || []);
        setEndTimestamp(state.endTimestamp);
        
        // Calculate remaining seconds
        const remaining = Math.max(0, Math.floor((state.endTimestamp - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          handleAutoSubmit(state.answers || {});
        }
      } else {
        // Fresh start: Set absolute end timestamp
        const endTime = Date.now() + test.durationMinutes * 60 * 1000;
        setEndTimestamp(endTime);
        setTimeLeft(test.durationMinutes * 60);
        
        const initialState = {
          answers: {},
          visited: [test.questions[0]?.id],
          marked: [],
          endTimestamp: endTime
        };
        localStorage.setItem(stateKey, JSON.stringify(initialState));
      }
    } catch (e) {
      console.error("Failed to initialize exam state:", e);
    }
  }, []);

  // 2. Timer Countdown Loop
  useEffect(() => {
    if (!endTimestamp) return;

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleAutoSubmit(answers);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [endTimestamp, answers]);

  // 3. Save state on change helper
  const saveState = (updatedAnswers, updatedVisited, updatedMarked) => {
    if (!endTimestamp) return;
    try {
      const state = {
        answers: updatedAnswers || answers,
        visited: updatedVisited || visited,
        marked: updatedMarked || marked,
        endTimestamp
      };
      localStorage.setItem(stateKey, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  };

  const currentQuestion = test.questions[currentIdx];
  const isLastQuestion = currentIdx === test.questions.length - 1;

  // Mark a question as visited
  const markAsVisited = (qId) => {
    if (!visited.includes(qId)) {
      const updatedVisited = [...visited, qId];
      setVisited(updatedVisited);
      saveState(null, updatedVisited, null);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      markAsVisited(test.questions[nextIdx].id);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      markAsVisited(test.questions[prevIdx].id);
    }
  };

  const handleSelectOption = (optIdx) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: optIdx };
    setAnswers(updatedAnswers);
    saveState(updatedAnswers, null, null);
  };

  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[currentQuestion.id];
    setAnswers(updatedAnswers);
    saveState(updatedAnswers, null, null);
  };

  const handleMarkForReview = () => {
    let updatedMarked;
    if (marked.includes(currentQuestion.id)) {
      updatedMarked = marked.filter(id => id !== currentQuestion.id);
    } else {
      updatedMarked = [...marked, currentQuestion.id];
    }
    setMarked(updatedMarked);
    saveState(null, null, updatedMarked);
    
    // Auto-advance
    if (!isLastQuestion) {
      handleNext();
    }
  };

  // 4. Submit logic (Calculate metrics and save to history)
  const submitExam = (finalAnswers = answers) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    clearInterval(timerRef.current);

    try {
      let correctCount = 0;
      let incorrectCount = 0;
      let unattemptedCount = 0;

      test.questions.forEach(q => {
        const selected = finalAnswers[q.id];
        if (selected === undefined) {
          unattemptedCount++;
        } else if (selected === q.correctIndex) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      });

      // Calculate score based on marks schema
      const positiveMarks = correctCount * series.marksPerQuestion;
      const negativeDeduction = incorrectCount * series.negativeMark;
      const totalScore = parseFloat((positiveMarks - negativeDeduction).toFixed(2));
      const accuracy = correctCount + incorrectCount > 0 
        ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
        : 0;

      // Unique attempt ID
      const attemptId = `attempt_${Date.now()}`;
      
      const newAttempt = {
        id: attemptId,
        seriesId: series.id,
        seriesTitle: series.title,
        testIndex: test.index,
        testTitle: test.title,
        score: totalScore,
        totalMarks: series.totalMarks,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        unattempted: unattemptedCount,
        accuracy,
        submittedAt: new Date().toISOString(),
        timeSpentSeconds: test.durationMinutes * 60 - timeLeft,
        answers: finalAnswers
      };

      // Load previous history, insert new, and save
      const savedHistory = localStorage.getItem('mock_test_attempts');
      const attempts = savedHistory ? JSON.parse(savedHistory) : [];
      attempts.unshift(newAttempt);
      localStorage.setItem('mock_test_attempts', JSON.stringify(attempts));

      // Clean up in progress cache
      localStorage.removeItem(stateKey);

      // Redirect
      router.push(`/test-series/${series.id}/result/${test.index}?attemptId=${attemptId}`);
    } catch (e) {
      console.error("Failed to submit exam:", e);
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = (finalAnswers) => {
    console.log("Time's up! Automatically submitting exam...");
    submitExam(finalAnswers);
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get color state of palette items
  const getPaletteState = (q) => {
    const hasAnswer = answers[q.id] !== undefined;
    const isMarked = marked.includes(q.id);
    const isVisited = visited.includes(q.id);

    if (hasAnswer && isMarked) return 'answered-marked'; // Purple with check
    if (!hasAnswer && isMarked) return 'marked'; // Purple
    if (hasAnswer && !isMarked) return 'answered'; // Green
    if (!hasAnswer && isVisited) return 'not-answered'; // Red
    return 'not-visited'; // Gray
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col font-sans select-none w-full">
      
      {/* Exam Header */}
      <header className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b border-blue-900 shrink-0 shadow-md">
        <div>
          <h2 className="font-extrabold text-sm sm:text-base tracking-wide uppercase">{series.title}</h2>
          <span className="text-xs text-blue-200 font-semibold">{test.title}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-900 px-4 py-2 rounded-xl border border-blue-800 text-xs sm:text-sm font-bold shadow-inner">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">Time Left: {formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Submit Test
          </button>
          
          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 bg-blue-900 border border-blue-800 rounded-xl cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Console Layout */}
      <div className="flex-1 flex overflow-hidden relative w-full">
        
        {/* Left Side: Question Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Question Indicator */}
          <div className="bg-gray-50 border-b border-gray-150 px-6 py-3 shrink-0 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-blue-900">
              Mock Exam Console
            </span>
            <span className="text-xs font-semibold text-gray-400">
              Q. {currentIdx + 1} of {test.questions.length}
            </span>
          </div>

          {/* Question Box */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            
            {/* Question Text */}
            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-5 md:p-6 shadow-sm">
              <span className="inline-block text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full mb-3">QUESTION {currentIdx + 1}</span>
              <p className="text-gray-900 font-semibold text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {currentQuestion?.questionText}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3.5">
              {currentQuestion?.options.map((option, optIdx) => {
                const isSelected = answers[currentQuestion.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/20 ring-2 ring-blue-100' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-gray-300 text-gray-450 bg-gray-50'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-gray-800 text-sm font-semibold leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Bottom Navigation Toolbar */}
          <footer className="border-t border-gray-150 bg-gray-50 px-6 py-4 flex items-center justify-between shrink-0 shadow-inner">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearResponse}
                disabled={answers[currentQuestion?.id] === undefined}
                className="bg-white hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white text-gray-700 border border-gray-250 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Clear Response
              </button>
              
              <button
                onClick={handleMarkForReview}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className="w-4 h-4" /> {marked.includes(currentQuestion?.id) ? "Unmark" : "Mark for Review"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="bg-white hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-white text-gray-750 border border-gray-250 p-2.5 rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                disabled={isLastQuestion}
                className="bg-black hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Save & Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </footer>

        </main>

        {/* Right Side: Sidebar Palette (Hidden on mobile unless toggled) */}
        <aside className={`w-80 border-l border-gray-200 bg-white flex flex-col shrink-0 lg:static absolute right-0 top-0 bottom-0 z-40 transition-transform duration-300 transform shadow-xl lg:shadow-none ${
          mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}>
          
          {/* User Profile Info Card */}
          <div className="p-5 border-b border-gray-150 flex items-center gap-3.5 bg-gray-50/50">
            <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center text-blue-650 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">Aspirant Candidate</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Exam Session: Live</p>
            </div>
          </div>

          {/* Palette Grid Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <h4 className="font-bold text-blue-950 text-xs uppercase tracking-wider">Question Palette</h4>
            
            <div className="grid grid-cols-4 gap-3.5">
              {test.questions.map((q, idx) => {
                const paletteState = getPaletteState(q);
                const isActive = currentIdx === idx;
                
                let btnStyles = 'bg-gray-100 text-gray-650 border-gray-200';
                if (paletteState === 'answered') btnStyles = 'bg-green-600 border-green-600 text-white';
                else if (paletteState === 'not-answered') btnStyles = 'bg-red-500 border-red-500 text-white';
                else if (paletteState === 'marked') btnStyles = 'bg-indigo-650 border-indigo-650 text-white';
                else if (paletteState === 'answered-marked') btnStyles = 'bg-indigo-650 border-indigo-650 text-white ring-2 ring-green-400 ring-offset-1';
                
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      markAsVisited(q.id);
                      setMobileSidebarOpen(false); // Close on mobile toggle
                    }}
                    className={`w-11 h-11 rounded-xl font-bold text-sm border flex items-center justify-center transition-all cursor-pointer relative ${btnStyles} ${
                      isActive ? 'ring-4 ring-blue-100 scale-105 border-blue-600' : ''
                    }`}
                  >
                    {idx + 1}
                    {paletteState === 'answered-marked' && (
                      <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Palette Legends */}
          <div className="p-5 border-t border-gray-150 bg-gray-50/50 space-y-3.5 shrink-0">
            <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">Legend</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-600">
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-green-600 border border-green-600 rounded-md"></span> Answered</div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-red-500 border border-red-500 rounded-md"></span> Not Answered</div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-indigo-650 border border-indigo-650 rounded-md"></span> Marked</div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-indigo-650 border-indigo-650 rounded-md relative"><span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></span></span> Answered & Marked</div>
              <div className="flex items-center gap-1.5 col-span-2"><span className="w-3.5 h-3.5 bg-gray-100 border border-gray-200 rounded-md"></span> Not Visited</div>
            </div>
          </div>

        </aside>

      </div>

      {/* Confirmation Submit Overlay modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card padding="p-6 relative w-full max-w-sm animate-fade-in-up" hover={false}>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">Submit Exam?</h3>
              <p className="text-xs text-gray-500 mt-1">Are you sure you want to submit? Once submitted, your answers will be locked and analyzed.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => submitExam()}
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-gray-800 text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit Exam"}
              </button>
              
              <button
                onClick={() => setShowConfirmSubmit(false)}
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-250 text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
              >
                No, Keep Writing
              </button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
