import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";


// Lazy-loaded components
const Landing = lazy(() => import("./pages/Landing/Landing"));
const Signup = lazy(() => import("./pages/Registeration/Register"));
const Login = lazy(() => import("./pages/Login/Login"));
const FacultyDashboard = lazy(() => import("./pages/FacultyFiles/FacultyDashboard/FacultyDashboard"));
const UploadVideo = lazy(() => import("./pages/VideoUpload/VideoUpload"));
const UploadedContent = lazy(() => import("./pages/VideoContent/VideoContent"));
const AdminDashboard = lazy(() => import("./pages/AdminFiles/AdminDashboard/AdminDashboard"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard/StudentDashboard"));
const TestPage = lazy(() => import("./TestPage"));
const ResultsPage = lazy(() => import("./ResultsPage"));
const FacultyCard = lazy(() => import("./FacultyCard"));
const Videos = lazy(() => import("./pages/AdminFiles/Admin/Videos"));
const User = lazy(() => import("./pages/AdminFiles/Admin/User"));
const AdminFaculty = lazy(() => import("./pages/AdminFiles/Admin/AdminFaculty"));
const AdminUploadContent = lazy(() => import("./pages/AdminFiles/Admin/AdminUploadContent"));
const Chat = lazy(() => import("./chat/Chat"));
const BilldeskGateway = lazy(() => import("./pages/PaymentGateway/BilldeskGateway"));
const BilldeskStatus = lazy(() => import("./pages/BilldeskStatus/BilldeskStatus"));
const Studentleaning = lazy(() => import("./pages/Studentleaning/Studentleaning"));
const Features = lazy(() => import("./pages/Features/Features"));
const Solutions = lazy(() => import("./pages/Solutions/Solutions"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const PreAssessment = lazy(() => import("./pages/PreAssessment/PreAssessment"));


const App = () => {
  return (
 
      <Router>
        <Suspense fallback={<div className="text-center mt-10 text-lg">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
            <Route path="/upload-video" element={<UploadVideo />} />
            <Route path="/uploaded-content" element={<FacultyCard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/course/:id" element={<UploadedContent />} />
            <Route path="/test/:testId" element={<TestPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/view/all/videos" element={<Videos />} />
            <Route path="/view-students" element={<User />} />
            <Route path="/view-faculty" element={<AdminFaculty />} />
            <Route path="/upload-admin" element={<AdminUploadContent />} />
            <Route path="/chat/:teacherId" element={<Chat />} />
            <Route path="/payment-gateway" element={<BilldeskGateway />} />
            <Route path="/billdeskstatus" element={<BilldeskStatus />} />
            <Route path="/student-leaning" element={<Studentleaning />} />
            <Route path="/features" element={<Features />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/assessment" element={<PreAssessment />} />
          </Routes>
        </Suspense>
      </Router>
    
  );
};

export default App;
