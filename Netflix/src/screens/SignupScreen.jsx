import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axios';
import './SignupScreen.css';

function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/auth/signup', {
                email,
                password,
                username: email.split('@')[0] // Default username from email
            });
            if (response.data) {
                // Signup success, redirect to login
                console.log("Signed up:", response.data);
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            setError("Signup failed. Email may be already in use.");
        }
    };

    return (
        <div className="signupScreen">
            <div className="signupScreen__background">
                <img
                    className="signupScreen__logo"
                    src="/images/Netflix-Logo-500x281.webp"
                    alt="Netflix Logo"
                />
                <button
                    onClick={() => navigate('/login')}
                    className="signupScreen__button"
                >
                    Sign In
                </button>
                <div className="signupScreen__gradient" />
            </div>

            <div className="signupScreen__body">
                <div className="signupScreen__form">
                    <h1>Sign Up</h1>
                    {error && <p className="signupScreen__error">{error}</p>}
                    <form onSubmit={handleSignup}>
                        <input
                            placeholder="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            placeholder="Type a Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            placeholder="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign Up</button>
                    </form>

                    <div className="signupScreen__text">
                        <span>Already have an account? </span>
                        <Link to="/login" className="signupScreen__link">Sign in now.</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupScreen;
