import Image from 'next/image'
import { Inter } from 'next/font/google'
import Index from "./LandingPage/index"
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
 <>
<Index/>
 </>
  )
}
