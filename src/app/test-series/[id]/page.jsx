import { getTestSeriesById } from '../../../data/mockTests';
import TestDetailClient from './TestDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const series = getTestSeriesById(id);
  
  if (!series) {
    return { title: 'Test Series Not Found' };
  }

  return {
    title: `${series.title} Online Practice Exam - WeeklyNaukri`,
    description: `Attempt free online full mock tests for ${series.title}. Check solutions, syllabus coverage, correct options, and negative marking scoring rules.`,
  };
}

export default async function TestDetailPage({ params }) {
  const { id } = await params;
  const series = getTestSeriesById(id);
  
  if (!series) {
    notFound();
  }

  return <TestDetailClient series={series} />;
}
