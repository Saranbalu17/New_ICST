import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ChevronRight,
  CreditCard,
  Trash2,
  Info,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import CourseImageCard from "../StudentDashboard/CourseImageCard";
import CartCourseCard from "../StudentDashboard/CartCourseCard";
 
// Modal Component for displaying alerts with success/failure animations
const Modal = ({ isOpen, onClose, title, message, buttonText = "OK", isError = false }) => {
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm px-4 sm:px-6 transition-opacity duration-300 ease-out">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 ease-out scale-100 hover:scale-105 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          {/* Success/Failure Icon with Animation */}
          <div className="mb-4">
            {isError ? (
              <svg
                className="h-12 w-12 text-red-500 animate-shake"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-12 w-12 text-green-500 animate-check"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <h3 className={`text-2xl font-bold ${isError ? 'text-red-700' : 'text-green-700'} font-sans tracking-tight mb-2`}>
            {title}
          </h3>
          <p className="text-gray-600 text-base font-sans leading-relaxed text-center">{message}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg font-semibold text-base font-sans transition-all duration-200 transform hover:-translate-y-0.5 ${
              isError
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            } shadow-md hover:shadow-lg`}
          >
            {buttonText}
          </button>
        </div>
      </div>
 
      {/* Custom Animation Keyframes */}
      <style jsx>{`
        @keyframes check {
          0% {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-4px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(4px);
          }
        }
        .animate-check {
          stroke-dasharray: 100;
          animation: check 0.6s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
 
// Access environment variables with fallback values
const baseUrl =
  import.meta.env.VITE_BASE_API_URL || "https://default-api.example.com/api";
const grpCode = import.meta.env.VITE_GRP_CODE || "DEFAULT_GRP_CODE";
const colCode = import.meta.env.VITE_DEFAULT_COL_CODE || "DEFAULT_COL_CODE";
const collegeId =
  import.meta.env.VITE_DEFAULT_COLLEGE_ID || "DEFAULT_COLLEGE_ID";
 
// CourseCard component for displaying each course
const CourseCard = ({ course, handleAddCard, handleExploreMore }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
 
  // Construct the image URL based on courseName
  const baseUrl = "https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/COURSETHUMBNAILS/";
  const imageName = course?.courseName?.replace(/\s+/g, '%20') + '.png';
  const imageUrl = baseUrl + imageName;
 
  // Reset imageError when course changes
  useEffect(() => {
    setImageError(false);
  }, [course]);
 
  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };
 
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
      <div className="relative h-48">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={course?.courseName || 'Course Thumbnail'}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-indigo-800 rounded-full shadow-sm">
                {course?.branchName || "N/A"}
              </span>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-white tracking-tight truncate">
              {course?.courseName || "Untitled Course"}
            </h3>
          </div>
        </div>
      </div>
 
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <BookOpen size={18} className="mr-2 text-indigo-500" />
          <span className="font-medium">{course?.regulationName || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          {course?.isPurchesedName === "Purchesed" ? (
            <button
              onClick={() => navigate(`/course/${course?.courseId}`)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Continue Learning
              <ChevronRight size={18} />
            </button>
          ) : (
            <>
              <h1 className="text-lg font-bold text-gray-900">
                ₹{course?.amount || "0.00"}
              </h1>
              <button
                onClick={() => handleAddCard(course)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ShoppingCart />
                Add to Cart
                <ChevronRight size={18} />
              </button>
            </>
          )}
          <button
            onClick={() => handleExploreMore(course)}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Explore More
            <Info size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
 
// StatsCard component for dashboard metrics
const StatsCard = ({ icon, title, value, bgColor }) => {
  return (
    <div
      className={`${bgColor} rounded-xl p-5 shadow-lg flex items-center transition-all duration-300 hover:shadow-xl border border-white/10`}
    >
      <div className="mr-4 bg-white/30 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-white text-sm font-semibold tracking-tight">
          {title}
        </h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};
 
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [addedCourses, setAddedCourses] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    isError: false,
    buttonText: "OK",
  });
 
  // Validate localStorage userData
  let userData;
  try {
    const userDataRaw = localStorage.getItem("userData");
    userData = userDataRaw ? JSON.parse(userDataRaw) : null;
  } catch (err) {
    console.error("Error parsing userData from localStorage:", err);
    userData = null;
  }
 
  const adminUserId = userData?.adminUserId;
  const userName = userData?.userName;
  const userType = userData?.userType;
  const couraseImageUrl = "https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/COURSETHUMBNAILS/";
 
  useEffect(() => {
    if (!userData || !adminUserId || !userName || userType !== "STUDENT") {
      setError("Unauthorized access. Please log in as a student.");
      navigate("/auth/login");
      return;
    }
 
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/LMS/LMS_DisplayStudentCoursesWithVideo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              grpCode,
              colCode,
              collegeId,
              studentId: parseInt(adminUserId),
              UserName: userName,
            }),
          }
        );
        const data = await response.json();
        setCourses(
          Array.isArray(data?.listofStudents) ? data.listofStudents : []
        );
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
        console.error("Fetch Courses Error:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
 
    fetchCourses();
  }, [adminUserId, userName, userType, navigate]);
 
  const fetchPopupdata = async () => {
    if (!adminUserId) return;
    try {
      const response = await fetch(`${baseUrl}/LMS/LMS_SaveCartCourses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grpCode,
          colCode,
          collegeId,
          studentId: parseInt(adminUserId),
          userId: parseInt(adminUserId),
          flag: "VIEW",
          courseId: 0,
          loginIpAddress: "127.0.0.1",
          loginSystemName: "ClientSystem",
          CartId: 0,
          dCartId: 0,
          tablevariable: [
            {
              Column1: "0",
              Column2: "0",
              Column3: "0",
              Column4: "0",
              Column5: "0",
            },
          ],
        }),
      });
 
      const data = await response.json();
      if (data.cardDetailsList?.length > 0) {
        setAddedCourses(
          Array.isArray(data?.cardDetailsList) ? data.cardDetailsList : []
        );
      } else {
        setAddedCourses([]);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error.message);
      setAddedCourses([]);
    }
  };
 
  useEffect(() => {
    if (adminUserId && userType === "STUDENT") {
      fetchPopupdata();
    }
  }, [adminUserId, userType]);
 
  const handleAddCard = async (course) => {
    if (!adminUserId) {
      setModalState({
        isOpen: true,
        title: "Authentication Required",
        message: "You need to be logged in to add courses to your cart. Please log in to continue.",
        isError: true,
        buttonText: "Go to Login",
      });
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/LMS/LMS_SaveCartCourses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grpCode,
          colCode,
          collegeId,
          studentId: parseInt(adminUserId),
          userId: parseInt(adminUserId),
          flag: "CREATE",
          courseId: course?.courseId || 0,
          loginIpAddress: "127.0.0.1",
          loginSystemName: "ClientSystem",
          CartId: 0,
          dCartId: 0,
          tablevariable: [
            {
              Column1: "0",
              Column2: course?.feeSetupId?.toString() ?? "0",
              Column3: course?.courseId?.toString() ?? "0",
              Column4: "0",
              Column5: "0",
            },
          ],
        }),
      });
 
      const data = await response.json();
      if (response.ok) {
        setModalState({
          isOpen: true,
          title: "Course Added",
          message: data.message || "The course has been successfully added to your cart.",
          isError: false,
        });
        fetchPopupdata();
      } else {
        console.error("Add to cart failed:", data.message);
        setModalState({
          isOpen: true,
          title: "Error",
          message: data.message || "Unable to add the course to your cart. Please try again.",
          isError: true,
        });
      }
    } catch (err) {
      console.error("API Error (Add Card):", err);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "An error occurred while adding the course to your cart. Please try again.",
        isError: true,
      });
    }
  };
 
  const handleDeleteCard = async (course) => {
    if (!adminUserId) {
      setModalState({
        isOpen: true,
        title: "Authentication Required",
        message: "You need to be logged in to remove courses from your cart. Please log in to continue.",
        isError: true,
        buttonText: "Go to Login",
      });
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/LMS/LMS_SaveCartCourses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grpCode,
          colCode,
          collegeId,
          studentId: parseInt(adminUserId),
          userId: parseInt(adminUserId),
          flag: "DELETE",
          courseId: course?.courseId || 0,
          loginIpAddress: "127.0.0.1",
          loginSystemName: "ClientSystem",
          CartId: 0,
          dCartId: course?.dCartId || 0,
          tablevariable: [
            {
              Column1: "0",
              Column2: "0",
              Column3: "0",
              Column4: "0",
              Column5: "0",
            },
          ],
        }),
      });
 
      const data = await response.json();
      if (response.ok) {
        setModalState({
          isOpen: true,
          title: "Course Removed",
          message: data.message || "The course has been successfully removed from your cart.",
          isError: false,
        });
        fetchPopupdata();
      } else {
        console.error("Delete from cart failed:", data.message);
        setModalState({
          isOpen: true,
          title: "Error",
          message: data.message || "Unable to remove the course from your cart. Please try again.",
          isError: true,
        });
      }
    } catch (err) {
      console.error("API Error (Delete Card):", err);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "An error occurred while removing the course from your cart. Please try again.",
        isError: true,
      });
    }
  };
 
  const handleConfirmPurchase = async (cartId, grandTotal) => {
    if (!adminUserId) {
      setModalState({
        isOpen: true,
        title: "Authentication Required",
        message: "You need to be logged in to proceed with the purchase. Please log in to continue.",
        isError: true,
        buttonText: "Go to Login",
      });
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/LMS/BankDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grpCode,
          colCode,
          collegeId,
          studentId: parseInt(adminUserId),
          cartId: cartId || 0,
          grandTotal: grandTotal || 0,
          flag: "BILLDESK",
        }),
      });
      const data = await response.json();
      console.log("Payment Gateway Response:", data);
      navigate("/payment-gateway", {
        state: { paymentData: data?.paymentGatewayResponse || {} },
      });
    } catch (error) {
      console.error("API Error (Confirm Purchase):", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Unable to fetch payment details. Please try again.",
        isError: true,
      });
      navigate("/payment-gateway", {
        state: {
          errorMessage: "Unable to fetch payment details. Please try again.",
        },
      });
    }
  };
 
  const handleExploreMore = (course) => {
    setSelectedCourse(course);
    setIsExploreOpen(true);
  };
 
  const handleEnquire = async (course) => {
    if (!userData || !adminUserId || !userName) {
      setModalState({
        isOpen: true,
        title: "Authentication Required",
        message: "You need to be logged in to submit an enquiry. Please log in to continue.",
        isError: true,
        buttonText: "Go to Login",
      });
      return;
    }
 
    const enquiryData = {
      personName: userName,
      courseInfo: {
        courseId: course?.courseId || "N/A",
        courseName: course?.courseName || "Untitled Course",
        branchName: course?.branchName || "N/A",
        semester: course?.semester || "N/A",
        regulationName: course?.regulationName || "N/A",
        amount: course?.amount || "0.00",
      },
    };
 
    try {
      const response = await fetch(`${baseUrl}/LMS/SendEnquiryEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grpCode,
          colCode,
          collegeId,
          studentId: parseInt(adminUserId),
          enquiryData,
        }),
      });
 
      const data = await response.json();
      if (response.ok) {
        setModalState({
          isOpen: true,
          title: "Enquiry Submitted",
          message: data.message || "Your enquiry has been successfully submitted. We'll get back to you soon.",
          isError: false,
        });
        setIsExploreOpen(false);
      } else {
        console.error("Enquiry submission failed:", data.message);
        setModalState({
          isOpen: true,
          title: "Error",
          message: data.message || "Unable to submit your enquiry. Please try again.",
          isError: true,
        });
      }
    } catch (err) {
      console.error("API Error (Enquiry):", err);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "An error occurred while submitting your enquiry. Please try again.",
        isError: true,
      });
    }
  };
 
  // Filter courses with proper validation
  const filteredCourses = Array.isArray(courses)
    ? courses.filter((course) => {
        const matchesSearch =
          (course?.courseName || "")
            .toLowerCase()
            .includes((searchTerm || "").toLowerCase()) ||
          (course?.semester || "")
            .toLowerCase()
            .includes((searchTerm || "").toLowerCase());
        const matchesSubject = subject ? course?.courseName === subject : true;
 
        if (selectedTab === "in-progress") {
          return (
            matchesSearch &&
            matchesSubject &&
            (course?.progress || 0) > 0 &&
            (course?.progress || 0) < 100
          );
        } else if (selectedTab === "not-started") {
          return matchesSearch && matchesSubject && (course?.progress || 0) === 0;
        } else if (selectedTab === "completed") {
          return (
            matchesSearch && matchesSubject && (course?.progress || 0) === 100
          );
        }
 
        return matchesSearch && matchesSubject;
      })
    : [];
 
  // Get stats for dashboard
  const totalCourses = Array.isArray(courses) ? courses.length : 0;
  const inProgressCourses = Array.isArray(courses)
    ? courses.filter(
        (course) => (course?.progress || 0) > 0 && (course?.progress || 0) < 100
      ).length
    : 0;
  const completedCourses = Array.isArray(courses)
    ? courses.filter((course) => (course?.progress || 0) == 100).length
    : 0;
 
  if (error && (!userData || !adminUserId || userType !== "STUDENT")) {
    return (
      <div className="flex min-h-screen font-sans justify-center items-center bg-gray-50">
        <div className="bg-white border-l-4 border-red-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-red-500 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-base text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 transition-all duration-300 md:ml-64">
        <div className="mb-10 pt-12 md:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Learning Dashboard
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Empowering students, professionals, and lifelong learners to
                grow their skills
              </p>
            </div>
 
            <div className="flex items-center mt-4 sm:mt-0 space-x-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white shadow-sm transition-all duration-200"
                />
                <Search
                  size={20}
                  className="absolute left-4 top-3.5 text-gray-400"
                />
              </div>
              <div className="relative">
                <button
                  type="button"
                  className="p-3 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition-all duration-200 shadow-sm"
                  onClick={() => setIsCartOpen(true)}
                >
                  <CreditCard size={24} />
                </button>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {Array.isArray(addedCourses) ? addedCourses.length : 0}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center mb-10">
            <img
              src="https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/Exam%20image.png"
              className="h-60"
              alt="logos"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            <StatsCard
              icon={<BookOpen size={28} className="text-white" />}
              title="Total Courses"
              value={totalCourses}
              bgColor="bg-indigo-600"
            />
            <StatsCard
              icon={<Clock size={28} className="text-white" />}
              title="In Progress"
              value={courses.length > 0 ? courses[0].totalProgress : 0}
              bgColor="bg-amber-500"
            />
            <StatsCard
              icon={<CheckCircle size={28} className="text-white" />}
              title="Completed"
              value={courses.length > 0 ? courses[0].totalCompleted : 0}
              bgColor="bg-green-600"
            />
          </div>
 
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex overflow-x-auto py-2 space-x-1 bg-gray-100 p-1.5 rounded-lg w-full sm:w-auto shadow-sm">
              <button
                className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${
                  selectedTab === "all"
                    ? "bg-white shadow-md text-indigo-600"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTab("all")}
              >
                All Courses
              </button>
            </div>
 
            <div className="flex items-center w-full sm:w-auto">
              <Filter size={18} className="mr-2 text-gray-500" />
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full sm:w-64 py-3 px-4 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
              >
                <option value="">All Subjects</option>
                {Array.isArray(courses) &&
                  courses.map((course, index) => (
                    <option key={index} value={course?.courseName || ""}>
                      {course?.courseName || "Untitled"}
                    </option>
                  ))}
              </select>
            </div>
          </div>
 
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-white border-l-4 border-red-500 p-6 rounded-lg shadow-md mb-6">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-red-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-base text-red-700 font-medium">{error}</p>
              </div>
            </div>
          ) : !Array.isArray(courses) || courses.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-8 sm:p-12 text-center shadow-sm">
              <BookOpen size={56} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-4 text-lg">
                {searchTerm || subject
                  ? "Try adjusting your filters"
                  : "You have no courses assigned yet"}
              </p>
              {(searchTerm || subject) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSubject("");
                  }}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-all duration-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard
                  key={index}
                  course={course}
                  handleAddCard={handleAddCard}
                  handleExploreMore={handleExploreMore}
                />
              ))}
            </div>
          )}
        </div>
      </div>
 
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm px-4">
          <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-gray-200 w-full max-w-5xl p-8 animate-fadeIn relative overflow-hidden">
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-2xl font-bold transition-all"
              onClick={() => setIsCartOpen(false)}
            >
              &times;
            </button>
 
            <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
              Your Course Cart
            </h2>
 
            {Array.isArray(addedCourses) && addedCourses.length === 0 ? (
              <div className="text-center py-10 text-gray-600 text-lg">
                Your cart is currently empty.
                <br />
                Browse courses and add them to get started on your learning
                journey.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2">
                  {addedCourses.map((course, index) => (
                    <CartCourseCard
                      key={index}
                      course={course}
                      onRemove={handleDeleteCard}
                    />
                  ))}
                </div>
 
                <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="text-gray-700 text-md mb-4 sm:mb-0">
                    <p className="font-medium">
                      Total Courses:{" "}
                      <span className="text-gray-900 font-semibold">
                        {addedCourses.length}
                      </span>
                    </p>
                    <p className="font-medium">
                      Total Fee:{" "}
                      <span className="text-gray-900 font-bold">
                        ₹{addedCourses[0]?.grandTotal || "0.00"}
                      </span>
                    </p>
                  </div>
 
                  <button
                    onClick={() =>
                      handleConfirmPurchase(
                        addedCourses[0]?.cartId,
                        addedCourses[0]?.grandTotal
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white text-lg font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4"
                    disabled={
                      !Array.isArray(addedCourses) || addedCourses.length === 0
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Wallet size={20} title="Wallet" />
                    </div>
                    Proceed to Pay
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
 
      {isExploreOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm px-4 sm:px-6">
          <div className="relative backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/20 ring-1 bg-white w-full max-w-lg p-8 sm:p-10 animate-fadeIn overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10 transition-all duration-200"
              onClick={() => setIsExploreOpen(false)}
            >
              &times;
            </button>
 
            <CourseImageCard
              selectedCourse={selectedCourse}
              couraseImageUrl={
                "https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/COURSETHUMBNAILS/"
              }
            />
 
            <div className="mt-6 space-y-5 text-gray-800">
              <div>
                <p className="text-base">
                  <strong className="font-bold">Description: </strong>{" "}
                  {selectedCourse?.courseName || "Untitled Course"}{" "}
                  {selectedCourse?.departmentName || "N/A"}
                </p>
              </div>
              <div className="flex items-center text-sm">
                <BookOpen size={20} className="mr-2 text-indigo-600" />
                <span className="font-semibold">
                  {selectedCourse?.regulationName || "N/A"}
                </span>
              </div>
              <p className="text-base">
                <strong className="font-bold">Instructor Name: </strong>{" "}
                <a
                  href="https://www.myra.ac.in/faculty-fcca-prof-sanjay-dwivedi"
                  className="text-blue-900 border-b border-b-blue-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedCourse?.employeeName || "N/A"}
                </a>
              </p>
              <p className="text-base">
                <strong className="font-bold">Department: </strong>{" "}
                {selectedCourse?.departmentName || "N/A"}
              </p>
              <p className="text-base">
                <strong className="font-bold">Designation: </strong>{" "}
                {selectedCourse?.designationName || "N/A"}
              </p>
              <p className="text-base">
                <strong className="font-bold">Amount: </strong> ₹
                {selectedCourse?.amount || "0.00"}
              </p>
            </div>
 
            <div className="mt-8">
              <button
                onClick={() => handleEnquire(selectedCourse)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
              >
                Enquire
              </button>
            </div>
          </div>
        </div>
      )}
 
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => {
          setModalState({ ...modalState, isOpen: false });
          if (modalState.buttonText === "Go to Login") {
            navigate("/auth/login");
          }
        }}
        title={modalState.title}
        message={modalState.message}
        isError={modalState.isError}
        buttonText={modalState.buttonText}
      />
    </div>
  );
};
 
export default StudentDashboard;