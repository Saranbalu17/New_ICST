import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../Components/navbar/Navbar";
import { MoveRight, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-blue-50 font-nunito">
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-20 pb-10 gap-10">
        {/* Text & CTA */}
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Welcome to the Future of Learning
          </h1>
          <p className="text-lg text-gray-600">
            Discover an intelligent, connected, and immersive education experience. Our LMS bridges digital innovation and academic excellence.
          </p>
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center justify-between w-full md:w-96 hover:shadow-2xl transition-all duration-300">
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">Start your journey today</h2>
              <p className="text-sm text-gray-500">Browse expert-curated courses</p>
            </div>
            <button
              onClick={() => navigate("/auth/login")}
              className="ml-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center space-x-1 transition-all"
            >
              <span>Explore</span>
              <MoveRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image / Illustration */}
        <div className="w-full mt-20 max-w-md md:max-w-lg lg:max-w-xl animate-fadeIn">
          <img
            src="/lms.jpg"
            alt="LMS Illustration"
            className="w-full h-auto object-cover drop-shadow-xl"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-6 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* About */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-blue-400">About Our LMS</h2>
            <p className="text-sm leading-relaxed text-gray-300">
              Our platform provides a unified digital campus experience. We combine powerful tools, personalized learning paths, and collaborative features to make learning seamless and inspiring.
            </p>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-blue-400">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-blue-300">Courses</Link></li>
              <li><Link to="/calendar" className="hover:text-blue-300">Academic Calendar</Link></li>
              <li><Link to="/library" className="hover:text-blue-300">Digital Library</Link></li>
              <li><Link to="/support" className="hover:text-blue-300">Help Desk</Link></li>
              <li><Link to="/contact" className="hover:text-blue-300">Contact</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h2 className="text-xl font-bold mb-3 text-blue-400">Contact Us</h2>
            <p className="text-sm text-gray-300">Digital Learning Office</p>
            <p className="text-sm text-gray-300">📞 +91-9876543210</p>
            <p className="text-sm text-gray-300">✉️ support@yourcollege.edu</p>

            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-blue-500"><Facebook /></a>
              <a href="#" className="hover:text-blue-400"><Twitter /></a>
              <a href="#" className="hover:text-blue-300"><Linkedin /></a>
              <a href="#" className="hover:text-pink-400"><Instagram /></a>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-4">
          © 2025 Your Institution Name. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
