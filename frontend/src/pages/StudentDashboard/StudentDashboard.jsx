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
} from "lucide-react";
import Sidebar from "../../Components/Sidebar/Sidebar";

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/api/placeholder/400/320"
            alt={course?.courseName || "Course"}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {course?.branchName || "N/A"}
              </span>
              {/* <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{course?.semester || 'N/A'}</span> */}
            </div>
            <h3 className="mt-1 text-lg font-bold text-white truncate">
              {course?.courseName || "Untitled Course"}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <BookOpen size={16} className="mr-1" />
          <span>{course?.regulationName || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between gap-x-3">
          {course?.isPurchesedName === "Purchesed" ? (
            <button
              onClick={() => navigate(`/course/${course?.courseId}`)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
            >
              Continue Learning
              <ChevronRight size={16} />
            </button>
          ) : (
            <>
              <h1 className="text-gray-800 font-semibold text-lg">
                ₹{course?.amount || "0.00"}
              </h1>
              <button
                onClick={() => handleAddCard(course)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
              >
                Add to Cart
                <ChevronRight size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => handleExploreMore(course)}
            className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
          >
            Explore More
            <Info size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats component for dashboard metrics
const StatsCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-4 shadow-md flex items-center`}>
      <div className="mr-4 bg-white/20 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-white text-sm font-medium">{title}</h3>
        <p className="text-white text-xl font-bold">{value}</p>
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

  useEffect(() => {
    // Check if userData is valid and user is a STUDENT
    if (!userData || !adminUserId || !userName || userType !== "STUDENT") {
      setError("Unauthorized access. Please log in as a student.");
      navigate("/login");
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
    if (!adminUserId) return; // Skip if adminUserId is missing
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
      console.log("Cart Data:", data);
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
      alert("Please log in to add courses to the cart.");
      navigate("/login");
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
        alert(data.message || "Course added to cart successfully");
        fetchPopupdata();
      } else {
        console.error("Add to cart failed:", data.message);
        alert(data.message || "Failed to add course to cart");
      }
    } catch (err) {
      console.error("API Error (Add Card):", err);
      alert("Failed to add course to cart. Please try again.");
    }
  };

  const handleDeleteCard = async (course) => {
    if (!adminUserId) {
      alert("Please log in to delete courses from the cart.");
      navigate("/login");
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
        alert(data.message || "Course removed from cart successfully");
        fetchPopupdata();
      } else {
        console.error("Delete from cart failed:", data.message);
        alert(data.message || "Failed to remove course from cart");
      }
    } catch (err) {
      console.error("API Error (Delete Card):", err);
      alert("Failed to remove course from cart. Please try again.");
    }
  };

  const handleConfirmPurchase = async (cartId, grandTotal) => {
    if (!adminUserId) {
      alert("Please log in to confirm purchase.");
      navigate("/login");
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
      navigate("/payment-gateway", {
        state: {
          errorMessage: "Failed to fetch payment details. Please try again.",
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
      alert("Please log in to make an enquiry.");
      navigate("/login");
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
      console.log(data)
      if (response.ok) {
        alert(data.message || "Enquiry submitted successfully!");
        setIsExploreOpen(false);
      } else {
        console.error("Enquiry submission failed:", data.message);
        alert(data.message || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      console.error("API Error (Enquiry):", err);
      alert("Failed to submit enquiry. Please try again.");
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
          return (
            matchesSearch && matchesSubject && (course?.progress || 0) === 0
          );
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
    ? courses.filter((course) => (course?.progress || 0) === 100).length
    : 0;

  if (error && (!userData || !adminUserId || userType !== "STUDENT")) {
    return (
      <div className="flex min-h-screen font-nunito justify-center items-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-nunito">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 transition-all duration-300 md:ml-64">
        <div className="mb-8 pt-12 md:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Student Dashboard
              </h1>
              <p className="text-gray-500 mt-1">Manage your learning journey</p>
            </div>

            <div className="flex items-center mt-4 sm:mt-0 space-x-4">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
              </div>
              <div className="relative">
                <button
                  type="button"
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                  onClick={() => setIsCartOpen(true)}
                >
                  <CreditCard size={22} />
                </button>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {Array.isArray(addedCourses) ? addedCourses.length : 0}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
              icon={<BookOpen size={24} className="text-white" />}
              title="Total Courses"
              value={totalCourses}
              bgColor="bg-blue-600"
            />
            <StatsCard
              icon={<Clock size={24} className="text-white" />}
              title="In Progress"
              value={inProgressCourses}
              bgColor="bg-amber-500"
            />
            <StatsCard
              icon={<CheckCircle size={24} className="text-white" />}
              title="Completed"
              value={completedCourses}
              bgColor="bg-green-600"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="flex overflow-x-auto pb-2 sm:pb-0 space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedTab === "all"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTab("all")}
              >
                All Courses
              </button>
            </div>

            <div className="flex items-center w-full sm:w-auto">
              <Filter size={16} className="mr-2 text-gray-500" />
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full sm:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : !Array.isArray(courses) || courses.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-12 text-center">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No courses found
              </h3>
              <p className="text-gray-500 mb-4">
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 animate-fadeIn relative">
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setIsCartOpen(false)}
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Your Selected Courses
            </h2>

            {Array.isArray(addedCourses) && addedCourses.length === 0 ? (
              <p className="text-gray-500">No courses added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto">
                {Array.isArray(addedCourses) &&
                  addedCourses.map((course, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src="/api/placeholder/400/320"
                            alt={course?.courseName || "Course"}
                            className="w-full h-full object-cover opacity-20"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="mt-1 text-lg font-bold text-white truncate">
                              {course?.courseName || "Untitled Course"}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <BookOpen size={16} className="mr-1" />
                          <span>{course?.courseCode || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <h1 className="text-gray-600 font-bold">
                            Amount: ₹{course?.amount || "0.00"}
                          </h1>
                          <button
                            onClick={() => handleDeleteCard(course)}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1 rounded-md transition"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() =>
                  handleConfirmPurchase(
                    addedCourses[0]?.cartId,
                    addedCourses[0]?.grandTotal
                  )
                }
                className="bg-green-600 hover:bg-green-700 font-bold text-white px-5 py-2 rounded-md transition"
                disabled={
                  !Array.isArray(addedCourses) || addedCourses.length === 0
                }
              >
                ₹{addedCourses[0]?.grandTotal || "0.00"} Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {isExploreOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm px-4">
          <div className="bg-white rounded-lg shadow-md w-full max-w-md animate-fadeIn relative overflow-hidden">
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl z-10"
              onClick={() => setIsExploreOpen(false)}
            >
              ×
            </button>
            <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/api/placeholder/400/320"
                  alt={selectedCourse?.courseName || "Course"}
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {selectedCourse?.branchName || "N/A"}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {selectedCourse?.semester || "N/A"}
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-white truncate">
                    {selectedCourse?.courseName || "Untitled Course"}
                  </h3>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <BookOpen size={16} className="mr-1" />
                  <span>{selectedCourse?.regulationName || "N/A"}</span>
                </div>
                <p>
                  <strong>Course ID:</strong>{" "}
                  {selectedCourse?.courseId || "N/A"}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{selectedCourse?.amount || "0.00"}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleEnquire(selectedCourse)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition"
                >
                  Enquire
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
