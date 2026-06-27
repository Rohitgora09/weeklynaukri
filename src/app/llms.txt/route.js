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
- [IT Government Jobs](https://weeklynaukri.com/it-govt-jobs): Technical and software government vacancies.
- [Test Series](https://weeklynaukri.com/test-series): Exam preparation mock tests for SSC CGL, RRB NTPC, IBPS PO.
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
- Data is sourced from official government recruitment websites and updated weekly.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
