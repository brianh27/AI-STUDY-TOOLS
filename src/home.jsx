import React from 'react'
import { useState,useEffect } from 'react'
import Login,{LoggedIn} from './login.jsx'
import { Link } from 'react-router-dom';
import ask from "./aiget.jsx"
import userCheck,{insert,getTests,update} from './backend.jsx'
import { set } from 'mongoose';
const Home=()=>{
    
    const [cards,setCards]=useState(null)
    const [notify,setNotify]=useState(0)
    const [param,setParam]=useState([10,8,2])
    const notifications=['','Please Wait...','Please enter some thing academic related.','Generated practice test. Press this button to save.','Practice Test saved on server!']
    const [mode,setMode]=useState(0)
    const [formatted,setFormat]=useState(null)
    const [num,setNum]=useState(0)
    const [topic,setTopic]=useState(4)
    const [idNum,setID]=useState(null)
    const topics=['Math',"Science",'Social Studies',"Literature",'','Other']
    const [accept,setaccept]=useState(3)
    
    
    if (LoggedIn===undefined){
        return (
            <div>
                <p>You are not logged in. pls log in</p>
                <ul>
                    <li><Link to="/">Go to Login</Link></li>
                    
                </ul>
            </div>
        )
    }
    
    async function generateCards(event){
        
        setNotify(1)
        const formData= new FormData(event.target)
        const response=formData.get('response')
        event.preventDefault()
        const val=await ask({description:`You are a practice test maker. The user will send you a list of their notes or simply a general topic. If the response does not make sense in this context or is not academic, test, or learning related return blank. You must return the exact number of each of the questions I specify. Under no circumstances do you double space lines. Every single sentence must only have 1 space between them. On the first line write the title of the topic. On the second line write three numbers separated by spaces in this order ${param[0]},${param[1]},${param[2]}. Then write EXACTLY ${param[0]} key vocabulary words on every other line (no more no less), then its definition on the line below the question. Then write EXACTLY ${param[1]} questions with one word or phrase answers (NO MORE NO LESS), then its correct answer on the line below the question. Then write EXACTLY ${param[2]} essay prompts regarding the topic (no more no less). YOU MUST HAVE THE EXACT NUMBER OF EACH QUESTION as I specified. NO MORE NO LESS, UNDER NO CIRCUMSTANCES DO YOU GO STRAY FROM THE VALUES I PROVIDED. Use the symbol '\n' to separate lines. NEVER EVER USE '\n' at the start or at the end.`,query:response})


        const subject =await ask({description:`Based on the description given either return the word "Math", "Science", "Literature", "Social Studies" or "Other" based on the subject matter that the user input is based most closely around.`,query:response})

        
        if (val===''){
            setNotify(2)
        }else{
            setNotify(3)
            
            setCards(val+'\n'+subject)
        }
        
        
    }
    const Generate=()=>{
        const Slider=({text,code})=>{
            
            return (
                <div>
                    {text}: 
                    <button onClick={()=>{
                        if (param[code] >1) {
                            const temp = [...param];
                            temp[code] -= 1;
                            setParam(temp);
                        }
                    }}>-</button>
                        {param[code]}
                    <button onClick={()=>{
                        if (param[code] <15) {
                            const temp = [...param];
                            temp[code] += 1;
                            setParam(temp);
                        }
                    }}>+</button>
                </div>
            )
        }
        return(
            <div>
            <p>Paste your a brief summary of your topic or your notes in the box below to generate a study guide</p>

            {notifications[notify]}
            {notify===3 ?<button onClick={()=> {setID(insert({data:cards})); setNotify(4)}}>Save to Server</button>:''}
            <p></p>
            <Slider text={'vocab'} code={0}></Slider>
            <Slider text={'short response'} code={1}></Slider>
            <Slider text={'essay'} code={2}></Slider>
            <p></p>
            <form onSubmit={generateCards}>
                
                <textarea id="response" name="response" rows="10" cols="50" placeholder="Enter your answer here..."></textarea>
                
                <p><button type="submit">Submit</button></p>
                
            </form>
            </div>
        )
    }
    
    const Search=({setCards})=>{
        const [inputValue, setInputValue] = useState("")
        const [test,setTest]=useState(null)
        useEffect(() => {
            const fetchData = async () => {
                const data = await getTests(); // Assuming getTests is a function that fetches data
                
                setTest(data);
            };
    
            fetchData();
        }, []);
        
        if (test===null){
            return(
                <div>
                    <p>Choose a pre-generated study guide of your choice</p>
                    <p>Search for Current Topic: <button onClick={()=>setTopic((topic+1)%6)}>{topics[topic]}</button></p>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <p>loading...</p>
                </div>
            )
        }else{
            
            return(
                <div>
                    <p>Choose a pre-generated study guide of your choice</p>
                    <p>Search for Current Topic: <button onClick={()=>setTopic((topic+1)%6)}>{topics[topic]}</button></p>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    {test.filter(t=>t.Practice_Tests.split('\n')[0].toLowerCase().includes(inputValue.toLowerCase())&& t.Practice_Tests.split('\n')[t.Practice_Tests.split('\n').length-1].includes(topics[topic])).map((n,i)=><li key={i}><button onClick={()=>{setCards(n.Practice_Tests);setID(n.id)}}>{n.Practice_Tests.slice(0,100)}...</button></li>) }
                    <p></p>
                </div>
            )
        }
    
    }
    const [edits,setEdits]=useState('')
    function format(){
        setNum(0)
        console.log('changed')
        if (cards==null){
            setFormat(null)
            return
        }
        setEdits(cards)
        console.log(cards)
        
        const temp=cards.split('\n')
        
        const topic=temp[0]
        
        const count=temp[1].split(' ')
        
        const t=temp.slice(2, 2+parseInt(count[0])*2)
        
        const test=[]        
        for (let i=0; i<t.length;i+=2){
            test.push([0,t[i],t[i+1]] )
        }
        
        const g=temp.slice(parseInt(count[0])*2+2,parseInt(count[0])*2+2+parseInt(count[1])*2)
        
        for (let i=0; i<g.length;i+=2){
            test.push([1,g[i],g[i+1]])
        }

        const h=temp.slice(parseInt(count[0])*2+2+parseInt(count[1])*2,temp.length)
        
        for (let i=0; i<h.length;i+=1){
            test.push([2,h[i]])
        }

        test.push(topic)
        test.push(parseInt(count[0])+parseInt(count[1])+parseInt(count[2]))
        
        setFormat(test)
        
    }
    function changeEdits(event){
        setEdits(event.target.value)
    }
        
    const Write=()=>{
        console.log('render')

        const toAccept=['Please make sure you have a title','Please make sure you have the numbers for the vocab, quiz and essay respectively','Please make sure the number of questions match the numbers given on the second line']
        function updateServer(props){
                
            setCards(props.i)
            
        }
        function check(props){

        }
        return(
            <div>
                <form onSubmit={(event) => {
                        event.preventDefault();
                        updateServer({ i: edits});
                    }}>
                        <textarea
                            id="response"
                            name="response"
                            rows="10"
                            cols="50"
                            placeholder="Enter your answer here..."
                            value={edits} // Controlled input
                            onChange={changeEdits} // Update state on change
                        ></textarea>

                        
                        {accept===3?
                        <div>
                            <p><button type="submit">Update Your Current Study Guide</button></p>
                            <p><button type='button' onClick={()=>update({id:idNum,cards:edits})}>Propogate and save the changes to the server</button></p>
                        </div>
                        :<p>{toAccept[accept]}</p>}
                </form>
                
            </div>
            
        )
    }
    const Display=(props)=>{
        const Vocab=({card})=>{
            return(
                <div>
                    <button onClick={flip===0?()=>setFlip(1):()=>setFlip(0)}>{card[flip+1]}</button>   
                </div>
            )
        }
        const Quiz=({card})=>{
            async function getResult(props){
                setRes("Loading, please wait...")
                const val=await ask({description:`You are a helpful checker bot. You are provided two phrases, the left phrase is the users answer, and the right phrase is the correct solution. Return "Please Type an Anwser" if the anwser is blank. Return if the user answer is either "Excellent" (if there are just a few mistakes), "Incorrect"(if the general definition of the user anwser compelty does not match the solution), "Good" (It matches the answer but there are spelling erros) or "Close enough" (which means the input is a synynom or has a definition similar to that of the solution)`,query:`${props.i} and ${props.ans}`})
                setRes(<div><p>{val}</p> <p>your awnser: {props.i}</p><p>correct anwser: {props.ans}</p></div>)
                
            }
            const handleSubmit=(event)=>{
                event.preventDefault();
                const data=new FormData(event.target);
                const i = data.get('inputField')
                getResult({i:i,ans:card[2]})
                
            }
            return(
                <div>
                    {card[1]}
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Type your Answer Here" name='inputField'/>
                        <button type="submit">Submit</button>
                    </form>
                    {ansResult}
                </div>
            )
        }
        const Essay=({card})=>{
            const [response, setResponse] = useState(""); 
            const [ansResult, setRes] = useState("");
            async function resulter(props){
                
                props.d('Loading. Please Wait...')
                const val=await ask({description:`You are a helpful checker bot. The user response is on the left side. The prompt is on the right side. Give a detailed and nuaced feedback to this essay detailing its qualities and where it can be improved especially with inaccuracies and clearness and organization and concicseness. Limit it to under 150 words.`,query:`${props.i} and ${props.ans}`})
                props.d(val)
            }
            return(
                <div>
                    {card[1]}
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        resulter({ i: response, ans: card[1], d: setRes });
                    }}>
                        <textarea
                            id="response"
                            name="response"
                            rows="10"
                            cols="50"
                            placeholder="Enter your answer here..."
                            value={response} // Controlled input
                            onChange={(e) => setResponse(e.target.value)} 
                        ></textarea>

                        <p><button type="submit">Submit</button></p>
                    </form>
                    {ansResult}
                </div>
            
            )
        }
        const formatted=props.text
        
        const num=props.num
        if (formatted===null){
            return(
                <div>
                    <h1>No Content Yet</h1>
                </div>
            )
        }
        
        return (
            <div>
                {num+1} out of {formatted[formatted.length-1]}
                {formatted[num][0]===0?<Vocab card={formatted[num]}></Vocab>:(formatted[num][0]===1?<Quiz card={formatted[num]}></Quiz>:<Essay card={formatted[num]}></Essay>)}
            </div>
        )
    }
    
    useEffect(()=>format(),[cards])
    const [flip,setFlip]=useState(0)
    const [ansResult,setRes]=useState(null)
    const pages=[<Generate></Generate>,<Search setCards={setCards}></Search>,<Write></Write>,<p></p>]
    
    return(
        <div>
            <h1>AI Study Guide</h1>
            <button onClick={()=>setMode(0)}>Generate</button>
            <button onClick={()=>setMode(1)}>Search</button>
            <button onClick={()=>{setMode(2)}}>Edit</button>
            <button onClick={()=>setMode(3)}>Fullscreen</button>
            {pages[mode]}
            {formatted===null?'':<div><button onClick={()=>{setNum((num-1+(formatted[formatted.length-1])*10)%(formatted[formatted.length-1])); setFlip(0);setRes(null)}}>Previous</button><button onClick={()=>{setNum((num+1+(formatted[formatted.length-1])*10)%(formatted[formatted.length-1])); setFlip(0);setRes(null)}}>Next</button></div>}
            {Display({num:num,text:formatted,flip:flip})}

        </div>
    )
}
export default Home
