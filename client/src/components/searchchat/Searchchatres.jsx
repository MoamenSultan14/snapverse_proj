import React from 'react';
import "./searchchatres.css";

const Searchchatres = ({ results, onClose, openConversation }) => {
    const PF = process.env.REACT_APP_PUBLIC_FLDER;

    const handleResultClick = (result) => {
        openConversation(result);
        onClose(); 
    };

    return (
        <div className='searchChatResults'>
            {results.map((result, id) => (
                <div className='searchChatResult' key={id} onClick={() => handleResultClick(result)}>
                    <img
                        src={result.profileImg ? result.profileImg : (PF + "person/R.png")}
                        alt=""
                        className='searchChatResultImg'
                    />
                    {result.username}
                </div>
            ))}
        </div>
    );
};

export default Searchchatres;
