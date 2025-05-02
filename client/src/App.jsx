import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Logout from './pages/logout';
import Login from './pages/login';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import About from './pages/About';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Register from './pages/register';
import CourseList from './pages/CourseList';
import CreateCourse from './pages/CreateCourse';
import CourseDetail from './pages/CourseDetail';
import { AuthProvider, useAuth } from './context/AuthContext';
import ViewContent from './pages/viewContent';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/create" element={<CreateCourse />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="courses/:courseId/content/:contentId" element={<ViewContent />}/>

      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
