"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { User, GeneratedPackage } from "@/lib/types"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

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
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [user, setUser] = useState<User | null>(null)
  const [packages, setPackages] = useState<GeneratedPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [packagesLoading, setPackagesLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user data and packages
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session?.user) {
          setIsAuthenticated(false)
          setLoading(false)
          setPackagesLoading(false)
          return
        }

        setIsAuthenticated(true)

        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error loading profile:', profileError)
          // Create profile if it doesn't exist
          if (profileError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || null,
                avatar_url: session.user.user_metadata?.avatar_url || null
              })

            if (!insertError) {
              // Reload profile after creation
              const { data: newProfileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()
              
              if (newProfileData) {
                setUser(newProfileData as User)
              }
            }
          }
        } else {
          setUser(profileData as User)
        }

        setLoading(false)

        // Load user's generated packages
        const { data: packagesData, error: packagesError } = await supabase
          .from('generated_packages')
          .select(`
            *,
            wizard_configurations (
              stack_choices,
              language_choices,
              created_at
            )
          `)
          .eq('wizard_configurations.user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (packagesError) {
          console.error('Error loading packages:', packagesError)
        } else {
          setPackages(packagesData as GeneratedPackage[])
        }

        setPackagesLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setLoading(false)
        setPackagesLoading(false)
      }
    }

    loadData()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true)
        loadData()
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setPackages([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleDownloadPackage = async (pkg: GeneratedPackage) => {
    if (!pkg.download_url) {
      toast.error('Download URL not available')
      return
    }

    try {
      // Increment download count
      await supabase
        .from('generated_packages')
        .update({ download_count: (pkg.download_count || 0) + 1 })
        .eq('id', pkg.id)

      // Download the file
      const response = await fetch(pkg.download_url)
      if (!response.ok) {
        throw new Error('Failed to download package')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rules-package-${pkg.package_type}-${pkg.id.slice(0, 8)}.${pkg.package_type === 'zip' ? 'zip' : 'sh'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Package downloaded successfully')
      
      // Update local state
      setPackages(prev => prev.map(p => 
        p.id === pkg.id 
          ? { ...p, download_count: (p.download_count || 0) + 1 }
          : p
      ))
    } catch (error) {
      console.error('Error downloading package:', error)
      toast.error('Failed to download package')
    }
  }

  // Show auth required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10">
        <motion.div 
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg mb-6">
            <Icons.user className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-md leading-relaxed">
            Access your profile and manage your generated packages.
          </p>
          <Button onClick={() => router.push('/auth/login')} size="lg">
            <Icons.login className="mr-2 h-5 w-5" />
            Sign In
          </Button>
        </motion.div>
      </div>
    )
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <div className="container mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and view your generated packages
        </p>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="packages">My Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* User Info Card */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.user className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 bg-gradient-to-r from-muted via-muted/60 to-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-gradient-to-r from-muted via-muted/60 to-muted rounded animate-pulse" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-lg">{user?.name || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-lg">{user?.email}</p>
                      </div>
                      {user?.github_username && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">GitHub</label>
                          <p className="text-lg">@{user.github_username}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Member since</label>
                        <p className="text-lg">
                          {user?.created_at 
                            ? new Date(user.created_at).toLocaleDateString()
                            : 'Unknown'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.settings className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button asChild variant="outline" className="h-auto p-4">
                      <Link href="/collections">
                        <div className="flex flex-col items-center gap-2">
                          <Icons.folder className="h-6 w-6" />
                          <span>My Collections</span>
                        </div>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4">
                      <Link href="/setup">
                        <div className="flex flex-col items-center gap-2">
                          <Icons.settings className="h-6 w-6" />
                          <span>Setup Wizard</span>
                        </div>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4">
                      <Link href="/rules">
                        <div className="flex flex-col items-center gap-2">
                          <Icons.code className="h-6 w-6" />
                          <span>Browse Rules</span>
                        </div>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icons.download className="h-5 w-5" />
                    Generated Packages
                  </CardTitle>
                  <CardDescription>
                    View and re-download your previously generated rule packages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {packagesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 w-full bg-gradient-to-r from-muted via-muted/60 to-muted rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : packages.length === 0 ? (
                    <div className="text-center py-8">
                      <Icons.download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No packages yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Generate your first package using the setup wizard
                      </p>
                      <Button asChild>
                        <Link href="/setup">
                          <Icons.settings className="mr-2 h-4 w-4" />
                          Start Setup Wizard
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {packages.map((pkg) => (
                        <motion.div
                          key={pkg.id}
                          variants={itemVariants}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {pkg.package_type.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {pkg.rule_count} {pkg.rule_count === 1 ? 'rule' : 'rules'}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {formatFileSize(pkg.file_size)}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Created {pkg.created_at 
                                  ? formatDistanceToNow(new Date(pkg.created_at), { addSuffix: true })
                                  : 'Unknown date'
                                }
                              </div>
                              {pkg.download_count && pkg.download_count > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  Downloaded {pkg.download_count} {pkg.download_count === 1 ? 'time' : 'times'}
                                </div>
                              )}
                              {pkg.expires_at && (
                                <div className="text-sm text-muted-foreground">
                                  Expires {formatDistanceToNow(new Date(pkg.expires_at), { addSuffix: true })}
                                </div>
                              )}
                            </div>
                            <Button
                              onClick={() => handleDownloadPackage(pkg)}
                              disabled={!pkg.download_url}
                            >
                              <Icons.download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
