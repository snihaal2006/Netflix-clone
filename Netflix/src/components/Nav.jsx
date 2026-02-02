import React, { useEffect, useState } from "react";
import "./Nav.css";

import { useNavigate } from "react-router-dom";

function Nav() {
    const [show, handleShow] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleScroll = () => {
            if (window.scrollY > 100) {
                handleShow(true);
            } else {
                handleShow(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={`nav ${show && "nav__black"}`}>
            <div className="nav__left">
                <img
                    className="nav__logo"
                    src="/images/Netflix-Logo-500x281.webp"
                    alt="Netflix Logo"
                    onClick={() => navigate('/')}
                />
                <div className="nav__links">
                    <span onClick={() => navigate('/')}>Home</span>
                    <span>TV Shows</span>
                    <span>Movies</span>
                    <span>New & Popular</span>
                    <span>My List</span>
                </div>
            </div>

            <div className="nav__right">
                {user ? (
                    <img
                        className="nav__avatar"
                        src={`http://localhost:8081/api/users/${user.id}/picture`}
                        alt="Avatar"
                        onClick={() => navigate('/profile')}
                        onError={(e) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
                    />
                ) : (
                    <button
                        className="nav__signInButton"
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </div>
    );
}

export default Nav;
