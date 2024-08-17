import React from 'react'

import { Menu } from 'lucide-react'

// SHADCN COMPONENTS
import { Button } from '@/components/ui/button'
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet'
// COMPONENTS
import { Sidebar } from './Sidebar'

const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger>

                <Button variant={'ghost'} size={'icon'} className='md:hidden' asChild>
                    <Menu/>
                </Button>

            </SheetTrigger>

            <SheetContent side="left" className='p-0'>
                <Sidebar />
            </SheetContent>

        </Sheet>
        
    )
}

export default MobileSidebar