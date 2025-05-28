'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { errorLogger } from '@/lib/error-handling';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our monitoring system
    errorLogger.log(error, 'Page Error');
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            duration: 0.5, 
            type: "spring", 
            stiffness: 200 
          }}
          className="mx-auto mb-8 w-20 h-20 rounded-full bg-linear-to-br from-destructive/80 to-destructive flex items-center justify-center shadow-lg"
        >
          <AlertTriangle className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-destructive mb-4"
        >
          Oops! Something went wrong
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-muted-foreground mb-8 leading-relaxed"
        >
          We&apos;re sorry, something went wrong. Please try refreshing the page or contact support if the problem persists.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => reset()}
              className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild variant="outline" className="border-2 hover:bg-muted/50">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go home
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {process.env.NODE_ENV !== 'production' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 p-4 rounded-lg bg-linear-to-br from-destructive/10 to-destructive/20 dark:from-destructive/10 dark:to-destructive/20 border border-destructive/30 backdrop-blur-sm"
          >
            <p className="font-mono text-sm text-destructive dark:text-destructive/90 leading-relaxed">
              {error.message}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
