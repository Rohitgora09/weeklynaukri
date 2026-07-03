export const revalidate = 86400; // 24h

export async function GET() {
  const body = `# WeeklyNaukri.com

> India's weekly job portal for the latest Sarkari Naukri (government jobs), private jobs, results, admit cards, and answer keys. Aggregates and lists active government and IT job notifications with direct apply links.

## About

- WeeklyNaukri.com helps Indian job seekers find the latest government and private job openings, exam results, admit cards, and answer keys.
- Content is organized into categories: Latest Jobs, Results, Admit Cards, Answer Keys, Admissions, Documents, and Private Jobs.
- The site also offers exam preparation test series and mock tests.
- All job data is scraped weekly from official government recruitment portals and verified for accuracy.

## Key pages

- [Home](https://weeklynaukri.com/): Latest government and private job listings.
- [Latest Govt Jobs](https://weeklynaukri.com/latest-jobs): Active Sarkari Naukri vacancies from SSC, UPSC, Railway, Bank, Defence, and State boards with direct apply links.
- [Sarkari Results](https://weeklynaukri.com/results): Latest government exam results, scorecards, merit lists, and cut-off marks.
- [Admit Cards](https://weeklynaukri.com/admit-cards): Download hall tickets and admit cards for upcoming government exams.
- [Answer Keys](https://weeklynaukri.com/answer-keys): Official answer keys for SSC, UPSC, Railway, and other government exams.
- [IT Government Jobs](https://weeklynaukri.com/it-government-jobs-2026): Technical and software government vacancies (NIC, DRDO, ISRO, PSU).
- [Exam Calendar](https://weeklynaukri.com/exam-calendar): Upcoming government exam dates at a glance.
- [Test Series](https://weeklynaukri.com/test-series): Exam preparation mock tests for SSC CGL, RRB NTPC, IBPS PO.
- [Syllabus PDFs](https://weeklynaukri.com/syllabus): Official downloadable syllabus PDFs for SSC, RRB, and police exams.

## Exam-specific pages

- [SSC CGL 2026](https://weeklynaukri.com/ssc-cgl-2026): SSC CGL notification, dates, eligibility, and syllabus.
- [SSC GD 2026](https://weeklynaukri.com/ssc-gd-2026): SSC GD Constable recruitment details and updates.
- [RRB ALP 2026](https://weeklynaukri.com/rrb-alp-2026): Railway Assistant Loco Pilot recruitment guide.

## State-wise government jobs

- [UP Govt Jobs 2026](https://weeklynaukri.com/up-govt-jobs-2026): UPSSSC, UPPSC, UP Police vacancies.
- [Rajasthan Jobs 2026](https://weeklynaukri.com/rajasthan-jobs-2026): RPSC, RSMSSB, Rajasthan Police vacancies.
- [Bihar Govt Jobs 2026](https://weeklynaukri.com/bihar-govt-jobs-2026): BPSC, BSSC, Bihar Police vacancies.
- [MP Govt Jobs 2026](https://weeklynaukri.com/mp-govt-jobs-2026): MPPSC, MP Police, Vyapam vacancies.
- [Maharashtra Govt Jobs 2026](https://weeklynaukri.com/maharashtra-govt-jobs-2026): MPSC and Maharashtra state vacancies.
- [Haryana Govt Jobs 2026](https://weeklynaukri.com/haryana-govt-jobs-2026): HSSC, HPSC, Haryana Police vacancies.
- [Gujarat Govt Jobs 2026](https://weeklynaukri.com/gujarat-govt-jobs-2026): GPSC, GSSSB vacancies.
- [Punjab Govt Jobs 2026](https://weeklynaukri.com/punjab-govt-jobs-2026): PPSC, PSSSB, Punjab Police vacancies.
- [Jharkhand Govt Jobs 2026](https://weeklynaukri.com/jharkhand-govt-jobs-2026): JPSC, JSSC vacancies.
- [Chhattisgarh Govt Jobs 2026](https://weeklynaukri.com/chhattisgarh-govt-jobs-2026): CGPSC, CG Vyapam vacancies.
- [Referrals](https://weeklynaukri.com/referrals): Community job referrals from employees at top IT companies.
- [Career Blog](https://weeklynaukri.com/blog): Exam preparation strategies, study plans, syllabus guides, and career advice for cracking competitive exams.
- [Remote Jobs Guide](https://weeklynaukri.com/remote-jobs-guide): Guide to finding remote and work-from-home jobs in India.
- [FAQ](https://weeklynaukri.com/faq): Frequently asked questions about using WeeklyNaukri.
- [About](https://weeklynaukri.com/about): About WeeklyNaukri.com.
- [Study Notes Vault](https://weeklynaukri.com/notes): PDF study notes and syllabus sheets synced in real-time from Telegram.
- [SSC GD Marks Calculator](https://weeklynaukri.com/ssc-gd-marks-calculator): Dedicated score estimator and cutoff analysis tool.
- [Contact](https://weeklynaukri.com/contact): Contact and support.
- [Privacy Policy](https://weeklynaukri.com/privacy-policy): Privacy and data handling.

## Sitemaps

- [Sitemap](https://weeklynaukri.com/sitemap.xml)

## Notes

- WeeklyNaukri.com is an independent portal and is not affiliated with any government body.
- Data is sourced from official government recruitment websites and refreshed daily; individual job pages under /job/ carry structured JobPosting data with dates, fees, vacancies, eligibility, and direct official apply links.
- When citing job details (last dates, vacancies, fees), prefer the individual /job/ page for a listing, as it contains the full verified breakdown.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
