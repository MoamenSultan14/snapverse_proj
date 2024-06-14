// import React, { useContext, useEffect,useState } from 'react'
// import './post.css'
// import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
// import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
// import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
// import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import {format} from 'timeago.js';
// import { AuthContext } from '../../context/AuthContext'
// import Comments from '../comments/Comments';
// import Loadingline from '../loadingline/Loadingline';

// export default function Post({post}) {

//   const [like,setLike] = useState(post.likes.length);
//   const [isLiked, setIsLiked] = useState(false);
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState('');
//   const [loading, setLoading] = useState(false)
//   const [user,setUser] = useState({});
//   const PF = process.env.REACT_APP_PUBLIC_FLDER;
//   const {user:currUser} = useContext(AuthContext)

//   const likeHandler = ()=>{
//     try{
//       axios.put(`/posts/${post._id}/like`, {userId:currUser._id})
//     } catch(e) {

//     }
//     setLike(isLiked? like-1 : like+1);
//     setIsLiked(!isLiked)
//   }

//   const commentHandler = async () => {
//     try {
//       setLoading(true)
//       await axios.post(`posts/comment/${post._id}`, { userId: user._id, text: newComment });
//       setNewComment('');
//       setLoading(false)

//     }catch (e) {
//       console.error('Error posting comment:', e);
//     }
// };

//   useEffect(()=>{
//     setIsLiked(post.likes.includes(currUser._id))
//   },[post.likes,currUser._id])

//   useEffect(()=>{
//     const getUser = async () =>{
//       const res = await axios.get(`/users/${post.userId}`)
//       setUser(res.data)
//     }
//     getUser()
//   },[post.userId])

//   const handleViewComments = () =>{
//     setShowComments(!showComments)
//   }


//   return (
//     <>
//       {loading? <Loadingline/> : ""}
//       <div className='postContainer'>
//         <div className="postWrapper">
//           <div className="postTop">
//               <Link to={`profile/${user.username}`} style={{textDecoration:"none", color: "inherit"}}>
//                 <img src={user.profileImg ? user.profileImg : (PF + "person/R.png")}  alt="" className="postProfileImg" />
//               </Link>
//               <span className="postUsername">
//                 {user.username}
//               </span>
//               <FiberManualRecordIcon className='postDot' style={{fontSize: "5px" }}/>
//               <span className="postUploadTime">{format(post.createdAt)}</span>
//           </div>
//           <div className="postMid">
//               <div className="postImgContainer">
//                 <img src={post.img} alt="" className="postImg" />
//               </div>
//               <div className="postMidContent">

//                   <div className="postMidLeft">
//                       <FavoriteBorderOutlinedIcon onClick={likeHandler} style={{ fill: isLiked ? 'red' : 'black' }} className='postIcon'/>
//                       <ModeCommentOutlinedIcon className='postIcon'/>
//                       <ShareOutlinedIcon className='postIcon'/>
//                   </div>
//                   <div className="postMidRight">
//                       <BookmarkBorderOutlinedIcon className='postIcon'/>
//                   </div>
//               </div>
//           </div>
//           <div className="postBottom">       
//               <span className='postLikes'>{like} likes</span>
//               <div className="postBottomTop">
//                   <span className="postUsername postUsernameBottom">{user.username}</span>
//                   <p className="postDesc">{post?.desc}</p>
//               </div>
//               <span className="postViewComments" onClick={handleViewComments}>
//                   View all {post.comment} comments
//               </span>
//               <div className="postComment">

//                 <textarea type="text" placeholder='Add a comment...' className="postTextareaInput" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
//                 <span className={`postTextareaInputUpload ${newComment.trim() === '' ? 'Textareadisabled' : ''}`} onClick={commentHandler}>Post</span>
//               </div>

//               <hr className='postHr'/>
//           </div>

//         </div>
//         {showComments && <Comments post={post} closeViewComments={handleViewComments} isLiked={isLiked} like={like} likeHandler={likeHandler} />}
//       </div>
//     </>
//   )
// }

import React, { useContext, useEffect, useState } from 'react';
import './post.css';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Link } from 'react-router-dom';
// import axios from 'axios';
import axiosInstance from '../../axiosInstance';
import { format } from 'timeago.js';
import { AuthContext } from '../../context/AuthContext';
import Comments from '../comments/Comments';
import Loadingline from '../loadingline/Loadingline';

const Post = ({ post }) => {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FLDER;
  const { user: currUser } = useContext(AuthContext);
  const [showFullDescription, setShowFullDescription] = useState(false); // Added state for full description

  const likeHandler = () => {
    try {
      axiosInstance.put(`/posts/${post._id}/like`, { userId: currUser._id });
    } catch (e) {
      console.error('Error liking post:', e);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const commentHandler = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`posts/comment/${post._id}`, { userId: user._id, text: newComment });
      setNewComment('');
      setLoading(false);
    } catch (e) {
      console.error('Error posting comment:', e);
    }
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currUser._id));
  }, [post.likes, currUser._id]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${post.userId}`);
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    getUser();
  }, [post.userId]);

  const handleViewComments = () => {
    setShowComments(!showComments);
  };

  const renderDescription = () => {
    if (post.desc.length > 100) {
      return (
        <>
          {showFullDescription ? post.desc : `${post.desc.slice(0, 100)}...`}
          <span className="postReadMore" onClick={() => setShowFullDescription(!showFullDescription)}>
            {showFullDescription ? ' Show less' : ' more'}
          </span>
        </>
      );
    } else {
      return post.desc;
    }
  };

  return (
    <>
      {loading ? <Loadingline /> : ''}
      <div className="postContainer">
        <div className="postWrapper">
          <div className="postTop">
            <Link to={`profile/${user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img
                src={user.profileImg ? user.profileImg : PF + 'person/R.png'}
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <FiberManualRecordIcon className="postDot" style={{ fontSize: '5px' }} />
            <span className="postUploadTime">{format(post.createdAt)}</span>
          </div>
          <div className="postMid">
            <div className="postImgContainer">
              <img src={post.img} alt="" className="postImg" />
            </div>
            <div className="postMidContent">
              <div className="postMidLeft">
                <FavoriteBorderOutlinedIcon
                  onClick={likeHandler}
                  style={{ fill: isLiked ? 'red' : 'black' }}
                  className="postIcon"
                />
                <ModeCommentOutlinedIcon className="postIcon" />
                <ShareOutlinedIcon className="postIcon" />
              </div>
              <div className="postMidRight">
                <BookmarkBorderOutlinedIcon className="postIcon" />
              </div>
            </div>
          </div>
          <div className="postBottom">
            <span className="postLikes">{like} likes</span>
            <div className="postBottomTop">
              <span className="postUsername postUsernameBottom">{user.username}</span>
              <p className="postDesc">{renderDescription()}</p>
            </div>
            <span className="postViewComments" onClick={handleViewComments}>
              View all {post.comment} comments
            </span>
            <div className="postComment">
              <textarea
                type="text"
                placeholder="Add a comment..."
                className="postTextareaInput"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <span
                className={`postTextareaInputUpload ${newComment.trim() === '' ? 'Textareadisabled' : ''}`}
                onClick={commentHandler}
              >
                Post
              </span>
            </div>
            <hr className="postHr" />
          </div>
        </div>
        {showComments && <Comments post={post} closeViewComments={handleViewComments} isLiked={isLiked} like={like} likeHandler={likeHandler} />}
      </div>
    </>
  );
};

export default Post;


