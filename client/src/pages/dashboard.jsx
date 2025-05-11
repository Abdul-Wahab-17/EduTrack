import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "../components/student";
import Instructor from "../components/instructor";



function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const role = user?.role;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

//   // Socket registration
//   useEffect(() => {
//     if (isAuthenticated && username) {
//       socket.connect();
//       socket.on("connect", () => {
//         console.log("Connected to socket");
//         socket.emit("register", username);
//       });

//       return () => {
//         socket.disconnect();
//       };
//     }
//   }, [isAuthenticated, username]);

  // Dynamic component rendering
  let content;
  switch (role) {
    case "student":
      content = <StudentDashboard />;
      break;
    case "instructor":
      content = <Instructor />;
      break;
    default:
      content = null;
  }


  return <>{content}</>;
}

export default Dashboard;
