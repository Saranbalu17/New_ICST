import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext/AuthContext";
import axios from 'axios'
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const grpCode = 'devprod'
  const handleToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      setError("");
      setSuccess("");
      const response = await axios.post('https://beesprod.beessoftware.cloud/CloudilyaAPILMS/LMS/LMS_Login', { grpCode, username, password })
      if (response.status === 200) {
        const userDetails= response.data.listofResponseLogin
        console.log(userDetails)
        const {userType}=userDetails[0]
        const {adminUserId}=userDetails[0]
       localStorage.setItem('userName',userDetails[0].userName)
        login(1, userType,adminUserId)
        if (userType === 'ADMIN') {
          navigate('/admin-dashboard')
        }
        if(userType==='STUDENT' || userType==='EXTERNAL STUDENT'){
          navigate('/student-dashboard')
        }
        if(userType==='EMPLOYEE'){
           navigate('/faculty-dashboard')
        }
      }

      // const facultyData = dummyData.faculty;

      // if (
      //   username !== facultyData.username ||
      //   password !== facultyData.password
      // ) {
      //   setError("You have entered wrong credentials");
      //   setIsLoading(false);
      //   return;
      // }

      // const token = facultyData.token;
      // const role = facultyData.role;
      //   const findEmployee=employees.find((employee)=>employee.username===username)
      //  if(findEmployee){
      //   if(findEmployee.password===password){
      //     if(findEmployee.role==='student'){

      //       navigate('/student-dashboard')
      //     }
      //     else if(findEmployee.role==='faculty'){
      //       navigate('/faculty-dashboard')
      //     }
      //     else{
      //       navigate('/admin-dashboard')
      //     }
      //     localStorage.setItem('username',username)
      //      login(findEmployee.token, findEmployee.role);
      //   }
      //   else{
      //     setError('password is wrong')
      //   }



      // setTimeout(() => {
      //   if(role==="faculty"){
      //     navigate("/faculty-dashboard");
      //   }
      //   return
      // }, 1000);

      // setUsername("");
      // setPassword("");
    } catch (error) {
      console.log(error);
      setError("Something went wrong with the server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-evenly min-h-screen w-screen font-nunito">
      <div className="bg-white px-4 py-2 shadow-2xl flex-col flex items-center space-y-7 h-120 w-120">
        <div>
          <img src="/bees.png" alt="logo" />
        </div>
        <form
          className="flex flex-col space-y-3 w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <span>Username</span>
            <input
              className="input border-2 border-gray-300 py-1 px-1"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col relative">
            <span>Password</span>
            <input
              className="input border-2 border-gray-300 py-1 px-1 relative"
              type={!showPassword ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="absolute right-1 top-8">
              <button type="button" onClick={handleToggle}>
                {!showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {success && <div className="text-green-500 text-sm">{success}</div>}

          <div className="bg-blue-500 w-full text-center px-2 py-2 rounded-md">
            <button
              className="text-white w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        <div>
          <Link
            to="#"
            className="underline text-black hover:text-blue-500 transition-all ease-in-out duration-150"
          >
            Forgot password?
          </Link>
          <Link
            to="/auth/signup"
            className="underline text-black hover:text-blue-500 transition-all ease-in-out duration-150"
          >
           SignUp
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
