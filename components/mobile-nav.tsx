'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { useAuth } from "./auth/auth-provider";

export function MobileNav() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link 
        href="/" 
        className="flex items-center">
        <Icons.logo className="h-6 w-6 mr-2" />
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
      <nav className="flex flex-col gap-2">
        <Link
          href="/"
          className={cn(
            "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            pathname === "/" && "bg-accent"
          )}
        >
          <Icons.home className="mr-2 h-4 w-4" />
          Home
        </Link>
        <Link
          href="/rules"
          className={cn(
            "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            pathname?.startsWith("/rules") && "bg-accent"
          )}
        >
          <Icons.file className="mr-2 h-4 w-4" />
          Rules
        </Link>
        <Link
          href="/categories"
          className={cn(
            "flex items-center rounded-md px-2 py-1 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            pathname?.startsWith("/categories") && "bg-accent"
          )}
        >
          <Icons.categories className="mr-2 h-4 w-4" />
          Categories
        </Link>
        
        {!isLoading && !user ? (
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
      </nav>
    </div>
  );
}
