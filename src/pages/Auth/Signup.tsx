import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import '../../assets/styles/Signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    // const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e: any) => {
        e.preventDefault();

        setEmailError('');
        setPasswordError('');

        if (!email) setEmailError('Email is required.');
        if (!password) setPasswordError('Password is required.');
        if (!email || !password) return;

        try {
            await axiosInstance.post('api/auth/register', {
                email,
                password,
            });

            // setSuccessMessage('Account created successfully!');
            toast.success('Account created successfully!');
            setTimeout(() => {
                navigate("/login")
            }, 2000)
        } catch (error: any) {
            // setSuccessMessage('');
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
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
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
                    <button type="submit">Create Account</button>
                    {/* {successMessage && <p className="success">{successMessage}</p>} */}
                    <div className="links">
                        <p>
                            Already have an account?
                            <a href="/">Sign In</a>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Signup;
