import React from 'react'
import './bottombar.css'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Link } from 'react-router-dom';

function Bottombar() {
  return (
    <>
    <hr></hr>
    <div className='bottombarContainer'>
        <div className="bottombarWrapper">
            <ul className="bottombarOptions">
                <li className="bottombarOptionsItem">
                    <HomeRoundedIcon className='material-size md-36 bottombarIcon'/>
                </li>
                <li className="bottombarOptionsItem">
                    <ExploreOutlinedIcon className='material-size md-36 bottombarIcon'/>
                </li>
                <li className="bottombarOptionsItem">
                    <SlideshowOutlinedIcon className='material-size md-36 bottombarIcon'/>
                </li>
                <li className="bottombarOptionsItem">
                    <MessageOutlinedIcon className='material-size md-36 bottombarIcon'/>
                </li>
                <li className="bottombarOptionsItem">
                    <AddBoxOutlinedIcon className='material-size md-36 bottombarIcon'/>
                </li>
                <li className="bottombarOptionsItem">
                    <Link to="/profile" style={{textDecoration:"none", color: "inherit"}}>
                    <img src='/assets/mypic.jpg' className='bottombarProfileImg bottombarIcon'/>
                    </Link>
                </li>      
            </ul>
        </div>
      
    </div>
    </>
  )
}

export default Bottombar
