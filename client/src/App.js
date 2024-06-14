import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from "./pages/register/Register";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Editprofile from "./pages/editprofile/Editprofile";
// import axios from "axios";
import axiosInstance from "./axiosInstance";
import Loading from "./components/loading/Loading";
import Messenger from "./pages/messenger/Messenger";

function App() {
  const { user } = useContext(AuthContext);
  const [res, setRes] = useState([]);
  const [loading, setLoading] = useState(true);

  const url = "https://snapverse-proj-api.vercel.app/api/";

  useEffect(() => {
    
    const getPosts = async () => {
      if(user && user._id && res.length === 0){
        try {
          const response = await axiosInstance.get(`${url}posts/feed/${user._id}`);
          setRes(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    };


  if (user) {
    getPosts();
  } else {
    setLoading(false);
    setRes([]);
  }
  }, [user, res.length]);

  return (
    <Router>
      {loading ? (
        <Loading/>
      ) : (
        <Routes>
          <Route
            path="/"
            element={user ? <Home res={res} /> : <Register />}
          />
          <Route path="/profile/:username" element={<Profile />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/messenger"
            element={!user ? <Navigate to="/" /> : <Messenger />}
          />
          <Route
            path="/profile/:username/editprofile"
            element={user ? <Editprofile /> : <Profile />}
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;








