import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios'; // Ensure this points to your axios instance
import './PlayerScreen.css';
import {
    IoArrowBack, IoFlagOutline, IoPlay, IoPause,
    IoVolumeMedium, IoVolumeMute,
    IoSettingsOutline, IoScanOutline, IoChatboxOutline
} from "react-icons/io5";
import { MdReplay10, MdForward10 } from "react-icons/md";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";

// Helper to format time (seconds -> mm:ss)
const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mm = Math.floor(seconds / 60);
    const ss = Math.floor(seconds % 60);
    return `${mm}:${ss < 10 ? '0' : ''}${ss}`;
};

function PlayerScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const hideTimeoutRef = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [movieTitle, setMovieTitle] = useState("");
    const [movie, setMovie] = useState(null);

    // Fetch movie details for title
    useEffect(() => {
        async function fetchData() {
            try {
                // If you don't have a direct /api/movies/:id, we can fetch all and find (not ideal but works for this demo)
                // Or if you added a getUser endpoint, maybe you added a getMovie endpoint? 
                // Let's try to fetch from the list since we have a list endpoint
                const request = await axios.get('/movies');
                const foundMovie = request.data.find(m => m.id === parseInt(id));
                if (foundMovie) {
                    setMovie(foundMovie);
                    setMovieTitle(foundMovie.title);
                }
            } catch (error) {
                console.error("Error fetching movie:", error);
            }
        }
        fetchData();
    }, [id]);

    const handlePlayPause = () => {
        if (playing) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setPlaying(!playing);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
    };

    const handleSeek = (e) => {
        const time = Number(e.target.value);
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = () => {
        if (muted) {
            setMuted(false);
            videoRef.current.muted = false;
            setVolume(1);
        } else {
            setMuted(true);
            videoRef.current.muted = true;
            setVolume(0);
        }
    };

    const skip = (amount) => {
        videoRef.current.currentTime += amount;
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // Auto-hide controls
    const handleMouseMove = () => {
        setShowControls(true);
        containerRef.current.style.cursor = "default";

        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }

        hideTimeoutRef.current = setTimeout(() => {
            if (playing) {
                setShowControls(false);
                containerRef.current.style.cursor = "none";
            }
        }, 3000);
    };

    return (
        <div
            className="playerScreen"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => playing && setShowControls(false)}
        >
            <video
                ref={videoRef}
                className="playerScreen__video"
                src={`http://localhost:8081/api/movies/${id}/video`}
                autoPlay
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={handlePlayPause}
            />

            <div className={`playerScreen__overlay ${!showControls ? 'playerScreen__overlay--hidden' : ''}`}>
                {/* Header */}
                <div className="playerScreen__header">
                    <button className="playerScreen__backBtn" onClick={() => navigate(-1)}>
                        <IoArrowBack />
                    </button>
                    <button className="playerScreen__flagBtn">
                        <IoFlagOutline />
                    </button>
                </div>

                {/* Footer Controls */}
                <div className="playerScreen__controls">
                    {/* Progress Bar */}
                    <div className="playerScreen__progress">
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="playerScreen__slider"
                            style={{ backgroundSize: `${(currentTime / duration) * 100}% 100%` }}
                        />
                        <span className="playerScreen__time">{formatTime(duration - currentTime)}</span>
                    </div>

                    {/* Buttons Row */}
                    <div className="playerScreen__buttons">
                        <div className="playerScreen__leftControls">
                            <button className="playerScreen__btn" onClick={handlePlayPause}>
                                {playing ? <IoPause /> : <IoPlay />}
                            </button>
                            <button className="playerScreen__btn" onClick={() => skip(-10)}>
                                <MdReplay10 />
                            </button>
                            <button className="playerScreen__btn" onClick={() => skip(10)}>
                                <MdForward10 />
                            </button>
                            <button className="playerScreen__btn" onClick={handleVolumeChange}>
                                {muted ? <IoVolumeMute /> : <IoVolumeMedium />}
                            </button>
                        </div>

                        <div className="playerScreen__titleContainer">
                            <span className="playerScreen__title">{movieTitle || "Officer on Duty"}</span>
                        </div>

                        <div className="playerScreen__rightControls">
                            <button className="playerScreen__btn">
                                <IoChatboxOutline />
                            </button>
                            <button className="playerScreen__btn">
                                <IoScanOutline />
                            </button>
                            <button className="playerScreen__btn" onClick={toggleFullscreen}>
                                {document.fullscreenElement ? <BsFullscreenExit /> : <BsFullscreen />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerScreen;
