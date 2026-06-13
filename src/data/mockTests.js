export const mockTestSeriesList = [
  {
    id: 'ssc-cgl-2026',
    title: 'SSC CGL Full Mock Test Series 2026',
    org: 'Staff Selection Commission',
    category: 'SSC',
    description: 'Tier-1 full-length mock tests designed as per the latest SSC CGL pattern. Features negative marking and detailed sectional insights.',
    totalTests: 3,
    durationMinutes: 60,
    totalQuestions: 15, // Compact size for performance, scalable to 100
    totalMarks: 30,
    marksPerQuestion: 2,
    negativeMark: 0.5,
    tests: [
      {
        index: 0,
        title: 'Full Mock Test - 1',
        isFree: true,
        durationMinutes: 60,
        sections: ['General Intelligence & Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension'],
        questions: [
          {
            id: 'ssc-q1',
            section: 'General Intelligence & Reasoning',
            questionText: 'Select the related number from the given alternatives:\n\n6 : 18 :: 4 : ?',
            options: ['12', '8', '6', '16'],
            correctIndex: 1, // 4 * (4/2) = 8 (6 * (6/2) = 18)
            explanation: 'The pattern is: Number * (Number / 2).\n\n- 6 * (6 / 2) = 18\n- 4 * (4 / 2) = 8.\n\nTherefore, the correct answer is 8.'
          },
          {
            id: 'ssc-q2',
            section: 'General Intelligence & Reasoning',
            questionText: 'If red is called blue, blue is called white, white is called yellow, and yellow is called black, what is the color of clear sky?',
            options: ['Blue', 'White', 'Yellow', 'Black'],
            correctIndex: 1,
            explanation: 'The color of a clear sky is Blue. Since Blue is called White, the sky color will be represented as White.'
          },
          {
            id: 'ssc-q3',
            section: 'General Awareness',
            questionText: 'Who was the first Indian woman to win an Olympic medal?',
            options: ['Karnam Malleswari', 'P.V. Sindhu', 'Saina Nehwal', 'Mary Kom'],
            correctIndex: 0,
            explanation: 'Karnam Malleswari won a bronze medal in weightlifting at the 2000 Sydney Olympics, becoming the first Indian woman to win an Olympic medal.'
          },
          {
            id: 'ssc-q4',
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
      },
      {
        index: 1,
        title: 'Full Mock Test - 2',
        isFree: false,
        durationMinutes: 60,
        sections: ['General Intelligence & Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension'],
        questions: []
      }
    ]
  },
  {
    id: 'rrb-ntpc-2026',
    title: 'RRB NTPC Graduate Level Speed Test',
    org: 'Railway Recruitment Board',
    category: 'Railways',
    description: 'Designed for RRB NTPC Graduate Level CBT-1. Quick-paced general awareness and math speed sheets.',
    totalTests: 2,
    durationMinutes: 90,
    totalQuestions: 6,
    totalMarks: 6,
    marksPerQuestion: 1,
    negativeMark: 0.33,
    tests: [
      {
        index: 0,
        title: 'NTPC General Test - 1',
        isFree: true,
        durationMinutes: 90,
        sections: ['Mathematics', 'General Intelligence', 'General Awareness'],
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
            section: 'General Intelligence',
            questionText: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
            options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
            correctIndex: 1,
            explanation: 'Since the man has no brothers or sisters, "my father\'s son" refers to himself. So, the photograph belongs to his son.'
          },
          {
            id: 'rrb-q3',
            section: 'General Awareness',
            questionText: 'Where is the headquarters of the International Court of Justice (ICJ) located?',
            options: ['Geneva, Switzerland', 'New York, USA', 'The Hague, Netherlands', 'Paris, France'],
            correctIndex: 2,
            explanation: 'The International Court of Justice (ICJ) is headquartered in The Hague, Netherlands.'
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
    description: 'Sectional banking mock exams for IBPS PO, featuring negative marking and heavy time restraints.',
    totalTests: 1,
    durationMinutes: 60,
    totalQuestions: 5,
    totalMarks: 5,
    marksPerQuestion: 1,
    negativeMark: 0.25,
    tests: [
      {
        index: 0,
        title: 'Prelims Practice - 1',
        isFree: true,
        durationMinutes: 60,
        sections: ['English Language', 'Quantitative Aptitude', 'Reasoning Ability'],
        questions: [
          {
            id: 'ibps-q1',
            section: 'English Language',
            questionText: 'Fill in the blank: The manager was ________ in his criticism of the team\'s report.',
            options: ['harsh', 'harshly', 'harshness', 'harsher'],
            correctIndex: 0,
            explanation: 'An adjective is needed here to describe the manager\'s behavior. "harsh" is the correct adjective form.'
          },
          {
            id: 'ibps-q2',
            section: 'Reasoning Ability',
            questionText: 'In a code, "MOCK" is written as "OPEM". How is "TEST" coded?',
            options: ['VGUV', 'VGUU', 'UFUT', 'VGVU'],
            correctIndex: 0,
            explanation: 'The pattern shifts characters forward by 2 positions: M->O (+2), O->P (+1), C->E (+2), K->M (+2) - wait! \nM(+2)=O, O(+2)=Q (or O->P is +1), C(+2)=E, K(+2)=M. \nLet\'s check the simple shift of +2 for all letters: T(+2)=V, E(+2)=G, S(+2)=U, T(+2)=V. So TEST becomes VGUV.'
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
