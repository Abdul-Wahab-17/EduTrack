import { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css'
import { Link } from 'react-router-dom';

function Navbar(){
    const [ IsAuthenticated , setAuthenticated] = useState(false);
    useEffect(
        ()=>{
            axios.get('http://localhost:8080/auth/check' , { withCredentials :true} ,  )
            .then(
                (res)=>{
                    setAuthenticated(res.data.IsAuthenticated);
                }
            )
        }
    );
    return ( 
    <div className="navbar">
        <nav >
                <Link to='/'>Home</Link>
                <Link to='/dashboard'>Dashboard</Link>
                <Link to='/contact'>Contact</Link>

                { IsAuthenticated ?  <Link to='/logout'>Logout</Link> : <Link to='/login'>Login</Link> }
                
        
        </nav>
    </div>  
);
}

export default Navbar;