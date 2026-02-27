import Link from "next/link";
import { Megaphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col flex-1 w-full p-10 bg-muted/20 items-center justify-center min-h-svh">
      <div className="max-w-2xl text-center space-y-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Megaphone className="size-8 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-xl">
            Welcome to the official communication center for Test City. 
            Manage announcements and broadcast updates to citizens.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button size="lg" asChild className="h-12 px-8 text-lg font-semibold bg-primary text-primary-foreground">
            <Link href="/announcements">
              Go to Announcements
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

