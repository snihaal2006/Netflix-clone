import React, { useState, useEffect } from 'react';
import axios from './axios';
import './App.css';
import Row from './components/Row';
import Banner from './components/Banner';
import Nav from './components/Nav';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen';
import PlayerScreen from './screens/PlayerScreen';

function HomeScreen() {
  const [myList, setMyList] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    async function fetchUserLists() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        try {
          // Fetch fresh user data to get lists
          const userResponse = await axios.get(`/users/${user.id}`);
          const userData = userResponse.data;

          if (userData.myList && userData.myList.length > 0) {
            const myListResponse = await axios.post('/movies/batch', userData.myList);
            setMyList(myListResponse.data);
          }

          if (userData.likedMovies && userData.likedMovies.length > 0) {
            const likedResponse = await axios.post('/movies/batch', userData.likedMovies);
            setLikedMovies(likedResponse.data);
          }
        } catch (error) {
          console.error("Error fetching user lists", error);
        }
      }
    }
    fetchUserLists();
  }, []);

  return (
    <>
      <Nav />
      <Banner />
      <Row title="NETFLIX ORIGINALS" fetchUrl="/movies" className="row__overlap" />
      {myList.length > 0 && <Row title="My List" movies={myList} />}
      {likedMovies.length > 0 && <Row title="Liked Movies" movies={likedMovies} />}
      <Row title="Because you watched Tere Ishk Mein" fetchUrl="/movies" />
      <Row title="Comedy Movies" fetchUrl="/movies/genre/Comedy" />
      <Row title="Action Movies" fetchUrl="/movies/genre/Action" />
      <Row title="Horror Movies" fetchUrl="/movies/genre/Horror" />
    </>
  )
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/player/:id" element={<PlayerScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
