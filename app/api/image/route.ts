import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server"
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})



export async function POST(req: Request) {
    try {

        console.log('IT IS BEING CALLED')
        
        
        
        const body = await req.json()
        const { prompt, amount = 1, resolution = '512x512' } = body

    

        const { userId } = auth()
        

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!openai.apiKey) {
            return new NextResponse('OpenAI API Key is required.', { status: 500 })
        }

        if (!prompt) {
            return new NextResponse('Prompt is required.', { status: 400 })
        }

        if (!amount) {
            return new NextResponse('Amount is required.', { status: 400 })
        }

        if (!resolution) {
            return new NextResponse('Resolution is required.', { status: 400 })
        }


        console.log('IT IS BEING CALLED userId', userId)


        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution
        });

        console.log('IT IS BEING CALLED response', response)

        return NextResponse.json(response.data);

    } catch (error) {
        console.log('CONVERSATIONN ERROR', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}