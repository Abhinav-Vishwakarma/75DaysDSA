import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true });
            
            if (response.data === true) {
                toast.success('Login successful! Redirecting...', { autoClose: 1000 });
                setTimeout(() => {
                    navigate('/dashboard'); // Use navigate instead of window.location
                }, 1100);
            } else {
                toast.error('Incorrect Username or Password!', { autoClose: 2000 });
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            toast.error(errorMessage, { autoClose: 2000 });
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form className="form_container" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username state on input change
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state on input change
                        required
                    />
                </div>
                <button type="submit" className="btn">Login</button>
                <p>Don’t have an account? <Link to='/register'>Register Here!</Link></p>
            </form>
        </div>
    );
}

export default Login;
