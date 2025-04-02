import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated }) {
    return (
        <div className="navbar">
            <nav>
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/contact">Contact</Link>

                {isAuthenticated ? (
                    <Link to="/logout">Logout</Link>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
        </div>
    );
}

export default Navbar;
