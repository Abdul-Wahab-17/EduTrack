import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LockClosedIcon } from "@heroicons/react/24/outline";

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
  <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-lg">
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
        <LockClosedIcon className="h-6 w-6 text-indigo-600" />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        Are you sure you want to logout?
      </h2>
    </div>
    <div className="flex justify-center space-x-4">
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 hover:shadow-md"
      >
        Logout
      </button>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-200 hover:shadow-md"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

  );
}

export default Logout;
