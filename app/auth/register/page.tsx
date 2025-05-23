'use client';

import { motion } from 'framer-motion';
import { RegisterForm } from '@/components/auth/auth-forms';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
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
            className="absolute top-1/3 left-1/3 w-36 h-36 bg-success/20 dark:bg-success/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 120, 240, 360]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/3 w-44 h-44 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.3, 1, 1.3],
              rotate: [360, 240, 120, 0]
            }}
            transition={{ 
              duration: 22,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <RegisterForm onSuccess={handleSuccess} />
      </div>
    </motion.div>
  );
}
