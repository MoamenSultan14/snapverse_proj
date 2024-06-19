import React, { useContext } from 'react'
import './topbar.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

function Topbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='topbarContainer'>
      <div className="topbarWrapper">
        <div className="topbarLeft">
          <Link to="/" style={{textDecoration:"none", color: "inherit"}}>
            <span className="topbarLogo">Snapverse</span>
          </Link>
        </div>
        <div className="topbarRight">
          <LogoutIcon className='material-size md-36 topbarIcon' onClick={handleLogout}/>
        </div>
      </div>
    </div>
  )
}

export default Topbar
