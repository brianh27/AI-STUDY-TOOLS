import React from 'react'
import { useState,useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {useNavigate, useSearchParams} from 'react-router-dom'
import userCheck,{getData,logout,getState} from './backend'
import g from './home.module.css'
const Home=()=>{
    const navigate = useNavigate();
    
    const [user,setUser]=useState(null)
    
    if (user===null){
        const temp=getState()     
        if (temp===false){
            navigate('/not-found')
        }else{
            setUser(temp)
            
        }

    }
    console.log(user)
    return(
        <div>
            <h1>Hi {user!=null?user.username:''}!</h1>
            <button onClick={()=>navigate(`/guides`)}>Study Guide Generator</button>
            <button onClick={()=>navigate(`/puzzle`)}>Daily Puzzle</button>
            <button onClick={()=>navigate(`/rush/main`)}>Rush</button>
            <button className={g.signout} onClick={()=>logout({nav:navigate})}>Sign Out</button>

            <p>
              
            </p>

        </div>
    )
}
{/* <h1>Points System</h1>
<li>100 - Referring a Person </li>
<li> 20% of the points a refered person earns - For legal purposes points earned from referring other people will not be counted in the percentage </li>
<li>25 - Completing Daily Puzzle </li>
<li>50 - Correctly Anwsering Daily Puzzle </li>
<li>10*streak - You will earn points each day for your streak count * 10</li>
<h1>Prizes</h1>
<li>100 points = candy</li>
<li>500 points = Pencil </li>
<li>1000 points = Pen </li> */}
export default Home
