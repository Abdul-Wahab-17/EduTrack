import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout()
      .then(() => {
        console.log("Logged out successfully");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
