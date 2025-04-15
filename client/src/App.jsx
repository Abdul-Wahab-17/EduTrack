import { useState , useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Logout from './pages/logout'
import Login from './pages/login'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import Contact from './pages/contact'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Register from './pages/register'


function App()  {
  const [isAuthenticated, setAuthenticated] = useState(null);
  const [role , setRole] = useState("");
  const [username , setUsername] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8080/auth/check', { withCredentials: true })
      .then(res => {
        setAuthenticated(res.data.authenticated);
        setRole(res.data.user.role);
        setUsername(res.data.user.username);
      })
      .catch(() => setAuthenticated(false))
  }, []);


  return (
      <BrowserRouter>
          <Navbar isAuthenticated={isAuthenticated}  />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={ <Dashboard  isAuthenticated={isAuthenticated} role={role} username={username} setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername} /> }  />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername} />} />
              <Route path="/logout" element={<Logout setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername} />} />
             <Route path="/register" element={ <Register setAuthenticated={setAuthenticated} setRole={setRole} setUsername={setUsername}/>}/>
          </Routes>
          <Footer/>
      </BrowserRouter>
  );
}


export default App
