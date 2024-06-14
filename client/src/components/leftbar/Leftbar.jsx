import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import { AuthContext } from '../../context/AuthContext';
import Createpost from '../createpost/Createpost';
import Searchbar from '../searchbar/Searchbar';
import leftbarCSS from './leftbar.module.css';
import messengerLeftbarCSS from './messengerleftbar.module.css';
import useOutsideClick from '../../hooks/useOutsideClick';

function Leftbar() {
  const { user, logout } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FLDER;
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [isSearchBarOpen, setSearchBarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMessengerPage = location.pathname === '/messenger';
  const styles = isMessengerPage ? messengerLeftbarCSS : leftbarCSS;
  

  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleCreateClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const toggleSearchBar = () => {
    setSearchBarOpen(!isSearchBarOpen);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1264px)');
    setIsSmallScreen(mediaQuery.matches);

    const handleScreenResize = (e) => {
      setIsSmallScreen(e.matches);
    };

    mediaQuery.addEventListener('change', handleScreenResize);

    return () => {
      mediaQuery.removeEventListener('change', handleScreenResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMoreClick = () => {
    setShowLogout(!showLogout);
  };

  const logoutRef = useOutsideClick(() => setShowLogout(false));

  return (
    <>
      <div className={styles.leftbarContainer}>
        <div className={styles.leftbarWrapper}>
          <div className={styles.leftbarTop}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              {isSmallScreen || isMessengerPage? (
                <InstagramIcon className="material-size md-36 leftbarIcon" />
              ) : (
                <span className={styles.leftbarLogo}>Snapverse</span>
              )}
            </Link>
          </div>

          <div className={styles.leftbarMid}>
            <div className={styles.leftbarMidWrapper}>
              <ul className={styles.leftbarOptions}>
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                  <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemHome}`}>
                    <HomeRoundedIcon className="material-size md-36 leftbarIcon" />
                    <span className={styles.leftbarItemText}>Home</span>
                  </li>
                </Link>
                <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemSearch}`} onClick={toggleSearchBar}>
                  <SearchRoundedIcon className="material-size md-36 leftbarIcon" />
                  <span className={styles.leftbarItemText}>Search</span>
                </li>
                <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemExplore}`}>
                  <ExploreOutlinedIcon className="material-size md-36 leftbarIcon" />
                  <span className={styles.leftbarItemText}>Explore</span>
                </li>
                <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemReels}`}>
                  <SlideshowOutlinedIcon className="material-size md-36 leftbarIcon" />
                  <span className={styles.leftbarItemText}>Reels</span>
                </li>
                <Link to="/messenger" style={{ textDecoration: "none", color: "inherit" }}>
                  <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemMessages}`}>
                    <MessageOutlinedIcon className="material-size md-36 leftbarIcon" />
                    <span className={styles.leftbarItemText}>Messages</span>
                  </li>
                </Link>
                <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemNotifications}`}>
                  <FavoriteBorderOutlinedIcon className="material-size md-36 leftbarIcon" />
                  <span className={styles.leftbarItemText}>Notifications</span>
                </li>
                <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemCreate}`} onClick={handleCreateClick}>
                  <AddBoxOutlinedIcon className="material-size md-36 leftbarIcon" />
                  <span className={styles.leftbarItemText}>Create</span>
                </li>
                <Link to={`/profile/${user.username}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemProfile}`}>
                    <img src={user.profileImg ? user.profileImg : `${PF}person/R.png`} alt="" className={`${styles.leftbarProfileImg} leftbarIcon`} />
                    <span className={styles.leftbarItemText}>Profile</span>
                  </li>
                </Link>
              </ul>

              <ul className={styles.leftbarBottomOptions}>
                <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemThreads}`}>
                  <GestureOutlinedIcon className="material-size md-36 leftbarIcon" />
                  <span className={styles.leftbarItemText}>Threads</span>
                </li>
                <li className={`${styles.leftbarOptionsItem} ${styles.leftbarItemMore}`} onClick={handleMoreClick}>
                  <DehazeOutlinedIcon className="material-size md-36 leftbarIcon" />
                  <span className={styles.leftbarItemText}>More</span>
                  {showLogout && (
                    <ul ref={logoutRef} className={styles.moreOptions}>
                      <li className={styles.moreOptionItem} onClick={handleLogout}>
                        Logout
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className={styles.leftbarHr} />
      </div>
      {isPopupOpen && <Createpost onClose={handleClosePopup} />}
      {isSearchBarOpen && <Searchbar onClose={toggleSearchBar} />}
    </>
  );
}

export default Leftbar;


