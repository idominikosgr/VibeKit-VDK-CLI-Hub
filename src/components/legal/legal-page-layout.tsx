"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Icons } from "@/components/icons";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  icon?: keyof typeof Icons;
  lastUpdated?: string;
  children: ReactNode;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function LegalPageLayout({
  title,
  description,
  icon = "documentation",
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  const IconComponent = Icons[icon];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="flex justify-center mb-6"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {description}
          </motion.p>

          {lastUpdated && (
            <motion.div
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground border"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Icons.refresh className="w-4 h-4" />
              Last updated: {lastUpdated}
            </motion.div>
          )}
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="relative"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
          </div>

          {/* Content card */}
          <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="space-y-8">{children}</div>
            </div>
          </div>
        </motion.div>

        {/* Footer Section */}
        <motion.div
          className="mt-12 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-muted/30 rounded-full text-sm text-muted-foreground border">
            <Icons.logo className="w-4 h-4" />
            <span>VibeKit VDK Hub</span>
            <span>•</span>
            <span>Building better AI-assisted development</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
