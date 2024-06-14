import React, { useContext, useEffect, useState } from 'react'
import "./uploadprofileimg.css"
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext';

const Uploadprofileimg = ({closePopUp}) => {

    const {user,dispatch} = useContext(AuthContext);
    const [hasProfileImg, sethasProfileImg] = useState(false)

    const convertToBase64 = (e) =>{
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            updateImg(reader.result)
        };
        reader.onerror = err => {
            console.log(err)
        }
    }

    const updateImg = async (base64Img) =>{
      const updatedUser = {
        // ...user,
        userId: user._id,
        profileImg: base64Img
      };
      try{
        await axios.put(`/users/${user._id}`, updatedUser)
        dispatch({type: "UPDATE_IMG", payload: base64Img})
        closePopUp()
        
      }catch(e){
        console.log(e)
      }
    }

    const handleRemoveImg = async () =>{
      const updatedUser = {
        userId: user._id,
        profileImg: "",
      }
      try{
        await axios.put(`/users/${user._id}`, updatedUser)
        dispatch({type: "UPDATE_IMG", payload: ""})
        closePopUp()
        
      }catch(e){
        console.log(e)
      }
    }

    const handleWrapperClick = (e) => {
      // Prevent the click event from propagating to the container
      e.stopPropagation();
    };

  useEffect(() => {
    if(user.profileImg !== ""){
      sethasProfileImg(true)
    }
  }, [user.profileImg]);
    
  return (
    <div className='imgUpoadContaier' onClick={closePopUp}>
      <div className={hasProfileImg ? 'imgUploadWrapper' : 'imgUploadWrapper no-cancel-button'} onClick={handleWrapperClick}>
        <span className="imgUploadTitle">Change profile photo</span>
        <label htmlFor="imgFile" className="uploadProfileImgFile">
            <span className='uploadProfileImg'>Upload photo</span>
            <input type="file" id="imgFile" style={{display:"none"}} accept=".jpg,.jpeg,.png" onChange={convertToBase64} />
        </label>
        {hasProfileImg && <button className="uploadProfileImgRemove" onClick={handleRemoveImg}>Remove current photo</button>}
        <button className="uploadProfileImgCancel" onClick={closePopUp}>Cancel</button>
      </div>
    </div>
  )
}

export default Uploadprofileimg
