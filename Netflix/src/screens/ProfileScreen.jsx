import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import Nav from '../components/Nav';
import './ProfileScreen.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

function ProfileScreen() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [avatarKey, setAvatarKey] = useState(Date.now()); // to force refresh image

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setUser(u);
            setName(u.username || '');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleSignOut = () => {
        localStorage.removeItem('user');
        navigate('/login');
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Update Name
            const res = await axios.put(`/users/${user.id}`, { username: name });
            const updatedUser = { ...user, username: res.data.username };
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
            alert("Profile saved!");
        } catch (error) {
            console.error(error);
            alert("Error saving profile");
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`/users/${user.id}/picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setAvatarKey(Date.now()); // Force re-render of image
            alert("Avatar updated!");
        } catch (error) {
            console.error(error);
            alert("Error uploading avatar");
        }
    }

    if (!user) return null;

    return (
        <div className="profileScreen">
            <Nav />
            <div className="profileScreen__body">
                <h1>Edit Profile</h1>
                <div className="profileScreen__info">
                    <div className="profileScreen__avatarContainer">
                        <img
                            src={`${API_URL}/users/${user.id}/picture?key=${avatarKey}`}
                            alt="Avatar"
                            onError={(e) => e.target.src = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
                        />
                        <label htmlFor="file-upload" className="custom-file-upload">
                            Change Avatar
                        </label>
                        <input id="file-upload" type="file" onChange={handleFileChange} />
                    </div>

                    <div className="profileScreen__details">
                        <h2>{user.email}</h2>
                        <div className="profileScreen__plans">
                            <h3>Profile Name</h3>
                            <form onSubmit={handleSave} className="profileScreen__form">
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="profileScreen__input"
                                />
                                <button type="submit" className="profileScreen__save">Save</button>
                            </form>

                            <button
                                onClick={handleSignOut}
                                className="profileScreen__signOut"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileScreen;
