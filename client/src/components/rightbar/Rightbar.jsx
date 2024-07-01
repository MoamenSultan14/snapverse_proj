import React, { useContext, useEffect, useState } from 'react'
import './rightbar.css'
import { AuthContext } from '../../context/AuthContext'
// import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { Link } from 'react-router-dom';

function Rightbar() {

  const {user,dispatch} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FLDER;


  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {

    const fetchSuggestions = async () => {
      try {
        const response = await axiosInstance.get(`/users/suggestMutualFriends/${user._id}`);
        if (response.data && response.data.firstFiveMutualFriends) {
          setSuggestions(response.data.firstFiveMutualFriends)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();

  }, [user._id]);

  const handleClick = async (userId, index) => {
    try {
      const updatedSuggestions = [...suggestions];
      updatedSuggestions[index].isFollowing = true;
      setSuggestions(updatedSuggestions);
  
      const response = await axiosInstance.put(`/users/${userId}/follow`, { userId: user._id });
      console.log(response)
  
      dispatch({ type: "FOLLOW", payload: userId });
  
      // Remove followed user from suggestions
      const newSuggestions = suggestions.filter((_, i) => i !== index);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error following user:', error);
    }
  }


  return (
    <div className='rightbarContainer'>
      <div className="rightbarWrapper">
        <span className="suggestingText">Suggested for you</span>
        <ul className="rightbarSuggestingList">
            {suggestions.map((suggestedUser, index) => (
                <li className="rightbarSuggesting" key={suggestedUser._id}>
                    <Link to={`/profile/${suggestedUser.username}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <img src={suggestedUser.profileImg ? suggestedUser.profileImg : (PF + "person/R.png")} alt={suggestedUser.username} className="suggestedImg" />
                    </Link>
                    <div className="suggestedContent">
                        <Link to={`/profile/${suggestedUser.username}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <span className="suggestedUsername">
                                {suggestedUser.username}
                            </span>
                        </Link>
                        <span className="suggestedInfo">
                            Suggested for you
                        </span>
                    </div>
                    <div className="suggestedFollowOption">
                      <span className="suggestedFollow" onClick={() => handleClick(suggestedUser._id, index)}>Follow</span>
                    </div>
                </li>
            ))}
        </ul>
        <span className='rightbarCopyright'>© SNAPVERSE FROM MOAMEN</span>  
      </div>
    </div>
  )
}

export default Rightbar

