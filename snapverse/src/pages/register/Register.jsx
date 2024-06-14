import axios from 'axios';
import "./register.css"
import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const navigate = useNavigate();

    const handleClick = async (e) => {

        e.preventDefault();
        const user = {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value

        }
        try{
            console.log(user)
            await axios.post("/auth/register",user);
            navigate("/login")

        }catch(err){
            console.log(err)
        }
        
    }

    return (
        <div className='signUpContaier'>
          <div className="signUpWrapper">
            <span className="signUpLogo">Snapverse</span>
            <form className="signUpBox" onSubmit={handleClick}>
              <div className="signUpBoxTop">
                <input placeholder='Username' className="signUpInput" ref={username} required min="4" max="20"/>
                <input type="email" placeholder='Email' className="signUpInput" ref={email} required max="50"/>
                <input type="password" placeholder='Password' className="signUpInput" ref={password} required min="8" />
              </div>
              <div className="signUpBoxBottom">
                <button className="btn">Sign up</button>
                <Link to="/login/" style={{textDecoration:"none", color: "inherit", width: "50%"}}>
                  <button className="btn loginBtn">Already have an acoount</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
    )
}
