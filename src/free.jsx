import React from 'react'
import { useState,useEffect } from 'react'
import userCheck,{insert,getState,getData,getTests,update,updateUser} from './backend.jsx'
import { useSearchParams,useNavigate, Link} from 'react-router-dom';
import NotFound from './notFound.jsx'
function CountdownTimer({reset,setCond}) {
    const [time, setTime] = useState(60); // Initial time in seconds
    const [isActive, setIsActive] = useState(true); // Timer active state
  
    useEffect(() => {
      let timer;
      
      if (isActive && time > 0) {
        // Set up the timer to decrease time every second
        timer = setInterval(() => {
          setTime(prevTime => prevTime - 1);
        }, 1000);
      } else if (time === 0) {
        // Stop the timer when time reaches 0
        setIsActive(false);
        setCond(true)
      }
  
      // Cleanup the interval on component unmount or when timer stops
      return () => clearInterval(timer);
    }, [isActive, time]);
  
    return (
      <div>
        <h1>Time Remaining: {time}s</h1>
        {/* Optional button to reset the timer */}
        <button onClick={() => {
          setTime(60); // Reset time to 60 seconds
          setIsActive(true); // Activate timer
          setCond(false)
          reset()
        }}>Reset</button>
      </div>
    );
}
  
const Free=({uData,setU})=>{
    const [points,setPoints]=useState(0)
    const [question,setQuestion]=useState(['1+1',2])
    const [ans,setAns]=useState('')
    const [message,setMes]=useState('')
    const [timerOver,setCond]=useState(false)
    const [board,setBoard]=useState(null)
    console.log(uData)
    function reset(){
        setPoints(0)
        setQuestion(['1+1',2])
        setAns('')
        setMes('')
       
    }
    
   
    
    
    
    async function updateRecord(){
        const temp=uData
        temp.info.record=points+1
        setU(temp)
        await updateUser({col:'users',id:uData.id,info:temp})
        

    }
    useEffect(()=>{if (points>uData.info.record){
        updateRecord()
    }},[points])
    useEffect(()=>{
        async function leaderboard(){
            const t=await getTests({col:'users'})
            console.log(t)
            setBoard(t.sort((a,b)=>b.info.record-a.info.record))
    
        }
        leaderboard()
    },[uData])
    setTimeout(() => {
        if (parseInt(ans)===question[1]){
            setPoints(points+1)
            setAns('')
            
            const op=Math.floor(Math.random() * 4) + 1;
            if (op===0){
                //addition
                const rand1=Math.floor(Math.random() * 100) + 1;
                const rand2=Math.floor(Math.random() * 100) + 1;    
                setQuestion([`${rand1}+${rand2}`,rand1+rand2])

            }else if (op===1){
                //subtraction
                const rand1=Math.floor(Math.random() * 100) + 1;
                const rand2=Math.floor(Math.random() * 100) + 1;    
                setQuestion([`${rand1}-${rand2}`,rand1-rand2])

            }else if (op===2){
                //multiplication
                const rand1=Math.floor(Math.random() * 12) + 1;
                const rand2=Math.floor(Math.random() * 90) + 1;    
                setQuestion([`${rand1}*${rand2}`,rand1*rand2])
            }else{
                const rand1=Math.floor(Math.random() * 12) + 1;
                const rand2=Math.floor(Math.random() * 90) + 1;    

                setQuestion([`${rand1*rand2}/${rand1}`,rand2])
            }
            

        }

      }, 100);
    console.log(timerOver)
    return(
        <div>
            <p>{question[0]}</p>
            <input value={timerOver?"The Game is Over. Good Job!":ans} onChange={(e)=>setAns(e.target.value)} disabled={timerOver}></input>
            Points: {points}
            <p>{message}</p>
            <CountdownTimer reset={reset} setCond={setCond}></CountdownTimer>
            <p className='record'>Your Record: {uData.info.record}</p>
            <h1>Leaderboard</h1>
            {board===null?'loading...':<ol>{board.map((n,i)=><li key={i}>{n.username}'s Score is {n.info.record}</li>)}</ol>}
        </div>

    )
}
export default Free