import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "./Banner.css";
import { FaPlay } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { GoMute, GoUnmute } from "react-icons/go";
import MovieModal from "./MovieModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

function Banner() {
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch all movies and pick one randomly
                const request = await axios.get("/movies");
                if (request.data && request.data.length > 0) {
                    const randomMovie = request.data[Math.floor(Math.random() * request.data.length)];
                    setMovie(randomMovie);
                    setImageError(false); // Reset error state on new movie
                }
            } catch (error) {
                console.error("Failed to fetch banner movie", error);
            }
        }
        fetchData();
    }, []);

    // Function to handle image load error
    const handleImageError = () => {
        if (!imageError) {
            setImageError(true);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    }

    // Fallback image if the movie's thumbnail is missing
    // Since we are now using BLOBs served via API, we construct the URL dynamically
    const backgroundSrc = !movie?.id || imageError
        ? "https://upload.wikimedia.org/wikipedia/commons/c/cd/Portrait_Placeholder_Square.png"
        : movie.thumbnailUrl;

    return (
        <header className="banner">
            {/* Background Image Layer */}
            <div className="banner__background-container">
                <img
                    src={backgroundSrc}
                    alt={movie?.title || "Banner"}
                    className="banner__background-image"
                    onError={handleImageError}
                />
                <div className="banner__overlay-gradient"></div>
            </div>

            <div className="banner__contents">
                {/* Netflix Brand Label */}
                <h3 className="banner__label">NETFLIX</h3>

                {/* Dynamic Title */}
                <h1 className="banner__title logo-font">
                    {movie?.title || "NETFLIX"}
                </h1>

                {/* Dynamic Subtitle */}
                <h2 className="banner__subtitle">
                    {movie?.releaseDate ? `Season 2 coming on ${new Date(movie.releaseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}` : "Watch Now"}
                </h2>

                <div className="banner__description">
                    {movie?.description || "Loading..."}
                </div>

                <div className="banner__buttons">
                    <button className="banner__button play_button" onClick={() => navigate(`/player/${movie?.id}`)}><FaPlay className="btn_icon" /> Play</button>
                    <button className="banner__button info_button" onClick={() => setShowModal(true)}><FiInfo className="btn_icon" /> More Info</button>
                </div>
            </div>

            <div className="banner__right-controls">
                <button className="banner__mute-button" onClick={toggleMute}>
                    {isMuted ? <GoMute /> : <GoUnmute />}
                </button>
                <div className="banner__ageRating">
                    <span>{movie?.rating || "U/A 16+"}</span>
                </div>
            </div>

            <div className="banner--fadeBottom" />
            {showModal && (
                <MovieModal
                    movie={movie}
                    onClose={() => setShowModal(false)}
                />
            )}
        </header>
    );
}

export default Banner;
