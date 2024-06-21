import React from 'react';
import './postmodal.css';
import useOutsideClick from '../../hooks/useOutsideClick'; 
import CloseIcon from '@mui/icons-material/Close';

const PostModal = ({ post, isOpen, onClose }) => {

  const modalRef = useOutsideClick(onClose);

  if (!isOpen || !post) return null;

  return (
    <div className="postmodalContainer">
      <div className="postmodalWrapper" ref={modalRef}>
        <CloseIcon className="closeIcon" onClick={onClose} style={{fontSize:"30px"}}/>
        <img src={post.img} className='postmodalImg' />
      </div>
    </div>
  );
};

export default PostModal;

