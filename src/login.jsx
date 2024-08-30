import React from 'react'
import { useState ,useEffect} from 'react'
//import check from './backend.jsx'
import {useNavigate} from 'react-router-dom'
import redirect from './redirect.jsx'
import userCheck,{insert,getData,getTests} from './backend.jsx'
import ask from'./aiget.jsx'
export const LoggedIn=false
console.log(typeof LoggedIn)
async function check({event,newUser,newPass,set,type,setError,usernam}){
  set(event.target.value)
  if (type==='u'){
    newUser=event.target.value
  }else{
    newPass=event.target.value
  }
  
  console.log('checking')
  if (usernam===null){
    setError(0)
    
  }
  else if (usernam.find(n=>n.username.toLowerCase()===newUser.toLowerCase())!=undefined){
    console.log(newUser.toLowerCase)
    setError(1)
    
  }else if (/^[a-z]+$/.test(newUser.toLowerCase())===false){
    console.log(newUser.toLowerCase())
    setError(2)
  }
  else{
    
    const response=await ask({description:`YOU WILL ONLY RETURN THE LETTER Y OR N. YOU ARE A USERNAME CHECKER. IF the username provided is inappropriate return Y, 
      if it is appropriate return N. Be very strict, avoid racism, any discrimination, being mean, objectification or anything else politically 
      incorrect or you shouldn't bring up at the dinner table to your family`,query:newUser})
    if (response==='Y'){
      setError(3)
    }else if (newPass.length>15 ||newPass.length<5){
      setError(4)
    }else if (  newPass.match(/[^\w\s]/g)&&symbols.length<3){
      setError(5)
    }else if (newPass.toLowerCase().includes('cow')===false){
      setError(6)
    }else{
      setError(8)
    }
    
  }

}

const Create=({setState,newUser,newPass,error,upUse,upPass,setError,usernam})=>{
  const errors=['Please type a username','Your username is not available',"Your username must only have letters","Your username must be appropriate",'Your password must be between 5-15 characters','Your password must contain a 3 symbols',"Your password must contain the word cow","Your password must be appropriate"]
  const navigate = useNavigate();
 
  
  //change insert in case of userinfo parameter alteration
  return(
    <div>
      <form onSubmit={()=>{setState(true);insert({col:'user_info',data:{username:newUser,password:newPass,info:{
  "points": 0,
  "streak": 0,
  "answers": {}
}}})}}>
              New Username: <input key={1} onChange={(e)=>check({event:e,newUser:newUser,newPass:newPass,set:upUse,type:'u',setError:setError,usernam:usernam})} value={newUser} />
              <p>New Password: <input key={2} onChange={(e)=>check({event:e,newUser:newUser,newPass:newPass,set:upPass,type:'p',setError:setError,usernam:usernam})} value={newPass}/></p>
        
        {error===8?<button type="submit">Register</button>:errors[error]}
              
      </form>
    </div>
  )
  
}
const Login=()=>{
  const [error,setError]=useState(0)
  
  const [debug,setDebug]=useState(['',''])
  
  
  const Created=()=>{
      const navigate = useNavigate();
      const [user,changeUser]=useState('')
      const [pass,changePass]=useState('')
      
      const [message,changeMessage]=useState('')
    // const redirect=(event)=>{
      //   event.preventDefault()
        // navigate('/Home')
      //}
      async function checks(){
          event.preventDefault()
          
          const temp= await userCheck({username:user,password:pass})
          
          if (temp[0]===true){
              redirect({loc:`/home?confidential=${temp[1]}`,nav:navigate})
              
          }else{
              changeMessage(temp)
          }
      }
      return(
      <div>
        {message}
        <form onSubmit={checks}>
                Username: <input onChange={()=>changeUser(event.target.value)} value={user} />
                <p>Password: <input type='password' onChange={()=>changePass(event.target.value)} value={pass} /></p>
                <button type="submit">Login</button>
                
        </form>
      </div>
      )
  }
  
  
  const [state,setState]=useState(true)
  const [usernam,setUsername]=useState(null)
  const [reset,setReset]=useState(false)
  const [newUser,upUse]=useState('')
  const [newPass,upPass]=useState('')
  useEffect(() => {
    const fetchUsernames = async () => {
      const usernames = await getTests({ col: 'user_info' });
      setUsername(usernames)
    };
    fetchUsernames();
  }, []);
  

  return(
    <div>
      <button onClick={()=>setState(true)}>Sign In</button>
      <button onClick={()=>{setState(false);setReset(true);upUse('');upPass('')}}>Sign Up</button>
      {state?<Created></Created>:<Create usernam={usernam} setState={setState} newUser={newUser} newPass={newPass} error={error} upUse={upUse} upPass={upPass} setError={setError} ></Create>}
    </div>
  )
}
export default Login