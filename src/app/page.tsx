import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/24/outline'
import { SideBar } from '../components/sidebar'
import { Chats } from '@/components/chats'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex h-full w-full flex-wrap">
      {/* <SideBar></SideBar> */}
      <Chats></Chats>
    </main>
  )
}
