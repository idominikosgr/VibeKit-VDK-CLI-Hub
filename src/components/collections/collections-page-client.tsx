'use client';

import Link from "next/link";
import { motion } from 'framer-motion';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpenIcon, PlusIcon, CalendarIcon, EyeIcon, LockIcon, SparkleIcon } from '@phosphor-icons/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1
  }
};

interface Collection {
  id: string;
  name: string;
  description?: string;
  is_public: boolean | null;
  updated_at: string | null;
  rules?: any[];
}

interface CollectionsPageClientProps {
  collections: Collection[];
}

export function CollectionsPageClient({ collections }: CollectionsPageClientProps) {
  return (
    <motion.div 
      className="container py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-8">
        <motion.div 
          className="flex items-center justify-between p-6 rounded-2xl bg-linear-to-br from-accent/10 to-primary/10 dark:from-accent/20 dark:to-primary/20 border border-accent dark:border-accent/50 backdrop-blur-sm"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg"
            >
              <FolderOpenIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-primary">
                My Collections
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Organize and manage your favorite AI development rules
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild
              className="bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6"
            >
              <Link href="/collections/new">
                <PlusIcon className="mr-2 h-5 w-5" />
                Create Collection
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {collections.length > 0 ? (
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 24 }
                }}
                whileTap={{ scale: 0.98 }}
                custom={index}
              >
                <Link href={`/collections/${collection.id}`}>
                  <Card className="h-full overflow-hidden bg-linear-to-br from-card/80 to-muted/60 dark:from-card/80 dark:to-muted/60 backdrop-blur-sm border-2 border-border/20 hover:border-accent/50 dark:hover:border-accent/30 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="line-clamp-2 text-lg font-semibold group-hover:text-primary dark:group-hover:text-primary/80 transition-colors">
                            {collection.name}
                          </CardTitle>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {collection.is_public === true ? (
                            <Badge 
                              variant="outline" 
                              className="bg-linear-to-r from-success/20 to-success/30 dark:from-success/10 dark:to-success/20 border-success/50 dark:border-success/30 text-success dark:text-success/90"
                            >
                              <EyeIcon className="w-3 h-3 mr-1" />
                              Public
                            </Badge>
                          ) : (
                            <Badge 
                              variant="outline"
                              className="bg-linear-to-r from-muted to-muted/80 dark:from-muted/30 dark:to-muted/20 border-border dark:border-border/50 text-muted-foreground"
                            >
                              <LockIcon className="w-3 h-3 mr-1" />
                              Private
                            </Badge>
                          )}
                        </motion.div>
                      </div>
                      <CardDescription className="line-clamp-3 mt-2 text-sm leading-relaxed">
                        {collection.description || "No description provided"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center gap-1"
                        >
                          <SparkleIcon className="w-4 h-4" />
                          <span className="font-medium">
                            {collection.rules?.length || 0} rules
                          </span>
                        </motion.div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-border/20 pt-4 bg-linear-to-r from-muted/40 to-muted/20 dark:from-muted/20 dark:to-muted/10">
                      <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>
                            Updated {collection.updated_at ? new Date(collection.updated_at).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                        <motion.div
                          className="w-6 h-6 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-sm"
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <FolderOpenIcon className="w-3 h-3 text-white" />
                        </motion.div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="flex justify-center py-16"
          >
            <Card className="max-w-md w-full bg-linear-to-br from-card/50 to-muted/30 dark:from-card/50 dark:to-muted/30 backdrop-blur-sm border-2 border-border/20 shadow-xl text-center">
              <CardContent className="pt-8 pb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.3,
                    type: "spring", 
                    stiffness: 200,
                    damping: 15
                  }}
                  className="mx-auto w-20 h-20 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg mb-6"
                >
                  <FolderOpenIcon className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl font-semibold mb-2 text-primary"
                >
                  No collections yet
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-muted-foreground mb-6 leading-relaxed"
                >
                  Create your first collection to organize your favorite rules and start building your curated library.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild
                    className="bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6"
                  >
                    <Link href="/collections/new">
                      <PlusIcon className="mr-2 h-5 w-5" />
                      Create Your First Collection
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 