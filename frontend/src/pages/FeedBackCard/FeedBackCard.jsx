import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
const baseUrl = import.meta.env.VITE_BASE_API_URL;
const grpCode = import.meta.env.VITE_GRP_CODE || "DEFAULT_GRP_CODE";
const colCode = import.meta.env.VITE_DEFAULT_COL_CODE || "DEFAULT_COL_CODE";
const collegeId =
  import.meta.env.VITE_DEFAULT_COLLEGE_ID || "DEFAULT_COLLEGE_ID";
const emojiOptionsMap = ["😠", "😞", "😐", "😊", "🤩"];

const starOptionsMap = {
  1: "poor",
  2: "below average",
  3: "average",
  4: "good",
  5: "excellent",
};

const defaultOptions = {
  Stars: Array(5).fill({ optionValue: null, optionText: null }),
  "Yes/No": [
    { optionValue: "Yes", optionText: "Yes" },
    { optionValue: "No", optionText: "No" },
  ],
};

const FeedBackCard = ({ title = "Feedback Form" }) => {
  const [responses, setResponses] = useState({});
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [preAssessmentResult, setPreAssessmentResult] = useState(null);
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const { feedbackId, studentId } = useParams();
  const location = useLocation();
  const { PreAssessment, adminUserId } = location.state;
  const navigate = useNavigate();
  const resultsRef = useRef(null);

  console.log(location.state);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${baseUrl}/api/FeedBack/Feedback_FeedBackuser`,
          {
            GrpCode: grpCode,
            ColCode: colCode,
            CollegeId: collegeId,
            AssignmentId: 0,
            FeedBackId: 8,
            StudentId: parseInt(adminUserId),
            ProgramId: 0,
            BranchId: 0,
            SemId: 0,
            SectionId: 0,
            RegulationId: 0,
            AcademicYear: "2024-2025",
            EmployeeId: 0,
            DepartmentId: 0,
            DesignationId: 0,
            Flag: "DISPLAY",
            LoginIpAddress: "192.168.1.1",
            LoginSystemName: "DESKTOP-TEST",
          }
        );
        const list = Array.isArray(response.data.userResponseList)
          ? response.data.userResponseList
          : [];
        console.log("API Response:", list);
        setFeedbackData(list);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbackData([]);
        setError("Failed to fetch feedback data.");
        alert("Failed to fetch feedback data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, [feedbackId, studentId]);

  const handleResponse = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setValidationErrors((prev) => ({ ...prev, [questionId]: null }));

    const currentQuestion = allQuestions[visibleQuestionIndex];
    const currentSection = uniqueSections.find((section) =>
      section.questions.some(
        (q) => q.questionId === currentQuestion?.questionId
      )
    );
    const currentSectionQuestions = currentSection?.questions || [];
    const currentQuestionIndexInSection = currentSectionQuestions.findIndex(
      (q) => q.questionId === currentQuestion?.questionId
    );

    if (value && visibleQuestionIndex < allQuestions.length - 1) {
      const isLastQuestionInSection =
        currentQuestionIndexInSection === currentSectionQuestions.length - 1;
      const tempResponses = { ...responses, [questionId]: value };
      const allAnsweredInSection = currentSectionQuestions.every(
        (q) =>
          tempResponses[q.questionId] ||
          q.questionType.toLowerCase() === "textarea"
      );

      if (isLastQuestionInSection && allAnsweredInSection) {
        setVisibleQuestionIndex(visibleQuestionIndex + 1);
      } else if (!isLastQuestionInSection) {
        setVisibleQuestionIndex((prev) => prev + 1);
      }
    }
  };

  const handleDescriptiveChange = (questionId, value) => {
    setComments((prev) => ({ ...prev, [questionId]: value }));
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendMarksToEmail = async (email, marks, percentage) => {
    try {
      const response = await fetch(`${baseUrl}/LMS/SendFeedbackScoreEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          score: marks,
          percentage: percentage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send marks email");
      }

      alert("Feedback marks sent successfully!");
    } catch (err) {
      console.error("Error sending marks email:", err);
      alert("Error sending feedback marks");
      throw err;
    }
  };

  const handleContinue = async () => {
    if (submissionStatus === "success" && preAssessmentResult) {
      // Validate email
      if (!email) {
        setEmailError("Please enter an email address.");
        return;
      }
      if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address.");
        return;
      }

      try {
        const obtainedMarks =
          preAssessmentResult?.preAssessmentList[0]?.obtainedMarks || 0;
        const percentage =
          preAssessmentResult?.preAssessmentList[0]?.percentage || 0;

        // Send marks and percentage to email
        await sendMarksToEmail(email, obtainedMarks, percentage);

        // Navigate to student-dashboard (uncomment if needed)
        navigate("/student-dashboard");
      } catch (error) {
        console.error("Error sending marks:", error);
        alert("Failed to send marks. Please try again.");
      }
    }
  };

  const handleSubmit = async () => {
    const errors = {};
    const questionMap = new Map();

    feedbackData.forEach((item) => {
      const {
        feedBackId,
        questionId,
        questionText,
        questionType,
        questionRange,
        optionText,
        optionValue,
        optionId,
      } = item;
      if (
        !feedBackId ||
        !questionId ||
        !questionText ||
        !questionType ||
        !optionText ||
        !optionValue
      )
        return;

      if (!questionMap.has(questionId)) {
        questionMap.set(questionId, {
          questionId,
          questionText,
          questionType,
          questionRange,
          options: [],
        });
      }

      const current = questionMap.get(questionId);
      const exists = current.options.some(
        (opt) =>
          opt.optionValue === optionValue &&
          opt.optionText === optionText &&
          opt.optionId === optionId
      );

      if (!exists) {
        current.options.push({ optionText, optionValue, optionId });
      }
    });

    const uniqueQuestions = Array.from(questionMap.values());

    uniqueQuestions.forEach((question) => {
      if (
        !responses[question.questionId] &&
        question.questionType.toLowerCase() !== "textarea"
      ) {
        errors[question.questionId] = "Please select an option.";
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userTableVariable = [];
      Object.entries(responses).forEach(([questionId, value]) => {
        const questionData = feedbackData.filter(
          (item) => item.questionId === parseInt(questionId)
        );
        const commentText = comments[questionId] || "";

        if (Array.isArray(value)) {
          value.forEach((val) => {
            const option = questionData.find(
              (item) => item.optionValue === val
            );
            const responseText = val.toString();
            const finalResponseText = commentText
              ? `${responseText} ${commentText}`.trim()
              : responseText;
            userTableVariable.push({
              QuestionId: parseInt(questionId),
              OptionId: option ? option.optionId || 0 : 0,
              ResponseText: finalResponseText,
            });
          });
        } else {
          const option = questionData.find(
            (item) => item.optionValue === value
          );
          const responseText = value?.toString() || "";
          const finalResponseText = commentText
            ? `${responseText} ${commentText}`.trim()
            : responseText;
          userTableVariable.push({
            QuestionId: parseInt(questionId),
            OptionId: option ? option.optionId || 0 : 0,
            ResponseText: finalResponseText,
          });
        }
      });

      const submissionData = {
        GrpCode: "icst",
        ColCode: "0001",
        CollegeId: 1,
        AssignmentId: 0,
        FeedBackId: 8,
        StudentId: parseInt(adminUserId),
        EmployeeId: 0,
        CourseId: 0,
        HostelId: 0,
        EventId: 0,
        TransportId: 0,
        LibraryId: 0,
        GeneralId: 0,
        Comments: comments["general"] || "",
        AcademicYear: "2024-2025",
        Flag: "CREATE",
        Faculty: 0,
        TableVariable: userTableVariable,
        LoginIpAddress: "192.168.1.1",
        LoginSystemName: "DESKTOP-TEST",
      };

      console.log("Submitting feedback with data:", submissionData);
      const feedbackResponse = await axios.post(
        `${baseUrl}/api/FeedBack/FeedbackUserResponse1`,
        submissionData
      );

      if (feedbackResponse.data.message === "Response already saved") {
        setSubmissionStatus("alreadySaved");
      } else {
        const preAssessmentData = {
          GrpCode: grpCode,
          ColCode: colCode,
          StudentiD: parseInt(adminUserId),
          FeedBACKID: 8,
        };

        console.log(
          "Calling SP_PreAssessment_Result with data:",
          preAssessmentData
        );
        const preAssessmentResponse = await axios.post(
          `${baseUrl}/api/FeedBack/SP_PreAssessment_Result`,
          preAssessmentData
        );
        setPreAssessmentResult(preAssessmentResponse.data);
        console.log("PreAssessment Result:", preAssessmentResponse.data);

        const preAssessmentName =
          preAssessmentResponse.data?.preAssessmentList?.[0]
            ?.preAssessmentName || "";

        if (preAssessmentName.toLowerCase() === "no") {
          navigate("/preAssessment", {
            state: { adminUserId, PreAssessment },
          });
          return;
        }

        setSubmissionStatus("success");
        setResponses({});
        setComments({});
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setError("Failed to save user response or fetch pre-assessment result.");
      setSubmissionStatus("error");
    } finally {
      setLoading(false);
      if (resultsRef.current && submissionStatus !== "alreadySaved") {
        resultsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  const renderOptions = (question, questionIndex) => {
    const baseClasses =
      "border border-gray-300 px-2 mx-2 flex items-center rounded-lg hover:bg-gray-100 hover:border-teal-500 transition-all duration-300";

    const questionMap = new Map();
    feedbackData.forEach((item) => {
      if (
        item.questionId &&
        item.questionText &&
        item.questionType &&
        item.optionText &&
        item.optionValue &&
        item.optionId
      ) {
        if (!questionMap.has(item.questionId)) {
          questionMap.set(item.questionId, {
            questionId: item.questionId,
            questionText: item.questionText,
            questionType: item.questionType,
            questionRange: item.questionRange || null,
            options: new Map(),
          });
        }
        const questionEntry = questionMap.get(item.questionId);
        if (!questionEntry.options.has(item.optionId)) {
          questionEntry.options.set(item.optionId, {
            optionText: item.optionText,
            optionValue: item.optionValue,
            optionId: item.optionId,
          });
        }
      }
    });

    const uniqueQuestions = Array.from(questionMap.values()).map((q) => ({
      ...q,
      options: Array.from(q.options.values()).sort(
        (a, b) => a.optionId - b.optionId
      ),
    }));

    const currentQuestion = uniqueQuestions.find(
      (q) => q.questionId === question.questionId
    );
    const uniqueOptions = currentQuestion ? currentQuestion.options : [];

    if (!question.questionType || typeof question.questionType !== "string") {
      return (
        <div className="text-red-600 text-center text-sm md:text-base">
          Invalid question type
        </div>
      );
    }

    const optionText =
      uniqueOptions.length > 0
        ? uniqueOptions[0].optionText.toLowerCase()
        : question.questionType.toLowerCase();

    switch (optionText) {
      case "radio":
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(10)].map((_, index) => {
              const value = index + 1;
              const isSelected =
                responses[question.questionId] === value.toString();
              return (
                <label key={index} className="flex items-center m-0">
                  <input
                    type="radio"
                    name={`radioGroup-${question.questionId}`}
                    value={value}
                    checked={isSelected}
                    onChange={() =>
                      handleResponse(question.questionId, value.toString())
                    }
                    className="hidden"
                  />
                  <span
                    className={`flex justify-center items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 text-sm sm:text-base font-medium cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? value <= 2
                          ? "bg-red-500 text-white border-red-600"
                          : value <= 4
                          ? "bg-yellow-500 text-white border-yellow-600"
                          : value <= 6
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-green-500 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300"
                    } hover:border-teal-500 hover:bg-gray-100 hover:shadow-sm`}
                  >
                    {value}
                  </span>
                </label>
              );
            })}
          </div>
        );
      case "checkbox":
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {uniqueOptions.map((option, index) => (
              <label key={option.optionId} className="flex items-center m-0">
                <input
                  type="checkbox"
                  checked={responses[question.questionId]?.includes(
                    option.optionValue
                  )}
                  onChange={() => {
                    const current = responses[question.questionId] || [];
                    const updated = current.includes(option.optionValue)
                      ? current.filter((v) => v !== option.optionValue)
                      : [...current, option.optionValue];
                    handleResponse(question.questionId, updated);
                  }}
                  className="mr-2 rounded border-gray-300 focus:ring-teal-500"
                />
                <span className="text-gray-500 text-sm md:text-base">
                  {option.optionValue}
                </span>
              </label>
            ))}
          </div>
        );
      case "stars":
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {uniqueOptions.map((option, index) => (
              <button
                key={option.optionId}
                className={`${baseClasses} ${
                  responses[question.questionId] === option.optionValue
                    ? "bg-teal-500 text-white border-teal-600"
                    : "text-gray-700"
                } min-w-[100px] sm:min-w-[120px] py-1.5`}
                onClick={() =>
                  handleResponse(question.questionId, option.optionValue)
                }
              >
                <span className="text-lg mr-1.5">🌟</span>
                <span className="text-sm md:text-base">
                  {starOptionsMap[option.optionValue] || option.optionValue}
                </span>
              </button>
            ))}
          </div>
        );
      case "emoji":
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {uniqueOptions.map((option, index) => (
              <button
                key={option.optionId}
                className={`${baseClasses} ${
                  responses[question.questionId] === option.optionValue
                    ? "bg-teal-500 text-white border-teal-600"
                    : "text-gray-700"
                } min-w-[90px] sm:min-w-[100px] py-1.5`}
                onClick={() =>
                  handleResponse(question.questionId, option.optionValue)
                }
              >
                <span className="text-lg mr-1.5">
                  {emojiOptionsMap[index] || ""}
                </span>
                <span className="text-sm md:text-base">
                  {option.optionValue}
                </span>
              </button>
            ))}
          </div>
        );
      case "slider":
        const sliderOptions = uniqueOptions.map((opt) => opt.optionValue);
        const totalSteps = sliderOptions.length;
        const currentValue = responses[question.questionId];
        const percentageFromLabel = (label) => {
          const index = sliderOptions.indexOf(label);
          return index >= 0 ? Math.floor((index / (totalSteps - 1)) * 100) : 0;
        };
        const getLabelFromPercentage = (percentage) => {
          const index = Math.min(
            Math.floor((percentage / 100) * totalSteps),
            totalSteps - 1
          );
          return sliderOptions[index];
        };
        const displayPercent = percentageFromLabel(
          currentValue || sliderOptions[0]
        );

        return (
          <div className="w-full px-2 sm:px-3">
            <input
              type="range"
              min="0"
              max={100}
              step="1"
              value={displayPercent}
              onChange={(e) => {
                const percent = parseInt(e.target.value);
                const selectedLabel = getLabelFromPercentage(percent);
                handleResponse(question.questionId, selectedLabel);
              }}
              className="appearance-none w-full max-w-sm sm:max-w-md md:max-w-lg h-2 rounded-md outline-none transition-all duration-500"
              style={{
                background: `linear-gradient(to right, #14b8a6 ${displayPercent}%, #e5e7eb ${displayPercent}%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-gray-700 text-sm md:text-base">
              <div className="font-semibold">{displayPercent}%</div>
              <div className="font-semibold">{currentValue}</div>
            </div>
          </div>
        );
      case "textarea":
        return (
          <div className="w-full px-2 sm:px-3">
            <div className="flex flex-wrap gap-2 mb-3 justify-center">
              {uniqueOptions.map((option, index) => (
                <button
                  key={option.optionId}
                  className={`${baseClasses} ${
                    responses[question.questionId] === option.optionValue
                      ? "bg-teal-500 text-white border-teal-600"
                      : "text-gray-700"
                  } min-w-[90px] sm:min-w-[100px] py-1.5`}
                  onClick={() =>
                    handleResponse(question.questionId, option.optionValue)
                  }
                >
                  <span className="text-sm md:text-base">
                    {option.optionValue}
                  </span>
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 resize-none hover:border-teal-500 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm md:text-base"
              placeholder="Write your response here..."
              rows={4}
              value={comments[question.questionId] || ""}
              onChange={(e) =>
                handleDescriptiveChange(question.questionId, e.target.value)
              }
              required
            />
          </div>
        );
      case "textbox":
        return (
          <input
            type="text"
            className="w-full sm:w-3/4 md:w-1/2 mx-auto rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 hover:border-teal-500 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm md:text-base"
            placeholder="Short answer"
            value={responses[question.questionId] || ""}
            onChange={(e) =>
              handleResponse(question.questionId, e.target.value)
            }
          />
        );
      case "yes/no":
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {(uniqueOptions.length > 0
              ? uniqueOptions.map((opt) => opt.optionValue)
              : defaultOptions["Yes/No"].map((opt) => opt.optionValue)
            ).map((value, index) => (
              <label key={index} className="flex items-center m-0">
                <input
                  type="radio"
                  name={`yesnoGroup-${question.questionId}`}
                  value={value}
                  checked={responses[question.questionId] === value}
                  onChange={() => handleResponse(question.questionId, value)}
                  className="mr-2 rounded border-gray-300 focus:ring-teal-500"
                />
                <span className="text-gray-500 text-sm md:text-base">
                  {value}
                </span>
              </label>
            ))}
          </div>
        );
      case "toggle":
        return (
          <label className="flex items-center gap-3 justify-center text-gray-700 text-sm md:text-base">
            <span>Off</span>
            <input
              type="checkbox"
              checked={responses[question.questionId] === "on"}
              onChange={() =>
                handleResponse(
                  question.questionId,
                  responses[question.questionId] === "on" ? "off" : "on"
                )
              }
              className="rounded border-gray-300 focus:ring-teal-500"
            />
            <span>On</span>
          </label>
        );
      case "number":
        return (
          <input
            type="number"
            className="w-full sm:w-1/2 md:w-1/4 mx-auto rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 hover:border-teal-500 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm md:text-base"
            value={responses[question.questionId] || ""}
            onChange={(e) =>
              handleResponse(question.questionId, e.target.value)
            }
          />
        );
      case "grid":
      case "drag & drop":
      case "option":
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {uniqueOptions.map((option, index) => (
              <button
                key={option.optionId}
                className={`${baseClasses} ${
                  responses[question.questionId] === option.optionValue
                    ? "bg-teal-500 text-white border-teal-600"
                    : "text-gray-700"
                } min-w-[90px] sm:min-w-[100px] py-1.5 text-sm md:text-base`}
                onClick={() =>
                  handleResponse(question.questionId, option.optionValue)
                }
              >
                {option.optionValue}
              </button>
            ))}
          </div>
        );
      case "label":
        return (
          <div className="text-gray-500 text-center text-sm md:text-base">
            {uniqueOptions[0]?.optionValue || "Label"}
          </div>
        );
      default:
        return (
          <div className="text-red-600 text-center text-sm md:text-base">
            No preview available for optionText: {optionText}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-600 rounded text-center py-4 sm:py-5 text-base sm:text-lg max-w-3xl mx-auto">
        {error}
      </div>
    );
  }

  const sectionMap = new Map();
  feedbackData
    .filter((item) => item.feedBackId === (parseInt(feedbackId) || 8))
    .forEach((item) => {
      if (!item.questionId || !item.questionText || !item.questionType) {
        console.warn("Skipping invalid question entry:", item);
        return;
      }

      const sectionKey = `${item.feedBackId}-${item.section || "General"}`;
      const sectionName = item.section || "General";
      const sectionId = item.sectionId || `general-${item.feedBackId}`;

      if (!sectionMap.has(sectionKey)) {
        sectionMap.set(sectionKey, {
          sectionId,
          sectionName,
          feedBackId: item.feedBackId,
          questions: [],
        });
      }

      const section = sectionMap.get(sectionKey);
      const questionExists = section.questions.some(
        (q) => q.questionId === item.questionId
      );
      if (!questionExists) {
        section.questions.push({
          questionId: item.questionId,
          questionText: item.questionText,
          questionType: item.questionType,
          questionRange: item.questionRange || null,
          section: sectionName,
          sectionId,
          feedBackId: item.feedBackId,
        });
      }
    });

  const uniqueSections = Array.from(sectionMap.values()).map((section) => ({
    ...section,
    questions: section.questions.sort((a, b) => a.questionId - b.questionId),
  }));

  const allQuestions = uniqueSections
    .flatMap((section) => section.questions)
    .sort((a, b) => a.questionId - b.questionId);

  if (allQuestions.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4 sm:py-5 text-base sm:text-lg max-w-3xl mx-auto">
        No valid feedback questions available for FeedBackId: {feedbackId || 8}.
      </div>
    );
  }

  const currentQuestion = allQuestions[visibleQuestionIndex];
  const currentSectionIndex = uniqueSections.findIndex((section) =>
    section.questions.some((q) => q.questionId === currentQuestion?.questionId)
  );
  const visibleSections = uniqueSections.slice(0, currentSectionIndex + 1);

  const obtainedMarks =
    preAssessmentResult?.preAssessmentList[0]?.obtainedMarks || 0;
  const maxMarks = preAssessmentResult?.preAssessmentList[0]?.maximumMarks || 0;
  const needleRotation = maxMarks ? (obtainedMarks / maxMarks) * 180 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-md font-quicksand bg-gray-50">
      <div className="bg-white/90 rounded-xl shadow-md backdrop-blur-sm p-6 sm:p-8 md:p-10 mx-auto my-8 sm:my-10 md:my-12 max-w-3xl animate-floatUp">
        <h1 className="text-center font-bold text-2xl sm:text-3xl md:text-4xl text-[#002f4b]  bg-clip-text">
          GPMS TRANSPORTAL AI
        </h1>
        <h2 className="text-center font-semibold text-lg sm:text-xl md:text-2xl text-gray-600 mt-2">
          Entrepreneurial Potential Self-Evaluation
        </h2>
        <p className="text-gray-500 mt-2 text-center text-sm md:text-base">
          Rate yourself from 1 to 10 on each statement.
        </p>
        <p className="text-gray-500 text-center text-sm md:text-base">
          Your results will help you assess your readiness to pursue the course.
        </p>
      </div>

      <img
        src="https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/ICST.jPEG"
        alt="ICST Logo"
        className="mx-auto mb-4 w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px]"
      />

      <hr className="mb-5 border-teal-500 max-w-[400px] sm:max-w-[500px] md:max-w-[600px] mx-auto" />

      {visibleSections.map((section) => {
        const isCurrentSection =
          section.sectionId === uniqueSections[currentSectionIndex].sectionId;
        const sectionQuestions = isCurrentSection
          ? section.questions.filter((q) => {
              const globalIndex = allQuestions.findIndex(
                (aq) => aq.questionId === q.questionId
              );
              return (
                globalIndex <= visibleQuestionIndex || responses[q.questionId]
              );
            })
          : section.questions;

        return (
          <div key={section.sectionId} className="mb-5">
            <h3 className="text-center font-bold text-lg sm:text-xl bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text mb-3">
              {section.sectionName}
            </h3>
            <hr className="border-teal-500 max-w-[300px] sm:max-w-[350px] md:max-w-[400px] mx-auto mb-5" />
            <div className="bg-white/90 rounded-xl shadow-md backdrop-blur-sm p-4 sm:p-5 md:p-6 max-w-[600px] sm:max-w-[650px] md:max-w-[700px] mx-auto">
              {sectionQuestions.map((q, index) => {
                const globalIndex = allQuestions.findIndex(
                  (aq) => aq.questionId === q.questionId
                );
                const questionTextMatch =
                  q.questionText.match(/^(\d+)\.\s*(.*)/);
                const questionNumber = questionTextMatch
                  ? questionTextMatch[1]
                  : globalIndex + 1;
                const questionText = questionTextMatch
                  ? questionTextMatch[2]
                  : q.questionText;
                return (
                  <div key={q.questionId} className="mb-4">
                    <p
                      className="font-bold text-gray-700 mb-2 text-2xl "
                      const
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        fontSize: "1.5em",
                        fontWeight: 600,
                        color: "#212529",
                      }}
                    >
                      Q{questionNumber}. {questionText}
                      <span className="text-red-600 ml-1">*</span>
                    </p>
                    <div className="flex justify-center">
                      {renderOptions(q, index)}
                    </div>
                    {validationErrors[q.questionId] && (
                      <div className="text-red-600 mt-2 text-center text-sm md:text-base">
                        {validationErrors[q.questionId]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="text-center mb-5">
        <button
          className="font-semibold rounded-lg px-4 sm:px-5 md:px-6 py-2 bg-gradient-to-r from-teal-400 to-cyan-500 text-white border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm md:text-base"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin inline-block w-4 hms-4 border-2 border-t-transparent border-white rounded-full mr-2"></span>
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </button>
      </div>

      {submissionStatus && (
        <div
          className="bg-white/90 rounded-xl shadow-md backdrop-blur-sm p-4 sm:p-5 md:p-6 mt-5 max-w-[600px] sm:max-w-[650px] md:max-w-[700px] mx-auto"
          ref={resultsRef}
          id="results"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          {submissionStatus === "success" && preAssessmentResult && (
            <>
              <h3
                className="text-green-700 rounded text-center mb-4 text-base sm:text-lg md:text-xl"
                style={{ backgroundColor: "#DCFCE7" }}
              >
                Thank You for Your Feedback!
              </h3>
              <div className="text-center">
                <h4 className="text-gray-700 mb-4 text-base sm:text-lg">
                  Your Assessment Results
                </h4>
                <div className="flex justify-center">
                  <div className="flex flex-col items-center my-4 sm:my-5 max-w-[250px] sm:max-w-[280px] md:max-w-[300px]">
                    <div
                      ref={resultsRef}
                      className="relative w-[220px] sm:w-[240px] md:w-[260px] h-[110px] sm:h-[120px] md:h-[130px] rounded-t-full overflow-hidden shadow-md border-2 border-gray-800"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #ef4444, #facc15, #22c55e)",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <div
                        className="absolute bottom-0 left-[5%] w-[90%] h-[90%] bg-white rounded-t-full border-2 border-gray-800"
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#1F2937",
                        }}
                      ></div>
                      <div
                        className="absolute w-1 h-[90px] sm:h-[100px] md:h-[110px] bg-red-600 left-1/2 bottom-0 origin-bottom transition-transform duration-500 z-10"
                        style={{
                          transform: `rotate(${needleRotation - 90}deg)`,
                          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                          backgroundColor: "#DC2626",
                        }}
                      ></div>
                      <div
                        className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-teal-600 rounded-full left-1/2 bottom-0 -translate-x-1/2 z-[11] border-2 border-white"
                        style={{
                          backgroundColor: "#0D9488",
                          borderColor: "#ffffff",
                        }}
                      ></div>
                      <div className="absolute w-full h-full flex justify-between items-end p-2 sm:p-2.5">
                        {[...Array(Math.ceil(maxMarks / 10))].map((_, i) => {
                          const mark = i * 10;
                          const angle = maxMarks
                            ? (mark / maxMarks) * 180 - 90
                            : -90;
                          return (
                            <span
                              key={mark}
                              className="absolute left-1/2 text-xs sm:text-sm text-gray-700 text-center w-8 sm:w-10 -ml-4 sm:-ml-5"
                              style={{
                                transform: `rotate(${angle}deg) translate(0, -110px) sm:translate(0, -120px) md:translate(0, -140px) rotate(-${angle}deg)`,
                                fontWeight:
                                  mark === obtainedMarks ? "bold" : "normal",
                                backgroundColor:
                                  mark === obtainedMarks
                                    ? "rgba(255, 255, 0, 0.3)"
                                    : "transparent",
                                color: "#4B5563",
                              }}
                            >
                              {mark}
                            </span>
                          );
                        })}
                        {maxMarks > 0 && (
                          <span
                            className="absolute left-1/2 text-xs sm:text-sm text-gray-700 text-center w-8 sm:w-10 -ml-4 sm:-ml-5"
                            style={{
                              transform: `rotate(90deg) translate(0, -110px) sm:translate(0, -120px) md:translate(0, -140px) rotate(-90deg)`,
                              fontWeight:
                                maxMarks === obtainedMarks ? "bold" : "normal",
                              backgroundColor:
                                maxMarks === obtainedMarks
                                  ? "rgba(255, 255, 0, 0.3)"
                                  : "transparent",
                              color: "#4B5563",
                            }}
                          >
                            {maxMarks}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className="mt-3 text-center text-gray-700 text-sm md:text-base"
                      style={{ color: "#4B5563" }}
                    >
                      <p>
                        <strong>Score:</strong> {obtainedMarks}/{maxMarks}
                      </p>
                      <p>
                        <strong>Percentage:</strong>{" "}
                        {preAssessmentResult.preAssessmentList[0].percentage ||
                          0}
                        %
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    className="font-bold text-gray-700 text-base sm:text-lg block mb-2"
                    style={{ color: "#4B5563" }}
                  >
                    Enter your email to receive the result
                    <span
                      className="text-red-600 ml-1"
                      style={{ color: "#DC2626" }}
                    >
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    className="w-full sm:w-3/4 md:w-1/2 mx-auto rounded-xl border-gray-300 focus:border-teal-500 p-4 focus:ring-2 focus:ring-teal-500/50 hover:border-teal-500 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm md:text-base"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(null);
                    }}
                    style={{
                      borderColor: "#D1D5DB",
                      color: "#4B5563",
                      backgroundColor: "#F9FAFB",
                      "--tw-ring-color": "rgba(20, 184, 166, 0.5)",
                      "--tw-border-color": "#14B8A6",
                    }}
                  />
                  {emailError && (
                    <div
                      className="text-red-600 mt-2 text-center text-sm md:text-base"
                      style={{ color: "#DC2626" }}
                    >
                      {emailError}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {submissionStatus === "alreadySaved" && (
            <div className="text-center">
              <h3
                className="text-yellow-700 rounded mb-3 text-base sm:text-lg md:text-xl"
                style={{ backgroundColor: "#FEF9C3", color: "#B45309" }}
              >
                Feedback Already Submitted
              </h3>
              <p
                className="text-gray-500 text-sm md:text-base"
                style={{ color: "#6B7280" }}
              >
                Your feedback has already been recorded. Thank you!
              </p>
            </div>
          )}
          {submissionStatus === "error" && (
            <div
              className="text-red-600 rounded text-center"
              style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
            >
              <h3 className="text-base sm:text-lg md:text-xl">Error</h3>
              <p className="text-sm md:text-base">
                Failed to save user response or fetch pre-assessment result.
              </p>
            </div>
          )}
          <div className="text-center mt-4">
            <button
              className="font-semibold rounded-lg px-4 sm:px-5 md:px-6 py-2 text-white border-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-sm md:text-base"
              onClick={handleContinue}
              disabled={loading}
              style={{
                backgroundImage: "linear-gradient(to right, #2DD4BF, #06B6D4)",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedBackCard;
