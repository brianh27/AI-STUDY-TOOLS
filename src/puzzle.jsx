import React from 'react'
import { useState,useEffect } from 'react'
import userCheck,{insert,getData,getTests,update} from './backend.jsx'
import { useSearchParams,useNavigate, Link} from 'react-router-dom';
import NotFound from './notFound.jsx'


const Display=()=>{
    async function changeAcc({res}){

    }
    const Question=()=>{
        
        
        return(
            <div>
                    <p>{data.Subject}</p>
                    <p>{<div dangerouslySetInnerHTML={{ __html: data.q}} />}</p>
                    <p>{data.choices.map((n,i)=><button onClick={()=>{choice===null&&setChoice(i);changeAcc({res:true})}}key={i}>{n}</button>)}</p>
                    
                    {choice!=null?<div><p>Your Answer: {data.choices[choice]}</p><p>{<div dangerouslySetInnerHTML={{ __html: data.a}} />}</p></div>:''}
            </div>
        )
    }    
    const date = new Date();
    const [data,setData]=useState(null)
    const d=date.getUTCFullYear()+'-'+date.getUTCMonth()+'-'+date.getUTCDate()
    const [choice,setChoice]=useState(null)
    console.log(choice)
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
    const [userID,setID]=useState(null)
    function Links(){
        const temp = searchParams.get('confidential');
        if (userID === null) {
            if (temp === null) {
                console.log('checks')
                navigate('/not-found')
            }else{
                setID(temp);
            }
        } else if (temp !== null) {
            reset();
        }
    }
    useEffect(()=>Links(), [userID, searchParams]);
    function reset(){
        
        navigate('/puzzle', { replace: true });
        console.log('changed')
    }
    
    return(
        <div>
            <h1>Daily Puzzle</h1>
            <Display ></Display>
        </div>
    )
}
export default Puzzle