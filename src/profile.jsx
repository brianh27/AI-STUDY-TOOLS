import React from 'react'
import { useState,useEffect } from 'react'
import userCheck,{insert,getData,getTests,update,updateUser} from './backend.jsx'
import { useSearchParams,useNavigate, Link} from 'react-router-dom';
import NotFound from './notFound.jsx'
const Profile=()=>{    
    
}
export default Profile
// const navigate = useNavigate();
//     const [searchParams] = useSearchParams();
//     const [userData,setUser]=useState(null)
    
//     async function getAns({userID}){
//         const temp=await getData({col:'user_info',id:userID})
//         if (temp===false){
//             navigate('/not-found')
//             return
//         }
//         setUser(temp)

//     }
//     function Links(){
//         const temp = searchParams.get('confidential');
//         if (userData === null) {
//             if (temp === null) {
                
//                 navigate('/not-found')
//             }else{
//                 getAns({userID:temp})
//             }
//         } else if (temp !== null) {
//             reset();
//         }
//     }
//     useEffect(()=>Links(), [userData, searchParams]);
//     function reset(){
        
//         navigate('/profile', { replace: true });
        
//     }
//     if (userData===null){
//         return(
//             <div>
//                 Loading...
//             </div>
//         )
//     }
//     return(
//         <div>
//             hello {userData.username}
//         </div>
//     )