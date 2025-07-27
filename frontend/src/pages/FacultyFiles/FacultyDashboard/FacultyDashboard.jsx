import { useEffect, useState } from "react";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import { SquarePen } from "lucide-react";
const FacultyDashboard = () => {
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [success, setSuccess] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");
  useEffect(() => {
    const getName = localStorage.getItem("username");
    setName(getName || "");
  }, []);

  const handleSave = (e) => {
    try {
      e.preventDefault();
      localStorage.setItem("username", name);
      setEdit(false);
      setDisabled(true);
      setSuccess(true);
      setEditedMessage(`You Have Successfully Edited your Profile ${name}`);
    } catch (error) {
      console.log(error);
      setEditedMessage("You have encountered an error");
    }
  };

  const handleToggle = () => {
    setEdit(true);
    setDisabled(false);
  };
  return (
    <div className="flex font-nunito">
      <Sidebar />
      <div className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to Faculty Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Use the sidebar to upload videos, view uploaded content, or manage
              branches.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col items-center bg-blue-50 py-4 md:py-8">
              {success && <h1 className="text-green-300">{editedMessage}.</h1>}
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                <img
                  src="/man.jpg"
                  alt="Faculty"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {name || "Faculty Name"}
              </h2>
              <p className="text-gray-500">Faculty</p>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-800 mb-6 pb-2 border-b">
                Personal Details
              </h3>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Name
                    </label>
                    <div className="flex space-x-2">
                      {edit ? (
                        <>
                          <input
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </>
                      ) : (
                        <>
                          <input
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            type="text"
                            value={name}
                            readOnly
                          />
                          <button
                            onClick={handleToggle}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          >
                            <SquarePen size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="collegeName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      College Name
                    </label>
                    <input
                      id="collegeName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      type="text"
                      readOnly
                      value="Malla Reddy Engineering College"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Role
                    </label>
                    <input
                      id="role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      type="text"
                      readOnly
                      value="Faculty"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="branches"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Teaching Branches
                    </label>
                    <input
                      id="branches"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      type="text"
                      readOnly
                      value="CSE, Cyber Security, Data Science"
                    />
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-200 w-full md:w-auto"
                  type="submit"
                  disabled={disabled}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
