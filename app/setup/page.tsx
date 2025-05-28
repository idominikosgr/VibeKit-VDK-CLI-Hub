'use client';

import { motion } from 'framer-motion';
import { ModernSetupWizard } from "@/components/setup/modern-setup-wizard"
import { Settings, Sparkles, Wand2, Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export default function SetupPage() {
  return (
    <motion.div 
      className="container py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex flex-col items-center gap-8 text-center mb-12"
        variants={itemVariants}
      >
        <div className="relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              className="absolute -top-8 -left-8 w-16 h-16 bg-primary/20 dark:bg-primary/10 rounded-full blur-xl"
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
              className="absolute -bottom-8 -right-8 w-20 h-20 bg-accent/20 dark:bg-accent/10 rounded-full blur-xl"
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

          <motion.div
            className="relative p-8 rounded-3xl bg-linear-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border border-primary/20 dark:border-primary/30 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-accent/5 rounded-3xl"></div>
            
            <div className="relative space-y-6">
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Settings className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.h1 
                className="text-5xl font-bold tracking-tight lg:text-6xl bg-linear-to-r from-primary to-accent bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Setup Wizard
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-[700px] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Configure and download CodePilotRules tailored to your project needs.
                Follow our step-by-step wizard to generate a personalized rules package.
              </motion.p>

              <motion.div 
                className="flex justify-center gap-6 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {[
                  { icon: Sparkles, color: "from-primary/60 to-primary", label: "Smart" },
                  { icon: Wand2, color: "from-accent/60 to-accent", label: "Easy" },
                  { icon: Zap, color: "from-secondary/60 to-secondary", label: "Fast" }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-12 h-12 rounded-full bg-linear-to-br ${item.color} flex items-center justify-center shadow-md`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <ModernSetupWizard />
      </motion.div>
    </motion.div>
  )
}
