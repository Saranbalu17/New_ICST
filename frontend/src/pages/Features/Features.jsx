import { Link } from "react-router-dom";
import Navbar from "../../Components/navbar/Navbar";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Features = () => {
  return (
    <>
    <Navbar/>
    <div className="pt-20">
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Cloudilya LMS Features
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Management</h2>
            <p className="text-gray-600 mb-4">
              Create, manage, and distribute courses with ease using our intuitive course builder.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Drag-and-drop course creation</li>
              <li>Support for multimedia content</li>
              <li>Customizable learning paths</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interactive Assessments</h2>
            <p className="text-gray-600 mb-4">
              Engage students with quizzes, assignments, and interactive assessments.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Automated grading</li>
              <li>Custom question types</li>
              <li>Real-time feedback</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Collaboration Tools</h2>
            <p className="text-gray-600 mb-4">
              Foster interaction with integrated discussion forums and group projects.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Real-time chat and forums</li>
              <li>Group assignment features</li>
              <li>Peer review capabilities</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mobile Accessibility</h2>
            <p className="text-gray-600 mb-4">
              Access Cloudilya LMS on the go with our fully responsive mobile app.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>iOS and Android support</li>
              <li>Offline content access</li>
              <li>Push notifications</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Request a Demo
          </Link>
        </div>
      </section>
      
    </div>
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
              <li><Link to="/" className="hover:text-blue-300">Courses</Link></li>
              <li><Link to="/" className="hover:text-blue-300">Academic Calendar</Link></li>
              <li><Link to="/" className="hover:text-blue-300">Digital Library</Link></li>
              <li><Link to="/" className="hover:text-blue-300">Help Desk</Link></li>
              <li><Link to="/" className="hover:text-blue-300">Contact</Link></li>
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
    </>
  );
};

export default Features;