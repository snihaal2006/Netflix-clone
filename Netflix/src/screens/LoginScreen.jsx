import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axios';
import './LoginScreen.css';

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/login', {
                email,
                password
            });
            if (response.data) {
                // Login success
                console.log("Logged in:", response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="loginScreen">
            <div className="loginScreen__background">
                <img
                    className="loginScreen__logo"
                    src="/images/Netflix-Logo-500x281.webp"
                    alt="Netflix Logo"
                />
                <button
                    onClick={() => navigate('/signup')}
                    className="loginScreen__button"
                >
                    Sign Up
                </button>
                <div className="loginScreen__gradient" />
            </div>

            <div className="loginScreen__body">
                <div className="loginScreen__form">
                    <h1>Sign In</h1>
                    {error && <p className="loginScreen__error">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <input
                            placeholder="Email or mobile number"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Sign In</button>

                        <div className="loginScreen__extras">
                            <label>
                                <input type="checkbox" defaultChecked /> Remember me
                            </label>
                            <span>Need help?</span>
                        </div>
                    </form>

                    <div className="loginScreen__text">
                        <span>New to Netflix? </span>
                        <Link to="/signup" className="loginScreen__link">Sign up now.</Link>
                    </div>
                    <div className="loginScreen__recaptcha">
                        <p>This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="#">Learn more.</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen;
