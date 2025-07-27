import { useState, useEffect } from "react";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  // State for dynamic data

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate()
  // Mock API call to fetch data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      const totalFaculty = localStorage.getItem('facultyMember')
      const totalStudents = localStorage.getItem('studentLength')
      const mockApiResponse = {
        totalStudents: totalStudents,
        totalFaculty: totalFaculty,
        totalCourses: 56,
        totalEnrollments: 3456,
        courses: [
          { name: "Python Basics", enrollments: 245 },
          { name: "Data Science 101", enrollments: 189 },
          { name: "Web Development", enrollments: 320 },
        ],
      };

      setStats({
        totalStudents: mockApiResponse.totalStudents,
        totalFaculty: mockApiResponse.totalFaculty,
        totalCourses: mockApiResponse.totalCourses,
        totalEnrollments: mockApiResponse.totalEnrollments,
      });
      setCourses(mockApiResponse.courses);
    };

    fetchData();
  }, []);

  // Data for Line Chart (Student Growth Over Time)
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Students",
        data: [200, 350, 500, 700, 900, stats.totalStudents],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Options for Line Chart
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Student Growth Over Time" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Data for Doughnut Chart (Course Enrollment Distribution)
  const doughnutChartData = {
    labels: courses.map((course) => course.name),
    datasets: [
      {
        data: courses.map((course) => course.enrollments),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(249, 115, 22, 0.8)",
        ],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  // Options for Doughnut Chart
  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Course Enrollment Distribution" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-nunito">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 md:ml-64 lg:ml-64">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:block">Admin User</span>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-700 font-semibold">AU</span>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        {/* <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-600">Total Students</h2>
            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-600">Total Faculty</h2>
            <p className="text-2xl font-bold text-gray-900">{stats.totalFaculty}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-600">Total Courses</h2>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
          </div>
        </section> */}

        {/* Charts Section */}
        {/* <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </section> */}

        {/* Course Management */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Management</h2>
          <div className="space-y-4 mb-6">
            {courses.map((course, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">{course.name}</p>
                  <p className="text-sm text-gray-500">Enrolled: {course.enrollments} students</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Add Student
            </button>
            <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Add Faculty
            </button>
            <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => navigate('/upload-admin')}>
              Add Course
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;