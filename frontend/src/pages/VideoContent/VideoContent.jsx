// import axios from 'axios';
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext/AuthContext";
import VideoCard from "../../Components/VideoCard/VideoCard";
import Sidebar from "../../Components/Sidebar/Sidebar";
import axios from "axios";

// Access environment variables with fallback values
const baseUrl =import.meta.env.VITE_BASE_API_URL || "https://default-api.example.com/api";
const grpCode = import.meta.env.VITE_GRP_CODE || "DEFAULT_GRP_CODE";
const colCode = import.meta.env.VITE_DEFAULT_COL_CODE || "DEFAULT_COL_CODE";
const collegeId =import.meta.env.VITE_DEFAULT_COLLEGE_ID || "DEFAULT_COLLEGE_ID";
const UploadedContent = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const { id } = useParams();

  const studentId =
    JSON.parse(localStorage.getItem("userData")).adminUserId || "";
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Simulate API call with dummy data for testing
        // Comment out the axios call and use dummy data
        // const response = await axios.get('/faculty/uploaded-videos', {
        //   headers: { Authorization: token }
        // });
        // setVideos(response.data);

        // Use dummy data instead
        // setTimeout(() => {
        //   const findCourses = coursesData.filter((course) => course._id === id);
        //   setVideos(findCourses);
        //   // setVideos(coursesData);
        //   setLoading(false);
        // }, 1000); // Simulate network delay

        const response = await axios.post(
          `${baseUrl}/LMS/LMS_StudentCoursesWithTopicsDisplay`,
          {
            grpCode: grpCode,
            colCode: colCode,
            collegeId: collegeId,
            studentId: studentId,
            courseId: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;

        setVideos(data.listofStudents);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [id]);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("userData")).userType;
    if (role) {
      setRole(role);
    }
  }, []);

  // const handleUpdate = (videoId) => {
  //   navigate(`/upload-video?videoId=${videoId}`);
  // };

  // const handleDelete = async (videoId) => {
  //   try {
  //     // Simulate API call with dummy data for testing
  //     // Comment out the axios call and update state directly
  //     // await axios.delete(`/faculty/delete-video/${videoId}`, {
  //     //   headers: { Authorization: token }
  //     // });

  //     // Update state directly with dummy data
  //     setVideos(videos.filter(video => video._id !== videoId));
  //     alert('Video deleted successfully');
  //   } catch (err) {
  //     alert(err.response?.data?.message || 'Failed to delete video');
  //   }
  // };

  return (
    <div className="min-h-screen  font-nunito">
      {/* Main Container - Responsive layout with sidebar consideration */}
      <div className="flex">
        {/* Sidebar space - Hidden on mobile, visible on desktop */}
        {/* Main Content Area */}
        <div className="flex-1 w-full lg:w-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Your Learning Materials
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Access all the resources shared by your instructor to support
                your learning journey.
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading content...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && !videos && (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 8v11a2 2 0 002 2h14a2 2 0 002-2V8H3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No content uploaded yet
                </h3>
                <p className="text-gray-500 text-sm sm:text-base mb-6">
                  The faculty didn&apos;t upload any content please message your
                  faculty..
                </p>
                <Link
                  to={"/student-dashboard"}
                  className="bg-blue-500 text-white px-3 py-3 rounded-md"
                >
                  Back to Courses Page.
                </Link>
              </div>
            )}
            {/* Video Cards Grid - Responsive */}
            {!loading && !error && videos && (
              <div className="">
                <div className="w-full">
                  <VideoCard
                    video={videos}
                    role={role}
                    // onUpdate={role==='faculty' && (handleUpdate)}
                    // onDelete={role==='faculty' && (handleDelete)}
                  />
                </div>
              </div>
            )}

            {/* Course Statistics - Optional responsive stats section */}
            {/* {videos && videos.length > 0 && (
              <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6 fl">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{videos.length}</div>
                    <div className="text-sm text-gray-500">Total Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {videos.reduce((acc, course) => acc + course.completedVideos, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Completed Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {videos.reduce((acc, course) => acc + course.totalVideos, 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(videos.reduce((acc, course) => acc + course.progress, 0) / videos.length)}%
                    </div>
                    <div className="text-sm text-gray-500">Avg Progress</div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadedContent;
