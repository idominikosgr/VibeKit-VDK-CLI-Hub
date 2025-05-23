'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

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
          <h1 className="text-8xl font-black bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
            404
          </h1>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent mb-4"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-muted-foreground mb-8 leading-relaxed"
        >
          Looks like this page decided to take a vacation! Don't worry, we'll help you find your way back.
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
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Return Home
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
                <Search className="w-4 h-4 mr-2" />
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
            className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 backdrop-blur-sm"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Lost? Try these popular destinations:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link 
                href="/rules" 
                className="text-xs px-3 py-1 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors border"
              >
                Rules
              </Link>
              <Link 
                href="/collections" 
                className="text-xs px-3 py-1 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors border"
              >
                Collections
              </Link>
              <Link 
                href="/profile" 
                className="text-xs px-3 py-1 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white/70 dark:hover:bg-black/30 transition-colors border"
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
