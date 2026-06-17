import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { syllabusList } from '../../data/syllabus';
import SyllabusClient from './SyllabusClient';

export const metadata = {
  title: 'Official Exam Syllabus PDF Vault 2026 | WeeklyNaukri',
  description: 'Download clean, fast-loading official syllabus PDFs for popular exams including SSC CGL, UP Police, RRB NTPC, SSC GD and more. Free download mirrors with exam pattern details.',
  alternates: {
    canonical: '/syllabus'
  }
};

export default function SyllabusVaultPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full font-sans antialiased text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full" id="main-content">
        <SyllabusClient syllabusList={syllabusList} />
      </main>

      <Footer />
    </div>
  );
}
