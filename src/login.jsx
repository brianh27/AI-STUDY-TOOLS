import React from 'react'
import { useState } from 'react'
//import check from './backend.jsx'
import {useNavigate} from 'react-router-dom'
import redirect from './redirect.jsx'
import userCheck from './backend.jsx'
export const LoggedIn=false
console.log(typeof LoggedIn)

const Login=()=>{
    const [user,changeUser]=useState('')
    const [pass,changePass]=useState('')
    const navigate = useNavigate();
    const [message,changeMessage]=useState('')
   // const redirect=(event)=>{
     //   event.preventDefault()
       // navigate('/Home')
    //}
    async function check(){
        event.preventDefault()
        
        const temp= await userCheck({username:user,password:pass})
        
        if (temp===true){
            redirect({loc:'/Home',nav:navigate})
            
        }else{
            changeMessage(temp)
        }
    }
    return(
    <div>
      {message}
      <form onSubmit={check}>
              Username: <input onChange={()=>changeUser(event.target.value)} value={user} />
              <p>Password: <input type='password' onChange={()=>changePass(event.target.value)} value={pass} /></p>
              <button type="submit">Login</button>
              
      </form>
        username: 12345@gmail.com
        password: 12345


        <p>Thank you to these people for helping out:</p>
        <p>William Feng, Dhruv Saini, Nischant, RobloxDeveloper.</p>
        
        <p>Also PLEASE Feel free to refer this to anyone. just send this link not the /Home one</p>

    </div>
    )
}

export default Login
