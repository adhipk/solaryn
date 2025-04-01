import type React from "react"
import "~/styles/globals.css"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
const inter = Inter({ subsets: ["latin"] })
import {
  Menu,
  Globe,
  Star,
  Calendar,
  Store,
} from "lucide-react"
export const metadata = {
  title: "Athlete Profile",
  description: "Professional athlete profile page",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
    <html lang="en" >
      <body className={inter.className}>
          {children}
          {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center gap-10 justify-center py-3 max-w-full mx-auto">
        <div className="flex flex-col items-center">
          <Menu className="w-5 h-5" />
          <span className="text-xs mt-1">Menu</span>
        </div>
        <div className="flex flex-col items-center">
          <Globe className="w-5 h-5" />
          <span className="text-xs mt-1">Partners</span>
        </div>
        <div className="flex flex-col items-center">
          <Star className="w-5 h-5" />
          <span className="text-xs mt-1">Showroom</span>
        </div>
        <div className="flex flex-col items-center">
          <Store className="w-5 h-5" />
          <span className="text-xs mt-1">Marketplace</span>
        </div>
        <div className="flex flex-col items-center">
          <Calendar className="w-5 h-5" />
          <span className="text-xs mt-1">Events</span>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/5 h-1 bg-black rounded-t-md"></div>
      </div>
      </body>
    </html>
    </ClerkProvider>
  )
}

