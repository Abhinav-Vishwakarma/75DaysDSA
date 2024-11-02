import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Loader function for the Dashboard
// const dashboardLoader = async () => {
//   try {
//     const response = await axios.get('http://localhost:5000/api/authentication', {
//       withCredentials: true, // Include cookies with the request
//     });

//     if (response.data.match) {
//       // User ID matches, allow access to the Dashboard
//       return null; // Returning null allows the Dashboard component to render
//     } else {
//       // User ID does not match, redirect to Login
//       return redirect('/login');
//     }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return redirect('/login'); // Redirect on error
//   }
// };

// Define routes with the loader for the Dashboard
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    // loader: dashboardLoader, // Use loader for this route
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />, // Assuming you have a Login component
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);

// Performance reporting
reportWebVitals();
