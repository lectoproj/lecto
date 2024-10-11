"use client"; // Mark this as a client-side component

import { Button, buttonVariants } from '@/components/ui/button';
import { signOut } from 'next-auth/react'; // Client-side signOut
import Image from 'next/image';
import { LogIn, LogOut } from "lucide-react";
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession(); // Use the session on the client side
  const user = session?.user;

  if (!user) {
    return (
      <Link className={buttonVariants({ variant: "outline" })} href="/signin">
        <LogIn className="mr-2 h-4 w-4" />
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={() => signOut()}>
        <LogOut className="mr-2 h-4 w-4" /> 
        Sign Out
      </Button>
      <Image
        className="h-8 w-8 rounded-full"
        src={user.image!}
        height={32}
        width={32}
        alt={`${user.name} avatar`}
      />
    </div>
  );
}
