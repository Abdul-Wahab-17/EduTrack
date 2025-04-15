import {  useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import Student from '../components/student';
import Instructor  from "../components/instructor";
import Admin from "../components/Admin";
import { io} from "socket.io-client";
import axios from "axios";

const socket = io(`http://localhost:8080`);

function Dashboard({isAuthenticated ,role , username , setAuthenticated ,setRole , setUsername}) {

    
  
    const navigate = useNavigate();

    useEffect(()=>{
        socket.on(`connect` , ()=>{
            console.log(`user connected`);
        })
    })
   
    useEffect(()=>{
        axios.get("http://localhost:8080/auth/check", { withCredentials: true })
        .then((res) => {
            setAuthenticated(res.data.authenticated);
    setRole(res.data.user.role);
    setUsername(res.data.user.username);
        })
        .catch(err => {
            console.error( err);
        });
    })

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);
    

    
    let content;
    switch (role){
      
        case 'student':
            content = <Student />;
            break;
        case 'instructor':
            content = <Instructor />;
            break;
        case 'admin':
            content = <Admin />
            break;
    }
   
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <h1 className="text-3xl font-semibold text-gray-800">
                Welcome to the Dashboard, {username} <br />
                
            </h1>
            {content}
        </div>
    );
}

export default Dashboard;
