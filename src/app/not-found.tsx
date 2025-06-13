'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HomeIcon, MagnifyingGlassIcon, ArrowLeftIcon } from "@radix-ui/react-icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            duration: 0.7, 
            type: "spring", 
            stiffness: 150 
          }}
          className="mx-auto mb-8"
        >
          <h1 className="text-8xl font-black bg-linear-to-br from-accent via-primary to-secondary bg-clip-text text-transparent drop-shadow-lg">
            404
          </h1>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-3xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-muted-foreground mb-8 leading-relaxed"
        >
          Looks like this page decided to take a vacation! Don&apos;t worry, we&apos;ll help you find your way back.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild
              className="bg-linear-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/">
                <HomeIcon className="w-4 h-4 mr-2" />
                Return House
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild 
              variant="outline" 
              className="border-2 hover:bg-muted/50"
            >
              <Link href="/rules">
                <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                Browse Rules
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg bg-linear-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border border-primary/20 dark:border-primary/30 backdrop-blur-sm"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Lost? Try these popular destinations:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link 
                href="/rules" 
                className="text-xs px-3 py-1 rounded-full bg-background/50 dark:bg-muted/20 hover:bg-background/70 dark:hover:bg-muted/30 transition-colors border"
              >
                Rules
              </Link>
              <Link 
                href="/collections" 
                className="text-xs px-3 py-1 rounded-full bg-background/50 dark:bg-muted/20 hover:bg-background/70 dark:hover:bg-muted/30 transition-colors border"
              >
                Collections
              </Link>
              <Link 
                href="/profile" 
                className="text-xs px-3 py-1 rounded-full bg-background/50 dark:bg-muted/20 hover:bg-background/70 dark:hover:bg-muted/30 transition-colors border"
              >
                Profile
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
