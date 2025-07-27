import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const ResultsPage = ({ results, questions, onRetakeTest }) => {
  const [chartData, setChartData] = useState({
    overview: null,
    byType: null,
    performanceByQuestion: null
  });
  
  useEffect(() => {
    if (!results || !questions) return;
    
    // Prepare data for the overview pie chart
    const overviewData = {
      labels: ['Correct', 'Incorrect'],
      datasets: [
        {
          data: [results.score, results.totalPossible - results.score],
          backgroundColor: ['#4ade80', '#f87171'],
          borderColor: ['#16a34a', '#dc2626'],
          borderWidth: 1,
        },
      ],
    };
    
    // Group questions by type
    const questionsByType = {
      SCQ: { total: 0, correct: 0 },
      MCQ: { total: 0, correct: 0 },
      TF: { total: 0, correct: 0 },
      Descriptive: { total: 0, correct: 0 }
    };
    
    // Calculate performance by question type
    questions.forEach(question => {
      const result = results.questionResults[question.id];
      if (questionsByType[question.type]) {
        questionsByType[question.type].total++;
        if (result && result.isCorrect === true) {
          questionsByType[question.type].correct++;
        }
      }
    });
    
    // Prepare data for question type performance chart
    const typeLabels = Object.keys(questionsByType).filter(type => questionsByType[type].total > 0);
    const typePerformanceData = {
      labels: typeLabels,
      datasets: [
        {
          label: 'Correct',
          data: typeLabels.map(type => questionsByType[type].correct),
          backgroundColor: '#4ade80',
        },
        {
          label: 'Incorrect',
          data: typeLabels.map(type => questionsByType[type].total - questionsByType[type].correct),
          backgroundColor: '#f87171',
        },
      ],
    };
    
    // Prepare data for performance by individual question
    const questionLabels = questions.map((q, index) => `Q${index + 1}`);
    const questionPerformanceData = {
      labels: questionLabels,
      datasets: [
        {
          label: 'Score',
          data: questions.map(q => {
            const result = results.questionResults[q.id];
            return result && result.isCorrect === true ? 1 : 0;
          }),
          backgroundColor: questions.map(q => {
            const result = results.questionResults[q.id];
            return result && result.isCorrect === true ? '#4ade80' : '#f87171';
          }),
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          maxBarThickness: 30,
        },
      ],
    };
    
    setChartData({
      overview: overviewData,
      byType: typePerformanceData,
      performanceByQuestion: questionPerformanceData
    });
  }, [results, questions]);
  
  if (!results || !questions || !chartData.overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-nunito">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Preparing results...</p>
      </div>
    );
  }
  
  // Calculate some statistics
  const questionTypes = {
    SCQ: questions.filter(q => q.type === "SCQ").length,
    MCQ: questions.filter(q => q.type === "MCQ").length,
    TF: questions.filter(q => q.type === "TF").length,
    Descriptive: questions.filter(q => q.type === "Descriptive").length
  };
  
  // Grade calculation
  let grade = "F";
  const percentage = results.percentage;
  if (percentage >= 90) grade = "A";
  else if (percentage >= 80) grade = "B";
  else if (percentage >= 70) grade = "C";
  else if (percentage >= 60) grade = "D";
  
  // Time-based feedback
  let feedback = "Great effort!";
  if (percentage >= 90) feedback = "Excellent work! You clearly understand Python concepts well!";
  else if (percentage >= 70) feedback = "Good job! You have a solid understanding of Python basics.";
  else if (percentage >= 50) feedback = "Nice effort! You're making progress with Python concepts.";
  else feedback = "Keep practicing! Python takes time to master.";
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Python Knowledge Test Results</h1>
          <p className="mt-2 text-gray-600">Test completed successfully</p>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-gray-900">Overall Score</h2>
                <div className="mt-2">
                  <p className="text-4xl font-bold text-blue-600">{results.score}/{results.totalPossible}</p>
                  <p className="text-2xl font-semibold text-gray-700">
                    {results.percentage}% <span className="ml-2 px-3 py-1 rounded-full text-sm font-medium" 
                      style={{
                        backgroundColor: 
                          percentage >= 90 ? '#dcfce7' : 
                          percentage >= 80 ? '#e0f2fe' : 
                          percentage >= 70 ? '#fef9c3' : 
                          percentage >= 60 ? '#fed7aa' : 
                          '#fee2e2',
                        color: 
                          percentage >= 90 ? '#16a34a' : 
                          percentage >= 80 ? '#0284c7' : 
                          percentage >= 70 ? '#ca8a04' : 
                          percentage >= 60 ? '#ea580c' : 
                          '#dc2626'
                      }}
                    >
                      Grade: {grade}
                    </span>
                  </p>
                </div>
                <p className="mt-3 text-gray-600">{feedback}</p>
              </div>
              
              <div className="w-48 h-48">
                {chartData.overview && (
                  <Pie 
                    data={chartData.overview} 
                    options={{
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-6 py-4">
            <h3 className="text-sm font-medium text-gray-500">TEST BREAKDOWN</h3>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Single Choice</p>
                <p className="font-medium">{questionTypes.SCQ} Questions</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Multiple Choice</p>
                <p className="font-medium">{questionTypes.MCQ} Questions</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">True/False</p>
                <p className="font-medium">{questionTypes.TF} Questions</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Descriptive</p>
                <p className="font-medium">{questionTypes.Descriptive} Questions</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Performance by Question Type</h2>
            <div className="h-64">
              {chartData.byType && (
                <Bar
                  data={chartData.byType}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                        beginAtZero: true
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Performance by Question</h2>
            <div className="h-64">
              {chartData.performanceByQuestion && (
                <Bar
                  data={chartData.performanceByQuestion}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                          stepSize: 1,
                          callback: value => value === 0 ? 'Incorrect' : value === 1 ? 'Correct' : ''
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Question Analysis</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Answer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question, index) => {
                  const result = results.questionResults[question.id];
                  let answerDisplay = '';
                  
                  if (question.type === "SCQ") {
                    answerDisplay = result?.userAnswer?.[0] || 'Not answered';
                  } else if (question.type === "MCQ") {
                    answerDisplay = result?.userAnswer?.join(', ') || 'Not answered';
                  } else if (question.type === "TF") {
                    answerDisplay = result?.userAnswer === true ? 'True' : 
                                    result?.userAnswer === false ? 'False' : 'Not answered';
                  } else {
                    // Truncate long descriptive answers
                    const answer = result?.userAnswer || '';
                    answerDisplay = answer.length > 50 ? answer.substring(0, 50) + '...' : answer || 'Not answered';
                  }
                  
                  return (
                    <tr key={question.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}. {question.question.length > 60 ? 
                          question.question.substring(0, 60) + '...' : 
                          question.question}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {question.type === "SCQ" ? "Single Choice" :
                        question.type === "MCQ" ? "Multiple Choice" :
                        question.type === "TF" ? "True/False" : "Descriptive"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {answerDisplay}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {result?.isCorrect ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Correct
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Incorrect
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onRetakeTest}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retake Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;