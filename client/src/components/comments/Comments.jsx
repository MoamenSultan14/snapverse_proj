import React, { useContext, useEffect, useState } from 'react';
import './comments.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { format } from 'timeago.js';
import { AuthContext } from '../../context/AuthContext';
import io from 'socket.io-client';
import Loadingline from '../loadingline/Loadingline';
import { Link } from 'react-router-dom';


const socket = io('http://localhost:8080', { transports : ['websocket'] });


const Comments = ({ post, closeViewComments, isLiked, like, likeHandler }) => {
    const {user} = useContext(AuthContext)
    const [postUploader, setPostUploader] = useState({});
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loading,setLoading] = useState(true);
    const PF = process.env.REACT_APP_PUBLIC_FLDER;
  
    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await axios.get(`/users/${post.userId}`);
                setPostUploader(user.data);
            } catch (error) {
                console.error(error);
            }
        };

        getUser();
    }, [post.userId]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`posts/comments/${post._id}`);
                setComments(response.data);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, []);

    useEffect(()=> {
        socket.on('new-comments', (msg) => {
            setComments(msg)
            setLoading(false)
        })
    },[socket])


    const handlePostComment = async () => {
        try {
            setLoading(true)
            const updatedPost = await axios.post(`posts/comment/${post._id}`, { userId: user._id, text: newComment });
            setNewComment('');
            const updatedComments = updatedPost.data.comments;
            // setComments(updatedComments)
            socket.emit('comment', updatedComments)


        } catch (e) {
            console.error('Error posting comment:', e);
        }
    };

    const handleLikeDislikeComment = async (commentId) => {
        try {
            const response = await axios.put(`posts/${post._id}/comments/${commentId}/like`, { userId: user._id });
            const updatedComments = comments.map(comment => {
                if (comment._id === commentId) {
                    return {
                        ...comment,
                        likes: response.data.likes
                    };
                }
                return comment;
            });
            // setComments(updatedComments)
            socket.emit('comment', updatedComments)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            setLoading(true)
            await axios.delete(`/posts/commentDelete/${post._id}/${commentId}?userId=${user._id}`, { userId: user._id});
            const updatedComments = comments.filter(comment => comment._id !== commentId);
            // setComments(updatedComments);
            socket.emit('comment', updatedComments);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleWrapperClick = (e) => {
        e.stopPropagation();
    };

    return (
    
        <div className='commentsContainer' onClick={closeViewComments}>
            {loading ? <Loadingline/> : ''}
            <div className="commentsWrapper" onClick={handleWrapperClick}>
                <CloseIcon className="closeIcon" onClick={closeViewComments} style={{fontSize:"30px"}}/>
                <div className="commentsLeft">
                    <img src={post.img} className='commentsUploadedPost' alt="Uploaded post" />
                </div>
                <div className="commentsRight">
                    <div className="commentsTopRight">
                        <Link to={`/profile/${postUploader.username}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <img
                                src={postUploader.profileImg ? postUploader.profileImg : `${PF}person/R.png`}
                                alt="Uploader profile"
                                className="commentsUploaderProfile"
                            />
                        </Link>
                        <Link to={`/profile/${postUploader.username}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <span className="commentsUploadedUsername">{postUploader.username}</span>
                        </Link>
                    </div>
                    <div className="commentsContent">
                        <div className="uploadedComments">
                            <ul className="uploadedCommentsList">
                                {comments && comments.length > 0 && comments.map((comment) => (
                                    <li className="uploadedComment" key={comment._id}>
                                        <div className="uploadedCommentLeft">
                                            <Link to={`/profile/${comment.postedBy.username}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                <img src={comment.postedBy.profileImg ? comment.postedBy.profileImg : `${PF}person/R.png`} className="commentUploaderProfileImg" alt="Commenter profile" />
                                            </Link>
                                            <div className="uploadedCommentContent-Info">
                                                <div className="uploadedCommentContent">
                                                    <Link to={`/profile/${comment.postedBy.username}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                        <span className="commentUploaderUsername">{comment.postedBy.username}</span>
                                                    </Link>
                                                    <p className="commentText">{comment.text}</p>
                                                </div>
                                                <div className="uploadedCommentInfo">
                                                    <span className="commentTimestamp">{format(comment.created)}</span>
                                                    <span className="commentLikesCounter">{comment.likes.length} likes</span>
                                                    {comment.postedBy._id === user._id && (
                                                        <DeleteIcon className="deleteCommentIcon" onClick={() => handleDeleteComment(comment._id)} style={{fontSize:"15px", fill: "gray"}} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="uploadedCommentRight">
                                            <FavoriteBorderIcon 
                                            style={{ fontSize: "small", fill: comment.likes.includes(user._id) ? "red" : "black" }}
                                            onClick={() => handleLikeDislikeComment(comment._id)} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="postInteraction">
                            <FavoriteBorderOutlinedIcon onClick={likeHandler} style={{ fill: isLiked ? 'red' : 'black' }}/>
                            <ModeCommentOutlinedIcon />
                            <ShareOutlinedIcon />
                        </div>
                        <div className="postInteractionSummary">
                            <span className="postLikesCounter">{like} likes</span>
                            <span className="postTimestamp">{format(post.createdAt)}</span>
                        </div>
                        <div className="postCommentarea">
                            <textarea type="text" placeholder='Add a comment...' className="postTextareaInput" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                            <span className={`postTextareaInputUpload ${newComment.trim() === '' ? 'Textareadisabled' : ''}`} onClick={handlePostComment}>Post</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comments;