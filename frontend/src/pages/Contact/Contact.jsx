import { useState } from "react";
import Navbar from "../../Components/navbar/Navbar";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send to API)
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
    <Navbar/>
    <div className="pt-20">
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Contact Us
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-4">
              Have questions or need assistance? Our team is here to help you with Cloudilya LMS.
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Email:</strong> support@cloudilya.com
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Phone:</strong> +1-800-123-4567
            </p>
            <p className="text-gray-600">
              <strong>Address:</strong> 123 Learning Lane, Education City, USA
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@university.edu"
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we assist you?"
                  rows={5}
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
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
    </>
  );
};

export default Contact;