import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow-md px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="https://beessoftware.cloud/SupportSystemsBees/images/logo123.png" alt="logo" className="w-12 h-12 md:w-16 md:h-16" />
          <span className="text-xl md:text-2xl font-bold text-blue-600">Cloudilya LMS</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"
          }>
            Home
          </NavLink>

          <NavLink to="/features" className="hover:text-blue-500">Features</NavLink>

          <NavLink to="/solutions" className="hover:text-blue-500">Solutions</NavLink>

          {/* <NavLink to="/pricing" className="hover:text-blue-500">Pricing</NavLink> */}

          <NavLink to="/contact" className="hover:text-blue-500">Contact</NavLink>
        </div>

        {/* Actions */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/auth/login"
            className="text-gray-800 px-4 py-2 hover:text-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="text-gray-800 px-4 py-2 hover:text-blue-600 transition"
          >
            Sign Up
          </Link>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Request Demo
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={handleToggle} className="md:hidden">
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-20 right-0 bg-white shadow-lg w-72 h-auto z-40 p-6 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col space-y-4">
          <NavLink to="/" className="hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/features" className="hover:text-blue-600" onClick={() => setIsOpen(false)}>Features</NavLink>
          <NavLink to="/solutions" className="hover:text-blue-600" onClick={() => setIsOpen(false)}>Solutions</NavLink>
          <NavLink to="/pricing" className="hover:text-blue-600" onClick={() => setIsOpen(false)}>Pricing</NavLink>
          <NavLink to="/contact" className="hover:text-blue-600" onClick={() => setIsOpen(false)}>Contact</NavLink>
          <hr className="border-gray-300" />
          <Link to="/auth/login" className="hover:text-blue-600" onClick={() => setIsOpen(false)}>Login</Link>
          <Link
            to="/demo"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition"
            onClick={() => setIsOpen(false)}
          >
            Request Demo
          </Link>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8">
          <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-fadeIn border border-gray-300">

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Request a Demo</h2>
            <p className="text-sm text-gray-500 mb-6">
              Fill out the form below and our team will reach out to schedule your demo.
            </p>

            {/* Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input type="text" required placeholder="John Doe"
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input type="email" required placeholder="john@university.edu"
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Institution / Organization *</label>
                <input type="text" required placeholder="ABC University"
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input type="text" placeholder="Professor / Principal / Coordinator"
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number (optional)</label>
                <input type="tel" placeholder="+91-9876543210"
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message / Requirements</label>
                <textarea placeholder="Let us know what you're looking for..."
                  rows={3}
                  className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}


    </>
  );
};

export default Navbar;
