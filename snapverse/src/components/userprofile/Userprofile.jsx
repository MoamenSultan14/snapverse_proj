// import React, { useEffect, useState } from 'react'
// import './userprofile.css'
// import SettingsIcon from '@mui/icons-material/Settings';
// import Profilestats from '../profilestats/Profilestats';
// import axios from 'axios';
// import { useParams } from 'react-router';

// function Userprofile() {


//   const [user,setUser] = useState({});
//   const PF = process.env.REACT_APP_PUBLIC_FLDER;
//   const username = useParams().username

//   useEffect(()=>{
//     const getUser = async () =>{
//       const res = await axios.get(`/users?username=${username}`)
//       setUser(res.data)
//     }
//     getUser()
//   },[username])

//   return (
//     <div className='userprofileContainer'>
//         <div className="userprofileTop">
//             <div className="userprofileTopLeft">
//               <img src={user.profileImg ? user.profileImg : (PF + "person/R.png")} alt="" className="userprofileImg" />
//             </div>
//             <div className="userprofileTopRight">
//                 <div className="userprofileControlPanel">
//                     <span className='userprofileUsername'>{user.username}</span>
//                     <button className='userprofileEdit'>Edit profile</button>
//                     <SettingsIcon className='userprofileSettingsIcon'/>
//                 </div>
//                 <div className="userprofileStats">
//                     <span className='userprofilePostsCounter'><b>12</b> posts</span>
//                     <span className='userprofileFollowersCounter'><b>{user.followers}</b> followers</span>
//                     <span className='userprofileFollowingCounter'><b>{user.followings}</b> followings</span>
//                 </div>
//                 {/* <Profilestats/> */}
//                 <span className='userprofileBio'>{user.desc}</span>
//             </div>
//         </div>
//         <hr className='userprofileHr'/>
//         <div className="userprofilePosts">
//           <img src="/assets/bmw.png" alt="" className="userprofilePostImg" />
//           <img src="/assets/bmw.png" alt="" className="userprofilePostImg" />
//           <img src="/assets/bmw.png" alt="" className="userprofilePostImg" />
//           <img src="/assets/bmw.png" alt="" className="userprofilePostImg" />

//         </div>

//     </div>
//   )
// }

// export default Userprofile

import React, { useContext, useEffect, useState } from 'react';
import './userprofile.css';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import { useParams } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Loadingline from '../loadingline/Loadingline';

function Userprofile() {
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FLDER;
  const username = useParams().username;
  const {user:currUser,dispatch} = useContext(AuthContext)
  // const [followed,setFollowed] = useState(currUser.followings.includes(user?._id))
  const [followed,setFollowed] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/users?username=${username}`);
        setUser(userResponse.data);
        setFollowed(currUser.followings.includes(userResponse.data._id));
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        setLoading(true); 
        const postsResponse = await axios.get(`/posts/profile/${username}`);
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true); 
  //       const [userResponse, postsResponse] = await Promise.all([
  //         axios.get(`/users?username=${username}`),
  //         axios.get(`/posts/profile/${username}`)
  //       ]);
  //       setUser(userResponse.data);
  //       setUserPosts(postsResponse.data);
  //       setLoading(false); 
  //       setFollowed(currUser.followings.includes(userResponse.data._id));
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [username, currUser]);

  const handleClick = async () =>{
    try{
      if(followed){
        await axios.put(`/users/${user._id}/unfollow`, {userId:currUser._id})
        dispatch({type:"UNFOLLOW", payload:user._id})
      }else{
        await axios.put(`/users/${user._id}/follow`, {userId:currUser._id})
        dispatch({type:"FOLLOW", payload:user._id})
      }
      setFollowed(!followed)
      window.location.reload();
    }catch(e){
      console.log(e)
    }
  }

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
                <Link to={`/profile/${user.username}/editprofile`} style={{textDecoration:"none", color: "inherit"}}>
                  <button className="userprofileEdit">Edit profile</button>
                </Link>
                <SettingsIcon className="userprofileSettingsIcon" />
              </>
            ) : (
              <button className="userprofileFollow" onClick={handleClick}>
                {followed? "Unfollow" : "Follow"}
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
            <img src={post.img} key={post._id} className="userprofilePostImg" />
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default Userprofile;



