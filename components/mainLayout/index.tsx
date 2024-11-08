'use client'; // Add this to make the entire layout a Client Component
import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { useSession } from 'next-auth/react'; // Import SessionProvider
import Mobile from '@/components/sidebar/mobile';
import Web from '@/components/sidebar/web';
import Navbar from '@/components/navbar';
import { AuthContext } from 'app/contextApi/authContext';
import UserInfo from '../getUserInfo';
import { usePathname, useRouter } from 'next/navigation';
import { NavigationGuard } from '../NavigationGuard';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession(); // Use the session on the client side
  const user = session?.user;

  const authContext = useContext(AuthContext);

  // Check if authContext is defined before destructuring
  const setUserInfo = authContext?.setUserInfo;
  const userInfo = authContext?.userInfo;

  useEffect(()=> {
    if (userInfo?.normalCount === 8) {
        if (pathname === '/lecturas') {
            router.push('/posttest')
        }

    }
  },[userInfo])

  useEffect(() => {
    if (user) {
      getUserInfo();
    }
  }, [user]);

  const getUserInfo = async () => {
    const userData = await fetch('/api/userInfo');
    const response = await userData.json();

    // Ensure setUserInfo exists before calling it
    if (setUserInfo && response.data) {
      setUserInfo(response?.data);
    }
  };

  interface UserInfo {
    name_tutor: string | null;
    email_tutor: string | null;
  }

  const checkRequiredUserInfo = (): boolean => {
    const { name_tutor = '', email_tutor = '' } = userInfo as UserInfo;

    return (
      [name_tutor, email_tutor].some((field) => field == null) &&
      pathname !== '/signin' &&
      user?.email
    );
  };

  return (
    <NavigationGuard>
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* Desktop layout */}
      <div className="hidden border-r lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* Left menu for desktop */}
          <div className="flex h-[60px] items-center border-b px-5">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <Logo />
              <span className="">Lecto</span>
            </Link>
          </div>
          <Web />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b justify-between lg:justify-end">
          {/* Sliding menu for mobile */}
          <Mobile />

          {/* Logo and login button for mobile */}
          <Link
            className="flex items-center gap-2 font-semibold lg:hidden"
            href="/"
          >
            <Logo />
            <span className="">LECTO</span>
          </Link>
          <Navbar />
        </header>

        {checkRequiredUserInfo() ? (
          <UserInfo />
        ) : (
          <main className="bg-light-blue-50 p-6 flex-1">{children}</main>
        )}
      </div>
    </div>
    </NavigationGuard>
  );
};

export default MainLayout;
