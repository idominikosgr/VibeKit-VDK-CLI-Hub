"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { Rule } from "@/lib/types";
import {
  WarningIcon,
  CaretRightIcon,
  DownloadIcon,
  CopyIcon,
  EyeIcon,
  CalendarIcon,
  HashIcon,
  CpuIcon,
  SparkleIcon,
  FileTextIcon,
  StackIcon,
} from "@phosphor-icons/react";
import { RuleModal } from "@/components/rules/rule-modal";
import { RuleActions } from "@/components/rules/rule-actions";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

// Define the rule page props
interface RulePageProps {
  params: Promise<{
    category: string;
    ruleId: string;
  }>;
}

// Helper function to sanitize rule data for client-side consumption
function sanitizeRuleData(rule: any): Rule {
  return {
    id: typeof rule.id === "string" ? rule.id : "",
    title: typeof rule.title === "string" ? rule.title : "",
    slug: typeof rule.slug === "string" ? rule.slug : "",
    path: typeof rule.path === "string" ? rule.path : "",
    description: typeof rule.description === "string" ? rule.description : "",
    content: typeof rule.content === "string" ? rule.content : "",
    version: typeof rule.version === "string" ? rule.version : "1.0.0",
    category_id: typeof rule.category_id === "string" ? rule.category_id : "",
    votes: typeof rule.votes === "number" ? rule.votes : null,
    downloads: typeof rule.downloads === "number" ? rule.downloads : null,
    tags: Array.isArray(rule.tags) ? rule.tags : null,
    globs: Array.isArray(rule.globs) ? rule.globs : null,
    last_updated:
      typeof rule.last_updated === "string" ? rule.last_updated : null,
    created_at: typeof rule.created_at === "string" ? rule.created_at : null,
    updated_at: typeof rule.updated_at === "string" ? rule.updated_at : null,
    always_apply:
      typeof rule.always_apply === "boolean" ? rule.always_apply : null,
    compatibility:
      typeof rule.compatibility === "object" && rule.compatibility
        ? rule.compatibility
        : null,
    examples:
      typeof rule.examples === "object" && rule.examples ? rule.examples : null,
    categoryName:
      typeof rule.categoryName === "string" ? rule.categoryName : undefined,
    categorySlug:
      typeof rule.categorySlug === "string" ? rule.categorySlug : undefined,
  };
}

