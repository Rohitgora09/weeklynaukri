import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  IndianRupee,
  User,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  Building2,
  Share2,
} from 'lucide-react';
import {
  latestJobs,
  latestResults,
  admitCards,
  answerKeys,
  admissions,
  documents,
  privateJobs,
} from '../data/jobs';

function findJobById(id) {
  const allData = [
    ...latestJobs, ...latestResults, ...admitCards, 
    ...answerKeys, ...admissions, ...documents, ...privateJobs
  ];
  return allData.find((item) => item.id === id);
}

export default function JobDetails() {
  const { id } = useParams();
  const job = findJobById(id);

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
        <p className="text-gray-500 mb-6">The listing you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-blue-950 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-900 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  // Fallbacks for data that might not be fully enriched (e.g., results, admit cards)
  const isDetailedJob = !!job.fee; 
  
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ─── Header Navigation ────────────────────────────── */}
      <nav className="bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <button className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
            <Share2 className="w-4 h-4" /> <span className="text-sm font-medium hidden sm:inline">Share</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
        
        {/* ─── Top Header Block ──────────────────────────────── */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-blue-950 leading-tight mb-2">
            {job.org} {job.title} Online Form 2026
          </h1>
          <h2 className="text-base md:text-lg font-bold text-amber-600 mb-2">
            {job.org} / {job.company || 'Government'} Examination 2026 : Short Details
          </h2>
          <h3 className="text-lg md:text-xl font-bold text-blue-900">
            WeeklyNaukri.Com
          </h3>
        </div>

        {isDetailedJob ? (
          <div className="border border-gray-300 bg-white mb-8">
            
            {/* ─── Unified Details Table (Dates & Fee) ───────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-300">
              {/* Important Dates */}
              <div className="border-r-0 md:border-r border-b md:border-b-0 border-gray-300">
                <div className="bg-blue-950 text-white font-bold text-center py-2 border-b border-gray-300">
                  Important Dates
                </div>
                <div className="p-4 text-sm space-y-2 text-gray-800">
                  <p><span className="font-semibold">Online Apply Start Date :</span> <span className="font-bold text-blue-900">{job.dates.applyStart}</span></p>
                  <p><span className="font-semibold">Online Apply Last Date :</span> <span className="font-bold text-amber-600">{job.dates.applyEnd}</span></p>
                  <p><span className="font-semibold">Exam Date :</span> <span className="font-bold text-blue-900">{job.dates.examDate}</span></p>
                  <p><span className="font-semibold">Admit Card :</span> <span className="font-bold text-blue-900">Before Exam</span></p>
                  <p><span className="font-semibold">Result Date :</span> <span className="font-bold text-amber-600">Will Be Updated Here Soon</span></p>
                </div>
              </div>

              {/* Application Fee */}
              <div>
                <div className="bg-blue-950 text-white font-bold text-center py-2 border-b border-gray-300">
                  Application Fee
                </div>
                <div className="p-4 text-sm space-y-2 text-gray-800">
                  <p><span className="font-semibold">For General, OBC :</span> ₹ {job.fee.general}</p>
                  <p><span className="font-semibold">For SC / ST :</span> ₹ {job.fee.scSt}</p>
                  <p><span className="font-semibold">For Women :</span> ₹ {job.fee.women}</p>
                  <p className="font-semibold mt-4 mb-1 border-t border-gray-200 pt-3">Payment Mode (Online):</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Debit Card</li>
                    <li>Credit Card</li>
                    <li>Internet Banking</li>
                    <li>UPI / Mobile Wallet</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Age Limit & Total Posts ───────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] border-b border-gray-300">
              <div className="border-r-0 md:border-r border-b md:border-b-0 border-gray-300">
                <div className="bg-blue-900 text-white font-bold text-center py-2 border-b border-gray-300">
                  {job.org} Notification 2026 : Age Limit
                </div>
                <div className="p-4 text-sm space-y-2 text-gray-800">
                  <p><span className="font-semibold">Minimum Age :</span> {job.ageLimit.min}</p>
                  <p><span className="font-semibold">Maximum Age :</span> {job.ageLimit.max}</p>
                  <p className="text-gray-600 italic">Age Relaxation: {job.ageLimit.relaxation}</p>
                </div>
              </div>
              <div>
                <div className="bg-amber-600 text-white font-bold text-center py-2 border-b border-gray-300">
                  Total Post
                </div>
                <div className="p-4 flex items-center justify-center h-full min-h-[100px]">
                  <p className="text-xl font-bold text-gray-900">{job.vacancies} Posts</p>
                </div>
              </div>
            </div>

            {/* ─── Vacancy & Eligibility Table ───────────────── */}
            <div className="overflow-x-auto border-b border-gray-300">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="bg-blue-950 text-white p-2 text-center border-r border-gray-300 w-1/4">Post Name</th>
                    <th className="bg-blue-950 text-white p-2 text-center border-r border-gray-300 w-1/4">Total Posts</th>
                    <th className="bg-blue-950 text-white p-2 text-center w-1/2">Eligibility Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-300">
                    <td className="p-3 text-sm font-semibold text-center border-r border-gray-300 text-blue-900">{job.title}</td>
                    <td className="p-3 text-sm text-center border-r border-gray-300 font-bold">{job.vacancies}</td>
                    <td className="p-3 text-sm text-gray-700">{job.eligibility}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ─── Physical Eligibility ──────────────────────── */}
            {job.physical && (
              <div className="overflow-x-auto border-b border-gray-300">
                <div className="bg-blue-900 text-white font-bold text-center py-2 border-b border-gray-300">
                  Physical Eligibility Details
                </div>
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-100 text-gray-900">
                      <th className="p-2 border-r border-b border-gray-300 text-sm w-1/3">Category</th>
                      <th className="p-2 border-r border-b border-gray-300 text-sm w-1/3 text-center">Male</th>
                      <th className="p-2 border-b border-gray-300 text-sm w-1/3 text-center">Female</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.physical.map((phys, idx) => (
                      <tr key={idx}>
                        <td className="p-3 text-sm font-semibold border-r border-b border-gray-300">{phys.post}</td>
                        <td className="p-3 text-sm border-r border-b border-gray-300 text-center">{phys.male || 'N/A'}</td>
                        <td className="p-3 text-sm border-b border-gray-300 text-center">{phys.female || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ─── How to Fill Form ──────────────────────────── */}
            <div className="border-b border-gray-300">
              <div className="bg-blue-950 text-white font-bold text-center py-2 border-b border-gray-300">
                How To Fill {job.org} Online Form 2026
              </div>
              <ul className="list-disc pl-8 pr-4 py-4 text-sm space-y-2 text-gray-800">
                <li>Interested Candidates who wish to apply for the <span className="font-bold">{job.org}</span> post can submit their application online before <span className="font-bold text-amber-600">{job.dates.applyEnd}</span>.</li>
                <li>Use the "Apply Online" link provided below under the Important Links section to apply directly.</li>
                <li>Alternatively, visit the Official Website of <span className="font-bold">{job.org}</span> to complete the application process.</li>
                <li>Make sure to complete the application before the deadline <span className="font-bold text-amber-600">{job.dates.applyEnd}</span>.</li>
                <li className="text-red-600 font-medium">Note: Candidates are requested to read the Official Notification carefully before filling out the form. (Verify Age Limit, Education Qualification, etc.)</li>
              </ul>
            </div>

            {/* ─── Mode of Selection ─────────────────────────── */}
            <div className="border-b border-gray-300">
              <div className="bg-blue-900 text-white font-bold text-center py-2 border-b border-gray-300">
                {job.title} : Mode Of Selection
              </div>
              <ul className="list-disc pl-8 py-3 text-sm text-gray-800">
                <li className="font-semibold">Online CBT Examination / Written Test</li>
                {job.physical && <li className="font-semibold">Physical Efficiency Test / PST</li>}
              </ul>
            </div>

            {/* ─── Important Questions (FAQ) ─────────────────── */}
            <div className="border-b border-gray-300 bg-gray-50">
              <div className="bg-blue-950 text-white font-bold text-center py-2 border-b border-gray-300">
                {job.title} : Important Questions
              </div>
              <div className="p-4 text-sm space-y-4">
                <div>
                  <p className="font-bold text-gray-900">Question: When will the online application for {job.title} start?</p>
                  <p className="text-gray-800"><span className="font-semibold">Answer:</span> The online application has started on <span className="font-bold">{job.dates.applyStart}</span>.</p>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <p className="font-bold text-gray-900">Question: What is the last date for online application?</p>
                  <p className="text-gray-800"><span className="font-semibold">Answer:</span> The last date for online application form is <span className="font-bold">{job.dates.applyEnd}</span>.</p>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <p className="font-bold text-gray-900">Question: What is the age limit for this vacancy?</p>
                  <p className="text-gray-800"><span className="font-semibold">Answer:</span> The minimum age required is <span className="font-bold">{job.ageLimit.min}</span> and maximum age is <span className="font-bold">{job.ageLimit.max}</span>.</p>
                </div>
              </div>
            </div>

            {/* ─── Important Links ───────────────────────────── */}
            <div>
              <div className="bg-blue-100 text-amber-600 font-bold text-center py-2 border-b border-gray-300 uppercase tracking-wide">
                Some Useful Important Links
              </div>
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="p-3 text-sm font-bold text-blue-900 border-r border-gray-300 w-1/2 md:w-2/3">Apply Online</td>
                    <td className="p-3 text-center">
                      <a href={(job.links?.apply && job.links.apply !== '#') ? job.links.apply : (job.links?.official || '#')} target="_blank" rel="noreferrer" className="inline-block bg-blue-950 text-white px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-blue-800 transition-colors">
                        Click Here
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300 hover:bg-gray-50">
                    <td className="p-3 text-sm font-bold text-blue-900 border-r border-gray-300">Download Notification</td>
                    <td className="p-3 text-center">
                      <a href={(job.links?.notification && job.links.notification !== '#') ? job.links.notification : (job.links?.official || '#')} target="_blank" rel="noreferrer" className="inline-block bg-amber-600 text-white px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-amber-700 transition-colors">
                        Click Here
                      </a>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-sm font-bold text-blue-900 border-r border-gray-300">Official Website</td>
                    <td className="p-3 text-center">
                      <a href={job.links?.official || '#'} target="_blank" rel="noreferrer" className="inline-block text-blue-700 font-bold hover:underline">
                        Click Here
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          /* Simplified layout for non-detailed items (results, admit cards, etc) */
          <div className="border border-gray-300 bg-white mb-8">
             <div className="bg-blue-950 text-white font-bold text-center py-2 border-b border-gray-300">
                Summary Information
              </div>
            <div className="p-6">
              <p className="text-gray-800 mb-4 text-sm font-medium text-center">
                This is a summarized notification update. Please visit the official website or download the full notification for complete details.
              </p>
              <div className="flex flex-col items-center gap-2 mb-6 text-sm">
                {job.examDate && <p><span className="font-bold text-blue-900">Exam Date:</span> {job.examDate}</p>}
                {job.date && <p><span className="font-bold text-blue-900">Published / Event Date:</span> {job.date}</p>}
                {job.status && <p><span className="font-bold text-blue-900">Current Status:</span> <span className="font-bold text-amber-600">{job.status}</span></p>}
              </div>
              <div className="text-center">
                <a href="#" className="inline-block bg-blue-950 text-white px-8 py-2 rounded-sm font-bold hover:bg-blue-800 transition-colors">
                  Go to Official Site
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
