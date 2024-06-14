import React, { useEffect, useState } from 'react'
import './conversation.css'
// import axios from 'axios';
import axiosInstance from '../../axiosInstance';

const Conversation = ({conversation, currentUser }) => {

  const [user,setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FLDER;

  useEffect(()=>{
    const otherUser = conversation.members.find(m => m._id !== currentUser._id)

    const getUser = async () =>{
      const res = await axiosInstance.get('/users?userId=' + otherUser._id)
      setUser(res.data)
    }
    getUser()
  }, [currentUser, conversation])

  return (
    <div className='conversation'>
      <img src={user?.profileImg ? user.profileImg : `${PF}person/R.png`} alt="" className="conversationImg" />
      <span className="conversationUsername">{user?.username}</span>
    </div>
  )
}

export default Conversation
