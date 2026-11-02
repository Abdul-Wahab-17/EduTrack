import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import '../index.css';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          profileButtonRef.current &&
          !profileButtonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="bg-white/90 backdrop-blur border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:inline">EduTrack</span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 text-sm font-medium">
              Courses
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 text-sm font-medium">
              About
            </Link>

            {isAuthenticated ? (
              <div className="ml-1 sm:ml-3 relative">
                <button
                  ref={profileButtonRef}
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  id="user-menu"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <Avatar src={user?.profilePic} name={user?.displayName || user?.username || 'User'} className="h-8 w-8 text-sm" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {user?.username || 'Account'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    ref={dropdownRef}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email || "No email"}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/logout"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-2 sm:px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-300"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;