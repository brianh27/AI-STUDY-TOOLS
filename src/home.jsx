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
        if (u===false){
            navigate('/not-found')
            return
        }
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
            <button>Profile (not ready, but please refer)</button>
            <p>
                <h1>Points System</h1>
                <li>100 - Referring a Person </li>
                <li> 20% of the points a refered person earns - For legal purposes points earned from referring other people will not be counted in the percentage </li>
                <li>25 - Completing Daily Puzzle </li>
                <li>50 - Correctly Anwsering Daily Puzzle </li>
                <li>10*streak - You will earn points each day for your streak count * 10</li>
                <h1>Prizes</h1>
                <li>100 points = candy</li>
                <li>500 points = Pencil </li>
                <li>1000 points = Pen </li>
            </p>

        </div>
    )
}
export default Home
