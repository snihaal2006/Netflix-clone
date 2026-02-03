import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import "./Row.css";
import { FaPlay, FaPlus, FaThumbsUp } from "react-icons/fa";
import { AiOutlineDown } from "react-icons/ai";
import MovieModal from "./MovieModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

function Row({ title, fetchUrl, isLargeRow, className, movies: propMovies }) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (propMovies) {
            setMovies(propMovies);
        } else if (fetchUrl) {
            async function fetchData() {
                const request = await axios.get(fetchUrl);
                setMovies(request.data);
                return request;
            }
            fetchData();
        }
    }, [fetchUrl, propMovies]);

    const [modalMovie, setModalMovie] = useState(null);

    const handleClick = (movie) => {
        setModalMovie(movie);
    };

    const navigate = useNavigate();

    const handlePlay = (movie) => {
        navigate(`/player/${movie.id}`);
    };

    const handleAddToMyList = async (movie) => {
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

    const handleAddToLiked = async (movie) => {
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

    return (
        <div className={`row ${className || ""}`}>
            <h2>{title}</h2>

            <div className="row__posters">
                {movies.map((movie, index) => (
                    <div
                        key={movie.id}
                        className={`row__posterWrapper ${isLargeRow && "row__posterWrapperLarge"}`}
                    >
                        <div className="row__posterItem">
                            {/* ... existing poster code ... */}
                            {/* Demo Badges based on index */}
                            {index === 0 && (
                                <div className="row__posterBadge--recent">
                                    Recently added
                                </div>
                            )}
                            {index === 2 && (
                                <div className="row__posterBadge--top10">
                                    TOP <span>10</span>
                                </div>
                            )}

                            <img
                                className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                                src={`${API_URL}/movies/${movie.id}/thumbnail`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://upload.wikimedia.org/wikipedia/commons/c/cd/Portrait_Placeholder_Square.png"
                                }}
                                alt={movie.name}
                            />

                            <div className="row__posterDetails">
                                <div className="row__posterActions">
                                    <div className="row__posterActionLeft">
                                        <button className="icon-btn white-btn" onClick={() => handlePlay(movie)}><FaPlay /></button>
                                        <button className="icon-btn" onClick={() => handleAddToMyList(movie)}><FaPlus /></button>
                                        <button className="icon-btn" onClick={() => handleAddToLiked(movie)}><FaThumbsUp /></button>
                                    </div>
                                    <div className="row__posterActionRight">
                                        <button className="icon-btn" onClick={() => handleClick(movie)}>
                                            <AiOutlineDown />
                                        </button>
                                    </div>
                                </div>
                                <div className="row__posterInfo">
                                    <span className="match-score">{movie.matchScore || 95}% Match</span>
                                    <span className="age-rating">{movie.rating || "U/A 13+"}</span>
                                    <span className="duration">{movie.duration || "1h 40m"}</span>
                                    <div className="quality-badge">HD</div>
                                </div>
                                <div className="row__posterTags">
                                    <ul>
                                        <li>Exciting</li>
                                        <li>•</li>
                                        <li>Action</li>
                                        <li>•</li>
                                        <li>Adventure</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render Modal */}
            {modalMovie && (
                <MovieModal
                    movie={modalMovie}
                    onClose={() => setModalMovie(null)}
                />
            )}
        </div>
    );
}

export default Row;
