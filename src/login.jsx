import React from 'react'
import { useState ,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import redirect from './redirect.jsx'
import userCheck,{insert,getTests,login} from './backend.jsx'
//import s from './login.module.css';
import check from './check.jsx'


const Create=({newEmail,upMail,newPassConf,upPassConf,setState,newUser,newPass,error,upUse,upPass,setError,usernam})=>{
  const errors=['Please type a username','Your username is not available',"Your username must only have letters","You're email is not avaliable","Please make sure to have a proper email","Your username must be appropriate",'Your password must be between 5-15 characters','Your password must contain a 3 symbols',"Your password must contain the word cow","Your password must be appropriate",'Loading...','Account created! Please go to the login page and sign in','Error in creating account. Please check info then retry...']
  const navigate = useNavigate();
  
  async function handleSubmit(){
    event.preventDefault()
    setError(10)
    const t=await insert({col:'users', data:{
      "username": newUser,
      "email": newEmail,
      "password": newPass,
      "passwordConfirm": newPass,
      "info":{
        "answers": {},
        "points": 0,
        "streak": 0,
        "record":0
      }
    }})
    if (t===false){
      setError(12)
      return
    }
    setError(11)
  }
  //change insert in case of userinfo parameter alteration
  return(
    <div className={s.container}>
       <h1>Create Account</h1>
        <em>Please enter your details to register</em>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        
      <form onSubmit={handleSubmit}>
              <b>Username:</b> <input  onChange={(e)=>check({mail:newEmail,event:e,newUser:newUser,newPass:newPass,set:upUse,type:'u',setError:setError,usernam:usernam})} value={newUser} />
              <p>&nbsp;</p>
              <b>Email:</b> <input  onChange={(e)=>check({mail:newEmail,event:e,newUser:newUser,newPass:newPass,set:upMail,type:'e',setError:setError,usernam:usernam})} value={newEmail} />
              <p>&nbsp;</p>
              <p><b>Password:</b> <input  onChange={(e)=>check({mail:newEmail,event:e,newUser:newUser,newPass:newPass,set:upPass,type:'p',setError:setError,usernam:usernam})} value={newPass}/></p>
              <p>&nbsp;</p>
              
              
        
        {error===12?<button type="submit">Register</button>:errors[error]}
        
              
      </form>

      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>Already have an account? &nbsp;
        <span onClick={()=>setState(true)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                Log In
        </span>
        </p>
    </div>
  )
  
}
const Login=()=>{
  return (
      <div>
        This is an outdated version of the website.
        Here is the new website:
        
        <a href='https://testforger.vercel.app'>https://testforger.vercel.app</a>

        Update: The API key that I bought ran out of credits. So for now the Generate feature will not work. You can still access the practice tests using the search feature. I will update the generate feature in a couple days.
      </div>
  )
}

const l=()=>{
  const [error,setError]=useState(0)
  console.log(error)
  
  
  const navigate = useNavigate();
  const Created=()=>{
  
      const [user,changeUser]=useState('')
      const [pass,changePass]=useState('')
      
      const [loading,setLoading]=useState(false)
      const [message,setMessage]=useState('')
      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        
        const success = await login({ i: setLoading, email: user, password: pass, event: e });
        console.log(success)
        if (success) {
            navigate('/home'); // Navigate if login is successful
        } else {
            setMessage('Wrong username or password'); // Set error message if login fails
        }
    };
    
      return(
      <div className={s.container}>
        <h1>Welcome Back</h1>
        <em>Please enter your details to sign in</em>
        <p> &nbsp;</p>
        <p>&nbsp;</p>
        <p>Don't have an account?  &nbsp;
        <span onClick={()=>{setState(false);setReset(true);upUse('');upPass('');upMail('');setError(0)}} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
        Create one now.
            </span>
            </p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
      
        <form onSubmit={handleSubmit}>
                <p><b>Email or Username:</b> <input onChange={()=>changeUser(event.target.value)} value={user} /></p>
                <p>&nbsp;</p>
                <p><b>Password:</b> <input type='password' onChange={()=>changePass(event.target.value)} value={pass} /></p>
                {message}
                <p>{loading?<b>Loading...</b>:<button className={s.Login} type="submit">Login</button>}</p>
                
                
        </form>
      </div>
      )
  }
  
  
  const [state,setState]=useState(true)
  const [usernam,setUsername]=useState(null)
  const [reset,setReset]=useState(false)
  const [newUser,upUse]=useState('')
  const [newEmail,upMail]=useState('')
  const [newPass,upPass]=useState('')
  const [newPassConf,upPassConf]=useState('')
  useEffect(() => {
    async function fetchData() {
        const usernames = await getTests({ col: 'users' });
        setUsername(usernames);
        console.log(usernames); // Log the fetched usernames
    }

    if (usernam === null) {
        fetchData();
    }
}, [usernam]); 

  return(
    
    <div >
      
      {state?<Created></Created>:<Create newPassConf={newPassConf} upPassConf={upPassConf} newEmail={newEmail} upMail={upMail} usernam={usernam} setState={setState} newUser={newUser} newPass={newPass} error={error} upUse={upUse} upPass={upPass} setError={setError} ></Create>}
      
    </div>
  )
}
export default Login
