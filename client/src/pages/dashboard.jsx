import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Student from '../components/student';
import Instructor  from "../components/instructor";
import Admin from "../components/Admin";
import axios from "axios";

function Dashboard({isAuthenticated ,role , username}) {
  
    const navigate = useNavigate();
   
    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);
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
