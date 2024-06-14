import React from 'react'
import "./searchresults.css"
import { Link } from 'react-router-dom';

const searchresults = ({results,onClose}) => {
  const PF = process.env.REACT_APP_PUBLIC_FLDER;
  return (
        <div className='searchResults'>
            {results.map((result, id) => (
                <Link to={`/profile/${result.username}`} style={{textDecoration:"none", color: "inherit"}} key={id} onClick={onClose}>
                    <div className='searchResult'>
                        <img
                            src={result.profileImg ? result.profileImg : (PF + "person/R.png")}
                            alt=""
                            className='searchResultImg'
                        />
                        {result.username}
                    </div>
                </Link>
            ))}
        </div>
  )
}

export default searchresults
