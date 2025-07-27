import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FacultyProtected = ({ Component }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token && !role) {
      navigate("/");
    }

    if (role !== "EMPLOYEE") {
      navigate("/");
    }
  },[]);
  return <>{Component}</>;
};

export default FacultyProtected;
