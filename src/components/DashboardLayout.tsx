'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white flex flex-col transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <h1 className={`text-lg font-bold ${!sidebarOpen && 'hidden'}`}>Mission Control</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link
            href="/workspaces"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
          >
            <span>🏠</span>
            {sidebarOpen && <span>Workspaces</span>}
          </Link>
          <Link
            href="/agents"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
          >
            <span>🤖</span>
            {sidebarOpen && <span>Agents</span>}
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
          >
            <span>📁</span>
            {sidebarOpen && <span>Projects</span>}
          </Link>
          <Link
            href="/tasks"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
          >
            <span>✅</span>
            {sidebarOpen && <span>Tasks</span>}
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
          >
            <span>📊</span>
            {sidebarOpen && <span>Reports</span>}
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <div className="flex items-center gap-2 px-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              {session?.user?.email?.[0].toUpperCase()}
            </div>
            {sidebarOpen && (
              <span className="truncate text-sm">{session?.user?.email}</span>
            )}
          </div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}