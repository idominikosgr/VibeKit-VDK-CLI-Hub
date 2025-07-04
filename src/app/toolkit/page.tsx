"use client";

import Link from "next/link";
import React from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

// Enhanced animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Animated terminal demo
const TerminalDemo = () => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const terminalSteps = [
    {
      command: "curl -fsSL https://cli.vdk.tools | sh",
      output: [
        "🚀 Installing VibeKit VDK...",
        "✅ VDK Toolkit installed successfully!",
        "📡 Ready to analyze your projects",
      ],
    },
    {
      command: "vdk analyze",
      output: [
        "🔍 Analyzing project architecture...",
        "📊 Detected: React + TypeScript + Next.js + Tailwind",
        "🎯 Found 847 files across 23 directories",
        "🧠 Identifying patterns and conventions...",
        "⚡ Analysis complete!",
      ],
    },
    {
      command: "vdk generate",
      output: [
        "🔥 Generating intelligent rule toolkit...",
        "📦 Creating .ai/rules/ directory structure",
        "🎨 Applying project-specific customizations",
        "🧬 Processing 51+ specialized rules",
        "✨ Generated 23 context-aware rules",
        "🚀 Your AI assistant is now project-aware!",
      ],
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % terminalSteps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, terminalSteps.length]);

  return (
    <div className="relative bg-gray-900 dark:bg-gray-950 rounded-2xl p-6 shadow-2xl border border-gray-800 overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-4 text-gray-400 text-sm font-mono">
          VibeKit VDK
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-gray-400 hover:text-white"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Icons.spinner className="h-4 w-4" />
          ) : (
            <Icons.chevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Terminal content */}
      <div className="font-mono text-sm space-y-3 min-h-[200px]">
        <div className="text-green-400">$ {terminalSteps[step].command}</div>
        {terminalSteps[step].output.map((line, i) => (
          <motion.div
            key={`${step}-${i}`}
            className="text-gray-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3, duration: 0.4 }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2 mt-6">
        {terminalSteps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === step ? "bg-primary w-8" : "bg-gray-700 w-2"
            )}
          />
        ))}
      </div>
    </div>
  );
};

