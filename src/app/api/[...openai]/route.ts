
import { NextRequest, NextResponse } from 'next/server'
import { apiKey, chatCompletionURL } from '../../../utils/openai'

export const config = {
  runtime: 'edge'
  // api: {
  //   bodyParser: true,
  // }
}

export async function POST(request: NextRequest, { params }: {
  params: {
    openai: string[]
  }
}) {
  // https://api.openai.com/api/proxy/v1/chat/completions
  console.log(params);
  const openaiPath = params.openai.join('/');
  const openaiUrl = `https://api.openai.com/${openaiPath}`;
  // console.log(openaiUrl);
  let openaiRequest = new NextRequest(new URL(openaiUrl), request);
  Array.from(openaiRequest.headers.keys()).forEach(key => {
    openaiRequest.headers.delete(key);
  })
  openaiRequest.headers.set('Content-Type', "application/json");
  openaiRequest.headers.set('authorization', `Bearer ${apiKey}`);  
  return fetch(openaiRequest);
}
