import axios from "axios"
import PocketBase from 'pocketbase';    
import { useState,useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
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
        console.log(response)
        return response
    })
}

export async function insert(props){
    
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    return pb.collection(props.col).create(props.data).then(record=>{
        return record.id
    }).catch(error=>{
        return false
    })
    
    
}

export async function update(props) {
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    console.log(props)
    
    try{
        const rec=await pb.collection(props.col).getOne(props.id)
        try{
        return await pb.collection('Test').update(props.id, {
            Practice_Tests: props.cards,
            editors: rec.editors===null?[props.edi]:rec.editors.concat([props.edi])
        })
        .then(record => {
            console.log('Record updated:', record);
            return true
        })
        }
        catch(e){
            
            
            const temp=await insert({data:{Practice_Tests:props.cards,username:props.edi,editors:null},col:'Test'})
            return temp
        
        }
    }catch(e){

        
        const temp=await insert({data:{Practice_Tests:props.cards,username:props.edi,editors:null},col:'Test'})
        return temp
    }
    
    
    

    
}
export async function updateUser({col,id,info}){
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    await pb.collection(col).update(id, info)
    .then(record => {
        console.log('Record updated:', record);
    })
}
export async function login({i,email,password,event}){
    console.log('a')
    
    i(true)
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    return await pb.collection('users').authWithPassword(email,password)
    .then(()=>{
        console.log('logged in ')
        i(false)
        return true
    })
    .catch(e => {
        console.log(e)
        i(false)
        return false
    });
    



}
export function getState (){
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    if (pb.authStore.isValid){
        return pb.authStore.model
    }else{
        return false
    }
    
}
export function logout({nav}){
    
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    pb.authStore.clear()
    nav('/not-found')
    
}

export async function getData(props) {
    const pb = new PocketBase('https://ai-study-guides.pockethost.io/');
    console.log(props)
    

    
    return pb.collection(props.col).getOne(props.id)
    .then(record => {

        console.log('Record retrieved:', record);
        return record
    }).catch(error=>{
        return false
    })
    
    
}
