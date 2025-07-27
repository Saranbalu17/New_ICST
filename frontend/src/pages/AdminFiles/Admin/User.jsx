import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../Components/Sidebar/Sidebar';

const User = () => {
  const [originalStudentMembers, setOriginalStudentMembers] = useState([]);
  const [studentMembers, setStudentMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('')
  // API parameters
  const grpCode = 'devprod';
  const colCode = '0001';
  const collegeId = 1;

  useEffect(() => {
    try {
      if (!searchTerm || searchTerm.trim() === "") {
        setStudentMembers(originalStudentMembers)
      }
      else {
        const filtered = originalStudentMembers.filter((student) =>
          student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || student.branchName.toLowerCase().includes(searchTerm.toLowerCase()) || student.semester.toLowerCase().includes(searchTerm.toLowerCase()) || student.studMobile.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setStudentMembers(filtered);
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
        const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_StudentListContent', {
          grpCode,
          colCode,
          collegeId,
          Str: "",
        });
        const fetchedData = response.data.listOfStudent;
        setOriginalStudentMembers(fetchedData);
        setStudentMembers(fetchedData)
        localStorage.setItem('studentLength',fetchedData.length)
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
              <div className="text-lg text-gray-600">Loading student data...</div>
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
            Student Directory
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
              placeholder='Search student members...'
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

          {studentMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? 'No student members found matching your search.' : 'No student members found.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
              {studentMembers.map((student, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className='flex justify-between items-center '>
                        <h2 className="text-lg md:text-xl font-semibold text-indigo-700 break-words">
                          {student.studentName || 'Unknown Name'}
                        </h2>
                        <img src={student.studentImage ? student.studentImage :'/images.jpg'} alt="x" className='rounded-full w-20 h-20' />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        ID: {student.studentId || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-blue-600 text-sm md:text-base">
                      <span className="font-medium">Branch:</span> {student.branchName || 'Not specified'}
                    </p>
                    
                    <p className="text-blue-600 text-sm md:text-base">
                      <span className="font-medium">Father:</span> {student.fatherName || 'Not specified'}
                    </p>
                    <p className="text-blue-600 text-sm md:text-base">
                      <span className="font-medium">Gender:</span> {student.genderName || 'Not specified'}
                    </p>
                    <p className="text-blue-600 text-sm md:text-base">
                      <span className="font-medium">Semester:</span> {student.semester || 'Not specified'}
                    </p>

                     <p className="text-blue-600 text-sm md:text-base">
                      <span className="font-medium">Mobile No:</span> {student.studMobile || 'Not specified'}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="px-3 md:px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors cursor-pointer">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default User;