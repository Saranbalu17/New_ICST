// frontend/src/Pages/StudentManagement/StudentManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext/AuthContext';
import Sidebar from '../../../Components/Sidebar/Sidebar';

// Dummy data for testing
const dummyStudents = [
  { _id: '1', rollNumber: 'CS001', password: 'pass123', branch: 'CSE' },
  { _id: '2', rollNumber: 'AI001', password: 'pass123', branch: 'AIML' },
  { _id: '3', rollNumber: 'CS002', password: 'pass123', branch: 'CSE' },
];

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editStudentId, setEditStudentId] = useState(null);
  const [editRollNumber, setEditRollNumber] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setTimeout(() => {
          setStudents(dummyStudents);
          setLoading(false);
        }, 1000);

        // Uncomment for backend
        // const response = await axios.get('/admin/students', {
        //   headers: { Authorization: token }
        // });
        // setStudents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [token]);

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setStudents(students.filter(student => student._id !== studentId));
        alert('Student deleted successfully');

        // Uncomment for backend
        // await axios.delete(`/admin/student/${studentId}`, {
        //   headers: { Authorization: token }
        // });
        // setStudents(students.filter(student => student._id !== studentId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const handleEdit = (student) => {
    setEditStudentId(student._id);
    setEditRollNumber(student.rollNumber);
    setEditPassword(student.password);
    setEditBranch(student.branch);
  };

  const handleUpdate = async (studentId) => {
    try {
      const updatedStudent = {
        rollNumber: editRollNumber,
        password: editPassword,
        branch: editBranch,
      };
      setStudents(students.map(student =>
        student._id === studentId ? { ...student, ...updatedStudent } : student
      ));
      alert('Student updated successfully');
      setEditStudentId(null);

      // Uncomment for backend
      // await axios.put(`/admin/student/${studentId}`, updatedStudent, {
      //   headers: { Authorization: token }
      // });
      // setStudents(students.map(student =>
      //   student._id === studentId ? { ...student, ...updatedStudent } : student
      // ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update student');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="content ml-64 p-6">
        <h1 className="font-bold text-2xl mb-4">Student Management</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && students.length === 0 && (
          <p className="text-gray-500">No students found.</p>
        )}
        <div className="grid gap-4">
          {students.map(student => (
            <div key={student._id} className="p-4 bg-white rounded-lg shadow-md">
              {editStudentId === student._id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editRollNumber}
                    onChange={(e) => setEditRollNumber(e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Roll Number"
                  />
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Password"
                  />
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="AIML">AIML</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(student._id)}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditStudentId(null)}
                      className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{student.rollNumber}</h3>
                    <p><strong>Branch:</strong> {student.branch}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentManagement;