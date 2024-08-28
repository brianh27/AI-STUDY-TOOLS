import axios from "axios"
import PocketBase from 'pocketbase';    
import { useState,useEffect } from 'react'
export default async function userCheck(props){
    return axios.get("https://ai-study-guides.pockethost.io/api/collections/user_info/records").then((response)=>{
        
        const data=response.data.items
        
        

        const account=data.find(n=>n.username===props.username)
        
        if (account){
            if (account.password==props.password){
                return [true,account.id]
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
    return await pb.collection(props.col).getFullList({
        sort: '-created',
    }).then((response)=>{
        
        return response
    })
}

export async function insert(props){
    
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    return pb.collection(props.col).create(props.data).then(record=>{
        return record.id
    })
    
    
}

export async function update(props) {
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    console.log(props)
    
    const rec=await pb.collection(props.col).getOne(props.id).catch(error => {

        console.error('Failed to update record:', error.message);
        insert({data:{Practice_Tests:props.cards,username:props.edi,editors:''},col:'Test'})
        return 
    
    });
    
    await pb.collection('Test').update(props.id, {
        Practice_Tests: props.cards,
        editors: rec.editors+props.edi
    })
    .then(record => {
        console.log('Record updated:', record);
    })
    .catch(error => {

        console.error('Failed to update record:', error.message);
        insert({data:{Practice_Tests:props.cards,username:props.edi,editors:''},col:'Test'})
    
    });

    
}
export async function getData(props) {
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    console.log(props)
    

    
    return pb.collection(props.col).getOne(props.id)
    .then(record => {

        console.log('Record retrieved:', record);
        return record
    })
    
    
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