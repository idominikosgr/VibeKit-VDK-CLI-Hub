'use client';

import { LoginForm } from '@/components/auth/auth-forms';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto py-10">
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
}
