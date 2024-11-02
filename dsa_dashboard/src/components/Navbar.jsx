import React from "react";
import { useNavigate } from 'react-router-dom';
import './styles/navbar.css';
import axios from 'axios';
import { toast } from 'react-toastify';
function Navbar() {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await axios.post('https://seven5daysdsa-1.onrender.com/logout',{withCredentials: true,});
      if (response.data===true){
        toast.success('Logging out.....', { autoClose: 1000 });
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 1100);
      }else{
        return toast.error(`${response.data}`, { autoClose: 1000 });
      }
       
      
    } catch (error) {
      return toast.error(`${error}`, { autoClose: 1000 });
    }
  };

  return (
    <div className="navbar_container">
      <div className="nav_item">
        <img className="logo" src="https://cdn.codechef.com/images/cc-logo.svg" alt="CodeChef Logo" />
        <div className="title">DDSA 2.0</div>
      </div>
      <div className="nav_item">
        <button className="btn" onClick={handleClick}>Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
