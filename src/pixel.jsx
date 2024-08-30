import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getData } from './backend.jsx';
import './pixel.css'
const Pixel = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [userData, setUser] = useState(null);
    const [colors, setColors] = useState(null);
    const [cursor,setCursor]=useState(null)
    async function get(){
        const temp=await getData({col:'pixel',id:'gza3w3xdmxr6q8h'})
        console.log(temp)
        setColors(temp.pixels)
    }
    if (colors===null){
        get()
    }
    

    async function getAns({ userID }) {
        const temp = await getData({ col: 'user_info', id: userID });

        if (temp === false) {
            console.log(temp);
            navigate('/not-found');
            return;
        }
        setUser(temp);
    }

    function Links() {
        const temp = searchParams.get('confidential');
        console.log(temp);
        if (userData === null) {
            if (temp === null) {
                console.log(temp);
                navigate('/not-found');
            } else {
                getAns({ userID: temp });
            }
        } else if (temp !== null) {
            reset();
        }
    }

    useEffect(() => Links(), [userData, searchParams]);

    function reset() {
        navigate('/pixel', { replace: true });
    }

    if (userData === null || colors===null) {
        return (
            <div>
                Loading...
            </div>
        );
    }
    console.log(colors)
    return (
        <div className="grid">
            {colors.map((color, index) => (
                <div key={index} style={{ backgroundColor: color.replace(/['"]/g, '')}} className="square" onClick={()=>setCursor(index)}></div>
            ))}
        </div>
    );
}

export default Pixel;
