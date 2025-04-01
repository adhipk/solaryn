"use client"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { BellIcon, DotIcon, User, User2 } from "lucide-react";
import "~/styles/globals.css";

export default function TopNav({ text }: { text: React.ReactNode }) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 p-4">
      {text}
      <div className="flex gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton>
            <UserButton.MenuItems>
            <UserButton.Link label="My Profile" href="/user-Profile" labelIcon={<User className="w-4 h-4"/>}/>    
            </UserButton.MenuItems>
            
          </UserButton>
        </SignedIn>
        <BellIcon className="h-6 w-6" />
      </div>
    </header>
  );
}
