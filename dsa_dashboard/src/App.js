// import { Link } from "react-router-dom";
// import { useState } from "react";

// function App() {
//   const [profileImage, setProfileImage] = useState(null);

//   // Function to handle image upload
//   const handleImageUpload = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("profileImage", profileImage);

//     try {
//       const response = await fetch("http://localhost:5000/upload-profile", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         console.log("Image uploaded successfully:", data);
//       } else {
//         console.error("Error uploading image:", data.message);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div>
//       <form method="POST" action="http://localhost:5000/login">
//         <input type="text" required name="username" placeholder="Username" />
//         <input type="password" required name="password" placeholder="Password" />
//         <button type="submit">Login</button>
//       </form>
//       <form method="POST" action="http://localhost:5000/register">
//         <input type="text" required name="username" placeholder="Username" />
//         <input type="password" required name="password" placeholder="Password" />
//         <button type="submit">Register</button>
//       </form>
//       <form method="POST" action="http://localhost:5000/logout">
//         <button type="submit">Logout</button>
//       </form>
//       <form method="POST" action="http://localhost:5000/upload-profile" encType="multipart/form-data">
//     <input type="file" name="profileImage" required />
//     <button type="submit">Upload Profile Image</button>
//       </form>
//     </div>
//   );
// }

// export default App;

import React from "react";
import './App.css';
import Login from "./components/Login";
import Leaderboard from "./components/Leaderboard";


function App(){
  return(
    <div className="body_container">
      <Leaderboard/>
      <Login/>
    </div>  
  );
}

export default App;




