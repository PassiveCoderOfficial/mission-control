'use client';

import { SessionProvider } from 'next-auth/react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}