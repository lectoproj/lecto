"use client"; // Add this to make the entire layout a Client Component

import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider
import MainLayout from '@/components/mainLayout';
import './globals.css';
import { AuthContextProvider } from './contextApi/authContext';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full bg-light-blue-50">
      <body className="bg-light-blue-50">
        <AuthContextProvider>
          <SessionProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <Analytics />
          </SessionProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
