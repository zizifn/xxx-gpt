
import { NextRequest, NextResponse } from 'next/server'
import {apiKey, chatCompletionURL} from '../../../utils/openai'

export const config = {
  runtime: 'edge'
  // api: {
  //   bodyParser: true,
  // }
}

export async function GET(request: NextRequest) {
  const message = new URL(request.url).searchParams.get('test') || '';
  const body ={
    model: "gpt-3.5-turbo",
    messages:[
      {
        role: 'user',
        content: message
      }
    ]
  };
  const completionresp = await fetch(chatCompletionURL, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if(completionresp.status!=200){
    console.log('chatCompletionURL returned status', completionresp.status);
  }
  const completion = await completionresp.json();
  // return new Response(completion.choices[0].message?.content)
  return fetch(chatCompletionURL, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
}
