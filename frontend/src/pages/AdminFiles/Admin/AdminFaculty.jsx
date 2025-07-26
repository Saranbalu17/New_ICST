import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Components/Sidebar/Sidebar';

const AdminFaculty = () => {
  const [originalFacultyMembers, setOriginalFacultyMembers] = useState([]);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // API parameters
  const grpCode = 'testprod';
  const colCode = '0001';
  const collegeId = 1;
  const flag = 'EMPLOYEESEARCH';

  useEffect(() => {
    try {
      if (!searchTerm || searchTerm.trim() === "") {
        setFacultyMembers(originalFacultyMembers)
      }
      else {
        const filtered = originalFacultyMembers.filter((faculty) =>
          faculty.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || faculty.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) || faculty.designationName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFacultyMembers(filtered);
      }

    } catch (error) {
      console.log(error);

    }
  }, [searchTerm])

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_FacultyListContent', {
          grpCode,
          colCode,
          collegeId,
          slNo: 0,
          collegeName: "",
          employeeId: 0,
          employeeName: "",
          employeeNumber: "",
          department: 0,
          departmentName: "",
          designation: 0,
          designationName: "",
          employeeType: 0,
          employeeTypeName: "",
          courseId: 0,
          courseName: "",
          courseCode: "",
          topicId: 0,
          topicName: "",
          flag
        });
        const fetchedData = response.data.listOfFaculty
        setOriginalFacultyMembers(fetchedData);
        setFacultyMembers(fetchedData)
        console.log(fetchedData)
        localStorage.setItem('facultyMember', fetchedData.length)
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch faculty data');
        console.error('Error fetching faculty data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 md:ml-64 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading faculty data...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 md:ml-64 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex bg-gray-100 font-nunito">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 md:ml-64 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">
            Faculty Directory
          </h1>
          <div className="relative mb-6 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 bg-white hover:border-gray-400"
              placeholder='Search faculty members...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {facultyMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? 'No faculty members found matching your search.' : 'No faculty members found.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
              {facultyMembers.map((faculty, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className='flex justify-between items-center '>
                        <h2 className="text-lg md:text-xl font-semibold text-indigo-700 break-words">
                          {faculty.employeeName || 'Unknown Name'}
                        </h2>
                        <img src={faculty.facultyImage ? faculty.facultyImage : '/images.jpg'} alt="x" className='rounded-full w-20 h-20' />
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        ID: {faculty.employeeNumber || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-blue-600 text-sm md:text-base">
                      <span className="font-medium">Department:</span> {faculty.departmentName || 'Not specified'}
                    </p>
                    <p className="text-blue-600 text-sm md:text-base">
                      <span className="font-medium">Designation:</span> {faculty.designationName || 'Not specified'}
                    </p>
                    <p className="text-blue-600 text-sm md:text-base">
                      <span className="font-medium">Type:</span> {faculty.employeeTypeName || 'Not specified'}
                    </p>
                    <p className="text-blue-600 text-sm md:text-base">
                      <span className="font-medium">College:</span> {faculty.collegeName || 'Not specified'}
                    </p>

                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      className="px-3 md:px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedFaculty(faculty);
                        setIsModalOpen(true);
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
 {isModalOpen && selectedFaculty && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
    onClick={() => setIsModalOpen(false)} // click on background closes modal
  >
    <div
      className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fadeIn max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // prevent close when clicking inside modal
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
        onClick={() => setIsModalOpen(false)}
      >
        &times;
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <img
          src={selectedFaculty.facultyImage || "/images.jpg"}
          alt="Faculty"
          className="mx-auto rounded-full w-24 h-24 border-4 border-indigo-200 shadow"
        />
        <h2 className="text-xl md:text-2xl font-bold text-indigo-700 mt-4">
          {selectedFaculty.employeeName}
        </h2>
        <p className="text-sm text-gray-500">
          Employee No: {selectedFaculty.employeeNumber || "N/A"}
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-800">
        <div>
          <p><span className="font-semibold">Department:</span> {selectedFaculty.departmentName || 'N/A'}</p>
        </div>
        <div>
          <p><span className="font-semibold">Designation:</span> {selectedFaculty.designationName || 'N/A'}</p>
        </div>
        <div>
          <p><span className="font-semibold">Type:</span> {selectedFaculty.employeeTypeName || 'N/A'}</p>
        </div>
        <div>
          <p><span className="font-semibold">College:</span> {selectedFaculty.collegeName || 'N/A'}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}




    </div>
  );
};

export default AdminFaculty;