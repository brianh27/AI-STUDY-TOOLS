import { useState } from 'react'
import OpenAI from "openai";

const part1='sk-proj-f5QpNFSHwRlrwjj3UXLPQVSclV1onm2rs-ojWZMtdSVqJ_n_Qc5U72C0xISiQ9vsh46C'
const part2='MgPK6AT3BlbkFJ8cCh5fZRZc7-Ok-2w4bfn9afW54ZO3RBu79EGR0_SmyJ-uf-rSaij3CtDXfm4K0YsxHb5VZ80A'

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
