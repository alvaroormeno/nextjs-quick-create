'use client'

import React from 'react'
import axios from 'axios'
import * as z from "zod"
import { cn } from '@/lib/utils'

import { Code } from 'lucide-react'
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';

import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import Heading from '@/components/Heading'
import Loader from '@/components/Loader';

import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {Empty} from '@/components/Empty'
import { UserAvatar } from '@/components/UserAvatar'
import BotAvatar from '@/components/BotAvatar'

import ReactMarkdown from 'react-markdown'

const CodePage = () => {

    const [messages, setMessages] = React.useState<ChatCompletionMessageParam[]>([])

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
        }
    })


    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            
            const userMessage: ChatCompletionMessageParam = {
                role: 'user',
                content: values.prompt,
            }

            const newMessages = [...messages, userMessage]

            const response = await axios.post('/api/code', {
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
                title='Code XP'
                description='Chat with the smartest AI on the planet. Ask questions, get answers, and learn new things.'
                icon={Code}
                iconColor='text-violet-500'
                bgColor='bg-green-700/10'
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
                                        placeholder='How to generate a random number in JavaScript?'
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


                <div className='space-y-4 mt-4'>

                    {isLoading && (
                        <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
                            <Loader />
                        </div>
                    )}

                    {messages.length === 0 && !isLoading && (
                        <Empty label='No Conversation Started'/>
                    )}
                    
                    <div className='flex flex-col-reverse gap-y-4'>
                        {messages.map((message, idx) => (
                            <div 
                                key={`message-${idx}`}
                                className={cn('p-8 w-full flex items-start gap-x-8 rounded-lg', message.role === 'user' ? 'bg-violet-500/10' : 'bg-violet-500/20')}
                            >
                                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}

                                <ReactMarkdown
                                    components={{
                                        pre: ({ node, ...props }) => (
                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                            <pre {...props} />
                                        </div>
                                        ),
                                        code: ({ node, ...props }) => (
                                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                                        )
                                    }}
                                    className="text-sm overflow-hidden leading-7"
                                    >
                                    {String(message.content)}
                                </ReactMarkdown>

                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
        </div>
    )
}

export default CodePage