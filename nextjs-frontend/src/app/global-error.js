"use client";
import { Button } from "@/components/ui/button";

// Error boundaries must be Client Components

export default function GlobalError({ error, reset }) {
  return (
    // global-error must include html and body tags
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen p-8">
        <h2>Something went wrong!</h2>
        <Button onClick={() => reset()} className="mt-4 cursor-pointer">
          Try again
        </Button>
      </body>
    </html>
  );
}
