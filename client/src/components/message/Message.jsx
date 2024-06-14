import React from 'react'
import './message.css'
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';

const Message = ({message,own}) => {

  const PF = process.env.REACT_APP_PUBLIC_FLDER;


  return (
    <div className={own? 'message own' : 'message'}>
      <div className="messageTop">
        <Link to={`/profile/${message?.sender.username}`} style={{ textDecoration: "none", color: "inherit" }}>
          <img src={message?.sender.profileImg ? message.sender.profileImg : `${PF}person/R.png`} alt="" className="messageImg" />
        </Link>
        <p className="messageText">
          {message.text}
        </p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}

export default Message

