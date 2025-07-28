import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Search, Filter, ChevronRight } from 'lucide-react';
import Sidebar from '../../Components/Sidebar/Sidebar';
 
// Access environment variables with fallback values
const baseUrl = import.meta.env.VITE_BASE_API_URL || 'https://default-api.example.com/api';
const grpCode = import.meta.env.VITE_GRP_CODE || 'DEFAULT_GRP_CODE';
const colCode = import.meta.env.VITE_DEFAULT_COL_CODE || 'DEFAULT_COL_CODE';
const collegeId = import.meta.env.VITE_DEFAULT_COLLEGE_ID || 'DEFAULT_COLLEGE_ID';
const baseUrlImage = "https://beesprod.beessoftware.cloud/CloudilyaFileSource/CloudilyaDeployement/Cloudilya/LMS/COURSETHUMBNAILS/";
// CourseCard component for displaying each course
const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
 
  const courseName = course?.courseName || 'Untitled Course';
  const imageUrl = `${baseUrlImage}${courseName.replace(/\s+/g, '%20')}.png`;
 
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
      <div className="relative h-48">
        {
          !imageError ? (
            <img
              src={imageUrl}
              alt={courseName}
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </>
          )
        }
 
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-indigo-800 rounded-full shadow-sm">
              {course?.branchName || 'N/A'}
            </span>
            <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-indigo-800 rounded-full shadow-sm">
              {course?.semester || 'N/A'}
            </span>
          </div>
          <h3 className="mt-2 text-xl font-semibold text-white tracking-tight truncate">
            {courseName}
          </h3>
        </div>
      </div>
 
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <BookOpen size={18} className="mr-2 text-indigo-500" />
          <span className="font-medium">{course?.regulationName || 'N/A'}</span>
        </div>
        <button
          onClick={() => navigate(`/course/${course?.courseId || ''}`)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Continue Learning
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
 
// StatsCard component for dashboard metrics
const StatsCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-xl p-5 shadow-lg flex items-center transition-all duration-300 hover:shadow-xl border border-white/10`}>
      <div className="mr-4 bg-white/30 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-white text-sm font-semibold tracking-tight">{title}</h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};
 
const StudentLearning = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
 
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
      navigate('/auth/login');
      return;
    }
 
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/LMS/LMS_DisplayStudentCoursesWithVideo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grpCode,
            colCode,
            collegeId,
            studentId: parseInt(adminUserId),
            UserName: userName
          })
        });
        const data = await response.json();
        // Ensure listofStudents is an array and filter only purchased courses
        const purchasedCourses = Array.isArray(data?.listofStudents)
          ? data.listofStudents.filter(course => course?.isPurchesedName === "Purchesed")
          : [];
        setCourses(purchasedCourses);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error('Fetch Courses Error:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
 
    fetchCourses();
  }, [adminUserId, userName, userType, navigate]);
 
  // Filter courses based on search, subject, and tab selection
  const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
    const matchesSearch = (course?.courseName || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (course?.semester || '').toLowerCase().includes((searchTerm || '').toLowerCase());
    const matchesSubject = subject ? course?.courseName === subject : true;
 
    if (selectedTab === 'in-progress') {
      return matchesSearch && matchesSubject && (course?.progress || 0) > 0 && (course?.progress || 0) < 100;
    } else if (selectedTab === 'not-started') {
      return matchesSearch && matchesSubject && (course?.progress || 0) === 0;
    } else if (selectedTab === 'completed') {
      return matchesSearch && matchesSubject && (course?.progress || 0) === 100;
    }
 
    return matchesSearch && matchesSubject;
  }) : [];
 
  // Get stats for dashboard (only for purchased courses)
  const totalCourses = Array.isArray(courses) ? courses.length : 0;
  const inProgressCourses = Array.isArray(courses) ? courses.filter(course => (course?.progress || 0) > 0 && (course?.progress || 0) < 100).length : 0;
  const completedCourses = Array.isArray(courses) ? courses.filter(course => (course?.progress || 0) === 100).length : 0;
 
  if (error && (!userData || !adminUserId || userType !== 'STUDENT')) {
    return (
      <div className="flex min-h-screen font-nunito justify-center items-center bg-gray-50">
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
    <div className="flex min-h-screen font-nunito bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 transition-all duration-300 md:ml-64">
        <div className="mb-10 pt-12 md:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Learning</h1>
              <p className="text-gray-600 mt-1 text-lg">Manage your learning journey</p>
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
                <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
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
          {/* Dashboard Stats */}
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
 
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex overflow-x-auto  space-x-1 bg-gray-100 p-1.5 rounded-lg w-full sm:w-auto shadow-sm">
              <button
                className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${selectedTab === 'all' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                onClick={() => setSelectedTab('all')}
              >
                My Learning
              </button>
              <button
                className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${selectedTab === 'in-progress' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                onClick={() => setSelectedTab('in-progress')}
              >
                In Progress
              </button>
              <button
                className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${selectedTab === 'not-started' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                onClick={() => setSelectedTab('not-started')}
              >
                Not Started
              </button>
              <button
                className={`px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 whitespace-nowrap ${selectedTab === 'completed' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                onClick={() => setSelectedTab('completed')}
              >
                Completed
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
                {Array.isArray(courses) && courses.map((course, index) => (
                  <option key={index} value={course?.courseName || ''}>{course?.courseName || 'Untitled'}</option>
                ))}
              </select>
            </div>
          </div>
 
          {/* Course Cards Grid */}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-4 text-lg">
                {searchTerm || subject ? 'Try adjusting your filters' : 'You have no purchased courses yet'}
              </p>
              {(searchTerm || subject) && (
                <button
                  onClick={() => { setSearchTerm(''); setSubject(''); }}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-all duration-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default StudentLearning;