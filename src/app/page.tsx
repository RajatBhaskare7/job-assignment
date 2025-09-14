import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Career Counseling AI</CardTitle>
          <CardDescription className="text-center">
            Get personalized career advice and guidance from our AI counselor
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 text-center">
          <MessageSquare className="h-16 w-16 text-primary" />
          <p>
            Whether you&apos;re exploring new career paths, preparing for interviews, or seeking
            professional development advice, our AI counselor is here to help.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/chat" className="w-full">
            <Button className="w-full" size="lg">
              Start a Conversation
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
