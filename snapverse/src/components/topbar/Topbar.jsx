import React from 'react'
import './topbar.css'
import { Link } from 'react-router-dom';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

function Topbar() {
  return (
    <div className='topbarContainer'>
      <div className="topbarWrapper">
        <div className="topbarLeft">
          <Link to="/" style={{textDecoration:"none", color: "inherit"}}>
            <span className="topbarLogo">Snapverse</span>
          </Link>
        </div>
        <div className="topbarRight">
          <input className='topbarSearch' placeholder='Search'/>
          <FavoriteBorderOutlinedIcon className='material-size md-36 topbarIcon'/>
        </div>
      </div>
    </div>
  )
}

export default Topbar
