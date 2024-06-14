import React, { useContext, useEffect, useState } from 'react'
import "./editprofile.css"
import Leftbar from '../../components/leftbar/Leftbar'
import { AuthContext } from '../../context/AuthContext'
import Uploadprofileimg from '../../components/uploadprofileimg/Uploadprofileimg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const Editprofile = () => {
    const {user,dispatch} = useContext(AuthContext)
    const navigate = useNavigate();
    const PF = process.env.REACT_APP_PUBLIC_FLDER;
    const maxBioLength = 150;
    const [input,setInput] = useState("")
    const [charsCounter,setCharsCounter] = useState(0)
    const [isPopUpOpen, setPopUpOpen] = useState(false)

    const handleChange = (event) =>{
        const value = event.target.value;
        setInput(value)
        setCharsCounter(value.length)
    }

    const handlePopUp = () =>{
        setPopUpOpen(!isPopUpOpen)
    }


    const handleSubmit = async () =>{
        const updatedUser = {
            userId: user._id,
            desc: input,
        }
        try{
            await axios.put(`/users/${user._id}`, updatedUser)
            dispatch({type: "UPDATE_DESC", payload: input})
            navigate(`/profile/${user.username}`)
            

        }catch(e){
            console.log(e)
        }


    }

    useEffect(() => {
        setInput(user.desc);
        setCharsCounter(user.desc ? user.desc.length : 0);
    }, [user.desc]);


  return (
    <div className='editprofileContainer'>
        <div className="editprofileLeft">
            <Leftbar/>
        </div>
        <div className="editprofileRight">
            <span className="editprofileTitle">Edit profile</span>

            <div className="editprofilePhoto">
                <div className="leftContent">
                    <img src={user.profileImg ? user.profileImg : `${PF}person/R.png`} alt="" className="profileImg" />
                    <span className="profileUsername">{user.username}</span>
                </div>
                <button className="changePhotoBtn" onClick={handlePopUp}>Change photo</button>
            </div>

            <div className="editProfileBio">

                <span className="editporfileInputLabels">Bio</span>
                <div className="editprofileBioInput">
                    <textarea type="text" placeholder='Bio' className="profileBio" value={input} onChange={handleChange} maxLength={maxBioLength} />
                    <div className="bioCounter">
                        <span className="textAllowedLength">{charsCounter}/150</span>
                    </div>
                </div>
            </div>

            <div className="editProfileSubmit">
                <button className="editProfileSubmitBtn" onClick={handleSubmit}>Submit</button>
            </div>

        </div>

        { isPopUpOpen && <Uploadprofileimg closePopUp={handlePopUp}/>}
      
    </div>
  )
}

export default Editprofile
