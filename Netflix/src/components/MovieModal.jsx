import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import './MovieModal.css';
import { FaPlay, FaPlus, FaThumbsUp, FaVolumeUp } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

function MovieModal({ movie, onClose }) {
    if (!movie) return null;
    const navigate = useNavigate();

    // Mock recommendations for UI demo
    const [similarMovies, setSimilarMovies] = React.useState([]);

    const handleAddToMyList = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            try {
                await axios.post(`/users/${user.id}/mylist/${movie.id}`);
                alert("Added to My List!");
            } catch (error) {
                console.error("Error adding to My List", error);
            }
        } else {
            alert("Please login to add to My List");
        }
    };

    const handleAddToLiked = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            try {
                await axios.post(`/users/${user.id}/liked/${movie.id}`);
                alert("Added to Liked Movies!");
            } catch (error) {
                console.error("Error adding to Liked Movies", error);
            }
        } else {
            alert("Please login to like movies");
        }
    };

    React.useEffect(() => {
        if (movie && movie.genres && movie.genres.length > 0) {
            // Fetch similar movies based on the first genre
            const genreName = movie.genres[0].name;
            axios.get(`/movies/genre/${genreName}`)
                .then(response => {
                    // Filter out the current movie and take up to 6
                    const related = response.data
                        .filter(m => m.id !== movie.id)
                        .slice(0, 9);
                    setSimilarMovies(related);
                })
                .catch(error => console.error("Error fetching similar movies:", error));
        }
    }, [movie]);

    // Lock body scroll when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <AiOutlineClose />
                </button>

                <div className="modal-hero">
                    <img
                        src={movie.thumbnailUrl}
                        alt={movie.title}
                        className="modal-hero-img"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://upload.wikimedia.org/wikipedia/commons/c/cd/Portrait_Placeholder_Square.png"
                        }}
                    />
                    <div className="modal-hero-shadow"></div>

                    <div className="modal-hero-content">
                        <h1 className="modal-title">{movie.title}</h1>
                        <div className="modal-actions">
                            <button className="modal-play-btn" onClick={() => navigate(`/player/${movie.id}`)}>
                                <FaPlay /> Play
                            </button>
                            <button className="modal-icon-btn" onClick={handleAddToMyList}>
                                <FaPlus />
                            </button>
                            <button className="modal-icon-btn" onClick={handleAddToLiked}>
                                <FaThumbsUp />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-info-grid">
                    <div className="modal-info-left">
                        <div className="modal-stats">
                            <span className="modal-match">{movie.matchScore || 95}% Match</span>
                            <span className="modal-year">2026</span>
                            <span className="modal-age">{movie.rating || "U/A 16+"}</span>
                            <span className="modal-hd">HD</span>
                        </div>
                        <p className="modal-description">
                            {movie.description}
                        </p>
                    </div>
                    <div className="modal-info-right">
                        <div className="modal-meta-row">
                            <span className="modal-label">Cast:</span>
                            <span className="modal-value">Mock Cast, Another Actor, Star Name</span>
                        </div>
                        <div className="modal-meta-row">
                            <span className="modal-label">Genres:</span>
                            <span className="modal-value">Action, Exciting, Sci-Fi</span>
                        </div>
                        <div className="modal-meta-row">
                            <span className="modal-label">This movie is:</span>
                            <span className="modal-value">Mind-Bending, Emotional</span>
                        </div>
                    </div>
                </div>

                <div className="modal-more-like-this">
                    <h3>More Like This</h3>
                    <div className="more-like-this-grid">
                        {similarMovies.length > 0 ? (
                            similarMovies.map((rec) => (
                                <div key={rec.id} className="recommendation-card">
                                    <div className="recommendation-image-container">
                                        <img
                                            src={rec.thumbnailUrl}
                                            alt={rec.title}
                                            className="recommendation-img"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://upload.wikimedia.org/wikipedia/commons/c/cd/Portrait_Placeholder_Square.png"
                                            }}
                                        />
                                        <span className="recommendation-duration">{rec.duration || "1h"}</span>
                                    </div>
                                    <div className="recommendation-info">
                                        <div className="recommendation-stats">
                                            <span className="modal-age">{rec.rating || "U/A 13+"}</span>
                                            <button className="modal-add-btn"><FaPlus /></button>
                                        </div>
                                        <p className="recommendation-desc">
                                            {rec.description ? (rec.description.length > 100 ? rec.description.substring(0, 100) + "..." : rec.description) : "Description not available."}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-recommendations">No specific related movies found.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MovieModal;
