'use client'

import React from 'react'
import axios from 'axios'
import * as z from "zod";

import { MessageSquare } from 'lucide-react'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';

import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import Heading from '@/components/Heading'

import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {Empty} from '@/components/Empty'

const ConversationPage = () => {

    const [messages, setMessages] = React.useState<ChatCompletionMessageParam[]>([])

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
        }
    })


    console.log('messages', messages)


    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            
            const userMessage: ChatCompletionMessageParam = {
                role: 'user',
                content: values.prompt,
            }

            const newMessages = [...messages, userMessage]

            const response = await axios.post('/api/conversations', {
                messages: newMessages
            })

            

            setMessages((current) => {
                return [
                    ...current, 
                    userMessage,
                    {
                        role: 'assistant',
                        content: response.data.content
                    }
                ]
            })


            form.reset()

        } catch (error) {
            // todo open pro modal
            console.error(error)
        } finally {
            router.refresh()
        }
    }


    return (
        <div>
            <Heading 
                title='Conversation'
                description='Chat with the smartest AI on the planet. Ask questions, get answers, and learn new things.'
                icon={MessageSquare}
                iconColor='text-violet-500'
                bgColor='bg-violet-500/10'
            />

            <div className='px-4 lg:px-8'>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='rounded-lg border w-fulln p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
                    >

                    <FormField 
                        name='prompt'
                        render={({field}) => (
                            <FormItem className='col-span-12 lg:col-span-10'>
                                <FormControl className="m-0 p-0">
                                    <Input 
                                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                                        disabled={isLoading}
                                        placeholder='Ask me anything... How does a computer work?'
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button className='col-span-12 lg:col-span-2 w-full' disabled={isLoading}>
                        Generate
                    </Button>
                    </form>
                </Form>
            </div>

            <div className='space-y-4 mt-4'>

                {messages.length === 0 && !isLoading && (
                    <Empty label='No Conversation Started'/>
                )}
                
                <div className='flex flex-col-reverse gap-y-4'>
                    {messages.map((message, idx) => (
                        <div key={`message-${idx}`}>
                            {String(message.content)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ConversationPage