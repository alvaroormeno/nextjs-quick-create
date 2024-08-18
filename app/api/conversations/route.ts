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
        const { messages } = body

        
        console.log('IT IS BEING CALLED messages', messages)
        console.log('IT IS BEING CALLED body', body)

        const { userId } = auth()
        

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!openai.apiKey) {
            return new NextResponse('OpenAI API Key is required.', { status: 500 })
        }

        if (!messages) {
            return new NextResponse('Messages is required.', { status: 400 })
        }


        console.log('IT IS BEING CALLED userId', userId)


        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages
        })

        console.log('IT IS BEING CALLED response', response)

        return NextResponse.json(response.choices[0].message)

    } catch (error) {
        console.log('CONVERSATIONN ERROR', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}