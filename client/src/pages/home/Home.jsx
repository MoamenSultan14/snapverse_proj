import React from 'react'
import Leftbar from '../../components/leftbar/Leftbar'
import Feed from '../../components/feed/Feed'
import './home.css'
import Rightbar from '../../components/rightbar/Rightbar'
import Topbar from '../../components/topbar/Topbar'

function Home({res}) {

  return (
    <>
      <div className="homeContainer">
        <Topbar/>
        <div className="homeLeft">
          <Leftbar/>
        </div>
        <div className="homeRight">
          <Feed res={res}/>
          <Rightbar/>  
        </div>
      </div>

    </>
  )
}

export default Home






