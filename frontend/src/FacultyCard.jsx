import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FacultyCard = () => {
  // Mock course data
  const initialCourses = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      description: "Fundamentals of programming and algorithms for beginners.",
      branch: "Computer Science",
    },
    {
      id: 2,
      title: "Advanced React Development",
      description:
        "Deep dive into React hooks, context API and performance optimization.",
      branch: "Web Development",
    },
    {
      id: 3,
      title: "Data Structures and Algorithms",
      description:
        "Essential data structures and algorithms with practical implementations.",
      branch: "Computer Science",
    },
    {
      id: 4,
      title: "Machine Learning Basics",
      description: "Introduction to ML concepts with Python implementations.",
      branch: "Artificial Intelligence",
    },
  ];
  const [courses, setCourses] = useState(initialCourses);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(null);
  const [error, setError] = useState("");
  const [editForm, seteditForm] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    if (searchTerm) {
      let filterCourses = initialCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filterCourses) {
        setCourses(filterCourses);
      }
    } else {
      setCourses(initialCourses);
    }
  }, [searchTerm]);

  const handleEdit = (id) => {
    setEdit(true);
    setId(id);
    const toEditForm = courses.findIndex((course) => course.id === id);
    if (toEditForm !== -1) {
      seteditForm(courses[toEditForm]);
      setTitle(courses[toEditForm].title);
      setDescription(courses[toEditForm].description);
    }
  };

  const handleDeletion = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredCourse = courses.findIndex((course) => course.id === id);
    if (courses[requiredCourse] === -1) {
      setError("No course found");
    }
    let updatedCourse = [...courses];
    updatedCourse[requiredCourse].title = title;
    updatedCourse[requiredCourse].description = description;
    setCourses(updatedCourse);
    setEdit(false);
  };

  const closeModal = () => {
    setEdit(false);
  };

  const clearFilters = () => {
    if (searchTerm) {
      setSearchTerm("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <h1 className="text-center mt-2 text-3xl md:text-4xl font-bold text-gray-800 mb-8 font-nunito">
        My Courses
      </h1>

      {/* Styled search container */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="flex items-center bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {error && <h1 className="text-red-500 text-xl ">{error}</h1>}
          <input
            type="text"
            placeholder="Search for courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="font-nunito w-full px-4 py-3 focus:outline-none text-gray-700"
          />
          {searchTerm && (
            <button
              onClick={clearFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 transition-colors duration-200 font-nunito"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Responsive grid - 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {courses.length > 0 ? (
          <>
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 font-nunito h-full flex flex-col transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
                  {course.title}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                  {course.description}
                </p>
                <div className="flex flex-col space-y-1.5 justify-between items-center lg:flex-row lg:space-x-2 mt-auto">
                  <span className="inline-block bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {course.branch}
                  </span>
                  <div className="space-x-1 lg:flex">
                    <button
                      className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md transition-colors duration-200"
                      onClick={() => handleEdit(course.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-colors duration-200"
                      onClick={() => handleDeletion(course.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center">
            <h1 className="text-red-400 text-2xl font-bold text-center font-nunito">
              No Videos Found according to your Filters
            </h1>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-8">
        <Link
          to="/faculty-dashboard"
          className="text-blue-600 hover:text-blue-800 font-medium text-lg font-nunito"
        >
          Back to dashboard
        </Link>
      </div>

      {/* Modal Overlay - Styled but keeping functionality */}
      {edit && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 font-nunito backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-6 m-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Course</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyCard;
