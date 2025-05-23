'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { User, Mail, Github, Code, Settings, FolderOpen, Save, LogOut, Trash2, Lock, Plus } from 'lucide-react';

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
  visible: { opacity: 1, y: 0 }
};

export default function ProfilePage() {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [githubUsername, setGithubUsername] = useState(user?.github_username || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferred_language || '');

  // Handle redirect on client side only
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Don't render anything if user is not loaded yet or if user is null
  if (isLoading || !user) {
    return (
      <motion.div
        className="container mx-auto py-10 flex items-center justify-center min-h-[50vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse delay-100"></div>
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse delay-200"></div>
        </div>
      </motion.div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      github_username: githubUsername,
      preferred_language: preferredLanguage
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <motion.div
      className="container mx-auto py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="flex items-center gap-6 mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 backdrop-blur-sm"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-gray-800 shadow-lg">
              <AvatarImage src={user.avatar_url || undefined} alt={user.name || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                {user.name ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {user.name || 'User Profile'}
            </h1>
            <p className="text-muted-foreground text-lg mt-1 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
            {user.github_username && (
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Github className="w-4 h-4" />
                @{user.github_username}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full md:w-[500px] grid-cols-3 h-12 p-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 h-10 data-[state=active]:bg-surface-1 dark:data-[state=active]:bg-surface-3 data-[state=active]:shadow-md transition-all duration-300"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="collections" 
                className="flex items-center gap-2 h-10 data-[state=active]:bg-surface-1 dark:data-[state=active]:bg-surface-3 data-[state=active]:shadow-md transition-all duration-300"
              >
                <FolderOpen className="w-4 h-4" />
                Collections
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 h-10 data-[state=active]:bg-surface-1 dark:data-[state=active]:bg-surface-3 data-[state=active]:shadow-md transition-all duration-300"
              >
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-surface-1/50 to-surface-2/30 dark:from-surface-1/50 dark:to-surface-2/30 backdrop-blur-sm border-2 border-border/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            value={user.email}
                            disabled
                            readOnly
                            className="pl-10 h-12 bg-muted/50"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="githubUsername" className="text-sm font-medium">GitHub Username</Label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="githubUsername"
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            placeholder="Your GitHub username"
                            className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferredLanguage" className="text-sm font-medium">Preferred Programming Language</Label>
                        <div className="relative">
                          <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="preferredLanguage"
                            value={preferredLanguage}
                            onChange={(e) => setPreferredLanguage(e.target.value)}
                            placeholder="e.g. TypeScript, Python, etc."
                            className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      <motion.div 
                        className="pt-4"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isLoading ? 'Saving...' : 'Save Profile'}
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="collections">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-surface-1/50 to-surface-2/30 dark:from-surface-1/50 dark:to-surface-2/30 backdrop-blur-sm border-2 border-border/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FolderOpen className="w-5 h-5" />
                      Your Collections
                    </CardTitle>
                    <CardDescription>
                      Manage your rule collections and organize your favorite rules
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center shadow-lg mb-4"
                      >
                        <FolderOpen className="w-8 h-8 text-white" />
                      </motion.div>
                      <p className="text-muted-foreground mb-6 text-lg">
                        You haven't created any collections yet.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={() => router.push('/collections/new')}
                          className="h-12 px-6 border-2 hover:bg-gradient-to-r hover:from-success/10 hover:to-primary/10 dark:hover:from-success/10 dark:hover:to-primary/10 transition-all duration-300"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Collection
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <Card className="bg-gradient-to-br from-surface-1/50 to-surface-2/30 dark:from-surface-1/50 dark:to-surface-2/30 backdrop-blur-sm border-2 border-border/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Settings className="w-5 h-5" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/10 dark:to-primary/20">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Change Password
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Update your password to keep your account secure
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={() => router.push('/auth/change-password')}
                          className="border-2 hover:bg-surface-1 dark:hover:bg-surface-3"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </motion.div>
                    </div>

                    <div className="p-4 rounded-lg border-2 border-error/50 dark:border-error/30 bg-gradient-to-r from-error/10 to-error/20 dark:from-error/10 dark:to-error/20">
                      <h3 className="font-medium mb-2 flex items-center gap-2 text-error dark:text-error/90">
                        <Trash2 className="w-4 h-4" />
                        Danger Zone
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="destructive"
                          className="bg-gradient-to-r from-error to-error/80 hover:from-error/90 hover:to-error/70"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </motion.div>
                    </div>

                    <div className="pt-4 border-t">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={handleLogout}
                          className="w-full h-12 border-2 hover:bg-surface-1 dark:hover:bg-surface-3"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Log Out
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}
