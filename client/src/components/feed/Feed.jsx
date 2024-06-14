import React, { useContext, useEffect, useState } from 'react';
import Post from '../post/Post';
import './feed.css';
import { AuthContext } from '../../context/AuthContext';

function Feed({ res }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getPosts = () => {

      try {
        const sortedPosts = res.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        });
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error sorting posts:', error);
      }

    };
    getPosts();
  }, [res, user._id]);

  return (
    <div className='feedContainer'>
      <div className='feedWrapper'>
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}

export default Feed;

