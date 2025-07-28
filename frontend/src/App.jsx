import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";




// Lazy-loaded components
const Landing = lazy(() => import("./pages/Landing/Landing"));
const Signup = lazy(() => import("./pages/Registeration/Register"));
const Login = lazy(() => import("./pages/Login/Login"));
const UploadedContent = lazy(() => import("./pages/VideoContent/VideoContent"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard/StudentDashboard"));
const BilldeskGateway = lazy(() => import("./pages/PaymentGateway/BilldeskGateway"));
const BilldeskStatus = lazy(() => import("./pages/BilldeskStatus/BilldeskStatus"));
const Studentleaning = lazy(() => import("./pages/Studentleaning/Studentleaning"));
const Features = lazy(() => import("./pages/Features/Features"));
const Solutions = lazy(() => import("./pages/Solutions/Solutions"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const FeedBackCard=lazy(()=>import("./pages/FeedBackCard/FeedBackCard"))


const App = () => {
  return (
 
      <Router>
        <Suspense fallback={<div className="text-center mt-10 text-lg">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/course/:id" element={<UploadedContent />} />
            <Route path="/payment-gateway" element={<BilldeskGateway />} />
            <Route path="/billdeskstatus" element={<BilldeskStatus />} />
            <Route path="/student-leaning" element={<Studentleaning />} />
            <Route path="/features" element={<Features />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/preAssessment" element={<FeedBackCard />} />
          </Routes>
        </Suspense>
      </Router>
    
  );
};

export default App;
