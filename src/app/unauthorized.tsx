import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HomeIcon, EnterIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <ExclamationTriangleIcon className="text-destructive h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">401 - Unauthorized</CardTitle>
          <CardDescription>
            You need to be logged in to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center text-sm">
            Please log in to your account to continue accessing this resource.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">
                <EnterIcon className="mr-2 h-4 w-4" />
                Log In
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
