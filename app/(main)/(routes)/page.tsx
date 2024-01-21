import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';

const state = false
;
export default function Home() {
  return (
    <div className="h-screen">
      <UserButton afterSignOutUrl="/"/>
      protected route here
    </div>
  )
}
