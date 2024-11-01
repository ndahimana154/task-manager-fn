import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import '../../assets/styles/Signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate()
  const handleSignin = async (e: any) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');

    if (!email) setEmailError('Email is required.');
    if (!password) setPasswordError('Password is required.');
    if (!email || !password) return;

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.data.token);
      toast.success('Signed in successfully!');
      setTimeout(() => {
        navigate("/home")
      },2000)
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="signup-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSignin}>
          <p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <span className="error">{emailError}</span>}
          </p>
          <p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <span className="error">{passwordError}</span>}
          </p>
          <button type="submit">Sign In</button>
          <div className="links">
            <p>
              Don't have an account?
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signin;
