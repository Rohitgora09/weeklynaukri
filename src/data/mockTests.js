export const mockTestSeriesList = [
  {
    id: 'ssc-cgl-2026',
    title: 'SSC CGL Full Mock Test Series 2026',
    org: 'Staff Selection Commission',
    category: 'SSC',
    description: 'Tier-1 mock tests with strict 15-minute sectional timers. Switch to next section occurs automatically.',
    totalTests: 2,
    durationMinutes: 60, // 15 mins * 4 sections
    totalQuestions: 10,
    totalMarks: 20,
    marksPerQuestion: 2,
    negativeMark: 0.5,
    isSectionalTime: true,
    sectionDurationMinutes: 15,
    sections: ['General Intelligence and Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension'],
    tests: [
      {
        index: 0,
        title: 'Full Mock Test - 1',
        isFree: true,
        durationMinutes: 60,
        questions: [
          {
            id: 'ssc-q1',
            section: 'General Intelligence and Reasoning',
            questionText: 'In a certain code language, "PENCIL" is written as "RCTEKN". How will "BROKEN" be written in that code language?',
            options: ['DTQMGP', 'DTQMGO', 'CTQLFO', 'CTQMGN'],
            correctIndex: 0,
            explanation: 'The pattern is shifting each letter forward by 2 positions (+2):\nB(+2)=D, R(+2)=T, O(+2)=Q, K(+2)=M, E(+2)=G, N(+2)=P.\nTherefore, "BROKEN" becomes "DTQMGP".'
          },
          {
            id: 'ssc-q2',
            section: 'General Intelligence and Reasoning',
            questionText: 'Find the missing number in the series: 4, 9, 20, 43, 90, ?',
            options: ['180', '185', '186', '187'],
            correctIndex: 1,
            explanation: 'The pattern is: (Previous number * 2) + consecutive increasing numbers starting from 1:\n- (4 * 2) + 1 = 9\n- (9 * 2) + 2 = 20\n- (20 * 2) + 3 = 43\n- (43 * 2) + 4 = 90\n- (90 * 2) + 5 = 185.'
          },
          {
            id: 'ssc-q3',
            section: 'General Awareness',
            questionText: 'Which gas is the chief constituent of Biogas (Gobar gas)?',
            options: ['Methane', 'Ethane', 'Propane', 'Carbon Dioxide'],
            correctIndex: 0,
            explanation: 'Biogas primarily consists of Methane (about 50-75%) and Carbon Dioxide (25-50%), with trace amounts of other gases. Methane is the combustible part, making it a valuable fuel source.'
          },
          {
            id: 'ssc-q4',
            section: 'General Awareness',
            questionText: 'Who is known as the Father of the Indian Constitution?',
            options: ['Dr. B. R. Ambedkar', 'Mahatma Gandhi', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad'],
            correctIndex: 0,
            explanation: 'Dr. B. R. Ambedkar is recognized as the Father of the Indian Constitution for his pivotal role as the Chairman of the Drafting Committee.'
          },
          {
            id: 'ssc-q9',
            section: 'General Awareness',
            questionText: 'Who was the first Indian woman to win an Olympic medal?',
            options: ['Karnam Malleswari', 'P.V. Sindhu', 'Saina Nehwal', 'Mary Kom'],
            correctIndex: 0,
            explanation: 'Karnam Malleswari won a bronze medal in weightlifting at the 2000 Sydney Olympics, becoming the first Indian woman to win an Olympic medal.'
          },
          {
            id: 'ssc-q10',
            section: 'General Awareness',
            questionText: 'Which article of the Indian Constitution is related to the Equality of Opportunity in matters of public employment?',
            options: ['Article 14', 'Article 15', 'Article 16', 'Article 17'],
            correctIndex: 2,
            explanation: 'Article 16 of the Constitution of India guarantees equality of opportunity in matters of public employment for all citizens.'
          },
          {
            id: 'ssc-q5',
            section: 'Quantitative Aptitude',
            questionText: 'A shopkeeper sells an item at a 15% discount. If the marked price of the item is ₹800, what is the selling price?',
            options: ['₹680', '₹720', '₹640', '₹700'],
            correctIndex: 0,
            explanation: 'Discount = 15% of ₹800 = (15/100) * 800 = ₹120.\nSelling Price = Marked Price - Discount = 800 - 120 = ₹680.'
          },
          {
            id: 'ssc-q6',
            section: 'Quantitative Aptitude',
            questionText: 'The average of five consecutive even numbers is 24. Find the largest of these numbers.',
            options: ['26', '30', '28', '24'],
            correctIndex: 2,
            explanation: 'Let the numbers be x-4, x-2, x, x+2, x+4. Their average is x = 24. The largest number is x + 4 = 24 + 4 = 28.'
          },
          {
            id: 'ssc-q7',
            section: 'English Comprehension',
            questionText: 'Choose the word that is most nearly opposite in meaning to: OPAQUE',
            options: ['Transparent', 'Cloudy', 'Dark', 'Frosted'],
            correctIndex: 0,
            explanation: 'Opaque means not letting light through. The opposite is Transparent, which allows light and clear vision through it.'
          },
          {
            id: 'ssc-q8',
            section: 'English Comprehension',
            questionText: 'Identify the segment containing a grammatical error: "Neither of the two books were interesting."',
            options: ['Neither', 'of the two books', 'were', 'interesting'],
            correctIndex: 2,
            explanation: '"Neither" is singular, so it requires a singular verb. "were" should be replaced with "was".'
          }
        ]
      }
    ]
  },
  {
    id: 'rrb-ntpc-2026',
    title: 'RRB NTPC Graduate Level Speed Test',
    org: 'Railway Recruitment Board',
    category: 'Railways',
    description: 'Designed for RRB NTPC Graduate Level CBT-1. 15-minute strict sectional limits per subject.',
    totalTests: 1,
    durationMinutes: 45, // 15 mins * 3 sections
    totalQuestions: 6,
    totalMarks: 6,
    marksPerQuestion: 1,
    negativeMark: 0.33,
    isSectionalTime: true,
    sectionDurationMinutes: 15,
    sections: ['Mathematics', 'General Intelligence', 'General Awareness'],
    tests: [
      {
        index: 0,
        title: 'NTPC General Test - 1',
        isFree: true,
        durationMinutes: 45,
        questions: [
          {
            id: 'rrb-q1',
            section: 'Mathematics',
            questionText: 'Calculate: 72 ÷ 8 × 9 - 10',
            options: ['71', '1', '81', '0'],
            correctIndex: 0,
            explanation: 'Following BODMAS rule:\n1. 72 ÷ 8 = 9\n2. 9 × 9 = 81\n3. 81 - 10 = 71.'
          },
          {
            id: 'rrb-q2',
            section: 'Mathematics',
            questionText: 'The ratio of two numbers is 3:4 and their LCM is 180. Find the sum of the two numbers.',
            options: ['105', '90', '120', '80'],
            correctIndex: 0,
            explanation: 'Let the two numbers be 3x and 4x. Their LCM is 12x.\nGiven LCM = 180, so 12x = 180 => x = 15.\nTherefore, the numbers are 3 * 15 = 45 and 4 * 15 = 60.\nTheir sum = 45 + 60 = 105.'
          },
          {
            id: 'rrb-q3',
            section: 'General Intelligence',
            questionText: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
            options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
            correctIndex: 1,
            explanation: 'Since the man has no brothers or sisters, "my father\'s son" refers to himself. So, the photograph belongs to his son.'
          },
          {
            id: 'rrb-q4',
            section: 'General Intelligence',
            questionText: 'Find the missing term in the series: 3, 5, 9, 17, 33, ?',
            options: ['65', '49', '50', '60'],
            correctIndex: 0,
            explanation: 'The difference between consecutive terms doubles each time:\n- 5 - 3 = 2\n- 9 - 5 = 4\n- 17 - 9 = 8\n- 33 - 17 = 16\n- Next difference is 32. So, 33 + 32 = 65.'
          },
          {
            id: 'rrb-q5',
            section: 'General Awareness',
            questionText: 'Where is the headquarters of the International Court of Justice (ICJ) located?',
            options: ['Geneva, Switzerland', 'New York, USA', 'The Hague, Netherlands', 'Paris, France'],
            correctIndex: 2,
            explanation: 'The International Court of Justice (ICJ) is headquartered in The Hague, Netherlands.'
          },
          {
            id: 'rrb-q6',
            section: 'General Awareness',
            questionText: 'Which planet is known as the "Red Planet" in our solar system?',
            options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
            correctIndex: 1,
            explanation: 'Mars is known as the Red Planet due to the presence of iron oxide (rust) on its surface, which gives it a reddish appearance.'
          }
        ]
      }
    ]
  },
  {
    id: 'ibps-po-2026',
    title: 'IBPS PO Prelims Practice Arena',
    org: 'Inst. of Banking Personnel Selection',
    category: 'Banking',
    description: 'Sectional banking mock exams for IBPS PO, featuring negative marking and strict 15-minute timers.',
    totalTests: 1,
    durationMinutes: 45, // 15 mins * 3 sections
    totalQuestions: 6,
    totalMarks: 6,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    isSectionalTime: true,
    sectionDurationMinutes: 15,
    sections: ['Quantitative Aptitude', 'Reasoning Ability', 'English Language'],
    tests: [
      {
        index: 0,
        title: 'Prelims Practice - 1',
        isFree: true,
        durationMinutes: 45,
        questions: [
          {
            id: 'ibps-q1',
            section: 'Quantitative Aptitude',
            questionText: 'In how many different ways can the letters of the word "BANK" be arranged?',
            options: ['24', '12', '48', '120'],
            correctIndex: 0,
            explanation: 'The word "BANK" has 4 distinct letters. The number of ways to arrange them is 4! = 4 * 3 * 2 * 1 = 24.'
          },
          {
            id: 'ibps-q2',
            section: 'Quantitative Aptitude',
            questionText: 'A sum of money doubles itself in 8 years at simple interest. What is the rate of interest per annum?',
            options: ['12.5%', '10%', '15%', '8%'],
            correctIndex: 0,
            explanation: 'Let the principal be P. The amount becomes 2P in 8 years.\nSimple Interest = 2P - P = P.\nFormula: SI = (P * R * T) / 100\nP = (P * R * 8) / 100 => R = 100 / 8 = 12.5%.'
          },
          {
            id: 'ibps-q3',
            section: 'Reasoning Ability',
            questionText: 'In a code, "MOCK" is written as "OPEM". How is "TEST" coded?',
            options: ['VGUV', 'VGUU', 'UFUT', 'VGVU'],
            correctIndex: 0,
            explanation: 'The pattern shifts characters forward by 2 positions: T(+2)=V, E(+2)=G, S(+2)=U, T(+2)=V. So TEST becomes VGUV.'
          },
          {
            id: 'ibps-q4',
            section: 'Reasoning Ability',
            questionText: 'If A is the brother of B; B is the sister of C; and C is the father of D, how A is related to C?',
            options: ['Brother', 'Sister', 'Uncle', 'Father'],
            correctIndex: 0,
            explanation: 'A is the brother of B, and B is the sister of C. Therefore, A, B, and C are siblings. Hence, A is C\'s brother.'
          },
          {
            id: 'ibps-q5',
            section: 'English Language',
            questionText: 'Fill in the blank: The manager was ________ in his criticism of the team\'s report.',
            options: ['harsh', 'harshly', 'harshness', 'harsher'],
            correctIndex: 0,
            explanation: 'An adjective is needed here to describe the manager\'s behavior. "harsh" is the correct adjective form.'
          },
          {
            id: 'ibps-q6',
            section: 'English Language',
            questionText: 'Find the correctly spelt word from the options below:',
            options: ['Comittee', 'Committee', 'Commitee', 'Comitee'],
            correctIndex: 1,
            explanation: 'The correct spelling is "Committee" (double m, double t, double e).'
          }
        ]
      }
    ]
  }
];

export function getTestSeriesById(id) {
  return mockTestSeriesList.find(ts => ts.id === id);
}

export function getMockTestByIndex(seriesId, testIndex) {
  const series = getTestSeriesById(seriesId);
  if (!series || !series.tests) return null;
  return series.tests.find(t => t.index === parseInt(testIndex));
}
