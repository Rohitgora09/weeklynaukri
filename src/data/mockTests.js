export const mockTestSeriesList = [
  {
    id: 'ssc-cgl-2026',
    title: 'SSC CGL Full Mock Test Series 2026',
    org: 'Staff Selection Commission',
    category: 'SSC',
    description: 'Tier-1 mock tests with strict 15-minute sectional timers. Switch to next section occurs automatically.',
    totalTests: 2,
    durationMinutes: 60, // 15 mins * 4 sections
    totalQuestions: 60,
    totalMarks: 120,
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
          // Section 1: General Intelligence and Reasoning (Q1 - Q15)
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
            section: 'General Intelligence and Reasoning',
            questionText: 'Pointing to a photograph, a man said, "I have no brother or sister but that man\'s father is my father\'s son." Whose photograph was it?',
            options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
            correctIndex: 1,
            explanation: 'Since the speaker has no brothers or sisters, "my father\'s son" is the speaker himself. Thus, the photograph is of his son.'
          },
          {
            id: 'ssc-q4',
            section: 'General Intelligence and Reasoning',
            questionText: 'Select the option that is related to the third term in the same way as the second term is related to the first term.\n\nBook : Author :: Statue : ?',
            options: ['Mason', 'Sculptor', 'Painter', 'Calligrapher'],
            correctIndex: 1,
            explanation: 'A book is written by an author, and a statue is made by a sculptor.'
          },
          {
            id: 'ssc-q5',
            section: 'General Intelligence and Reasoning',
            questionText: 'Select the option that is related to the third number in the same way as the second number is related to the first number.\n\n8 : 81 :: 64 : ?',
            options: ['525', '625', '125', '729'],
            correctIndex: 1,
            explanation: 'The pattern is based on powers of consecutive integers:\n- 8 = 2^3, 81 = 3^4\n- 64 = 4^3, the next term is 5^4 = 625.'
          },
          {
            id: 'ssc-q6',
            section: 'General Intelligence and Reasoning',
            questionText: 'Three of the following four terms are alike in a certain way and form a group. Which is the one that does not belong to that group?',
            options: ['Mercury', 'Venus', 'Moon', 'Mars'],
            correctIndex: 2,
            explanation: 'Mercury, Venus, and Mars are planets, whereas the Moon is a natural satellite.'
          },
          {
            id: 'ssc-q7',
            section: 'General Intelligence and Reasoning',
            questionText: 'A man starts from a point and walks 5 km South. He then turns right and walks 3 km. He turns left and walks 5 km. In which direction is he now from his starting point?',
            options: ['West', 'South-West', 'South', 'South-East'],
            correctIndex: 1,
            explanation: 'Walking South, turning right puts him walking West. Turning left puts him walking South again. Relative to the starting point, his position is towards the South-West.'
          },
          {
            id: 'ssc-q8',
            section: 'General Intelligence and Reasoning',
            questionText: 'If "+" means "-", "-" means "*", "*" means "/", and "/" means "+", then calculate the value of the following expression:\n\n15 * 3 / 10 + 5 - 2',
            options: ['5', '8', '12', '6'],
            correctIndex: 0,
            explanation: 'Replacing operators:\nDivision: 15 / 3 = 5\nMultiplication: 5 * 2 = 10\nExpression is now: 5 + 10 - 10\nAddition & Subtraction: 15 - 10 = 5.'
          },
          {
            id: 'ssc-q9',
            section: 'General Intelligence and Reasoning',
            questionText: 'Read the statements and decide which of the given conclusions logically follow:\n\nStatements:\n1. All pens are cups.\n2. All cups are bowls.\n\nConclusions:\nI. All pens are bowls.\nII. Some bowls are cups.',
            options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both conclusions I and II follow', 'Neither follows'],
            correctIndex: 2,
            explanation: 'Since all pens are cups and all cups are bowls, the set of pens is inside cups, which is inside bowls, so all pens are bowls (I follows). Since all cups are bowls, some bowls are cups (II follows).'
          },
          {
            id: 'ssc-q10',
            section: 'General Intelligence and Reasoning',
            questionText: 'Five friends A, B, C, D, and E are sitting in a row facing North. A is sitting next to B. C is sitting next to D. C is not sitting next to E. E is on the left end of the row. D is in the second position from the right. If A is to the right of B, who is sitting in the middle?',
            options: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            explanation: 'Let\'s analyze the seating positions 1 (Left) to 5 (Right):\n- E is at the left end => Position 1 = E.\n- D is second from right => Position 4 = D.\n- C is sitting next to D, but not next to E, so C must be at Position 5 (next to D).\n- A is next to B and to the right of B, which means they must occupy Positions 2 and 3: Position 2 = B, Position 3 = A.\n- The final order is E, B, A, D, C. A is in the middle.'
          },
          {
            id: 'ssc-q11',
            section: 'General Intelligence and Reasoning',
            questionText: 'Which Venn diagram best represents the relationship among: Asia, India, Haryana?',
            options: ['Three disjoint circles', 'Three concentric circles', 'Two intersecting circles inside a third', 'One circle intersecting two disjoint circles'],
            correctIndex: 1,
            explanation: 'Haryana is a state in India, and India is a country in Asia. Thus, they represent three concentric circles (one inside the other).'
          },
          {
            id: 'ssc-q12',
            section: 'General Intelligence and Reasoning',
            questionText: 'Find the next term in the alphabet series: A, C, F, J, O, ?',
            options: ['T', 'U', 'V', 'W'],
            correctIndex: 1,
            explanation: 'The letter positions increase by progressively larger differences:\n- A(1) + 2 = C(3)\n- C(3) + 3 = F(6)\n- F(6) + 4 = J(10)\n- J(10) + 5 = O(15)\n- O(15) + 6 = U(21).'
          },
          {
            id: 'ssc-q13',
            section: 'General Intelligence and Reasoning',
            questionText: 'Find the missing number in the following 3x3 matrix:\n\n5   7   9\n6   8   10\n30  56  ?',
            options: ['70', '80', '90', '100'],
            correctIndex: 2,
            explanation: 'The pattern in each column is: Row 1 * Row 2 = Row 3.\n- Col 1: 5 * 6 = 30\n- Col 2: 7 * 8 = 56\n- Col 3: 9 * 10 = 90.'
          },
          {
            id: 'ssc-q14',
            section: 'General Intelligence and Reasoning',
            questionText: 'If 1st January 2023 was a Sunday, what day of the week was 31st December 2023?',
            options: ['Saturday', 'Sunday', 'Monday', 'Tuesday'],
            correctIndex: 1,
            explanation: '2023 is a non-leap year (365 days). A non-leap year always starts and ends on the same day of the week. Therefore, if Jan 1st was a Sunday, Dec 31st was also a Sunday.'
          },
          {
            id: 'ssc-q15',
            section: 'General Intelligence and Reasoning',
            questionText: 'Choose the correct mirror image of the word "EFFECT" when the mirror is placed to the right of the word.',
            options: ['TCEFFE', 'Mirror flipped letters starting with T', 'EFFECT written backwards', 'Flipped Fs and Es'],
            correctIndex: 1,
            explanation: 'When mirror is on the right, the rightmost letter T comes first and is laterally inverted, followed by C, E, F, F, E (all laterally inverted).'
          },

          // Section 2: General Awareness (Q16 - Q30)
          {
            id: 'ssc-q16',
            section: 'General Awareness',
            questionText: 'Which gas is the chief constituent of Biogas (Gobar gas)?',
            options: ['Methane', 'Ethane', 'Propane', 'Carbon Dioxide'],
            correctIndex: 0,
            explanation: 'Biogas primarily consists of Methane (about 50-75%) and Carbon Dioxide (25-50%), with trace amounts of other gases. Methane is the combustible part, making it a valuable fuel source.'
          },
          {
            id: 'ssc-q17',
            section: 'General Awareness',
            questionText: 'Who is known as the Father of the Indian Constitution?',
            options: ['Dr. B. R. Ambedkar', 'Mahatma Gandhi', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad'],
            correctIndex: 0,
            explanation: 'Dr. B. R. Ambedkar is recognized as the Father of the Indian Constitution for his pivotal role as the Chairman of the Drafting Committee.'
          },
          {
            id: 'ssc-q18',
            section: 'General Awareness',
            questionText: 'Who was the first Indian woman to win an Olympic medal?',
            options: ['Karnam Malleswari', 'P.V. Sindhu', 'Saina Nehwal', 'Mary Kom'],
            correctIndex: 0,
            explanation: 'Karnam Malleswari won a bronze medal in weightlifting at the 2000 Sydney Olympics, becoming the first Indian woman to win an Olympic medal.'
          },
          {
            id: 'ssc-q19',
            section: 'General Awareness',
            questionText: 'Which article of the Indian Constitution is related to the Equality of Opportunity in matters of public employment?',
            options: ['Article 14', 'Article 15', 'Article 16', 'Article 17'],
            correctIndex: 2,
            explanation: 'Article 16 of the Constitution of India guarantees equality of opportunity in matters of public employment for all citizens.'
          },
          {
            id: 'ssc-q20',
            section: 'General Awareness',
            questionText: 'In which year was the Battle of Plassey fought?',
            options: ['1757', '1764', '1789', '1857'],
            correctIndex: 0,
            explanation: 'The Battle of Plassey was fought on 23 June 1757 between the British East India Company (led by Robert Clive) and the Nawab of Bengal (Siraj-ud-Daulah).'
          },
          {
            id: 'ssc-q21',
            section: 'General Awareness',
            questionText: 'What was the capital of the Maurya Empire?',
            options: ['Pataliputra', 'Taxila', 'Ujjain', 'Indraprastha'],
            correctIndex: 0,
            explanation: 'Pataliputra (modern-day Patna) was the capital of the Maurya Empire, established by Chandragupta Maurya.'
          },
          {
            id: 'ssc-q22',
            section: 'General Awareness',
            questionText: 'Who coined the slogan "Swaraj is my birthright and I shall have it"?',
            options: ['Bal Gangadhar Tilak', 'Lala Lajpat Rai', 'Subhas Chandra Bose', 'Bhagat Singh'],
            correctIndex: 0,
            explanation: 'Bal Gangadhar Tilak, one of the key leaders of the Indian independence movement, raised the slogan to demand self-rule.'
          },
          {
            id: 'ssc-q23',
            section: 'General Awareness',
            questionText: 'Which is the deepest trench in the world\'s oceans?',
            options: ['Mariana Trench', 'Puerto Rico Trench', 'Java Trench', 'Sunda Trench'],
            correctIndex: 0,
            explanation: 'The Mariana Trench, located in the western Pacific Ocean, is the deepest trench, with Challenger Deep reaching approximately 10,994 meters.'
          },
          {
            id: 'ssc-q24',
            section: 'General Awareness',
            questionText: 'Scurvy is caused due to the deficiency of which vitamin?',
            options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
            correctIndex: 2,
            explanation: 'Scurvy, characterized by bleeding gums and fatigue, is caused by a deficiency of Vitamin C (ascorbic acid).'
          },
          {
            id: 'ssc-q25',
            section: 'General Awareness',
            questionText: 'Rusting of iron is a chemical reaction classified as what type of process?',
            options: ['Oxidation', 'Reduction', 'Sublimation', 'Evaporation'],
            correctIndex: 0,
            explanation: 'Rusting is an oxidation reaction where iron reacts with oxygen and moisture to form hydrated iron(III) oxide (rust).'
          },
          {
            id: 'ssc-q26',
            section: 'General Awareness',
            questionText: 'Which authority regulates the monetary policy in India?',
            options: ['Reserve Bank of India (RBI)', 'Ministry of Finance', 'SEBI', 'NITI Aayog'],
            correctIndex: 0,
            explanation: 'The Reserve Bank of India (RBI) regulates monetary policy under the Reserve Bank of India Act, 1934, to maintain price stability.'
          },
          {
            id: 'ssc-q27',
            section: 'General Awareness',
            questionText: 'Who was the first Governor-General of Bengal?',
            options: ['Warren Hastings', 'Lord Cornwallis', 'Robert Clive', 'Lord William Bentinck'],
            correctIndex: 0,
            explanation: 'Warren Hastings became the first Governor-General of Bengal in 1773 under the Regulating Act of 1773.'
          },
          {
            id: 'ssc-q28',
            section: 'General Awareness',
            questionText: 'Which is the largest freshwater lake in India?',
            options: ['Wular Lake', 'Chilika Lake', 'Dal Lake', 'Vembanad Lake'],
            correctIndex: 0,
            explanation: 'Wular Lake, located in Jammu & Kashmir, is the largest natural freshwater lake in India.'
          },
          {
            id: 'ssc-q29',
            section: 'General Awareness',
            questionText: 'The famous UNESCO World Heritage site, Ajanta Caves, is located in which Indian state?',
            options: ['Maharashtra', 'Madhya Pradesh', 'Karnataka', 'Rajasthan'],
            correctIndex: 0,
            explanation: 'The Ajanta Caves are 30 rock-cut Buddhist cave monuments located in Aurangabad district (now Chhatrapati Sambhajinagar), Maharashtra.'
          },
          {
            id: 'ssc-q30',
            section: 'General Awareness',
            questionText: 'Who is the ex-officio Chairman of the NITI Aayog in India?',
            options: ['The Prime Minister', 'The Finance Minister', 'The President', 'The Governor of RBI'],
            correctIndex: 0,
            explanation: 'The Prime Minister of India serves as the ex-officio Chairman of the National Institution for Transforming India (NITI Aayog).'
          },

          // Section 3: Quantitative Aptitude (Q31 - Q45)
          {
            id: 'ssc-q31',
            section: 'Quantitative Aptitude',
            questionText: 'A shopkeeper sells an item at a 15% discount. If the marked price of the item is ₹800, what is the selling price?',
            options: ['₹680', '₹720', '₹640', '₹700'],
            correctIndex: 0,
            explanation: 'Discount = 15% of ₹800 = (15/100) * 800 = ₹120.\nSelling Price = Marked Price - Discount = 800 - 120 = ₹680.'
          },
          {
            id: 'ssc-q32',
            section: 'Quantitative Aptitude',
            questionText: 'The average of five consecutive even numbers is 24. Find the largest of these numbers.',
            options: ['26', '30', '28', '24'],
            correctIndex: 2,
            explanation: 'Let the numbers be x-4, x-2, x, x+2, x+4. Their average is x = 24. The largest number is x + 4 = 24 + 4 = 28.'
          },
          {
            id: 'ssc-q33',
            section: 'Quantitative Aptitude',
            questionText: 'A sum of money doubles itself in 8 years at simple interest. What is the rate of interest per annum?',
            options: ['12.5%', '10%', '15%', '8%'],
            correctIndex: 0,
            explanation: 'Let principal be P. Interest gained in 8 years = P. R = (P * 100) / (P * 8) = 12.5%.'
          },
          {
            id: 'ssc-q34',
            section: 'Quantitative Aptitude',
            questionText: 'A can complete a work in 10 days and B can complete the same work in 15 days. Working together, how many days will they take to complete the work?',
            options: ['5 days', '6 days', '8 days', '9 days'],
            correctIndex: 1,
            explanation: 'Combined rate per day = 1/10 + 1/15 = 5/30 = 1/6.\nSo they will complete the work in 6 days.'
          },
          {
            id: 'ssc-q35',
            section: 'Quantitative Aptitude',
            questionText: 'If A : B = 2 : 3 and B : C = 4 : 5, find the ratio A : B : C.',
            options: ['8 : 12 : 15', '2 : 4 : 5', '6 : 8 : 10', '8 : 10 : 15'],
            correctIndex: 0,
            explanation: 'Multiply A:B by 4 -> 8:12. Multiply B:C by 3 -> 12:15. Combined ratio: A:B:C = 8:12:15.'
          },
          {
            id: 'ssc-q36',
            section: 'Quantitative Aptitude',
            questionText: 'If the price of sugar is increased by 20%, by what percentage should a household reduce its consumption of sugar so that the expenditure remains the same?',
            options: ['15%', '16.67%', '20%', '25%'],
            correctIndex: 1,
            explanation: 'Reduction in consumption = (R / (100 + R)) * 100 = (20 / 120) * 100 = 16.67%.'
          },
          {
            id: 'ssc-q37',
            section: 'Quantitative Aptitude',
            questionText: 'A train running at a speed of 72 km/h crosses a standing pole in 15 seconds. Find the length of the train.',
            options: ['250 m', '300 m', '350 m', '400 m'],
            correctIndex: 1,
            explanation: 'Speed in m/s = 72 * (5/18) = 20 m/s.\nLength (Distance) = Speed * Time = 20 * 15 = 300 m.'
          },
          {
            id: 'ssc-q38',
            section: 'Quantitative Aptitude',
            questionText: 'If x + 1/x = 5, find the value of x^2 + 1/x^2.',
            options: ['23', '25', '27', '21'],
            correctIndex: 0,
            explanation: 'Squaring both sides: (x + 1/x)^2 = 25 => x^2 + 2 + 1/x^2 = 25 => x^2 + 1/x^2 = 23.'
          },
          {
            id: 'ssc-q39',
            section: 'Quantitative Aptitude',
            questionText: 'Calculate the compound interest on ₹10,000 for 2 years at 10% per annum, compounded annually.',
            options: ['₹2,000', '₹2,100', '₹2,200', '₹1,900'],
            correctIndex: 1,
            explanation: 'Amount = 10000 * (1 + 10/100)^2 = 10000 * 1.21 = ₹12,100.\nCI = 12100 - 10000 = ₹2,100.'
          },
          {
            id: 'ssc-q40',
            section: 'Quantitative Aptitude',
            questionText: 'The product of two numbers is 2028 and their HCF is 13. How many pairs of such numbers can be formed?',
            options: ['1', '2', '3', '4'],
            correctIndex: 1,
            explanation: 'Let the numbers be 13a and 13b (where a and b are co-prime).\n13a * 13b = 2028 => 169 * ab = 2028 => ab = 12.\nCo-prime pairs of (a, b) whose product is 12 are: (1, 12) and (3, 4). Thus, 2 pairs.'
          },
          {
            id: 'ssc-q41',
            section: 'Quantitative Aptitude',
            questionText: 'If the radius of a circle is increased by 50%, find the percentage increase in its area.',
            options: ['100%', '125%', '150%', '75%'],
            correctIndex: 1,
            explanation: 'Net change = x + y + (xy/100) = 50 + 50 + (50 * 50 / 100) = 125%.'
          },
          {
            id: 'ssc-q42',
            section: 'Quantitative Aptitude',
            questionText: 'In a triangle, the angles are in the ratio 2 : 3 : 5. Find the measure of the smallest angle.',
            options: ['30°', '36°', '45°', '18°'],
            correctIndex: 1,
            explanation: 'Sum of angles is 180°.\n2x + 3x + 5x = 180 => 10x = 180 => x = 18.\nSmallest angle is 2x = 36°.'
          },
          {
            id: 'ssc-q43',
            section: 'Quantitative Aptitude',
            questionText: 'Evaluate: sin^2(30°) + cos^2(60°)',
            options: ['0.5', '1', '1.5', '0.25'],
            correctIndex: 0,
            explanation: 'sin(30°) = 0.5, so sin^2(30°) = 0.25.\ncos(60°) = 0.5, so cos^2(60°) = 0.25.\n0.25 + 0.25 = 0.5.'
          },
          {
            id: 'ssc-q44',
            section: 'Quantitative Aptitude',
            questionText: 'A and B start a business by investing in the ratio 3 : 5. After 6 months, A withdraws his capital while B continues. What is the ratio of their profits at the end of the year?',
            options: ['3 : 10', '9 : 25', '1 : 2', '3 : 5'],
            correctIndex: 0,
            explanation: 'Profit ratio = (Investment A * Time A) : (Investment B * Time B) = (3 * 6) : (5 * 12) = 18 : 60 = 3 : 10.'
          },
          {
            id: 'ssc-q45',
            section: 'Quantitative Aptitude',
            questionText: 'Find the remainder when (7^19 + 2) is divided by 6.',
            options: ['1', '2', '3', '0'],
            correctIndex: 2,
            explanation: '7 divided by 6 leaves a remainder of 1. So 7^19 leaves a remainder of 1^19 = 1.\nRemainder of (7^19 + 2) / 6 = (1 + 2) % 6 = 3.'
          },

          // Section 4: English Comprehension (Q46 - Q60)
          {
            id: 'ssc-q46',
            section: 'English Comprehension',
            questionText: 'Choose the word that is most nearly opposite in meaning to: OPAQUE',
            options: ['Transparent', 'Cloudy', 'Dark', 'Frosted'],
            correctIndex: 0,
            explanation: 'Opaque means not letting light through. The opposite is Transparent, which allows light and clear vision through it.'
          },
          {
            id: 'ssc-q47',
            section: 'English Comprehension',
            questionText: 'Identify the segment containing a grammatical error: "Neither of the two books were interesting."',
            options: ['Neither', 'of the two books', 'were', 'interesting'],
            correctIndex: 2,
            explanation: '"Neither" is singular, so it requires a singular verb. "were" should be replaced with "was".'
          },
          {
            id: 'ssc-q48',
            section: 'English Comprehension',
            questionText: 'Select the most appropriate synonym of the given word:\n\nABOLISH',
            options: ['Establish', 'Eliminate', 'Build', 'Support'],
            correctIndex: 1,
            explanation: 'Abolish means to formally put an end to a system, practice, or institution. Its synonym is Eliminate.'
          },
          {
            id: 'ssc-q49',
            section: 'English Comprehension',
            questionText: 'Select the word which means the same as the group of words given:\n\n"A person who compiles a dictionary"',
            options: ['Lexicographer', 'Cartographer', 'Bibliophile', 'Biographer'],
            correctIndex: 0,
            explanation: 'A lexicographer is a person who compiles dictionaries. A cartographer makes maps. A bibliophile loves books.'
          },
          {
            id: 'ssc-q50',
            section: 'English Comprehension',
            questionText: 'Select the most appropriate meaning of the given idiom:\n\n"Bite the bullet"',
            options: ['To show extreme anger', 'To face a difficult situation with courage', 'To get injured in an accident', 'To resolve a trivial dispute'],
            correctIndex: 1,
            explanation: '"Bite the bullet" means to face a difficult situation with courage and resolve, especially one that has been delayed.'
          },
          {
            id: 'ssc-q51',
            section: 'English Comprehension',
            questionText: 'Find the correctly spelt word from the options below:',
            options: ['Comittee', 'Committee', 'Commitee', 'Comitee'],
            correctIndex: 1,
            explanation: 'The correct spelling is "Committee" (double m, double t, double e).'
          },
          {
            id: 'ssc-q52',
            section: 'English Comprehension',
            questionText: 'Choose the correct passive voice of the given sentence:\n\n"The chef prepared a delicious meal."',
            options: ['A delicious meal is prepared by the chef.', 'A delicious meal was prepared by the chef.', 'A delicious meal has been prepared by the chef.', 'A delicious meal was being prepared by the chef.'],
            correctIndex: 1,
            explanation: 'The sentence is in Simple Past. Passive form is: Object + was/were + V3 + by Subject. Hence, "A delicious meal was prepared by the chef."'
          },
          {
            id: 'ssc-q53',
            section: 'English Comprehension',
            questionText: 'Select the correct indirect speech of the given sentence:\n\nHe said, "I am reading a book."',
            options: ['He said that he is reading a book.', 'He said that he was reading a book.', 'He said that I was reading a book.', 'He says that he is reading a book.'],
            correctIndex: 1,
            explanation: 'The reporting verb is in the past ("said"). "I" changes to "he", and present continuous "am reading" changes to past continuous "was reading".'
          },
          {
            id: 'ssc-q54',
            section: 'English Comprehension',
            questionText: 'Fill in the blank with the most appropriate word: The manager was ________ in his criticism of the team\'s report.',
            options: ['harsh', 'harshly', 'harshness', 'harsher'],
            correctIndex: 0,
            explanation: 'An adjective is needed here to describe the manager\'s behavior. "harsh" is the correct adjective form.'
          },
          {
            id: 'ssc-q55',
            section: 'English Comprehension',
            questionText: 'Select the alternative that will improve the underlined part of the sentence: "She has been working here <u>since</u> five years."',
            options: ['for', 'from', 'during', 'No improvement'],
            correctIndex: 0,
            explanation: 'Use "for" to denote a duration of time (five years) and "since" for a specific starting point in time.'
          },
          {
            id: 'ssc-q56',
            section: 'English Comprehension',
            questionText: 'Select the synonym of: DILIGENT',
            options: ['Hard-working', 'Lazy', 'Careless', 'Active'],
            correctIndex: 0,
            explanation: 'Diligent means having or showing care and conscientiousness in one\'s work or duties. Its synonym is Hard-working.'
          },
          {
            id: 'ssc-q57',
            section: 'English Comprehension',
            questionText: 'Select the antonym of: CAPTIVATE',
            options: ['Charm', 'Repel', 'Fascinate', 'Delight'],
            correctIndex: 1,
            explanation: 'Captivate means to attract and hold the interest of. Its opposite is Repel.'
          },
          {
            id: 'ssc-q58',
            section: 'English Comprehension',
            questionText: 'Select the meaning of the idiom: "Spill the beans"',
            options: ['To reveal a secret', 'To drop food items', 'To work hard', 'To speak rudely'],
            correctIndex: 0,
            explanation: '"Spill the beans" means to prematurely or accidentally reveal a secret.'
          },
          {
            id: 'ssc-q59',
            section: 'English Comprehension',
            questionText: 'Select the word which means the same as: "A person who hates mankind"',
            options: ['Misanthrope', 'Philanthropist', 'Misogynist', 'Optimist'],
            correctIndex: 0,
            explanation: 'A misanthrope is a person who dislikes humankind and avoids human society.'
          },
          {
            id: 'ssc-q60',
            section: 'English Comprehension',
            questionText: 'Complete the sentence with the correct option: He is too weak ________ walk.',
            options: ['to', 'for', 'at', 'into'],
            correctIndex: 0,
            explanation: 'The structure is "too + adjective + to + verb". Thus, "too weak to walk" is correct.'
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
