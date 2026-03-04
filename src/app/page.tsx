import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the enhanced dashboard
  redirect('/dashboard/enhanced-dashboard');
}