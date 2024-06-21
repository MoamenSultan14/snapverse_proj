import React, { useContext, useEffect, useState } from 'react';
import './userprofile.css';
import SettingsIcon from '@mui/icons-material/Settings';
import axiosInstance from '../../axiosInstance';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Loadingline from '../loadingline/Loadingline';
import Postmodal from '../postmodal/Postmodal'; // Import the PostModal component

function Userprofile() {
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FLDER;
  const username = useParams().username;
  const { user: currUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axiosInstance.get(`/users?username=${username}`);
        setUser(userResponse.data);
        setFollowed(currUser.followings.includes(userResponse.data._id));
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const postsResponse = await axiosInstance.get(`/posts/profile/${username}`);
        setUserPosts(postsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [username, currUser]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axiosInstance.put(`/users/${user._id}/unfollow`, { userId: currUser._id });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axiosInstance.put(`/users/${user._id}/follow`, { userId: currUser._id });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <>
      {loading && <Loadingline />}
      <div className="userprofileContainer">
        <div className="userprofileTop">
          <div className="userprofileTopLeft">
            <img src={user.profileImg ? user.profileImg : `${PF}person/R.png`} alt="" className="userprofileImg" />
          </div>
          <div className="userprofileTopRight">
            <div className="userprofileControlPanel">
              <span className="userprofileUsername">{user.username}</span>
              {username === currUser.username ? (
                <>
                  <Link to={`/profile/${user.username}/editprofile`} style={{ textDecoration: "none", color: "inherit" }}>
                    <button className="userprofileEdit">Edit profile</button>
                  </Link>
                  <SettingsIcon className="userprofileSettingsIcon" />
                </>
              ) : (
                <button className="userprofileFollow" onClick={handleClick}>
                  {followed ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
            <div className="userprofileStats">
              <span className="userprofilePostsCounter">
                <b>{userPosts.length}</b> posts
              </span>
              <span className="userprofileFollowersCounter">
                <b>{user.followers ? user.followers.length : 0}</b> followers
              </span>
              <span className="userprofileFollowingCounter">
                <b>{user.followings ? user.followings.length : 0}</b> followings
              </span>
            </div>
            <span className="userprofileBio">{user.desc}</span>
          </div>
        </div>
        <hr className="userprofileHr" />
        <div className="userprofileBottom">
          <div className="userprofilePosts">
            {userPosts.map((post) => (
              <img
                src={post.img}
                key={post._id}
                className="userprofilePostImg"
                onClick={() => handlePostClick(post)}
              />
            ))}
          </div>
        </div>
      </div>
      <Postmodal post={selectedPost} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default Userprofile;
