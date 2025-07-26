// frontend/src/Pages/FacultyManagement/FacultyManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext/AuthContext';
import Sidebar from '../../../Components/Sidebar/Sidebar';

// Dummy data for testing
const dummyFaculties = [
  {
    _id: '1',
    name: 'Dr. John Doe',
    collegeName: 'Tech University',
    branches: ['CSE', 'AIML'],
  },
  {
    _id: '2',
    name: 'Prof. Jane Smith',
    collegeName: 'Engineering College',
    branches: ['ECE', 'MECH'],
  },
  {
    _id: '3',
    name: 'Mr. Alan Turing',
    collegeName: 'Science Institute',
    branches: ['CSE'],
  },
];

const FacultyManagement = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editFacultyId, setEditFacultyId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCollegeName, setEditCollegeName] = useState('');
  const [editBranches, setEditBranches] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        // Simulate fetching data with dummy data for now
        setTimeout(() => {
          setFaculties(dummyFaculties);
          setLoading(false);
        }, 1000);

        // Uncomment this when integrating with backend
        // const response = await axios.get('/admin/faculties', {
        //   headers: { Authorization: token }
        // });
        // setFaculties(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch faculties');
      } finally {
        setLoading(false);
      }
    };
    fetchFaculties();
  }, [token]);

  const handleDelete = async (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty?')) {
      try {
        // Simulate deletion with dummy data
        setFaculties(faculties.filter(faculty => faculty._id !== facultyId));
        alert('Faculty deleted successfully');

        // Uncomment this when integrating with backend
        // await axios.delete(`/admin/faculty/${facultyId}`, {
        //   headers: { Authorization: token }
        // });
        // setFaculties(faculties.filter(faculty => faculty._id !== facultyId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete faculty');
      }
    }
  };

  const handleEdit = (faculty) => {
    setEditFacultyId(faculty._id);
    setEditName(faculty.name);
    setEditCollegeName(faculty.collegeName);
    setEditBranches(faculty.branches.join(', '));
  };

  const handleUpdate = async (facultyId) => {
    try {
      const updatedBranches = editBranches.split(',').map(branch => branch.trim());
      const updatedFaculty = {
        name: editName,
        collegeName: editCollegeName,
        branches: updatedBranches,
      };

      // Simulate update with dummy data
      setFaculties(faculties.map(faculty =>
        faculty._id === facultyId ? { ...faculty, ...updatedFaculty } : faculty
      ));
      alert('Faculty updated successfully');
      setEditFacultyId(null);

      // Uncomment this when integrating with backend
      // await axios.put(`/admin/faculty/${facultyId}`, updatedFaculty, {
      //   headers: { Authorization: token }
      // });
      // setFaculties(faculties.map(faculty =>
      //   faculty._id === facultyId ? { ...faculty, ...updatedFaculty } : faculty
      // ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update faculty');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="content ml-64 p-6">
        <h1 className="font-bold text-2xl mb-4">Faculty Management</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && faculties.length === 0 && (
          <p className="text-gray-500">No faculties found.</p>
        )}
        <div className="grid gap-4 w-1/2">
          {faculties.map(faculty => (
            <div key={faculty._id} className="p-4 bg-white rounded-lg shadow-md">
              {editFacultyId === faculty._id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Faculty Name"
                  />
                  <input
                    type="text"
                    value={editCollegeName}
                    onChange={(e) => setEditCollegeName(e.target.value)}
                    className="p-2 border rounded"
                    placeholder="College Name"
                  />
                  <input
                    type="text"
                    value={editBranches}
                    onChange={(e) => setEditBranches(e.target.value)}
                    className="p-2 border rounded"
                    placeholder="Branches (e.g., CSE, AIML)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(faculty._id)}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditFacultyId(null)}
                      className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{faculty.name}</h3>
                    <p><strong>College:</strong> {faculty.collegeName}</p>
                    <p><strong>Branches:</strong> {faculty.branches.join(', ')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(faculty)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faculty._id)}
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

export default FacultyManagement;