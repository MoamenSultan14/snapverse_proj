import React from 'react'
import './loading.css'
import InstagramIcon from '@mui/icons-material/Instagram';


const Loading = () => {
  return (
    <div className='loadingContainer'>
      <div className="loadingWrapper">
        <div className="loadingLogo">
            <span className="logo">
                Snapverse
            </span>
        </div>
        <div className="loadingBottom">
            <div className="loadingIcon">
                <InstagramIcon style={{fontSize:"3rem"}}/>
            </div>
            <div className="loadingCopyrights">© SNAPVERSE FROM MOAMEN</div>
        </div>
      </div>
    </div>
  )
}

export default Loading
