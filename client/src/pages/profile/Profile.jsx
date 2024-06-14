import React from 'react'
import './profile.css'
import Leftbar from '../../components/leftbar/Leftbar';
import Userprofile from '../../components/userprofile/Userprofile';
import Topbar from '../../components/topbar/Topbar';

function Profile() {
  return (
    <>
    <div className='profileContainer'>
      <Topbar/>
      <div className="profileLeft">
        <Leftbar/>
      </div>
      <div className="profileRight">
        <Userprofile/>
      </div>
    </div>
  </>
  )
}

export default Profile
