import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata() {
  return {
    auth: true,
  };
}