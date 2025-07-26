import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext/AuthContext";
import Sidebar from "../../../Components/Sidebar/Sidebar";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [branchesInput, setBranchesInput] = useState(""); // New state for branch input string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Split the branches input into an array, trim whitespace, and filter out empty entries
    const branches = branchesInput
      .split(",")
      .map((branch) => branch.trim())
      .filter((branch) => branch.length > 0);

    // Validate that at least one branch is entered
    if (branches.length === 0) {
      setError(
        "Please enter at least one branch for the faculty (e.g., CSE, AIML)."
      );
      setLoading(false);
      return;
    }

    try {
      // Simulate backend call with dummy data for testing
      console.log("Creating faculty with data:", {
        username,
        password,
        name,
        branches,
      });

      // Uncomment the following lines when integrating with backend
      // await axios.post('/admin/create-faculty', { username, password, name, branches }, {
      //   headers: { Authorization: token }
      // });

      setSuccess("Faculty created successfully");
      setUsername("");
      setPassword("");
      setName("");
      setBranchesInput(""); // Reset the branches input
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create faculty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <h1 className="text-2xl font-bold pb-5">Create Faculty</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <form className="md:w-1/2 w-full" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="input"
            type="text"
            placeholder="Faculty Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input"
            type="text"
            placeholder="Branches (e.g., CSE, AIML, ECE)"
            value={branchesInput}
            onChange={(e) => setBranchesInput(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Faculty"}
          </button>
        </form>
        <p style={{ color: "#555", marginTop: "10px" }}>
          <b>Note: </b> Enter branches separated by commas (e.g., CSE, AIML).
        </p>
      </div>
    </>
  );
};

export default Admin;