// IDE support showcase
const IDESupportCard = ({
  ide,
  description,
  icon,
  features,
}: {
  ide: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
    >
      <Card className="h-full bg-gradient-to-br from-card via-card/90 to-muted/30 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              {icon}
            </div>
            <CardTitle className="group-hover:text-primary transition-colors duration-300">
              {ide}
            </CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-2 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={
                  isHovered ? { opacity: 1, x: 0 } : { opacity: 0.7, x: 0 }
                }
                transition={{ delay: i * 0.1 }}
              >
                <Icons.check className="h-4 w-4 text-success flex-shrink-0" />
                {feature}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Animated stats counter
const AnimatedStat = ({
  value,
  label,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <div className="text-4xl font-bold text-primary mb-2">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export default function FrameworkPage() {
  const { scrollYProgress } = useScroll();
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/5 to-pink-500/10"
          style={{ y: yTransform, opacity: opacityTransform }}
        />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge variant="outline" className="mb-6 px-6 py-3 text-lg">
                <Icons.terminal className="mr-3 h-5 w-5" />
                The AI Context Toolkit
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent"
            >
              Your AI Assistant
              <br />
              Just Got
              <span className="text-primary"> Project-Aware</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12"
            >
              <span className="text-primary font-semibold">
                Stop repeating yourself to your AI assistant.
              </span>{" "}
              One command deploys intelligent, context-aware rules that
              transform any AI tool into a
              <span className="text-primary font-semibold">
                {" "}
                project-aware coding expert
              </span>
              .
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              <Button
                size="lg"
                className="group relative text-xl px-12 py-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20 overflow-hidden"
                style={{
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 3px rgba(255, 255, 255, 0.2)
                  `,
                }}
                asChild
              >
                <a
                  href="https://github.com/idominikosgr/VibeKit-VDK-CLI"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Icons.download className="mr-4 h-6 w-6 relative drop-shadow-sm" />
                  <span className="relative drop-shadow-sm">Get Toolkit</span>
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-xl px-12 py-8 hover:scale-105 transition-transform duration-300 bg-background/50 backdrop-blur-sm border-primary/30"
                asChild
              >
                <Link href="/generate">
                  <Icons.brain className="mr-4 h-6 w-6" />
                  Try VibeKit Generator
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Installation Demo Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-8"
            >
              <Badge variant="outline" className="w-fit px-4 py-2">
                <Icons.performance className="mr-2 h-4 w-4" />
                One-Command Intelligence
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight">
                From Generic AI to
                <span className="text-primary"> Project Genius</span>
                <br />
                in Seconds
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The VDK analyzes your project structure, identifies your coding
                patterns, and automatically generates intelligent context that
                makes your AI assistant understand your codebase like a senior
                developer who's been on your team for months.
              </p>
              <div className="flex gap-6">
                <Button
                  className="hover:scale-105 transition-transform text-lg px-8 py-4"
                  asChild
                >
                  <a
                    href="https://github.com/idominikosgr/VibeKit-VDK-CLI"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.github className="mr-2 h-5 w-5" />
                    View on GitHub
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  className="hover:scale-105 transition-transform text-lg px-8 py-4"
                  asChild
                >
                  <Link href="/docs">
                    Read Documentation
                    <Icons.chevronRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <TerminalDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* IDE Support Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <Badge variant="outline" className="mb-8 px-6 py-3">
              <Icons.tools className="mr-3 h-4 w-4" />
              Universal Compatibility
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-8">
              Works With Every
              <span className="text-primary"> AI Tool You Love</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Deploy once, benefit everywhere. The toolkit generates compatible
              rule sets for all major IDEs and AI assistants.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <IDESupportCard
                ide="Cursor"
                description="Native .ai/rules/ integration"
                icon={<Icons.code className="h-6 w-6 text-primary" />}
                features={[
                  "Auto-detects rule files",
                  "Context-aware suggestions",
                  "Zero configuration needed",
                ]}
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <IDESupportCard
                ide="VS Code"
                description="Works with Copilot, CodeWhisperer, Claude"
                icon={<Icons.code className="h-6 w-6 text-blue-500" />}
                features={[
                  "Multi-extension support",
                  "Workspace integration",
                  "Custom rule deployment",
                ]}
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <IDESupportCard
                ide="JetBrains"
                description="WebStorm, IntelliJ, PyCharm support"
                icon={<Icons.code className="h-6 w-6 text-orange-500" />}
                features={[
                  "AI Assistant integration",
                  "Project-aware context",
                  "Language-specific rules",
                ]}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-8">
              Systematic Intelligence.
              <br />
              <span className="text-primary">Not Random Suggestions.</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800/30">
                <CardHeader>
                  <Icons.search className="h-12 w-12 text-emerald-600 mb-4" />
                  <CardTitle className="text-2xl">
                    Intelligent Analysis
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Analyzes your entire codebase to understand patterns,
                    conventions, and architecture decisions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800/30">
                <CardHeader>
                  <Icons.brain className="h-12 w-12 text-blue-600 mb-4" />
                  <CardTitle className="text-2xl">Context Generation</CardTitle>
                  <CardDescription className="text-lg">
                    Generates project-specific rules that teach your AI about
                    your unique coding style and requirements.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800/30">
                <CardHeader>
                  <Icons.performance className="h-12 w-12 text-purple-600 mb-4" />
                  <CardTitle className="text-2xl">Instant Deployment</CardTitle>
                  <CardDescription className="text-lg">
                    Deploys rules to the right format for your IDE and AI tools,
                    working immediately without configuration.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid md:grid-cols-4 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <AnimatedStat value={51} label="Specialized Rules" suffix="+" />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <AnimatedStat value={23} label="IDE Integrations" delay={200} />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <AnimatedStat value={847} label="Files Analyzed" delay={400} />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <AnimatedStat
                value={98}
                label="Accuracy Score"
                suffix="%"
                delay={600}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-black tracking-tight mb-8"
            >
              Ready to Give Your AI
              <br />
              <span className="text-primary">Project Superpowers?</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            >
              Transform your AI assistant from generic helper to project-aware
              genius with one command.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-6 font-mono text-left max-w-2xl mx-auto">
                <div className="text-green-400 text-lg">
                  $ curl -fsSL https://cli.vdk.tools | sh
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <a
                    href="https://github.com/idominikosgr/VibeKit-VDK-CLI"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icons.download className="mr-3 h-5 w-5" />
                    Install Toolkit
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="text-xl px-12 py-6 hover:scale-105 transition-transform duration-300"
                  asChild
                >
                  <Link href="/generate">
                    <Icons.brain className="mr-3 h-5 w-5" />
                    Try VibeKit Generator
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
