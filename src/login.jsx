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
        idk why but you can't access the app from /Home. so you just have to login.
        username: goldCheese@gmail.com
        password: 12345

        React + Vite

        also I made this becasue i had time over the summer and wanted to learn something new.
        It was quite challenging but I have to thank some people who helped me along the way.
        William Feng, Dhruv Saini, Nischant, RobloxDeveloper.
        
        Bug fixes (Remeber to do):
        fix the read only edit window
        add more modes, chats?
        make auto detection for if the formatting is correct

    </div>
    )
}

export default Login
