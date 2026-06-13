import { getMockTestByIndex, getTestSeriesById } from '../../../../../data/mockTests';
import TestResultClient from './TestResultClient';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Mock Exam Scorecard & Analysis - WeeklyNaukri',
  description: 'Detailed analysis, accuracy charts, and solution explanations for your mock test attempt.',
  robots: {
    index: false,
    follow: false
  }
};

export default async function TestResultPage({ params, searchParams }) {
  const { id, testIndex } = await params;
  const resolvedSearchParams = await searchParams;
  const attemptId = resolvedSearchParams?.attemptId || '';
  
  const series = getTestSeriesById(id);
  const test = getMockTestByIndex(id, testIndex);
  
  if (!series || !test) {
    notFound();
  }

  return <TestResultClient series={series} test={test} attemptId={attemptId} />;
}
