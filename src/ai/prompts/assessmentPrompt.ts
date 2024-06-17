export function createMcqQuestionsPrompt(assessment: any) {
  const prompt = `Create a unique multiple-choice test for ${assessment.role} users with ${assessment.experience} years of experience. The test should have ${assessment.totalQuestions} questions of difficulty level ${assessment.difficulty}. An example question could be:
  
    {
      "title": "What is the capital of India?",
      "answer": "Delhi",
      "options": ["Delhi", "Mumbai", "Chennai", "Kolkata"]
    }
  
  Each question should contain a title, answer, and options keys. The test should be in JSON format without any parsing errors.`;
  return prompt;
}
export function createCodingQuestionPrompt(assessment: any) {
  const prompt = `Create a coding test for ${assessment.role} users with ${assessment.experience} years of experience. The test should have ${assessment.totalQuestions} questions of difficulty level ${assessment.difficulty}. An example question could be:
  
    {
      questionTitle: 'Sum of Even Digits',
      questionDescription:
        'Write a function sum_of_even_digits that takes in an integer n and returns the sum of all even digits in the number. If the input number is negative, consider its absolute value.',
      functionSignature: 'function sum_of_even_digits(n) { }',
      example: [
        { input: 1234, output: 6 },
        { input: 987654321, output: 20 },
        { input: -2468, output: 20 },
      ],
      testCases: [
        { input: 1234, output: 6 },
        { input: 987654321, output: 20 },
        { input: -2468, output: 20 },
        { input: 0, output: 0 },
        { input: 13579, output: 0 },
      ],
    },
  
    Each question should contain a questionTitle, questionDescription, example, testCases, solution keys. The test should be in JSON format without any parsing errors.`;
  return prompt;

  // solution:
  //       function sum_of_even_digits(n) {
  //         n = Math.abs(n);
  //         let sumEven = 0;
  //         while (n > 0) {
  //           let digit = n % 10;
  //           if (digit % 2 === 0) {
  //             sumEven += digit;
  //           }
  //           n = Math.floor(n / 10);
  //         }
  //         return sumEven;
  //       },
}
