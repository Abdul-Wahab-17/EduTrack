import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Logout from './pages/logout';
import Login from './pages/login';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import About from './pages/About';
import Navbar from './components/navbar';
import Footer from './components/footer';
import CourseList from './pages/CourseList';
import CreateCourse from './pages/CreateCourse';
import CourseDetail from './pages/CourseDetail';
import { AuthProvider, useAuth } from './context/AuthContext';
import ViewContent from './pages/viewContent';
import UploadFile from './pages/UploadFile';
import EditCourseForm from './pages/editCourse';
import QuizManagement from './pages/QuizManagement';
import UploadQuiz from './pages/UploadQuiz';
import SolveQuizView from './pages/SolveQuizView';
import ViewAllQuizzes from './pages/ViewAllQuizzes';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Logout />} />
        <Route path="/logout"  element={isAuthenticated ? <Logout /> : <Login />}  />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/create" element={<CreateCourse />} />
        <Route path="/courses/:courseId/content/create" element={<UploadFile />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="courses/:courseId/content/:contentId" element={<ViewContent />}/>
        <Route path="/course/:courseId/quiz" element={<QuizManagement />}/>
        <Route path="/courses/:courseId/edit" element={<EditCourseForm />}/>
        <Route path="/course/:courseId/quiz/upload" element={<UploadQuiz />} />
        <Route path="/courses/:courseId/quiz/:quizId" element={<SolveQuizView />}/>
        <Route path="/course/:courseId/quizzes" element={<ViewAllQuizzes />} />

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
