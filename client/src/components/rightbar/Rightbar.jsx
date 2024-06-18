import React, { useContext, useEffect, useState } from 'react'
import './rightbar.css'
import { AuthContext } from '../../context/AuthContext'
// import axios from 'axios';
import axiosInstance from '../../axiosInstance';

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

  // const handleClick = async (userId, index) => {
  //   try {
  //     // Optimistically update UI
  //     const updatedSuggestions = [...suggestions];
  //     updatedSuggestions[index].isFollowing = true; // Add a property to track following state
  //     setSuggestions(updatedSuggestions);
  
  //     // Make request to follow user
  //     const response = await axiosInstance.put(`/users/${userId}/follow`, { userId: user._id });
  //     console.log(response.data);
  
  //     // If server responds successfully, update state
  //     // Remove the followed user from suggestions
  //     const newSuggestions = suggestions.filter((_, i) => i !== index);
  //     setSuggestions(newSuggestions);
  //   } catch (error) {
  //     console.error('Error following user:', error);
  //   }
  // }

  const handleClick = async (userId, index) => {
    try {
      const updatedSuggestions = [...suggestions];
      updatedSuggestions[index].isFollowing = true;
      setSuggestions(updatedSuggestions);
  
      // Make request to follow user
      const response = await axiosInstance.put(`/users/${userId}/follow`, { userId: user._id });
      console.log(response)
  
      // Assuming the follow operation was successful
      dispatch({ type: "FOLLOW", payload: userId }); // Update context state
  
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
                    <img src={suggestedUser.profileImg ? suggestedUser.profileImg : (PF + "person/R.png")} alt={suggestedUser.username} className="suggestedImg" />
                    <div className="suggestedContent">
                        <span className="suggestedUsername">
                            {suggestedUser.username}
                        </span>
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

