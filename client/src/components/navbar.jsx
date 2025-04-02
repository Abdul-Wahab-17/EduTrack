import { Link } from 'react-router-dom';
import '../index.css'

function Navbar({ isAuthenticated }) {
    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold">
                    My LMS
                </Link>

                {/* Navigation Links */}
                <div className="space-x-6">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                    <Link to="/contact" className="hover:text-gray-300">Contact</Link>

                    {/* Conditional Login/Logout Button */}
                    {isAuthenticated ? (
                        <Link to="/logout" className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-700">Logout</Link>
                    ) : (
                        <Link to="/login" className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-700">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
