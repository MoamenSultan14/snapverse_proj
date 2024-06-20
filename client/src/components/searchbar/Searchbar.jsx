import React, { useState, useEffect } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import "./searchbar.css";
import axiosInstance from '../../axiosInstance';
import Searchresults from '../searchbar/Searchresults';
import CircularProgress from '@mui/material/CircularProgress';
import useDebounce from '../../hooks/useDebounce';

const Searchbar = ({ onClose }) => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedInput = useDebounce(input, 300);

    const fetchData = async (value) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/users/all", {
                params: { username: value }
            });
            setResults(res.data);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const handleChange = (value) => {
        setInput(value);
    };

    useEffect(() => {
        if (debouncedInput.trim() === "") {
            setResults([]);
        } else {
            fetchData(debouncedInput);
        }
    }, [debouncedInput]);

    const handleWrapperClick = (e) => {
        e.stopPropagation(); // Prevent click event from propagating to the container
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

