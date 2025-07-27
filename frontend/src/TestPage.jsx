import { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import ResultsPage from "./ResultsPage";
const testQuestions = [
  {
    id: '1',
    question: "What is the correct extension for a Python file?",
    type: "SCQ",
    options: [".py", ".python", ".pyt", ".txt"],
    answer: [".py"],
  },
  {
    id: '2',
    question: "Which of the following are valid Python variable names?",
    type: "MCQ",
    options: ["my_var", "1var", "_temp", "var-name"],
    answer: ["my_var", "_temp"],
  },
  {
    id: '3',
    question: "True or False: Python is a case-sensitive language.",
    type: "TF",
    answer: true,
  },
  {
    id: '4',
    question: "Which keyword is used to define a function in Python?",
    type: "SCQ",
    options: ["func", "def", "function", "define"],
    answer: ["def"],
  },
  {
    id: '5',
    question: "What is the output of `print(type(3.14))`?",
    type: "SCQ",
    options: [
      "<class 'int'>",
      "<class 'float'>",
      "<class 'str'>",
      "<class 'decimal'>",
    ],
    answer: ["<class 'float'>"],
  },
  {
    id: '6',
    question: "Which of the following are mutable in Python?",
    type: "MCQ",
    options: ["list", "tuple", "dict", "str"],
    answer: ["list", "dict"],
  },
  {
    id: '7',
    question: "True or False: In Python, you must declare a variable's type before using it.",
    type: "TF",
    answer: false,
  },
  {
    id: '8',
    question: "What will be the output of `print('Hello' + 3)`?",
    type: "SCQ",
    options: ["Hello3", "TypeError", "HelloHelloHello", "None"],
    answer: ["TypeError"],
  },
  {
    id: '9',
    question: "Which of the following is NOT a valid Python data type?",
    type: "SCQ",
    options: ["int", "float", "char", "bool"],
    answer: ["char"],
  },
  {
    id: '10',
    question: "What is the correct way to assign multiple variables in one line?",
    type: "MCQ",
    options: ["x = 1; y = 2", "x, y = 1, 2", "x = y = 1", "let x=1, y=2"],
    answer: ["x, y = 1, 2", "x = y = 1"],
  },
  {
    id: '11',
    question: "True or False: A tuple can be modified after creation.",
    type: "TF",
    answer: false,
  },
  {
    id: '12',
    question: "What is the output of `print(2 ** 3)`?",
    type: "SCQ",
    options: ["6", "8", "9", "23"],
    answer: ["8"],
  },
  {
    id: '13',
    question: "Which symbol is used for single-line comments in Python?",
    type: "SCQ",
    options: ["//", "#", "--", "/*"],
    answer: ["#"],
  },
  {
    id: '14',
    question: "Which of the following are valid ways to define a string in Python?",
    type: "MCQ",
    options: ["'Hello'", '"Hello"', "'''Hello'''", "`Hello`"],
    answer: ["'Hello'", '"Hello"', "'''Hello'''"],
  },
  {
    id: '15',
    question: "True or False: `None` is the same as `0` in Python.",
    type: "TF",
    answer: false,
  },
  {
    id: '16',
    question: "What does the `type()` function return?",
    type: "SCQ",
    options: [
      "The value of the variable",
      "The memory address",
      "The data type",
      "The length",
    ],
    answer: ["The data type"],
  },
  {
    id: '17',
    question: "Which operator is used for floor division in Python?",
    type: "SCQ",
    options: ["/", "//", "%", "**"],
    answer: ["//"],
  },
  {
    id: '18',
    question: "Explain the difference between `==` and `is` in Python.",
    type: "Descriptive",
    answer: "The `==` operator compares the values of two objects, while `is` checks if they are the exact same object in memory. For example, `x = [1,2]; y = [1,2]; x == y` is True (same values), but `x is y` is False (different objects). `is` returns True only if both variables point to the same object."
  },
  {
    id: '19',
    question: "Describe how Python handles dynamic typing with examples.",
    type: "Descriptive",
    answer: "Python uses dynamic typing, meaning variable types are determined at runtime and can change. You don't declare types explicitly. For example: `x = 5` (x is int), then `x = 'hello'` (x becomes str). The same variable can hold different data types. Type checking happens during execution, and operations are valid if types support them at runtime."
  },
  {
    id: '20',
    question: "What are the key differences between lists and tuples? Provide examples.",
    type: "Descriptive",
    answer: "Lists are mutable (can be modified after creation) while tuples are immutable. Lists use square brackets `[1,2,3]`, tuples use parentheses `(1,2,3)`. Lists have more methods like append(), remove(). Tuples are faster and used for fixed data. Example: `my_list = [1,2]; my_list[0] = 3` works, but `my_tuple = (1,2); my_tuple[0] = 3` raises an error."
  }
];

 const commonWords = [
    "the", "and", "for", "that", "with", "you", "this", "but", "have", 
    "from", "they", "will", "would", "there", "their", "what", "about", 
    "which", "when", "your", "said", "more", "some", "into", "them", "than"
  ];
const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuestions(testQuestions);
      
      // Initialize answers object
      const initialAnswers = {};
      testQuestions.forEach(q => {
        if (q.type === "MCQ") {
          initialAnswers[q.id] = [];
        } else if (q.type === "Descriptive") {
          initialAnswers[q.id] = "";
        } else {
          initialAnswers[q.id] = null;
        }
      });
      setAnswers(initialAnswers);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleSCQChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value]
    }));
  };

  const handleMCQChange = (questionId, value, checked) => {
    setAnswers(prev => {
      const currentAnswers = [...(prev[questionId] || [])];
      
      if (checked) {
        // Add the value if it's not already in the array
        if (!currentAnswers.includes(value)) {
          return {
            ...prev,
            [questionId]: [...currentAnswers, value]
          };
        }
      } else {
        // Remove the value
        return {
          ...prev,
          [questionId]: currentAnswers.filter(item => item !== value)
        };
      }
      
      return prev;
    });
  };

  const handleTFChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value === "true"
    }));
  };

  const handleDescriptiveChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = () => {
    let score = 0;
    let totalPossible = 0;
    const questionResults = {};
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      let isCorrect = false;
      
      if (question.type === "Descriptive") {
        // For descriptive questions, use keyword matching for validation
        if (userAnswer && userAnswer.trim() !== "") {
          isCorrect = validateDescriptiveAnswer(userAnswer, question.answer);
          totalPossible++;
          if (isCorrect) score++;
        } else {
          // If no answer provided, mark as incorrect
          isCorrect = false;
          totalPossible++;
        }
      } else if (question.type === "SCQ") {
        isCorrect = userAnswer && userAnswer[0] === question.answer[0];
        totalPossible++;
        if (isCorrect) score++;
      } else if (question.type === "MCQ") {
        // For MCQ, correct if all correct options are selected and no incorrect ones
        if (userAnswer) {
          const allCorrectSelected = question.answer.every(ans => userAnswer.includes(ans));
          const noIncorrectSelected = userAnswer.every(ans => question.answer.includes(ans));
          isCorrect = allCorrectSelected && noIncorrectSelected;
        }
        totalPossible++;
        if (isCorrect) score++;
      } else if (question.type === "TF") {
        isCorrect = userAnswer === question.answer;
        totalPossible++;
        if (isCorrect) score++;
      }
      
      questionResults[question.id] = {
        isCorrect,
        userAnswer,
        correctAnswer: question.answer,
        score: isCorrect ? 1 : 0
      };
    });
    
    return {
      score,
      totalPossible,
      percentage: totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0,
      questionResults
    };
  };
  
  // Function to validate descriptive answers using both keyword matching and text similarity
  const validateDescriptiveAnswer = (userAnswer, correctAnswer) => {
    if (!userAnswer || userAnswer.trim() === "") return false;
    
    const userText = userAnswer.toLowerCase();
    const correctText = correctAnswer.toLowerCase();
    
    // 1. Extract key phrases from the correct answer
    const keyPhrases = extractKeyPhrases(correctText);
    
    // 2. Calculate how many key phrases the user included
    const matchedPhrases = keyPhrases.filter(phrase => 
      userText.includes(phrase.toLowerCase())
    );
    
    // Calculate match percentage for key phrases
    const keyPhraseMatchPercentage = keyPhrases.length > 0 ? 
      (matchedPhrases.length / keyPhrases.length) * 100 : 0;
    
    // 3. Calculate text similarity score (0 to 1)
    const similarityScore = calculateTextSimilarity(userText, correctText) * 100;
    
    // 4. Combine both metrics with weights (70% keywords, 30% similarity)
    const combinedScore = (keyPhraseMatchPercentage * 0.7) + (similarityScore * 0.3);
    
    // Consider it correct if the combined score is at least 60%
    return combinedScore >= 60;
  };
  
  // Function to calculate similarity between two texts (for descriptive answers)
  const calculateTextSimilarity = (text1, text2) => {
    if (!text1 || !text2) return 0;
    
    // Convert to lowercase and remove punctuation
    const cleanText1 = text1.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    const cleanText2 = text2.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    
    // Split into words and filter out stop words
    const words1 = cleanText1.split(/\s+/).filter(word => word.length > 2 && !commonWords.includes(word));
    const words2 = cleanText2.split(/\s+/).filter(word => word.length > 2 && !commonWords.includes(word));
    
    // Count unique words in each text
    const uniqueWords1 = new Set(words1);
    const uniqueWords2 = new Set(words2);
    
    // Count common words
    let countcommonWords = 0;
    for (const word of uniqueWords1) {
      if (uniqueWords2.has(word)) {
        countcommonWords++;
      }
    }
    
    // Jaccard similarity coefficient
    const union = uniqueWords1.size + uniqueWords2.size - commonWords;
    return union > 0 ? commonWords / union : 0;
  };

  // Helper function to extract key phrases from the correct answer
  const extractKeyPhrases = (text) => {
    // Split by common delimiters and filter out short or common words
    const phrases = text.split(/[.,;()]/).map(p => p.trim())
      .filter(p => p.length > 5);
      
    // Extract key terms based on domain knowledge for Python-related questions
    const keyTerms = [
      "mutable", "immutable", "dynamic typing", "variable", "memory", 
      "object", "compare", "values", "runtime", "list", "tuple", "append", 
      "remove", "parentheses", "square brackets", "type checking", "exact same", 
      "different objects"
    ].filter(term => text.toLowerCase().includes(term.toLowerCase()));
    
    // Extract code examples if present (text between backticks)
    const codeExamples = [];
    const codeMatches = text.match(/`([^`]+)`/g);
    if (codeMatches) {
      codeMatches.forEach(match => {
        // Remove the backticks
        const code = match.replace(/`/g, '');
        codeExamples.push(code);
      });
    }
    
    // Combine all relevant phrases and terms
    return [...new Set([...phrases, ...keyTerms, ...codeExamples])];
  };
  
  // Common words to ignore in key phrase extraction
 

  const handleSubmit = () => {
    const results = calculateScore();
    setResults(results);
    setSubmitted(true);
  };

  const resetTest = () => {
    // Initialize answers object
    const initialAnswers = {};
    testQuestions.forEach(q => {
      if (q.type === "MCQ") {
        initialAnswers[q.id] = [];
      } else if (q.type === "Descriptive") {
        initialAnswers[q.id] = "";
      } else {
        initialAnswers[q.id] = null;
      }
    });
    setAnswers(initialAnswers);
    setResults(null);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Python Knowledge Test</h1>
        
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading questions...</p>
          </div>
        ) : (
          <>
            {results && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Test Completed</h2>
                <div className="mb-4">
                  <p className="text-lg">
                    Your test has been submitted successfully!
                  </p>
                  <div className="mt-4">
                    <Link 
                      to="#results" 
                      onClick={(e) => {
                        e.preventDefault();
                        // Here you would typically navigate to a separate results page
                        // For now, we'll just scroll to the results section
                        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Detailed Results &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div 
                  key={question.id} 
                  className={`bg-white shadow overflow-hidden rounded-lg p-6 ${
                    submitted && results?.questionResults[question.id]?.isCorrect === true 
                      ? 'border-2 border-green-500' 
                      : submitted && results?.questionResults[question.id]?.isCorrect === false 
                      ? 'border-2 border-red-500'
                      : ''
                  }`}
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      {index + 1}. {question.question}
                    </h2>
                  </div>

                  {question.type === "SCQ" && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label key={option} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`q${question.id}`}
                            value={option}
                            checked={answers[question.id]?.[0] === option}
                            onChange={() => handleSCQChange(question.id, option)}
                            disabled={submitted}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-gray-700 ${
                            submitted && question.answer.includes(option) ? 'font-bold text-green-700' : ''
                          }`}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "MCQ" && (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label key={option} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            name={`q${question.id}_${option}`}
                            value={option}
                            checked={answers[question.id]?.includes(option) || false}
                            onChange={(e) => handleMCQChange(question.id, option, e.target.checked)}
                            disabled={submitted}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-gray-700 ${
                            submitted && question.answer.includes(option) ? 'font-bold text-green-700' : ''
                          }`}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "TF" && (
                    <div className="flex space-x-6">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`q${question.id}`}
                          value="true"
                          checked={answers[question.id] === true}
                          onChange={() => handleTFChange(question.id, "true")}
                          disabled={submitted}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`ml-2 text-gray-700 ${
                          submitted && question.answer === true ? 'font-bold text-green-700' : ''
                        }`}>
                          True
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`q${question.id}`}
                          value="false"
                          checked={answers[question.id] === false}
                          onChange={() => handleTFChange(question.id, "false")}
                          disabled={submitted}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`ml-2 text-gray-700 ${
                          submitted && question.answer === false ? 'font-bold text-green-700' : ''
                        }`}>
                          False
                        </span>
                      </label>
                    </div>
                  )}

                  {question.type === "Descriptive" && (
                    <div>
                      <textarea
                        name={`q${question.id}_answer`}
                        rows={4}
                        value={answers[question.id] || ""}
                        onChange={(e) => handleDescriptiveChange(question.id, e.target.value)}
                        disabled={submitted}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2 py-2"
                        placeholder="Type your answer here..."
                      ></textarea>
                      
                      {submitted && (
                        <div className="mt-4 p-4 bg-gray-100 rounded">
                          <p className="font-bold text-gray-700">Model Answer:</p>
                          <p className="text-gray-700">{question.answer}</p>
                          
                          <div className="mt-2 pt-2 border-t border-gray-300">
                            <p className="font-bold text-gray-700">
                              Your answer was marked: {results?.questionResults[question.id]?.isCorrect ? 
                              <span className="text-green-600">Correct</span> : 
                              <span className="text-red-600">Incorrect</span>}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Descriptive answers are evaluated based on inclusion of key concepts from the model answer.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {submitted && (
                    <div className="mt-4">
                      {results?.questionResults[question.id]?.isCorrect ? (
                        <p className="text-green-600 font-medium">✓ Correct</p>
                      ) : (
                        <div>
                          <p className="text-red-600 font-medium">✗ Incorrect</p>
                          {question.type === "TF" ? (
                            <p className="text-gray-700 mt-1">
                              Correct answer: {question.answer ? "True" : "False"}
                            </p>
                          ) : question.type === "SCQ" || question.type === "MCQ" ? (
                            <p className="text-gray-700 mt-1">
                              Correct answer: {question.answer.join(", ")}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!submitted && (
                <div className="bg-white px-4 py-3 text-right sm:px-6 rounded-lg shadow">
                  <button
                    onClick={handleSubmit}
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit Test
                  </button>
                </div>
              )}
            </div>
            {submitted && results && (
              <div id="results-section" className="mt-12">
                <ResultsPage 
                  results={results} 
                  questions={questions} 
                  onRetakeTest={resetTest} 
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestPage;