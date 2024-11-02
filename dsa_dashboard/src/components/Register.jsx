import React, { useState,} from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../../node_modules/react-toastify/dist/ReactToastify.css'
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(''); // Clear any previous error messages

    // Clear previous timeout if the user keeps typing
    if (typingTimeout) clearTimeout(typingTimeout);

    // Set new timeout to check uniqueness after typing stops
    setTypingTimeout(
      setTimeout(async () => {
        try {
          const response = await axios.get('http://localhost:5000/check-username', {
            params: { username: value }
          },{withCredentials: true,});
          if (response.data.status) {
            setUsernameError('**Username is already taken.');
          }else{
            setUsernameError('**Username is available.');
          }
        } catch (error) {
          console.error('Error checking username uniqueness:', error);
        }
      }, 500) // Check after 500ms of no typing
    );
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Clear error message
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
    setError(''); // Clear error message
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    // console.log(username,password);
    try{
        const result = await axios.post('http://localhost:5000/register', { username, password });
        if(result.data){
          toast.success('You have successfully registered! Redirecting...', { autoClose: 2000 });
          setTimeout(() => {
            window.location.href = '/'; 
          }, 2100);
        }else{
          toast.error('Registration failed. Please try again.',{ autoClose: 2000 });
        }
      }
        
    catch(err){
            console.log(err);
            toast.error('Registration failed. Please try again.',{ autoClose: 2000 });
        }
    };

  // Determine the border color based on password match
  const passwordMatch = password === repeatPassword;
  const passwordInputStyle = passwordMatch ? { border: '2px solid green' } : { border: '2px solid red' };
  const repeatPasswordInputStyle = passwordMatch ? { border: '2px solid green' } : { border: '2px solid red' };

  return (
    <div className='body_container'>
      
      <div className="container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="form_container">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
            {usernameError && <span className="error">{usernameError}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
              style={passwordInputStyle} // Apply dynamic style
            />
          </div>
          <div className="input-group">
            <label htmlFor="repeat_password">Re-enter Password</label>
            <input
              type="password"
              id="R_password"
              name="R_password"
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
              required
              style={repeatPasswordInputStyle} // Apply dynamic style
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn">Register</button>
          <p>Already have an account? <Link to='/'>Login here!</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Register;
