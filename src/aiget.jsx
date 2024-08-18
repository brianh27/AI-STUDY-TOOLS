import { useState } from 'react'
import OpenAI from "openai";

const part1='sk-proj-qE6kcWMOHs-7A9bjcmMatv0etsUBLh_Ue9QEFjmgCeCUfUDiXYz'
const part2='TAfiCzXT3BlbkFJ_wb6jEapceKbOkEEYe2wuuF56d6fA7bUgIR2Fit2Zyplk7arYCyvF_hVAA'

const openai = new OpenAI({apiKey:part1+part2,dangerouslyAllowBrowser: true});


async function ask(props) {
    
    
    
    return await openai.chat.completions.create({

        messages: [{"role": "system", "content": props.description},{'role':'user','content':props.query}],
      model: "gpt-4o-mini",
    }).then(completion=>{
        const message=completion.choices[0].message.content
        return message
    })

    
}

  

export default ask
