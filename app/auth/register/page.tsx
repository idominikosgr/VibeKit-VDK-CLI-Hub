'use client';

import { RegisterForm } from '@/components/auth/auth-forms';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto py-10">
      <RegisterForm onSuccess={handleSuccess} />
    </div>
  );
}
