"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalMagnifyingGlass } from "./search/global-search";
import { cn } from "@/lib/utils";
import { useAuth } from "./auth/auth-provider";
import { useAdmin } from "@/hooks/use-admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b border-primary/20 dark:border-purple-800/30 bg-gradient-to-r from-white/70 via-primary/5 to-purple-50/50 dark:from-gray-950/80 dark:via-purple-950/20 dark:to-gray-950/80 backdrop-blur-xl"
      style={{
        boxShadow: `
          0 8px 32px rgba(139, 92, 246, 0.1),
          0 0 0 1px rgba(139, 92, 246, 0.1),
          inset 0 1px 2px rgba(255, 255, 255, 0.1)
        `,
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container flex h-16 items-center max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Icons.menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="pr-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-r border-white/20 dark:border-gray-800/30"
            style={{
              boxShadow: `
                8px 0 32px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.1),
                inset -1px 0 2px rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            <SheetTitle>
              <VisuallyHidden>Navigation Menu</VisuallyHidden>
            </SheetTitle>
            <MobileNav />
          </SheetContent>
        </Sheet>
        <MainNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center gap-4">
              <GlobalMagnifyingGlass />
              <div className="hidden sm:flex gap-2">
                <AdminCTA />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/generate"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "relative overflow-hidden bg-primary/10 dark:bg-purple-900/30 backdrop-blur-md border border-primary/30 dark:border-purple-700/40 hover:bg-primary/20 dark:hover:bg-purple-800/40 transition-all duration-300 hover:border-primary/50 dark:hover:border-purple-600/60 hover:shadow-lg group"
                    )}
                    style={{
                      boxShadow: `
                        0 4px 12px rgba(139, 92, 246, 0.15),
                        0 0 0 1px rgba(139, 92, 246, 0.1),
                        inset 0 1px 2px rgba(255, 255, 255, 0.1)
                      `,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icons.settings className="mr-2 h-4 w-4 relative drop-shadow-sm" />
                    <span className="relative drop-shadow-sm">
                      VibeKit Generator
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ThemeToggle />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <div
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                  })}
                >
                  <Icons.github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </div>
              </Link>
            </motion.div>
            <AuthMenuButton />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function AuthMenuButton() {
  const { user, isLoading, logout } = useAuth();
  const { isAdmin } = useAdmin();

  // Show login button if not logged in
  if (!user && !isLoading) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          href="/auth/login"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "relative overflow-hidden bg-primary/10 dark:bg-purple-900/30 backdrop-blur-md border border-primary/30 dark:border-purple-700/40 hover:bg-primary/20 dark:hover:bg-purple-800/40 transition-all duration-300 hover:border-primary/50 dark:hover:border-purple-600/60 hover:shadow-lg group"
          )}
          style={{
            boxShadow: `
              0 4px 12px rgba(139, 92, 246, 0.15),
              0 0 0 1px rgba(139, 92, 246, 0.1),
              inset 0 1px 2px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative drop-shadow-sm">Sign In</span>
        </Link>
      </motion.div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Icons.spinner className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  // Show user menu if logged in
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.avatar_url || undefined}
                alt={user?.name || "User"}
              />
              <AvatarFallback>
                {getInitials(user?.name || undefined)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user.name}</p>}
            {user?.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Icons.security className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <Icons.user className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/collections" className="cursor-pointer">
            <Icons.folder className="mr-2 h-4 w-4" />
            <span>My Collections</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-error focus:text-error focus:bg-error/10 dark:focus:bg-error/20"
          onSelect={async (event) => {
            event.preventDefault();
            await logout();
          }}
        >
          <Icons.logout className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { isAdmin } = useAdmin();

  return (
    <div className="flex flex-col space-y-3 p-4">
      <Link
        href="/rules"
        className={cn(
          "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          pathname?.startsWith("/rules") && "bg-accent"
        )}
      >
        <Icons.code className="mr-2 h-4 w-4" />
        Rules
      </Link>
      <Link
        href="/hub"
        className={cn(
          "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          pathname?.startsWith("/hub") && "bg-accent"
        )}
      >
        <Icons.brain className="mr-2 h-4 w-4" />
        VDK Toolkit
      </Link>
      <Link
        href="/generate"
        className={cn(
          "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          pathname?.startsWith("/generate") && "bg-accent"
        )}
      >
        <Icons.settings className="mr-2 h-4 w-4" />
        Generator
      </Link>
      <Link
        href="/docs"
        className={cn(
          "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          pathname?.startsWith("/docs") && "bg-accent"
        )}
      >
        <Icons.documentation className="mr-2 h-4 w-4" />
        Documentation
      </Link>
      {user && isAdmin && (
        <Link
          href="/admin"
          className={cn(
            "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            pathname?.startsWith("/admin") && "bg-accent"
          )}
        >
          <Icons.security className="mr-2 h-4 w-4" />
          Admin
        </Link>
      )}
      {user && (
        <>
          <Link
            href="/collections"
            className={cn(
              "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              pathname?.startsWith("/collections") && "bg-accent"
            )}
          >
            <Icons.folder className="mr-2 h-4 w-4" />
            Collections
          </Link>
          <Link
            href="/profile"
            className={cn(
              "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              pathname?.startsWith("/profile") && "bg-accent"
            )}
          >
            <Icons.user className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </>
      )}
    </div>
  );
}

function AdminCTA() {
  const { user } = useAuth();
  const { isAdmin, isLoading } = useAdmin();

  // Don't show anything if user is not authenticated
  if (!user) {
    return null;
  }

  // Show a placeholder while loading to prevent layout shift
  if (isLoading) {
    return (
      <div className="w-20 h-8">
        {" "}
        {/* Placeholder with approximate button dimensions */}
      </div>
    );
  }

  // Only show the admin button if user is confirmed admin
  if (!isAdmin) {
    return null;
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        href="/admin"
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground backdrop-blur-sm border border-white/20 transition-all duration-300 hover:shadow-xl"
        )}
        style={{
          boxShadow: `
            0 8px 16px rgba(139, 92, 246, 0.3),
            0 0 0 1px rgba(139, 92, 246, 0.2),
            inset 0 1px 2px rgba(255, 255, 255, 0.2)
          `,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/25 via-purple-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Icons.security className="mr-2 h-4 w-4 relative drop-shadow-sm" />
        <span className="relative drop-shadow-sm">Admin</span>
      </Link>
    </motion.div>
  );
}
