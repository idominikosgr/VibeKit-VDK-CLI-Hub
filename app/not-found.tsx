import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tighter">404</h1>
      <h2 className="mt-2 text-2xl font-medium">Page Not Found</h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}
