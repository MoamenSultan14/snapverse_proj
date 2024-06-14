import React, { useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import "./searchbar.css";
import axios from 'axios';
import Searchresults from '../searchbar/Searchresults';
import CircularProgress from '@mui/material/CircularProgress';

const Searchbar = ({ onClose }) => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async (value) => {
        try {
            if (value.trim() !== "") {
                setLoading(true);
                const res = await axios.get("/users/all", {
                    params: { username: value }
                });
                setResults(res.data);
                setLoading(false);
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const handleChange = (value) => {
        setInput(value);
        if (value.trim() === "") {
            setResults([]);
        } else {
            fetchData(value);
        }
    };

    const handleWrapperClick = (e) => {
        // Prevent the click event from propagating to the container
        e.stopPropagation();
    };

    return (
        <div className='searchBarContainer' onClick={onClose}>
            <div className="searchBarWrapper" onClick={handleWrapperClick}>
                <div className="inputWrapper">
                    <SearchOutlinedIcon id="searchIcon" />
                    <input 
                        placeholder='Type to search...'
                        value={input}
                        onChange={(e) => handleChange(e.target.value)}
                        className='searchInput'
                    />
                </div>
                {(loading || results.length > 0) && (
                    <div className="searchResultsWrapper">
                        {loading ? (
                            <CircularProgress className='loadingIcon' size="20px" />
                        ) : (
                            <Searchresults results={results} onClose={onClose} />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Searchbar;

