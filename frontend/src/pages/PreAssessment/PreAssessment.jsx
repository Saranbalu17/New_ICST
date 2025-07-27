import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Static assessment questions
const STATIC_QUESTIONS = [
  {
    id: 1,
    question: "What is the value of 2 + 2 * 3?",
    options: ["8", "12", "6", "10"],
    correctAnswer: "6"
  },
  {
    id: 2,
    question: "Which programming language is known for its use in web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    correctAnswer: "JavaScript"
  },
  {
    id: 3,
    question: "What is the unit of force in the SI system?",
    options: ["Newton", "Joule", "Watt", "Pascal"],
    correctAnswer: "Newton"
  },
  {
    id: 4,
    question: "What does HTML stand for?",
    options: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Markup Language", "HyperText Machine Language"],
    correctAnswer: "HyperText Markup Language"
  },
  {
    id: 5,
    question: "What is the square root of 16?",
    options: ["2", "4", "8", "16"],
    correctAnswer: "4"
  }
];

const PreAssessment = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate localStorage userData
  let userData;
  try {
    const userDataRaw = localStorage.getItem('userData');
    userData = userDataRaw ? JSON.parse(userDataRaw) : null;
  } catch (err) {
    console.error('Error parsing userData from localStorage:', err);
    userData = null;
  }

  const adminUserId = userData?.adminUserId;
  const userName = userData?.userName;
  const userType = userData?.userType;

  useEffect(() => {
    // Check if userData is valid and user is a STUDENT
    if (!userData || !adminUserId || !userName || userType !== 'STUDENT') {
      setError('Unauthorized access. Please log in as a student.');
      navigate('/login');
    }
  }, [adminUserId, userName, userType, navigate]);

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate that all questions are answered
    if (Object.keys(responses).length !== STATIC_QUESTIONS.length) {
      setError('Please answer all questions.');
      return;
    }

    setLoading(true);
    setError('');

    // Evaluate responses
    let score = 0;
    const detailedResults = STATIC_QUESTIONS.map(question => {
      const userAnswer = responses[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score += 1;
      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      };
    });

    setResults({ score, total: STATIC_QUESTIONS.length, details: detailedResults });
    setIsSubmitted(true);
    setLoading(false);
  };

  if (error && (!userData || !adminUserId || userType !== 'STUDENT')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
          <div className="flex items-center">
            <AlertCircle size={24} className="text-red-500 mr-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full transition-all duration-300">
        {!isSubmitted ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Pre-Assessment Test</h1>
            <p className="text-gray-600 mb-8 text-center">Evaluate your current knowledge with this quick test</p>
            <form onSubmit={handleSubmit}>
              {STATIC_QUESTIONS.map((question, index) => (
                <div
                  key={question.id}
                  className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <label className="block text-lg font-medium text-gray-800 mb-4">
                    {index + 1}. {question.question}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {question.options.map(option => (
                      <div
                        key={option}
                        className="flex items-center p-4 bg-white rounded-md border border-gray-200 hover:border-blue-300 transition-all duration-200"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={responses[question.id] === option}
                          onChange={() => handleInputChange(question.id, option)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                          required
                          aria-label={`Option ${option} for question ${question.id}`}
                        />
                        <label className="ml-3 text-gray-700 text-sm font-medium cursor-pointer">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle size={20} className="text-red-500 mr-3" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 disabled:opacity-50 transform hover:scale-105"
              >
                {loading ? 'Evaluating...' : 'Submit Test'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Your Test Results</h1>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-8 text-center">
              <p className="text-4xl font-bold">{results.score} / {results.total}</p>
              <p className="text-lg mt-2">
                Score: {((results.score / results.total) * 100).toFixed(1)}%
              </p>
              {results.score / results.total >= 0.8 && (
                <p className="text-sm mt-2 font-medium">Excellent Performance!</p>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Question Breakdown</h2>
            <div className="space-y-6">
              {results.details.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <p className="text-gray-800 font-medium mb-2">{index + 1}. {item.question}</p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Your Answer:</span>
                    <span className="text-sm font-medium">{item.userAnswer}</span>
                    {item.isCorrect ? (
                      <CheckCircle size={18} className="text-green-500 ml-3" />
                    ) : (
                      <XCircle size={18} className="text-red-500 ml-3" />
                    )}
                  </div>
                  {!item.isCorrect && (
                    <p className="text-sm text-gray-600 mt-1">
                      Correct Answer: {item.correctAnswer}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/student-dashboard')}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreAssessment;