import React from 'react'
import { useState,useEffect } from 'react'
import Login,{LoggedIn} from './login.jsx'
import { Link } from 'react-router-dom';
import ask from "./aiget.jsx"
import userCheck,{insert,getData,getTests,update} from './backend.jsx'
import { set } from 'mongoose';
import { useSearchParams,useNavigate } from 'react-router-dom';
import NotFound from './notFound.jsx'
const Guides=()=>{
    const [searchParams] = useSearchParams();
    const [userID,setUserID]=useState(null)
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
    const [test,setTest]=useState(null)
    const [edits,setEdits]=useState(['','','','',''])

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
    function format({t,v,q,e,s}){
        
        setNum(0)
        const info=[]
        const vocab=v.split('\n')
        console.log(vocab)
        for (let i=0;i<vocab.length/2;i+=1){
            info.push([0,vocab[i*2],vocab[i*2+1]])
        }
        const quiz=q.split('\n')
        
        for (let i=0;i<quiz.length/2;i+=1){
            info.push([1,quiz[i*2],quiz[i*2+1]])
        }
        const essay=e.split('\n')
        
        for (let i=0;i<essay.length;i+=1){
            info.push([2,essay[i]])
        }
        info.push(t)
        info.push(s)
        return info
        
    }
    async function generateCards(event){
        
        setNotify(1)
        const formData= new FormData(event.target)
        const response=formData.get('response')
        event.preventDefault()
        const title=await ask({description:`You are a practice test maker. The user will send you a list of their notes or simply a general topic. If the response does not make sense in this context or is not academic, test, or learning related return blank. If the topic is academic return a phrase on one single line which is a title which best embodies the topic of the input the user submitted`,query:response})
        if (title===''){
            setNotify(2)
        }else{
            const v=await ask({description:`You are a practice test maker. Follow my directions EXACTLY, you must be EXACT. The user will send you a list of their notes or simply a general topic. Write EXACTLY ${param[0]} key vocabulary words, and its definition on the line below the question. Then separate the vocab and definition with a blank line. This is the order for an individual chunk: vocab, definition, blank line... and so on You will only be returning EXACTLY ${param[0]} of these chunks.`,query:response})
           
            const q=await ask({description:`You are a practice test maker. Follow my directions EXACTLY, you must be EXACT. The user will send you a list of their notes or simply a general topic that you must base all of your quiz questions around. Write EXACTLY ${param[1]} quiz questions (unnumbered) with  an answer of just a phrase or one word to it. Then space out different questions with a blank line. This is the order: question, answer, blank line... and so on For math and science questions only provide practice problems related to the subject.`,query:response})
            
            const e=await ask({description:`You are a practice test maker. Follow my directions EXACTLY, you must be EXACT. The user will send you a list of their notes or simply a general topic. The only thing you will return is EXACTLY ${param[2]} essay prompts relating to the subject the user inputted. Seperate the essay prompts with one blank line. This is the order: Question, blank line, Question ... and so on`,query:response})
            
            const subject =await ask({description:`Based on the description given either return the word "Math", "Science", "Literature", "Social Studies" or "Other" based on the subject matter that the user input is based most closely around.`,query:response})
            console.log(v)
            let vocabs=v.split('\n').filter(n=>n.trim()!='').join('\n')
            
            
            let quizs=q.split('\n').filter(n=>n.trim()!='').join('\n')
           
            console.log(e)
            let essay=e.split('\n').filter(n=>n.trim()!='').join('\n')
            

            setEdits([vocabs,quizs,essay,subject,title])
            console.log(edits)
            setFormat(format({t:title,v:vocabs,q:quizs,e:essay,s:subject}))
            setID(Math.random())

            setNotify(3)
            
        }
        

        
        
        
        
    }
    
    const Generate=()=>{
        const Slider=({text,code})=>{
            
            return (
                <div>
                    {text}: 
                    <button onClick={()=>{
                        if (param[code] >5) {
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
        async function addToServer(){
            const id=await insert({data:{Practice_Tests:formatted,username:user,editors:''},col:"Test"})
            setID(id)
 
        }
        
        return(
            <div>
            <p>Paste your a brief summary of your topic or your notes in the box below to generate a study guide</p>

            {notifications[notify]}
            {notify===3 ?<button onClick={()=> {addToServer(); setNotify(4)}}>Save to Server</button>:''}
            <p></p>
            <Slider text={'vocab'} code={0}></Slider>
            <Slider text={'short response'} code={1}></Slider>
            <Slider text={'essay'} code={2}></Slider>
            <p></p>
            <form onSubmit={generateCards}>
                
                <textarea id="response" name="response" rows="10" cols="50" placeholder="ej. asymptotes, precalculus, science, geometry..."></textarea>
                
                <p><button type="submit">Submit</button></p>
                
            </form>
            </div>
        )
    }
    
    const Search=()=>{
        const [inputValue, setInputValue] = useState("")
        
        
        
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
                    {test.filter(t=>t.Practice_Tests[t.Practice_Tests.length-2].toLowerCase().includes(inputValue.toLowerCase())&& t.Practice_Tests[t.Practice_Tests.length-1].includes(topics[topic])).map((n,i)=><li key={i}>
                    <button onClick={()=>{setFormat(n.Practice_Tests);setID(n.id);
                    
                        setEdits([n.Practice_Tests.map((t,i)=>t[0]===0?'\n'+t[1]+'\n'+t[2]:'').join('').slice(1,10000),n.Practice_Tests.map(t=>t[0]===1?'\n'+t[1]+'\n'+t[2]:'').join('').slice(1,10000),n.Practice_Tests.map(t=>t[0]===2?'\n'+t[1]:'').join('').slice(1,10000),n.Practice_Tests[n.Practice_Tests.length-1],n.Practice_Tests[n.Practice_Tests.length-2]])}}>
                        {n.Practice_Tests[n.Practice_Tests.length-2].slice(0,100)}...</button> Created by: {n.username} {n.editors!=''&&'Edited by:'+n.editors} </li>) }
                    <p></p>
                </div>
            )
        }
        
    }
    //useEffect(console.log(formatted),[formatted])
    
    const Write=()=>{
    

        const toAccept=['Please make sure you have a title','Please make sure you have a topic','Please make sure your vocab each have definitions below them','Please make sure your quiz questions each have anwsers below them',"Please make sure you have an essay prompt"]
        function updateServer({i}){
                
            
            setFormat(format({t:i[4],v:i[0],q:i[1],e:i[2],s:i[3]}))
            
        }
        function processChange({ e, i }) {
            setEdits((edits) => {
                const newEdits = [...edits];
                newEdits[i] = e.target.value;
                return newEdits;
            });
        }
        function check(){
            if (edits[4].trim().length===0){
                setaccept(0)
            }else if (edits[3].trim().length===0){
                setaccept(1)
            }else if (edits[0].split('\n').length%2===1||edits[0].split('\n').find(n=>n.trim().length===0)!=undefined){
                setaccept(2)
            }else if (edits[1].split('\n').length%2===1 ||edits[1].split('\n').find(n=>n.trim().length===0)!=undefined){
                setaccept(3)
            }else if (edits[2].split('\n').length===0||edits[2].split('\n').find(n=>n.trim().length===0)!=undefined){
                setaccept(4)
            }else
            {
                setaccept(5)
            }
        }
        check()
        return(
            <div>
                <form onSubmit={(event) => {
                        event.preventDefault();
                        updateServer({ i: edits});
                    }}>
                        <p><input placeholder="Enter your title" value={edits[4]} onChange={(e)=>processChange({e:e,i:4})}></input></p>
                        <p><input placeholder="Enter your topic" value={edits[3]} onChange={(e)=>processChange({e:e,i:3})}></input></p>
                        <textarea
                            id="vocab"
                            name="vocab"
                            rows="10"
                            cols="50"
                            placeholder="Enter your vocab with its definition on the line below"
                            defaultValue={edits[0]}
                            
                            onChange={(e)=>processChange({e:e,i:0})}
                            
                        ></textarea>
                        <textarea
                            id="quiz"
                            name="quiz"
                            rows="10"
                            cols="50"
                            placeholder="Enter your quiz question with its anwser on the line below"
                            defaultValue={edits[1]}
                            //value={edits[1]} // Controlled input
                            onChange={(e)=>processChange({e:e,i:1})}
                        ></textarea>
                        <textarea
                            id="essay"
                            name="essay"
                            rows="10"
                            cols="50"
                            placeholder="Enter your essay prompts"
                            defaultValue={edits[2]}
                            //value={edits[2]} // Controlled input
                            onChange={(e)=>processChange({e:e,i:2})}
                        ></textarea>

                        
                        {accept===5?
                        <div>
                            <p><button type="submit">Update Your Current Study Guide</button></p>
                            <p><button type='button' onClick={()=>update({edi:user,id:idNum,col:'Test',cards:format({t:edits[4],v:edits[0],q:edits[1],e:edits[2],s:edits[3]})})}>Propogate and save the changes to the server</button></p>
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
                <h1>{formatted[formatted.length-2]}</h1>
                {<div><button onClick={()=>{setNum((num-1+(formatted.length-2)*10)%(formatted.length-2)); setFlip(0);setRes(null)}}>Previous</button><button onClick={()=>{setNum((num+1+(formatted.length-2)*10)%(formatted.length-2)); setFlip(0);setRes(null)}}>Next</button></div>}
                {num+1} out of {formatted.length-2}
                {formatted[num][0]===0?<Vocab card={formatted[num]}></Vocab>:(formatted[num][0]===1?<Quiz card={formatted[num]}></Quiz>:<Essay card={formatted[num]}></Essay>)}
            </div>
        )
    }
    
    const navigate = useNavigate();
    const [flip,setFlip]=useState(0)
    const [ansResult,setRes]=useState(null)
    const pages=[<Generate></Generate>,<Search setCards={setCards}></Search>,<Write></Write>,<p></p>]
    useEffect(() => {
        const fetchData = async () => {
            const data = await getTests({col:"Test"}); 
            
            setTest(data);
        };

        fetchData();
    }, [mode]);
    const [user,setUser]=useState(null)

    async function getUser({i}){
        const u=await getData({id:i,col:'user_info'})
        navigate('/guides', { replace: true });
        setUser(u.username)
    }
    if (user===null){
        
        const iden = searchParams.get('confidential');
        if (iden===null){
            console.log('notFound')
            navigate('/not-found')
        }
        setUser(1)
        setUserID(iden)
        console.log(iden)
        getUser({i:iden})
        
    }
    return(
        <div>
            <h1>AI Study Guide</h1>
            <button onClick={()=>setMode(0)}>Generate</button>
            <button onClick={()=>setMode(1)}>Search</button>
            <button onClick={()=>{setMode(2)}}>Edit</button>
            <button onClick={()=>setMode(3)}>Fullscreen</button>
            <button onClick={()=>navigate(`/home?confidential=${userID}`)}>Go to Home</button>
            {pages[mode]}
            
            {Display({num:num,text:formatted,flip:flip})}

        </div>
    )
}
export default Guides