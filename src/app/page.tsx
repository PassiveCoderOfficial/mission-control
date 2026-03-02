import { redirect } from 'next/navigation';

export default function HomePage() {
  // For now, redirect to workspaces page
  redirect('/workspaces');
}