import Free from './free.jsx'
import MathOff from './MathOff.jsx'
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react'
import { useSearchParams,useNavigate, Link} from 'react-router-dom';
import userCheck,{getData,logout,getState} from './backend'
function Rush() {
  // Access the mode parameter from the URL
  const [uData,setU]=useState(null)
  if (uData===null){
    const t=getState()     
    
    if (t===false){
        navigate('/not-found')
    }else{
        setU(t)
        
        

        
    }
}
  const { mode } = useParams();
  const navigate = useNavigate();
  const Page=()=>{
    return(
        <div>
            <button onClick={()=>navigate('/rush/timed')}>Timed (1 minute)</button>
            <button onClick={()=>navigate('/rush/math-off')}>math-off</button>
        </div>
    )
  }
  console.log(mode)
  return (
    <div>
      <h1>Rush</h1>
      
      {mode === 'main' && <Page></Page>}
      

      {mode === 'timed' && <Free uData={uData} setU={setU}></Free>}
      {mode === 'math-off' && <MathOff></MathOff>}
      
    </div>
  );
}

export default Rush;