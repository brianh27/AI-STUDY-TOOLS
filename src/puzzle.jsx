import React from 'react'
import { useState,useEffect } from 'react'
import userCheck,{insert,getState,getData,getTests,update,updateUser} from './backend.jsx'
import { useSearchParams,useNavigate, Link} from 'react-router-dom';
import NotFound from './notFound.jsx'


const Display=({userData,d,yesterday})=>{
    const [data,setData]=useState(null)
   
    const [choice,setChoice]=useState(d in userData.info.answers?userData.info.answers[d]:null)
    async function changeAcc({res}){
        console.log('called')
        const temp=userData
        temp.info.answers[d]=res
        
        const t=await getData({col:'puzzles',id:data.id})
        
        if (res===data.ans){
            temp.info.points=temp.info.points+75
            temp.info.streak=temp.info.streak+1
            t.acceptance[0]=t.acceptance[0]+1
            t.acceptance[1]=t.acceptance[1]+1
        }else{
            temp.info.points=temp.info.points+25
            temp.info.streak=0
            t.acceptance[1]=t.acceptance[1]+1
        }
        await updateUser({col:'users',id:userData.id,info:temp})
        await updateUser({col:'puzzles',id:data.id,info:t})
        
        
    }
    console.log(choice===null)
    const Question=()=>{
        
        
        return(
            <div>
                    
                    <p>{data.Subject}</p>
                    <p>Acceptance Rate: {data.acceptance[1]===0?0:String(data.acceptance[0]/data.acceptance[1]*100).slice(0,4)}%</p>
                    <p>{<div dangerouslySetInnerHTML={{ __html: data.q}} />}</p>
                    <p>{data.choices.map((n,i)=><button onClick={() => {
                        if (choice === null) {
                            setChoice(i);
                            changeAcc({ res: i });
                        }
                    }}
                    key={i}>{n}</button>)}</p>
                    
                    {choice!=null?<div><p>Your Answer: {data.choices[choice]}</p><p>{<div dangerouslySetInnerHTML={{ __html: data.a}} />}</p></div>:''}
                    <button >Streak: {userData.info.streak}</button>
            </div>
        )
    } 
    
    
    



   
    async function getPuzzle(){
        const temp=await getTests({col:'puzzles'})
        setData(temp.filter(n=>n.date===d)[0])
    }
    if (data===null){
        getPuzzle()
    }
    return(
        <div>
            {d}
            {data===null?"Loading...":<Question ></Question>}
            
        </div>
    )
}
const Puzzle=()=>{
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [userData,setUser]=useState(null)
    const date = new Date()
    const d=date.getUTCFullYear()+'-'+date.getUTCMonth()+'-'+date.getUTCDate()
    
    date.setDate(date.getDate() - 1); // Subtract one day

    const yesterday =date.getUTCFullYear()+'-'+date.getUTCMonth()+'-'+date.getUTCDate()

    
    async function getAns({userID}){
        const temp=await getData({col:'users',id:userID})
        if (temp===false){
            navigate('/not-found')
            return
        }
        if (!(yesterday in temp.info.answers) && temp.info.streak>1) {
            temp.info.streak=0
            await updateUser({col:'users',id:temp.id,info:temp})
        }
        
        setUser(temp)

    }
    if (userData===null){
        const temp=getState()     
        if (temp===false){
            navigate('/not-found')
        }else{
            setUser(temp)
            getAns({userID:temp.id})

            
        }
    }
    return(
        <div>
            <h1>Daily Puzzle</h1>
            <button onClick={()=>navigate(`/home`)}>Go to Home</button>
            {userData===null?'loading...':<Display d={d} yesterday={yesterday} userData={userData}></Display>}
            
        </div>
    )
}
export default Puzzle