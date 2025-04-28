import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Logout from './pages/logout';
import Login from './pages/login';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Contact from './pages/contact';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Register from './pages/register';
import ChatPage from './pages/ChatPage';
import ChatRoom from './pages/ChatRoom';
import CourseList from './pages/CourseList';
import CreateCourse from './pages/CreateCourse';
import CourseDetail from './pages/CourseDetail';
import UploadFile from './pages/UploadFile';
import ViewContent from './pages/viewContent';
import Broadcast from './pages/Broadcast';
import Watch from './pages/watch';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(null);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8080/auth/check', { withCredentials: true })
      .then(res => {
        setAuthenticated(res.data.authenticated);
        setRole(res.data.user.role);
        setUsername(res.data.user.username);
      })
      .catch(() => setAuthenticated(false));
  }, []);

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} role={role} />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={isAuthenticated ?  <Dashboard isAuthenticated={isAuthenticated} role={role} username={username} setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername} /> :  <Login setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername} />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/chat" element={isAuthenticated ? <ChatPage username={username} /> : <Login />} />

        <Route path="/chat/:recipient" element={isAuthenticated ? <ChatRoom username={username} /> :  <Login setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername} />} />
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername} />} />
        <Route path="/logout" element={<Logout setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername} />} />
        <Route path="/register" element={<Register role={role} username={username} setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername} />} />
        <Route path="/courses" element={<CourseList username={username} role={role} />} />
        <Route path="/courses/create" element={<CreateCourse role={role} username={username} />} />
        <Route path="/courses/:id" element={<CourseDetail role={role} />} />
        <Route path="/courses/:id/content/create" element={<UploadFile />} />
        <Route path="/courses/:id/content/:contentId" element={<ViewContent />} />


        <Route path="broadcast" element={<Broadcast role={role} username={username}/>}/>
        <Route path="watch" element={ <Watch />}/>


      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
