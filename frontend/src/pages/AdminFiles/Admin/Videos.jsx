import { useEffect, useState } from "react";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import axios from "axios";
import { FileText, Download } from "lucide-react"; // Import icons for PDF display

const Videos = () => {
  const [video, setVideo] = useState([]);
  const grpCode = "devprod";
  const colCode = "0001";
  const collegeId = 1;
  const userId = localStorage.getItem("adminUserId") || "";
  const role = localStorage.getItem("role") || "";

  const fetchVideos = async () => {
    try {
      const formData = new FormData();
      formData.append("grpCode", grpCode);
      formData.append("colCode", colCode);
      formData.append("collegeId", collegeId);
      formData.append("programId", "");
      formData.append("branchId", "");
      formData.append("regulationId", "");
      formData.append("semid", "");
      formData.append("id", "");
      formData.append("userId", userId);
      formData.append("loginIpAddress", "103.52.37.34");
      formData.append("LoginSystemName", "");
      formData.append("Flag", "VIEW");
      formData.append("CourseId", "");
      formData.append("TopicId", "");
      formData.append("VideoName", "");
      formData.append("UnitId", 0);
      formData.append("Description", "");

      const tableVariable = JSON.stringify([
        {
          Column1: "",
          Column2: 0,
          Column3: "",
          Column4: "",
          Column5: "",
        },
      ]);
      formData.append("tabelVariableforVideos", tableVariable);

      const res = await axios.post(
        "https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_UploadedCourseLevelVideos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);

      if (res.data.listofContentCourseUploadResponse) {
        setVideo(res.data.listofContentCourseUploadResponse);
      } else {
        setVideo([]);
      }
    } catch (error) {
      console.log("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDeletion = async (video) => {
    try {
      const formData = new FormData();
      formData.append("grpCode", grpCode);
      formData.append("colCode", colCode);
      formData.append("collegeId", collegeId);
      formData.append("programId", video.programId);
      formData.append("branchId", video.branchId);
      formData.append("semid", video.semId);
      formData.append("id", "");
      formData.append("userId", userId);
      formData.append("loginIpAddress", "103.52.37.34");
      formData.append("LoginSystemName", "");
      formData.append("Flag", "DELETE");
      formData.append("CourseId", video.courseId);
      formData.append("TopicId", video.topicId);
      formData.append("VideoName", "");
      formData.append("Description", "");
      formData.append("UnitId", 0);
      const tableVariable = JSON.stringify([
        {
          Column1: "",
          Column2: 0,
          Column3: "",
          Column4: "",
          Column5: "",
        },
      ]);
      formData.append("tabelVariableforVideos", tableVariable);

      const res = await axios.post(
        "https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_UploadedCourseLevelVideos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.message === "Record is Deleted") {
        fetchVideos();
      }
    } catch (error) {
      console.log("Error deleting video:", error);
    }
  };

  // Helper function to check if a URL is a PDF
  const isPDF = (url) => {
    return url && typeof url === "string" && url.toLowerCase().endsWith(".pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-nunito">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 md:ml-64 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">
            Courses
          </h1>

          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {video.length > 0 ? (
              video.map((course, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-4 md:p-6 space-y-3 md:space-y-4 hover:shadow-lg transition-shadow"
                >
                  {isPDF(course.url) ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-8 h-8 text-orange-500" />
                        <a
                          href={course.url}
                          download={course.videoName ? `${course.videoName}.pdf` : "document.pdf"}
                          className="text-blue-600 hover:text-blue-800 underline text-sm md:text-base"
                        >
                          {course.videoName || "Download PDF"}
                        </a>
                      </div>
                      {/* <Download className="w-6 h-6 text-gray-600" /> */}
                    </div>
                  ) : (
                    <video width="320" height="240" controls>
                      <source src={course.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <h2 className="text-lg md:text-xl font-semibold text-indigo-700">
                    {course.courseName}
                  </h2>
                  <h3 className="text-gray-700 text-xs md:text-sm">
                    {isPDF(course.url) ? "Document" : "Video"} Name: {course.videoName}
                  </h3>
                  <p className="text-gray-700 text-xs md:text-sm">
                    Description: {course.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-4">
                    {role === "ADMIN" && (
                      <button
                        className="px-3 md:px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        onClick={() => handleDeletion(course)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <span>No videos or documents found. Add new content.</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Videos;