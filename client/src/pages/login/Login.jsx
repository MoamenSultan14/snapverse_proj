import React, { useContext, useRef } from 'react'
import './login.css'
import { AuthContext } from '../../context/AuthContext';
import { loginCall } from '../../apiCalls';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';


function Login() {

  const email = useRef();
  const password = useRef();
  // const {user,isFetching,error,dispatch} = useContext(AuthContext);
  const {isFetching,dispatch} = useContext(AuthContext);


  const handleClick = (e) =>{
    e.preventDefault()
    loginCall(
      {email:email.current.value, password: password.current.value},
      dispatch
    )
  }

  return (
    <div className='loginContaier'>
      <div className="loginWrapper">
        <span className="loginLogo">Snapverse</span>
        <form className="loginBox" onSubmit={handleClick}>
          <div className="loginBoxTop">
            <input type="email" placeholder='Username or email' className="loginInput" ref={email} required max={50}/>
            <input type="password" placeholder='Password' className="loginInput" ref={password} required min={8} />
          </div>
          <div className="loginBoxBottom">
            <button className="btns" disabled={isFetching}>{isFetching? <CircularProgress size="1rem" color="inherit"/> : "Log in"}</button>
            <div className="separator">Don't have an account?</div>
            <Link to="/register/" style={{textDecoration:"none", color: "inherit", width: "100%"}}>
              <button className="btns signupBtn" disabled={isFetching}>{isFetching? <CircularProgress size="1rem" color="inherit"/> : "Sign up"}</button>
            </Link>

          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

