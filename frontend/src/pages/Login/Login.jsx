import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Read from .env
const baseUrl = import.meta.env.VITE_BASE_API_URL;
const grpCode = import.meta.env.VITE_GRP_CODE;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleToggle = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/LMS/LMS_Login`, {
        grpCode,
        username: username.trim(),
        password: password.trim(),
      });

      const userDetails = response?.data?.listofResponseLogin;
      if (!userDetails || userDetails.length === 0) {
        setError("Invalid credentials");
        return;
      }

      const { userType, adminUserId, userName, colCode, colId,preAssessmentName,PreAssessment } = userDetails[0];
   
      // Store user data
      localStorage.setItem(
        "userData",
        JSON.stringify({ userType, adminUserId, userName, colCode, colId })
      );

     if (preAssessmentName?.toLowerCase() === "no") {
  navigate("/preAssessment", {
    state: {
      adminUserId: adminUserId,
      PreAssessment: PreAssessment
    }
  });
  return;
}

      // Navigate based on role
      switch (userType) {
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        case "EMPLOYEE":
          navigate("/faculty-dashboard");
          break;
        case "STUDENT":
        case "EXTERNAL STUDENT":
          navigate("/student-dashboard");
          break;
        default:
          setError("Unauthorized role");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 font-nunito px-4">
      <div className="bg-white shadow-2xl rounded-2xl px-6 py-8 max-w-sm w-full space-y-6">
        <div className="text-center">
          <img src="/bees.png" alt="logo" className="mx-auto mb-4 w-24" />
          <h2 className="text-xl font-semibold">Welcome Back</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm text-gray-600">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="absolute top-9 right-3">
              <button type="button" onClick={handleToggle}>
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-100 text-red-800 px-3 py-2 rounded-md border border-red-300 animate-fade-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-1.414 1.414A9 9 0 105.636 18.364l1.414-1.414A7 7 0 1116.95 7.05l1.414-1.414z"
                />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="text-center space-x-4 text-sm">
          <Link
            to="/auth/signup"
            className="underline text-gray-600 hover:text-blue-500 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
