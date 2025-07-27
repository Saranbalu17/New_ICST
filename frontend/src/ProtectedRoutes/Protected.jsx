import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ Component }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    // if (!token && !role) {
    //   navigate("/");
    // }

    // if (role !== "STUDENT") {
    //   navigate("/");
    // }
  }, []);
  return <>{Component}</>;
};

export default Protected;
