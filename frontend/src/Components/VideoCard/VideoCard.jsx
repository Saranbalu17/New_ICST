import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import ReactPlayer from "react-player";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Pause,
  Play,
  CheckCircle,
  File,
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  BookOpen,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Download,
} from "lucide-react";
import html2canvas from "html2canvas";
import Certificate from "./Certificate";
import { jsPDF } from "jspdf";
const baseUrl =import.meta.env.VITE_BASE_API_URL || "https://default-api.example.com/api";
const grpCode = import.meta.env.VITE_GRP_CODE || "DEFAULT_GRP_CODE";
const colCode = import.meta.env.VITE_DEFAULT_COL_CODE || "DEFAULT_COL_CODE";
const collegeId =import.meta.env.VITE_DEFAULT_COLLEGE_ID || "DEFAULT_COLLEGE_ID";
const VideoCard = ({ video, role }) => {

  const studentId = JSON.parse(localStorage.getItem("userData"))?.adminUserId || null;
  const userId = studentId || null;
  const videoRef = useRef(null);
  const [watchingVideo, setWatchingVideo] = useState(null);
  const [currentTrackVideos, setCurrentTrackVideos] = useState([]);
  const [lastPlayedVideoName, setLastPlayedVideoName] = useState("");
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [lastrecordedseconds, setLastrecordedSeconds] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [pdf, setPDF] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [currentVideoData, setCurrentVideoData] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const certificateRef = useRef(null);
 
  
  const navigate = useNavigate();

  const getUserData = () => ({
    grpCode,
    colCode,
    collegeId,
    studentId,
    userId,
  });

  const handleDownloadCertificate = async () => {
    try {
      const certificateContainer = certificateRef.current;
      if (!certificateContainer) {
        throw new Error("Certificate container not found");
      }
      const canvas = await html2canvas(certificateContainer, {
        scale: 2,
        useCORS: true,
        width: 800,
        height: 600,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [800, 600],
      });
      pdf.addImage(imgData, "PNG", 0, 0, 800, 600);
      pdf.save(`certificate_course_${courseInfo.courseId || "unknown"}.pdf`);
      alert("Certificate downloaded successfully!");
    } catch (err) {
      console.error("Error generating certificate:", err);
      alert(err.message || "Failed to download certificate");
    }
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const convertTimeToSeconds = (timeString) => {
    if (!timeString) return 0;
    if (typeof timeString === "number") return timeString;

    const parts = timeString.split(":");
    if (parts.length !== 3) return 0;

    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parseInt(parts[2], 10) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  };

  // Transform video array into sections structure
  const sections = useMemo(() => {
    if (!Array.isArray(video) || video.length === 0) return [];
    const sectionMap = new Map();
    video.forEach((item) => {
      const unitId = item.unitId;
      const unitName = item.unitName;
      if (!sectionMap.has(unitId)) {
        sectionMap.set(unitId, {
          unitId,
          unitName,
          topics: [],
        });
      }
      const isPDF = item.videoURL.toLowerCase().endsWith(".pdf");
      const type = isPDF ? "pdf" : "video";
      sectionMap.get(unitId).topics.push({
        topicId: item.topicId,
        topicName: item.topicName,
        videoId: item.videoId,
        videoName: item.videoName,
        videoURL: item.videoURL,
        duration: item.videoEnd,
        type: type,
        courseName: item.courseName,
        employeeName: item.employeeName,
        unitId: item.unitId,
        courseId: item.courseId,
      });
    });
    return Array.from(sectionMap.values());
  }, [video]);

  // Total videos and progress calculation
  const totalVideos = Array.isArray(sections)
    ? sections.reduce(
        (sum, section) =>
          sum + section.topics.filter((topic) => topic.type === "video").length,
        0
      )
    : 0;

  const completedVideos = Array.isArray(sections)
    ? currentTrackVideos.filter((track) => track.status === "ended").length
    : 0;

  // Save student content tracking to server
  const saveStudentContentTracking = useCallback(async (trackingData) => {
    if (
      trackingData.VideoName &&
      trackingData.VideoName.toLowerCase().endsWith(".pdf")
    ) {
      // Skip API call for PDFs, rely on localStorage
      return { success: true };
    }
    try {
      const userData = getUserData();
      const payload = {
        ...userData,
        ...trackingData,
        Flag: "UPSERT",
      };

      const response = await fetch(
        `${baseUrl}/LMS/LMS_SaveStudentContentTracking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving student content tracking:", error);
      return null;
    }
  }, []);

  // Fetch server data
  const fetchServerData = useCallback(async () => {
    try {
      setLoading(true);
      const userData = getUserData();
      const payload = {
        ...userData,
        Flag: "VIEW",
      };

      const response = await fetch(
        `${baseUrl}/LMS/LMS_SaveStudentContentTracking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
    
      if (result.listofSaveStudentContentTrackingResponse) {
        const transformedData = result.listofSaveStudentContentTrackingResponse
          .map((item) => {
            // Validate lastPlayed format
            const lastPlayedDate = item.lastPlayed &&
              /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(item.lastPlayed)
              ? new Date(item.lastPlayed.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")).getTime()
              : Date.now();

            return {
              video_name: item.videoName,
              videoId: item.videoId,
              seconds: convertTimeToSeconds(item.timeStamps) || 0,
              status:
                item.progress >= 100
                  ? "ended"
                  : item.timeStamps !== "00:00:00"
                  ? "paused"
                  : "not_started",
              lastWatching: false,
              topicId: item.topicId,
              UnitId: item.unitId,
              courseId: item.courseId,
              progress: item.progress !== null ? item.progress : 0, // Use progress field with fallback
              lastUpdated: lastPlayedDate,
            };
          })
          // Sort by lastPlayed in descending order (most recent first)
          .sort((a, b) => b.lastUpdated - a.lastUpdated);

       
        return transformedData;
      }
      return [];
    } catch (error) {
      console.error("Error fetching student content tracking:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrUpdateVideoProgress = useCallback(
    (
      videoUrl,
      videoData,
      seconds = 0,
      status = "watching",
      page = 1,
      totalPages = 1
    ) => {
      setCurrentTrackVideos((prev) => {
        const existingIndex = prev.findIndex(
          (track) => track.videoId === videoData?.videoId
        );
        let updated = [...prev];
        const progressPercentage =
          videoData.type === "pdf"
            ? totalPages > 0
              ? Math.min(Math.round((page / totalPages) * 100), 100)
              : 0
            : seconds > 0
            ? Math.min(
                Math.round(
                  (seconds /
                    convertTimeToSeconds(videoData?.duration || "00:00:01")) *
                    100
                ),
                100
              )
            : 0;
        const progressData = {
          video_name: videoData?.videoName,
          videoId: videoData?.videoId,
          seconds: videoData.type === "pdf" ? 0 : seconds,
          page: videoData.type === "pdf" ? page : undefined,
          totalPages: videoData.type === "pdf" ? totalPages : undefined,
          status:
            status === "ended" ||
            (videoData.type === "pdf" && page >= totalPages)
              ? "ended"
              : seconds > 0 || page > 1
              ? "paused"
              : "not_started",
          lastWatching: status === "watching",
          topicId: videoData?.topicId,
          UnitId: videoData?.unitId,
          courseId: videoData?.courseId,
          progress: status === "ended" ? 100 : progressPercentage,
          lastUpdated: Date.now(),
        };
        if (existingIndex === -1) {
          updated.push(progressData);
        } else {
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...progressData,
          };
        }
        updated = updated.map((item) =>
          item.videoId !== videoData?.videoId
            ? { ...item, lastWatching: false }
            : item
        );
        if (videoData.type === "pdf") {
          setPdfProgress((prev) => {
            const newProgress = {
              ...prev,
              [videoData.videoId]: {
                page,
                totalPages,
                progress: progressPercentage,
              },
            };
            localStorage.setItem("pdfProgress", JSON.stringify(newProgress));
            return newProgress;
          });
        }
        return updated;
      });
    },
    []
  );

  // Initialize data on component mount
  const initializeData = useCallback(async () => {
    if (isInitialized) return;
    const serverData = await fetchServerData();
    setCurrentTrackVideos(serverData);
    const savedPdfProgress = JSON.parse(
      localStorage.getItem("pdfProgress") || "{}"
    );
    setPdfProgress(savedPdfProgress);
    if (serverData.length > 0) {
      const lastVideo = serverData[0]; // Already sorted by lastPlayed
      if (lastVideo) {
        const videoData = sections
          .flatMap((section) => section.topics)
          .find((topic) => topic.videoId === lastVideo.videoId);
        if (videoData) {
          if (videoData.type === "pdf") {
            setPDF(videoData.videoURL);
            setWatchingVideo(null);
            setCurrentVideoTitle(videoData.topicName);
            setCurrentVideoData(videoData);
            setLastPlayedVideoName(videoData.videoURL);
            const savedProgress = savedPdfProgress[videoData.videoId] || {};
            setPageNumber(savedProgress.page || 1);
            setNumPages(savedProgress.totalPages || null);
            addOrUpdateVideoProgress(
              videoData.videoURL,
              videoData,
              0,
              "not_started",
              savedProgress.page || 1,
              savedProgress.totalPages || 1
            );
          } else {
            setWatchingVideo(videoData.videoURL);
            setCurrentVideoTitle(videoData.topicName);
            setCurrentVideoData(videoData);
            setLastPlayedVideoName(videoData.videoURL);
            setLastrecordedSeconds(lastVideo.seconds);
          }
        }
      }
    }
    setIsInitialized(true);
  }, [isInitialized, fetchServerData, sections, addOrUpdateVideoProgress]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Auto-save progress every 2 seconds when video is playing
  useEffect(() => {
    if (isPlaying && watchingVideo && currentVideoData) {
      intervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const currentTime = videoRef.current.getCurrentTime();
          const duration = videoRef.current.getDuration();
          const progressPercentage =
            duration > 0
              ? Math.min(Math.round((currentTime / duration) * 100), 100)
              : 0;
          setLastrecordedSeconds(currentTime);

          const trackingData = {
            UnitId: currentVideoData.unitId || "",
            TopicId: currentVideoData.topicId || "",
            VideoId: currentVideoData.videoId || "",
            VideoName: currentVideoData.videoName || "",
            VideoDescription: currentVideoData.topicName || "",
            LastPlayed: new Date()
              .toISOString()
              .replace("T", " ")
              .substring(0, 19),
            TimeStamps: formatTime(currentTime),
            VideoStart: "00:00:00",
            VideoEnd: formatTime(duration),
            LoginIpAddress: "127.0.0.1",
            LoginSystemName: "DESKTOP",
            CourseId: currentVideoData.courseId || "",
            Progress: progressPercentage,
            UserId: getUserData().userId,
          };

          saveStudentContentTracking(trackingData);
          addOrUpdateVideoProgress(
            watchingVideo,
            currentVideoData,
            currentTime,
            progressPercentage >= 100 ? "ended" : "watching"
          );
        }
      }, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isPlaying,
    watchingVideo,
    currentVideoData,
    saveStudentContentTracking,
    addOrUpdateVideoProgress,
  ]);

  // Save current video progress before switching
  const saveCurrentProgress = useCallback(async () => {
    if (videoRef.current && currentVideoData && watchingVideo) {
      const currentTime = videoRef.current.getCurrentTime();
      const duration = videoRef.current.getDuration();
      const progressPercentage =
        duration > 0
          ? Math.min(Math.round((currentTime / duration) * 100), 100)
          : 0;
      const status = progressPercentage >= 100 ? "ended" : "paused";

      const trackingData = {
        UnitId: currentVideoData.unitId || "",
        TopicId: currentVideoData.topicId || "",
        VideoId: currentVideoData.videoId || "",
        VideoName: currentVideoData.videoName || "",
        VideoDescription: currentVideoData.topicName || "",
        LastPlayed: new Date().toISOString().replace("T", " ").substring(0, 19),
        TimeStamps: formatTime(currentTime),
        VideoStart: "00:00:00",
        VideoEnd: formatTime(duration),
        LoginIpAddress: "127.0.0.1",
        LoginSystemName: "DESKTOP",
        CourseId: currentVideoData.courseId || "",
        Progress: progressPercentage,
        UserId: getUserData().userId,
      };

      await saveStudentContentTracking(trackingData);
      addOrUpdateVideoProgress(
        watchingVideo,
        currentVideoData,
        currentTime,
        status
      );
    }
  }, [
    watchingVideo,
    currentVideoData,
    saveStudentContentTracking,
    addOrUpdateVideoProgress,
  ]);

  // Handle video selection
  const handleVideo = useCallback(
    async (videoUrl, id, title) => {
      await saveCurrentProgress();

      const videoData = sections
        .flatMap((section) => section.topics)
        .find((topic) => topic.videoURL === videoUrl);

      if (!videoData) return;

      if (videoData.type === "pdf") {
        setPDF(videoUrl);
        setWatchingVideo(null);
        setCurrentVideoTitle(title);
        setCurrentVideoData(videoData);
        setLastPlayedVideoName(videoUrl);
        setLastrecordedSeconds(0);
        const savedProgress = pdfProgress[videoData.videoId] || {};
        setPageNumber(savedProgress.page || 1);
        setNumPages(savedProgress.totalPages || null);
        addOrUpdateVideoProgress(
          videoUrl,
          videoData,
          0,
          "not_started",
          savedProgress.page || 1,
          savedProgress.totalPages || 1
        );
        return;
      }

      setWatchingVideo(videoUrl);
      setCurrentVideoTitle(title);
      setCurrentVideoData(videoData);
      setVideoEnded(false);
      setLastPlayedVideoName(videoUrl);
      setPDF(null);

      const existingProgress = currentTrackVideos.find(
        (track) => track.videoId === videoData?.videoId
      );
      if (existingProgress && existingProgress.seconds > 0) {
        const seconds = convertTimeToSeconds(existingProgress.seconds);
        setLastrecordedSeconds(seconds);
        if (videoRef.current) {
          videoRef.current.seekTo(seconds, "seconds");
        }
      } else {
        setLastrecordedSeconds(0);
        addOrUpdateVideoProgress(videoUrl, videoData, 0, "not_started");
      }
    },
    [
      sections,
      currentTrackVideos,
      addOrUpdateVideoProgress,
      saveCurrentProgress,
      pdfProgress,
    ]
  );

  const toggleSection = (sectionIndex) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  const handleStart = () => {
    setIsPlaying(true);
    if (videoRef.current && lastrecordedseconds > 0) {
      videoRef.current.seekTo(lastrecordedseconds, "seconds");
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = async () => {
    setIsPlaying(false);
    await saveCurrentProgress();
  };

  const handleEnded = async () => {
    setIsPlaying(false);
    setVideoEnded(true);

    if (videoRef.current && currentVideoData) {
      const duration = videoRef.current.getDuration();
      const trackingData = {
        UnitId: currentVideoData.unitId || "",
        TopicId: currentVideoData.topicId || "",
        VideoId: currentVideoData.videoId || "",
        VideoName: currentVideoData.videoName || "",
        VideoDescription: currentVideoData.topicName || "",
        LastPlayed: new Date().toISOString().replace("T", " ").substring(0, 19),
        TimeStamps: formatTime(duration),
        VideoStart: "00:00:00",
        VideoEnd: formatTime(duration),
        LoginIpAddress: "127.0.0.1",
        LoginSystemName: "DESKTOP",
        CourseId: currentVideoData.courseId || "",
        Progress: 100,
        UserId: getUserData().userId,
      };

      await saveStudentContentTracking(trackingData);
      addOrUpdateVideoProgress(
        watchingVideo,
        currentVideoData,
        duration,
        "ended"
      );
    }
  };

  const getVideoStatus = (videoId) => {
    if (!videoId || !currentTrackVideos) return null;
    const track = currentTrackVideos.find((track) => track.videoId === videoId);
    return track ? track.status : null;
  };

  const getVideoProgress = (videoId) => {
    if (!videoId || !currentTrackVideos) return 0;
    const track = currentTrackVideos.find((track) => track.videoId === videoId);
    return track ? track.progress : 0;
  };

  const handleChange = (e) => {
    if (e.target && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      if (file) {
        alert("Submitted Assignment successfully");
        if (inputRef.current) {
          inputRef.current.value = null;
        }
        setFile(null);
        setIsOpen(false);
      }
    } catch (error) {
      console.log("Error submitting assignment:", error);
    }
  };

  // Initialize expanded sections
  useEffect(() => {
    if (sections.length > 0 && Object.keys(expandedSections).length === 0) {
      const initialExpanded = {};
      sections.forEach((_, index) => {
        initialExpanded[index] = true;
      });
      setExpandedSections(initialExpanded);
    }
  }, [sections]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Get course info from first video item
  const courseInfo = video?.[0] || {};

  if (!Array.isArray(video) || video.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <PlayCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No course content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-nunito flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">
                {courseInfo.courseName || courseInfo.course_name || "Course"}
              </h1>
              {loading && (
                <span className="text-sm text-yellow-400">Syncing...</span>
              )}
              {totalVideos && (
                <button
                  onClick={handleDownloadCertificate}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium"
                >
                  Download Certificate
                </button>
              )}
            </div>
             <button className="bg-blue-500 text-white font-bold px-4 py-3 rounded-md" onClick={()=>navigate("/student-dashboard")}>Back</button>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Main Video Section */}
          <div className="flex-1 flex flex-col">
            {/* Video Player */}
            <div className="relative bg-black">
              {watchingVideo ? (
                <div className="aspect-video">
                  <ReactPlayer
                    url={watchingVideo}
                    ref={videoRef}
                    width="100%"
                    height="100%"
                    controls
                    onStart={handleStart}
                    onPause={handlePause}
                    onEnded={handleEnded}
                    onPlay={handlePlay}
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Select a topic to start learning
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            {watchingVideo && (
              <div className="bg-gray-900 p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold mb-2">{currentVideoTitle}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>
                    By{" "}
                    {courseInfo.employeeName ||
                      courseInfo.employee_name ||
                      "Instructor"}
                  </span>
                  <span>•</span>
                  <span>
                    Course: {courseInfo.courseName || courseInfo.course_name}
                  </span>
                  {isPlaying && (
                    <>
                      <span>•</span>
                      <span className="text-green-400">
                        Auto-saving progress...
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tabs Section */}
            {/* <div className="bg-gray-900 border-b border-gray-800">
              <div className="flex space-x-8 px-6">
                <button className="py-4 text-white border-b-2 border-purple-500 font-medium">
                  Overview
                </button>
                <button className="py-4 text-gray-400 hover:text-white transition-colors">
                  Q&A
                </button>
                <button className="py-4 text-gray-400 hover:text-white transition-colors">
                  Notes
                </button>
                <button className="py-4 text-gray-400 hover:text-white transition-colors">
                  Announcements
                </button>
                <button className="py-4 text-gray-400 hover:text-white transition-colors">
                  Reviews
                </button>
                <button className="py-4 text-gray-400 hover:text-white transition-colors">
                  Learning tools
                </button>
                <button
                  className="py-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/chat/${courseInfo.employeeId || courseInfo.employee_id}`,
                      {
                        state: {
                          teacherName:
                            courseInfo.employeeName || courseInfo.employee_name,
                        },
                      }
                    )
                  }
                >
                  Chat with the instructor
                </button>
              </div>
            </div> */}
          </div>

          {/* Course Content Sidebar */}
          <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col">
            {/* Sidebar Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Units & Topics</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {completedVideos} / {totalVideos}
                  </span>
                  
                </div>
              </div>
              
            </div>

            {/* Course Content */}
            <div className="flex-1 overflow-y-auto">
              {sections.map((section, sectionIndex) => (
                <div key={section.unitId} className="border-b border-gray-800">
                  {/* Unit Header */}
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {sectionIndex + 1}
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-base">
                          {section.unitName}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {section.topics.length} topics
                        </p>
                      </div>
                    </div>
                    {expandedSections[sectionIndex] ? (
                      <ChevronUp className="w-5 h-5 text-gray-300" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-300" />
                    )}
                  </button>

                  {/* Topics */}
                  {expandedSections[sectionIndex] && (
                    <div className="bg-gray-850">
                      {section.topics.map((topic, topicIndex) => {
                        const videoStatus = getVideoStatus(topic.videoId);
                        const videoProgress = getVideoProgress(topic.videoId);
                        const isCurrentlyWatching =
                          watchingVideo === topic.videoURL;

                        return (
                          <div key={topic.videoId} className="relative">
                            <div style={{ position: "absolute", left: "-9999px" }} ref={certificateRef}>
                              <Certificate courseInfo={courseInfo || {}} />
                            </div>
                            {topic.type === "video" ? (
                              <button
                                className={`w-full text-left p-3 flex items-center space-x-3 hover:bg-gray-800 transition-colors ${
                                  isCurrentlyWatching
                                    ? "bg-purple-900 border-r-4 border-purple-500"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleVideo(
                                    topic.videoURL,
                                    topic.videoId,
                                    topic.topicName
                                  )
                                }
                              >
                                {/* Status Icon */}
                                <div className="flex-shrink-0">
                                  {videoStatus === "ended" ? (
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                  ) : isCurrentlyWatching ? (
                                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                      <Play className="w-3 h-3 text-white" />
                                    </div>
                                  ) : videoStatus === "paused" ||
                                    videoStatus === "watching" ? (
                                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                      <Pause className="w-3 h-3 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
                                      <Play className="w-3 h-3 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Topic Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate pr-2">
                                      {sectionIndex + 1}.{topicIndex + 1}.{" "}
                                      {topic.topicName}
                                    </span>
                                    {topic.duration && (
                                      <span className="text-xs text-gray-400 flex-shrink-0">
                                        {topic.duration}
                                      </span>
                                    )}
                                  </div>
                                  {(videoStatus === "watching" ||
                                    videoStatus === "paused") && (
                                    <div className="mt-1 bg-gray-700 rounded-full h-1 w-full">
                                      <div
                                        className="bg-yellow-500 h-1 rounded-full"
                                        style={{ width: `${videoProgress}%` }}
                                      ></div>
                                    </div>
                                  )}
                                  {videoStatus === "ended" && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      <span className="text-xs text-green-400">
                                        Completed
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </button>
                            ) : topic.type === "pdf" ? (
                              <button
                                className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-800 transition-colors ${
                                  pdf === topic.videoURL
                                    ? "bg-purple-900 border-r-4 border-purple-500"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleVideo(
                                    topic.videoURL,
                                    topic.videoId,
                                    topic.topicName
                                  )
                                }
                              >
                                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate pr-2">
                                      {sectionIndex + 1}.{topicIndex + 1}.{" "}
                                      {topic.topicName}
                                    </span>
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                      PDF
                                    </span>
                                  </div>
                                  {(videoStatus === "watching" ||
                                    videoStatus === "paused") && (
                                    <div className="mt-1 bg-gray-700 rounded-full h-1 w-full">
                                      <div
                                        className="bg-yellow-500 h-1 rounded-full"
                                        style={{ width: `${videoProgress}%` }}
                                      ></div>
                                    </div>
                                  )}
                                  {videoStatus === "ended" && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      <span className="text-xs text-green-400">
                                        Completed
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </button>
                            ) : (
                              <button
                                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-800 transition-colors"
                                onClick={() => setIsOpen(true)}
                              >
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Upload className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate pr-2">
                                      {sectionIndex + 1}.{topicIndex + 1}.{" "}
                                      {topic.topicName}
                                    </span>
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                      Assignment
                                    </span>
                                  </div>
                                </div>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Submission Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Submit Assignment</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Upload your file
                </label>
                <input
                  type="file"
                  ref={inputRef}
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
                  disabled={!file}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {pdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">PDF Viewer</h3>
              <button
                onClick={() => setPDF(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 bg-gray-900 rounded overflow-hidden">
              <iframe
                src={pdf}
                className="w-full h-full"
                frameBorder="0"
                title="PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
