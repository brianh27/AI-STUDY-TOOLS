import axios from "axios"
import PocketBase from 'pocketbase';    

export default async function userCheck(props){
    return axios.get("https://ai-study-guides.pockethost.io/api/collections/user_info/records").then((response)=>{
        
        const data=response.data.items
        
        

        const account=data.find(n=>n.email===props.username)
        
        if (account){
            if (account.password==props.password){
                return true
            }else{
                return 'Password Incorrect'
            }
        }else{
            return 'Email not found'
        }
    }).catch((err)=>{
        console.log("Error: ",err.message)
    })
}

export async function getTests(props){
    
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    return await pb.collection('Test').getFullList({
        sort: '-created',
    }).then((response)=>{
        
        return response
    })
}

export async function insert(props){
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    const record = await pb.collection('Test').create({Practice_Tests:props.data});
    
    return record.id
}
export async function update(props) {
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    console.log(props.cards)
    // Pass the ID and the object with the fields to update separately
    const record = await pb.collection('Test').update(props.id, {
        Practice_Tests: props.cards
    })
    .then(record => {
        console.log('Record updated:', record);
    })
    .catch(error => {
        console.error('Failed to update record:', error.message);
        insert({data:props.cards})
      
    });
    
}


function test(){
    
    axios.get("http://localhost:8090/api/collections/Messages/records").then((response)=>{
        console.log('data',response.data)
        const data=response.data
    }).catch((err)=>{
        console.log("Error: ",err.message)
    })
    const messageData = {
        Message: "Hello",
        collectionId: "ba4i0tco6r8xx15",
        collectionName: "Messages",
        created: "2024-08-16 00:25:10.012Z",
        id: "ib83hr4fsxa9q6r",
        updated: "2024-08-16 00:25:10.012Z"
      };
    axios.post("http://localhost:8090/api/collections/Messages/records",messageData).then((response)=>{
        console.log(response)
    })
}