'use client';

import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/auth-forms';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
  };

  return (
    <motion.div 
      className="container mx-auto py-10 min-h-[calc(100vh-200px)] flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
    >
      <div className="w-full relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </motion.div>
  );
}
