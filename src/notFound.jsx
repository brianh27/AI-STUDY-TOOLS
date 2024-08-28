import React from 'react'
import { useState,useEffect } from 'react'
import {useNavigate, BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
const NotFound=()=>{
    const navigate = useNavigate();
    console.log('called')
            return (
                <div>
                    Please Log In  
                    <p><button onClick={()=>navigate('/')}>Go to Login</button></p>
                </div>
            )
   
}
export default NotFound