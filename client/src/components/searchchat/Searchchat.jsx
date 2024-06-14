import React, { useState, useEffect } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import './searchchat.css';
// import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import Searchchatres from '../searchchat/Searchchatres';
import CircularProgress from '@mui/material/CircularProgress';

const Searchchat = ({ onClose, currentUser, input, conversations, setConversations, setCurrConversation, setInput }) => {
    const [results, setResults] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFollowings = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/users/${currentUser._id}/followings`);
                setFollowings(res.data);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        };
        fetchFollowings();
    }, [currentUser]);

    useEffect(() => {
        handleChange(input);
    }, [input, followings]);

    const handleChange = (value) => {
        const filteredResults = followings.filter(user =>
            user.username.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filteredResults);
    };

    const handleWrapperClick = (e) => {
        // Prevent the click event from propagating to the container
        e.stopPropagation();
    };

    const openConversation = async (result) => {
        try {
            // Check if conversation already exists
            const existingConversation = conversations.find(convo =>
                convo.members.some(member =>
                    member._id === currentUser._id) &&
                convo.members.some(member =>
                    member._id === result._id)
            );
    
            if (existingConversation) {
                console.log('Conversation already exists:', existingConversation);
                setCurrConversation(existingConversation);
            } else {
                // Create a new conversation
                const members = [currentUser._id, result._id];
                const res = await axiosInstance.post('/conversations', { members });
    
                console.log('New conversation created:', res.data);
    
                // Update conversations state
                setConversations([...conversations, res.data]);
                setCurrConversation(res.data);
            }
            setInput("")
        } catch (error) {
            console.error('Error creating or fetching conversation:', error);
        }
    };
    

    return (
        <div className='searchchatContainer' onClick={onClose}>
            <div className="searchchatWrapper" onClick={handleWrapperClick}>
                <SearchOutlinedIcon id="searchIcon" />
                <div className="followingsWrapper">
                    {loading ? (
                        <CircularProgress className='loadingIcon' size="20px"/>
                    ) : (
                        <Searchchatres results={results} onClose={onClose} openConversation={openConversation} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Searchchat;