export default function RulePage({ params }: RulePageProps) {
  const router = useRouter();

  const [category, setCategory] = useState<string>("");
  const [ruleId, setRuleId] = useState<string>("");
  const [paramsLoaded, setParamsLoaded] = useState(false);
  const [rule, setRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Create stable supabase client instance
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  // Debug effect to track component lifecycle
  useEffect(() => {
    return () => {
      // Component cleanup
    };
  }, []);

  // Memoize params to prevent unnecessary re-renders
  const stableParams = useMemo(() => params, []);

  // Load params first - use stable params
  useEffect(() => {
    let isMounted = true;

    async function loadParams() {
      try {
        const resolvedParams = await stableParams;

        if (isMounted) {
          setCategory(resolvedParams.category);
          setRuleId(resolvedParams.ruleId);
          setParamsLoaded(true);
        }
      } catch (err) {
        console.error("Error loading params:", err);
        if (isMounted) {
          setError("Failed to load page parameters");
          setLoading(false);
        }
      }
    }

    loadParams();

    return () => {
      isMounted = false;
    };
  }, [stableParams]);

  // Load rule data once params are available
  useEffect(() => {
    if (!paramsLoaded || !category || !ruleId) {
      return;
    }

    let isMounted = true;

    async function loadRule() {
      try {
        setLoading(true);
        setError(null);

        // Fetch rule from API
        const response = await fetch(`/api/rules/${category}/${ruleId}`);

        if (!response.ok) {
          if (response.status === 404) {
            if (isMounted) setError("Rule not found");
          } else {
            const errorData = await response.json();
            console.error("API error:", errorData);
            if (isMounted) setError(errorData.error || "Failed to load rule");
          }
          return;
        }

        const data = await response.json();

        // Sanitize the rule data before setting it in state
        const sanitizedRule = sanitizeRuleData(data.rule);

        if (isMounted) {
          setRule(sanitizedRule);
        }
      } catch (err) {
        console.error("Error loading rule:", err);
        if (isMounted) setError("Failed to load rule");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRule();

    return () => {
      isMounted = false;
    };
  }, [paramsLoaded, category, ruleId]);

  // Memoize date formatting to prevent re-renders
  const formattedDate = useMemo(() => {
    return rule?.last_updated
      ? new Date(rule.last_updated).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown";
  }, [rule?.last_updated]);

  // Stable callback functions
  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  // Note: Download functionality is now handled entirely by RuleActions component

  const handleCopy = useCallback(async () => {
    if (!rule?.content) return;

    try {
      await navigator.clipboard.writeText(rule.content);
      toast.success("Rule content copied to clipboard");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy to clipboard");
    }
  }, [rule?.content]);

  // Show loading state while params or rule are being fetched
  if (!paramsLoaded || loading) {
    return (
      <motion.div
        className="container py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/rules"
            className="hover:text-foreground transition-colors"
          >
            Rules
          </Link>
          <CaretRightIcon className="w-4 h-4" />
          {category ? (
            <Link
              href={`/rules/${category}`}
              className="hover:text-foreground transition-colors"
            >
              {category}
            </Link>
          ) : (
            <span>Loading...</span>
          )}
          <CaretRightIcon className="w-4 h-4" />
          <div className="flex items-center gap-2">
            <motion.div
              className="w-4 h-4 bg-muted rounded animate-pulse"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span>Loading...</span>
          </div>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="animate-pulse space-y-4"
            >
              <div className="h-8 w-3/4 bg-linear-to-r from-muted via-muted/60 to-muted rounded-lg"></div>
              <div className="h-4 w-1/2 bg-linear-to-r from-muted via-muted/60 to-muted rounded"></div>
              <div className="h-32 w-full bg-linear-to-r from-muted via-muted/60 to-muted rounded-lg"></div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  // Show error state
  if (error || !rule) {
    return (
      <motion.div
        className="container py-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/rules"
            className="hover:text-foreground transition-colors"
          >
            Rules
          </Link>
          <CaretRightIcon className="w-4 h-4" />
          <Link
            href={`/rules/${category}`}
            className="hover:text-foreground transition-colors"
          >
            {category}
          </Link>
          <CaretRightIcon className="w-4 h-4" />
          <span className="text-destructive">Error</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="mx-auto w-20 h-20 rounded-full bg-linear-to-br from-destructive to-destructive/80 flex items-center justify-center shadow-lg mb-6"
          >
            <WarningIcon className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h2
            className="text-3xl font-bold mb-4 bg-linear-to-r from-destructive to-destructive/80 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {error || "Rule not found"}
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-8 text-lg max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {error === "Rule not found"
              ? "The requested rule could not be found. It might have been moved or deleted."
              : "There was a problem loading this rule. Please try again later."}
          </motion.p>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="px-6"
              >
                Go Back
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-6"
              >
                <Link href="/rules">Browse All Rules</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`${category}-${ruleId}`}
      className="container py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-8">
        {/* Enhanced Breadcrumb navigation */}
        <motion.div
          className="flex items-center gap-2 text-sm text-muted-foreground"
          variants={itemVariants}
        >
          <Link href="/rules" className="hover:text-primary transition-colors">
            Rules
          </Link>
          <CaretRightIcon className="w-4 h-4" />
          <Link
            href={`/rules/${category}`}
            className="hover:text-primary transition-colors"
          >
            {category}
          </Link>
          <CaretRightIcon className="w-4 h-4" />
          <span className="text-foreground font-medium">{rule.title}</span>
        </motion.div>

        {/* Enhanced Rule title and description */}
        <motion.div
          className="relative p-8 rounded-2xl bg-linear-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border border-primary/20 dark:border-primary/30 backdrop-blur-sm"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-accent/5 rounded-2xl"></div>
          <div className="relative">
            <motion.h1
              className="text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {rule.title}
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground leading-relaxed mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {rule.description}
            </motion.p>

            {rule.tags && rule.tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {rule.tags.map((tag: string, index: number) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-linear-to-r from-primary/20 to-primary/30 dark:from-primary/10 dark:to-primary/20 border border-primary/50 dark:border-primary/30 text-primary"
                    >
                      <HashIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Enhanced Rule Content */}
          <motion.div className="md:col-span-2" variants={cardVariants}>
            <Card className="bg-linear-to-br from-card/80 to-muted/60 dark:from-card/80 dark:to-muted/60 backdrop-blur-sm border-2 border-border/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileTextIcon className="w-5 h-5" />
                  Rule Content
                </CardTitle>
                <CardDescription>
                  Read the full rule content or view it in a larger modal for
                  better readability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="prose dark:prose-invert max-w-none border-2 rounded-lg p-6 bg-linear-to-br from-muted/50 to-muted/80 dark:from-muted/20 dark:to-muted/40 border-border dark:border-border overflow-auto max-h-[500px] relative"
                  whileHover={{ borderColor: "hsl(var(--primary))" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {rule.content.length > 1000
                      ? `${rule.content.substring(0, 1000)}...`
                      : rule.content}
                  </div>

                  {rule.content.length > 1000 && (
                    <motion.div
                      className="mt-6 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleOpenModal}
                          className="bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Full Content
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
              <CardFooter className="border-t bg-linear-to-r from-muted/40 to-muted/20 dark:from-muted/20 dark:to-muted/10 pt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    onClick={handleOpenModal}
                    className="w-full border-2 hover:bg-muted/50"
                  >
                    <Icons.expand className="h-4 w-4 mr-2" />
                    Open in Modal
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          <div className="space-y-6">
            {/* Enhanced Rule Information */}
            <motion.div variants={cardVariants}>
              <Card className="bg-linear-to-br from-card/80 to-muted/60 dark:from-card/80 dark:to-muted/60 backdrop-blur-sm border-2 border-border/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SparkleIcon className="w-5 h-5" />
                    Rule Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-linear-to-r from-primary/10 to-primary/20 dark:from-primary/10 dark:to-primary/20 border border-primary/30"
                    >
                      <dt className="text-sm font-medium text-primary dark:text-primary/90 flex items-center gap-1">
                        <HashIcon className="w-3 h-3" />
                        Version
                      </dt>
                      <dd className="font-semibold text-primary dark:text-primary/90">
                        {rule.version}
                      </dd>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-linear-to-r from-muted/10 to-muted/20 dark:from-muted/10 dark:to-muted/20 border border-muted/30"
                    >
                      <dt className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/90 flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        Last Updated
                      </dt>
                      <dd className="font-semibold text-muted-foreground dark:text-muted-foreground/90">
                        {formattedDate}
                      </dd>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-linear-to-r from-accent/10 to-accent/20 dark:from-accent/10 dark:to-accent/20 border border-accent/30"
                    >
                      <dt className="text-sm font-medium text-accent-foreground dark:text-accent-foreground/90 flex items-center gap-1">
                        <DownloadIcon className="w-3 h-3" />
                        Downloads
                      </dt>
                      <dd className="font-semibold text-accent-foreground dark:text-accent-foreground/90">
                        {rule.downloads || 0}{" "}
                        {(rule.downloads || 0) === 1 ? "download" : "downloads"}
                      </dd>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-linear-to-r from-secondary/10 to-secondary/20 dark:from-secondary/10 dark:to-secondary/20 border border-secondary/30"
                    >
                      <dt className="text-sm font-medium text-secondary dark:text-secondary/90 flex items-center gap-1">
                        <SparkleIcon className="w-3 h-3" />
                        Votes
                      </dt>
                      <dd className="font-semibold text-secondary dark:text-secondary/90">
                        {rule.votes || 0}{" "}
                        {(rule.votes || 0) === 1 ? "vote" : "votes"}
                      </dd>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-linear-to-r from-muted-foreground/10 to-muted-foreground/20 dark:from-muted-foreground/10 dark:to-muted-foreground/20 border border-muted-foreground/30"
                    >
                      <dt className="text-sm font-medium text-muted-foreground dark:text-muted-foreground/90 flex items-center gap-1">
                        <StackIcon className="w-3 h-3" />
                        Category
                      </dt>
                      <dd className="font-semibold text-muted-foreground dark:text-muted-foreground/90">
                        {rule.categoryName || category}
                      </dd>
                    </motion.div>
                  </dl>
                </CardContent>
                <CardFooter className="border-t bg-linear-to-r from-muted/40 to-muted/20 dark:from-muted/20 dark:to-muted/10 pt-4">
                  {/* Use the RuleActions component for proper functionality - no onDownload to prevent double downloads */}
                  <RuleActions rule={rule} />
                </CardFooter>
              </Card>
            </motion.div>

            {/* Enhanced Compatibility Card */}
            {rule.compatibility &&
              Object.values(rule.compatibility).some(
                (arr) => arr && arr.length > 0
              ) && (
                <motion.div variants={cardVariants}>
                  <Card className="bg-linear-to-br from-card/80 to-muted/60 dark:from-card/80 dark:to-muted/60 backdrop-blur-sm border-2 border-border/20 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CpuIcon className="w-5 h-5" />
                        Compatibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {rule.compatibility.frameworks &&
                        rule.compatibility.frameworks.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                              <StackIcon className="w-3 h-3" />
                              Frameworks
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {rule.compatibility.frameworks.map(
                                (framework: string, index: number) => (
                                  <motion.div
                                    key={framework}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Badge
                                      variant="outline"
                                      className="bg-linear-to-r from-secondary/20 to-secondary/30 dark:from-secondary/10 dark:to-secondary/20 border-secondary/50 dark:border-secondary/30 text-secondary"
                                    >
                                      {framework}
                                    </Badge>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </motion.div>
                        )}

                      {rule.compatibility.ides &&
                        rule.compatibility.ides.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                              <CpuIcon className="w-3 h-3" />
                              IDEs
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {rule.compatibility.ides.map(
                                (ide: string, index: number) => (
                                  <motion.div
                                    key={ide}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Badge
                                      variant="outline"
                                      className="bg-linear-to-r from-primary/20 to-primary/30 dark:from-primary/10 dark:to-primary/20 border-primary/50 dark:border-primary/30 text-primary"
                                    >
                                      {ide}
                                    </Badge>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </motion.div>
                        )}

                      {rule.compatibility.aiAssistants &&
                        rule.compatibility.aiAssistants.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                              <SparkleIcon className="w-3 h-3" />
                              AI Assistants
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {rule.compatibility.aiAssistants.map(
                                (assistant: string, index: number) => (
                                  <motion.div
                                    key={assistant}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Badge
                                      variant="outline"
                                      className="bg-linear-to-r from-accent/20 to-accent/30 dark:from-accent/10 dark:to-accent/20 border-accent/50 dark:border-accent/30 text-accent-foreground"
                                    >
                                      {assistant}
                                    </Badge>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </motion.div>
                        )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
          </div>
        </div>
      </div>

      {/* Rule modal */}
      <RuleModal rule={rule} open={modalOpen} onOpenChange={setModalOpen} />
    </motion.div>
  );
}
