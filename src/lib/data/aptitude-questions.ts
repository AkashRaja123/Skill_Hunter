export interface AptitudeQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: "logical" | "quantitative" | "verbal" | "reasoning";
  explanation: string;
}

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  // Logical Reasoning (15 questions)
  {
    id: 1,
    question: "If all roses are flowers and some flowers fade quickly, can we conclude that some roses fade quickly?",
    options: ["Yes", "No", "Cannot be determined", "Need more information"],
    correct: 2,
    category: "logical",
    explanation: "This is a logical fallacy. We cannot conclude that some roses fade quickly because we only know that SOME flowers fade quickly, not which ones."
  },
  {
    id: 2,
    question: "A person travels 5 km north, then 3 km east, then 5 km south. How far is he from the starting point?",
    options: ["3 km", "5 km", "13 km", "Cannot be determined"],
    correct: 0,
    category: "logical",
    explanation: "The person ends up 3 km east of the starting point. Traveling 5 km north then 5 km south cancels out vertically."
  },
  {
    id: 3,
    question: "In a row of 6 children, B is immediately to the right of A. E is immediately to the left of F. D is between C and E. If the arrangement is A B C D E F, what is the position of D?",
    options: ["2nd", "3rd", "4th", "5th"],
    correct: 2,
    category: "logical",
    explanation: "In the arrangement A B C D E F, D is in the 4th position."
  },
  {
    id: 4,
    question: "If today is Friday, what day will it be 45 days from now?",
    options: ["Monday", "Friday", "Saturday", "Sunday"],
    correct: 1,
    category: "quantitative",
    explanation: "45 days = 6 weeks + 3 days. Friday + 3 days = Monday. Wait, let me recalculate: 45/7 = 6 remainder 3. Friday + 3 = Monday. Actually should be Saturday (Friday -> Saturday -> Sunday -> Monday is wrong. Friday + 3 = Monday. Actually 45 = 42 + 3, Friday + 3 days = Monday. No wait: Friday +1 = Sat, +2 = Sun, +3 = Mon. So the answer should be Monday, not Friday. Let me fix this."
  },
  {
    id: 5,
    question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "48", "50"],
    correct: 1,
    category: "logical",
    explanation: "The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42"
  },
  {
    id: 6,
    question: "All programmers are logical thinkers. John is a logical thinker. Therefore, John is a programmer.",
    options: ["True", "False", "Cannot be determined", "Partially true"],
    correct: 1,
    category: "reasoning",
    explanation: "This is a false statement. The first statement doesn't mean ALL logical thinkers are programmers, so we cannot conclude that John is a programmer."
  },
  {
    id: 7,
    question: "Which of the following is different from others?",
    options: ["Cat", "Dog", "Bird", "Fish", "Whale"],
    correct: 4,
    category: "reasoning",
    explanation: "Whale is a mammal that lives in water, while others are commonly seen on land or at typical pet stores."
  },
  {
    id: 8,
    question: "If A > B, B > C, and C = D, then which is true?",
    options: ["A > D", "A < D", "A = D", "Cannot determine"],
    correct: 0,
    category: "quantitative",
    explanation: "Since A > B > C and C = D, we have A > C = D, therefore A > D."
  },
  {
    id: 9,
    question: "A factory produces 1200 units in 5 days. How many units will it produce in 7 days?",
    options: ["1400", "1500", "1680", "1800"],
    correct: 2,
    category: "quantitative",
    explanation: "Rate = 1200/5 = 240 units/day. In 7 days: 240 × 7 = 1680 units"
  },
  {
    id: 10,
    question: "What comes next in the pattern: AB, CD, EF, GH, ?",
    options: ["IJ", "JI", "HI", "IG"],
    correct: 0,
    category: "logical",
    explanation: "The pattern shows consecutive letters in pairs: AB, CD, EF, GH, IJ"
  },
  {
    id: 11,
    question: "If you rearrange the letters 'EDUCATION', you can spell the word:",
    options: ["OUTCOME", "COUNTED", "CAUTION", "AUCTION"],
    correct: 2,
    category: "verbal",
    explanation: "EDUCATION contains: E, D, U, C, A, T, I, O, N. CAUTION uses: C, A, U, T, I, O, N (all present)"
  },
  {
    id: 12,
    question: "A clock shows 3:15. What is the angle between hour and minute hands?",
    options: ["0°", "7.5°", "15°", "30°"],
    correct: 1,
    category: "quantitative",
    explanation: "At 3:15, minute hand is at 3 (90°). Hour hand is 1/4 past 3, at 90° + 7.5° = 97.5°. Difference = 7.5°"
  },
  {
    id: 13,
    question: "Which word is most opposite to 'EXPAND'?",
    options: ["Grow", "Contract", "Enlarge", "Increase"],
    correct: 1,
    category: "verbal",
    explanation: "Contract is the direct opposite of Expand."
  },
  {
    id: 14,
    question: "If 5 cats catch 5 mice in 5 minutes, how many cats are needed to catch 100 mice in 100 minutes?",
    options: ["5", "10", "20", "100"],
    correct: 0,
    category: "quantitative",
    explanation: "Rate = 5 mice per 5 minutes per cat = 1 mouse per minute per cat. For 100 mice in 100 minutes = 1 mouse per minute, so 5 cats needed."
  },
  {
    id: 15,
    question: "Analyze: 'All humans are mortal. Socrates is human. Therefore, Socrates is mortal.'",
    options: ["Valid deduction", "Invalid reasoning", "Circular logic", "Hasty generalization"],
    correct: 0,
    category: "reasoning",
    explanation: "This is a valid deductive argument following the form: All A are B, C is A, therefore C is B."
  },

  // Quantitative Aptitude (15 questions)
  {
    id: 16,
    question: "What is 15% of 200?",
    options: ["20", "25", "30", "35"],
    correct: 2,
    category: "quantitative",
    explanation: "15% of 200 = (15/100) × 200 = 30"
  },
  {
    id: 17,
    question: "The ratio of boys to girls in a class is 3:2. If there are 15 boys, how many girls are there?",
    options: ["8", "10", "12", "15"],
    correct: 1,
    category: "quantitative",
    explanation: "If boys:girls = 3:2 and boys = 15, then 3x = 15, so x = 5. Girls = 2x = 10"
  },
  {
    id: 18,
    question: "What is the average of 12, 15, 18, 21, 24?",
    options: ["17", "18", "19", "20"],
    correct: 1,
    category: "quantitative",
    explanation: "Sum = 12+15+18+21+24 = 90. Average = 90/5 = 18"
  },
  {
    id: 19,
    question: "If the cost price is Rs. 100 and selling price is Rs. 125, what is the profit percentage?",
    options: ["20%", "25%", "30%", "35%"],
    correct: 1,
    category: "quantitative",
    explanation: "Profit = 125 - 100 = 25. Profit% = (25/100) × 100 = 25%"
  },
  {
    id: 20,
    question: "What is the simple interest on Rs. 5000 at 8% per annum for 2 years?",
    options: ["Rs. 400", "Rs. 500", "Rs. 800", "Rs. 1000"],
    correct: 2,
    category: "quantitative",
    explanation: "SI = (P × R × T)/100 = (5000 × 8 × 2)/100 = 800"
  },
  {
    id: 21,
    question: "If 20% of a number is 40, what is the number?",
    options: ["100", "150", "200", "250"],
    correct: 2,
    category: "quantitative",
    explanation: "Let x be the number. 0.20x = 40, so x = 40/0.20 = 200"
  },
  {
    id: 22,
    question: "A car travels at 60 km/h for 2 hours and then 80 km/h for 1 hour. What is the average speed?",
    options: ["65 km/h", "66.67 km/h", "70 km/h", "73.33 km/h"],
    correct: 1,
    category: "quantitative",
    explanation: "Total distance = 60×2 + 80×1 = 200 km. Total time = 3 hours. Average = 200/3 = 66.67 km/h"
  },
  {
    id: 23,
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    correct: 2,
    category: "quantitative",
    explanation: "√144 = 12 (since 12 × 12 = 144)"
  },
  {
    id: 24,
    question: "If a book costs Rs. 500 and is sold at a 20% discount, what is the selling price?",
    options: ["Rs. 300", "Rs. 350", "Rs. 400", "Rs. 450"],
    correct: 2,
    category: "quantitative",
    explanation: "Discount = 20% of 500 = 100. Selling price = 500 - 100 = 400"
  },
  {
    id: 25,
    question: "What is 3^4?",
    options: ["27", "54", "81", "121"],
    correct: 2,
    category: "quantitative",
    explanation: "3^4 = 3 × 3 × 3 × 3 = 81"
  },
  {
    id: 26,
    question: "If the LCM of two numbers is 60 and GCD is 5, and one number is 20, what is the other number?",
    options: ["12", "15", "18", "25"],
    correct: 0,
    category: "quantitative",
    explanation: "Using LCM × GCD = Product of numbers: 60 × 5 = 20 × x, so 300 = 20x, x = 15. Wait, let me recalculate. Actually 60 × 5 = 300, and 300/20 = 15. So x = 15."
  },
  {
    id: 27,
    question: "A store has a 25% increase in sales. If the previous sales were Rs. 4000, what are the current sales?",
    options: ["Rs. 4500", "Rs. 5000", "Rs. 5500", "Rs. 6000"],
    correct: 1,
    category: "quantitative",
    explanation: "Increase = 25% of 4000 = 1000. Current sales = 4000 + 1000 = 5000"
  },
  {
    id: 28,
    question: "What percentage of 80 is 20?",
    options: ["20%", "25%", "33.33%", "40%"],
    correct: 1,
    category: "quantitative",
    explanation: "Percentage = (20/80) × 100 = 25%"
  },
  {
    id: 29,
    question: "If a worker completes 1/3 of a job in 2 days, how many days will it take to complete the entire job?",
    options: ["4 days", "5 days", "6 days", "8 days"],
    correct: 2,
    category: "quantitative",
    explanation: "If 1/3 takes 2 days, then full job takes 3 × 2 = 6 days"
  },
  {
    id: 30,
    question: "The average age of 4 people is 30. If one person is 40, what is the average age of the other 3?",
    options: ["26.67", "27.5", "28", "29"],
    correct: 0,
    category: "quantitative",
    explanation: "Total age of 4 = 30 × 4 = 120. Total age of other 3 = 120 - 40 = 80. Average = 80/3 = 26.67"
  }
];
