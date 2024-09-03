import React from 'react'
import { useState ,useEffect} from 'react'
import ask from'./aiget.jsx'
import userCheck,{insert,getTests} from './backend.jsx'
import validator from 'validator';
export default async function check({event,mail,newUser,newPass,set,type,setError,usernam}){
    

    const isValidEmail = (email) => validator.isEmail(email);
    set(event.target.value)
    if (type==='u'){
      newUser=event.target.value
    }else if (type==='e'){
        mail=event.target.value
    }else if (type==='p'){
      newPass=event.target.value
    }
    console.log(usernam[0])
    
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
    else if (usernam.find(n=>n.email===mail)!=undefined){
        console.log(usernam.find(n=>n.email.toLowerCase()===mail.toLowerCase()))
        setError(3)
        
    }
    else if (isValidEmail(mail)===false){
        setError(4)
    }
    
    else{
      
      const response=await ask({description:`YOU WILL ONLY RETURN THE LETTER Y OR N. YOU ARE A USERNAME CHECKER. IF the username provided is inappropriate return Y, 
        if it is appropriate return N. Be very strict, avoid racism, any discrimination, being mean, objectification or anything else politically 
        incorrect or you shouldn't bring up at the dinner table to your family`,query:newUser})
      if (response==='Y'){
        setError(5)
      }else if (newPass.length>15 ||newPass.length<5){
        setError(6)
      }else if (  newPass.match(/[^\w\s]/g)&&symbols.length<3){
        setError(7)
      }else if (newPass.toLowerCase().includes('cow')===false){
        setError(8)
      }else{
        setError(12)
      }
      
    }
  
}