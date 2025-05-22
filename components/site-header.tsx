"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlobalSearch } from "./search/global-search"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Icons.menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
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
              <GlobalSearch />
              <div className="hidden sm:flex">
                <Link
                  href="/setup"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mr-2"
                  )}
                >
                  <Icons.settings className="mr-2 h-4 w-4" />
                  Setup Wizard
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon"
                })}
              >
                <Icons.github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <AuthMenuButton />
          </div>
        </div>
      </div>
    </header>
  )
}

function AuthMenuButton() {
  const { user, isLoading, logout } = useAuth();

  // Show login button if not logged in
  if (!user && !isLoading) {
    return (
      <Link href="/auth/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
        Sign In
      </Link>
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
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || 'User'} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user.name}</p>}
            {user?.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Icons.user className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/collections">
            <Icons.folder className="mr-2 h-4 w-4" />
            <span>My Collections</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
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
  const pathname = usePathname()
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-col space-y-3 p-4">
      <Link
        href="/"
        className={cn(
          "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          pathname === "/" && "bg-accent"
        )}
      >
        <Icons.logo className="mr-2 h-4 w-4" />
        Home
      </Link>
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
        href="/setup"
        className={cn(
          "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          pathname?.startsWith("/setup") && "bg-accent"
        )}
      >
        <Icons.settings className="mr-2 h-4 w-4" />
        Setup Wizard
      </Link>
      <Link
        href="/docs"
        className={cn(
          "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          pathname?.startsWith("/docs") && "bg-accent"
        )}
      >
        <Icons.brain className="mr-2 h-4 w-4" />
        Documentation
      </Link>
      <Link
        href={siteConfig.links.github}
        target="_blank"
        rel="noreferrer"
        className="flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Icons.github className="mr-2 h-4 w-4" />
        GitHub
      </Link>

      <div className="my-2 border-t border-border" />

      {!user && !isLoading ? (
        <>
          <Link
            href="/auth/login"
            className={cn(
              "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              pathname === "/auth/login" && "bg-accent"
            )}
          >
            <Icons.login className="mr-2 h-4 w-4" />
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className={cn(
              "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              pathname === "/auth/register" && "bg-accent"
            )}
          >
            <Icons.userPlus className="mr-2 h-4 w-4" />
            Register
          </Link>
        </>
      ) : user ? (
        <>
          <Link
            href="/profile"
            className={cn(
              "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              pathname === "/profile" && "bg-accent"
            )}
          >
            <Icons.user className="mr-2 h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/collections"
            className={cn(
              "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              pathname?.startsWith("/collections") && "bg-accent"
            )}
          >
            <Icons.folder className="mr-2 h-4 w-4" />
            My Collections
          </Link>
        </>
      ) : null}
    </div>
  )
}
