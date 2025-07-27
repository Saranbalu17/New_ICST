// frontend/src/Pages/OpenedVideo/OpenedVideo.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';

// Dummy video data for testing
const dummyVideos = [
  { _id: '1', title: 'Introduction to Python', description: 'Python basics', branch: 'CSE', thumbnail: '/course.jpg', videoPath: 'Random.mp4', status: 'available' },
  { _id: '2', title: 'Machine Learning Basics', description: 'ML concepts', branch: 'AIML', thumbnail: '/course.jpg', videoPath: 'Random.mp4', status: 'available' },
  { _id: '3', title: 'Data Structures', description: 'DS overview', branch: 'CSE', thumbnail: '/course.jpg', videoPath: 'Random.mp4', status: 'upcoming' },
  { _id: '4', title: 'Algorithms 101', description: 'Algo basics', branch: 'CSE', thumbnail: '/course.jpg', videoPath: 'Random.mp4', status: 'available' },
  { _id: '5', title: 'AI Fundamentals', description: 'AI intro', branch: 'AIML', thumbnail: '/course.jpg', videoPath: 'Random.mp4', status: 'upcoming' },
];

const OpenedVideo = () => { 
  const { id } = useParams(); // Get videoId from URL
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideoData = () => {
      try {
        // Simulate fetching video data by ID
        const video = dummyVideos.find(v => v._id === id);
        if (video) {
          setVideoData(video);
        } else {
          setError('Video not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load video');
        setLoading(false);
      }
    };
    fetchVideoData();

    // Uncomment for backend integration
    // const fetchVideoData = async () => {
    //   try {
    //     const response = await axios.get(`/student/videos/${id}`, {
    //       headers: { Authorization: token }
    //     });
    //     setVideoData(response.data);
    //   } catch (err) {
    //     setError(err.response?.data?.message || 'Failed to load video');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchVideoData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="content ml-64 p-6 w-full">
        {videoData && (
          <div className="max-w-4xl mx-auto">
            {/* Video Player */}
            <div className="mb-6">
            <video
            width="320"
            height="240"
            controls
            loop={true}
            poster={`${videoData.thumbnail}`}
            className="video-player"
            onError={(e) => console.error(`Failed to load video: ${videoData.videoPath}`)}
          >
            <source src={`${videoData.videoPath}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
            </div>
            {/* Video Details */}
            <div>
              <h1 className="font-bold text-2xl mb-2">{videoData.title}</h1>
              <p className="text-gray-600 mb-4">{videoData.description}</p>
              <p className="text-gray-500"><strong>Branch:</strong> {videoData.branch}</p>
              <p className="text-gray-500"><strong>Status:</strong> {videoData.status}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenedVideo;