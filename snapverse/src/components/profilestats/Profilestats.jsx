import React from 'react'
import './profilestats.css'

export default function Profilestats() {
  return (
    <div className='profilestatsContainer'>
        <span className='profilePostsCounter'><b>12</b> posts</span>
        <span className='profileFollowersCounter'><b>2030</b> followers</span>
        <span className='profileFollowingCounter'><b>12</b> following</span>
    </div>
  )
}
