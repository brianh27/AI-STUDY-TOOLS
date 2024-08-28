import React from 'react'
import { useState,useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {useNavigate, useSearchParams} from 'react-router-dom'
import userCheck,{getData} from './backend'
import NotFound from'./notFound.jsx'
const Home=()=>{
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [user,setUser]=useState(null)
    const [userID,setID]=useState(null)
    async function getUser({i}){
        const u=await getData({id:i,col:'user_info'})
        console.log('replaced')
        navigate('/home', { replace: true });
        setUser(u.username)
    }
    console.log(userID)
    if (userID===null){
        
        const temp=searchParams.get('confidential')
        if (temp===null){
            navigate('/not-found')
        }
    
        setID(temp)
        getUser({i:temp})
    }else if (searchParams.get('confidential')!=null){
        navigate('/home', { replace: true });
    }
    
    return(
        <div>
            <h1>Hi {user===null?'':user}!</h1>
            <button onClick={()=>navigate(`/guides?confidential=${userID}`)}>Study Guide Generator</button>
            <button onClick={()=>navigate(`/puzzle?confidential=${userID}`)}>Daily Puzzle</button>
            <button>Notes Sharing (not ready)</button>
            <button>Essay Review (not ready)</button>
            <button>Referral (not ready, but please refer)</button>


        </div>
    )
}
export default Home
