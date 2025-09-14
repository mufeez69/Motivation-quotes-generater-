"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { generateMotivationalQuote } from "@/ai/flows/generate-motivational-quote";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const [quote, setQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const luxuryBg = PlaceHolderImages.find(p => p.id === 'luxury-background');

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await generateMotivationalQuote({
        theme: "success and perseverance",
        style: "inspirational",
      });
      setQuote(result.quote);
    } catch (error) {
      console.error("Failed to generate quote:", error);
      toast({
        title: "Error Generating Quote",
        description: "Could not fetch a new quote. Please try again later.",
        variant: "destructive",
      });
      if (!quote) {
        setQuote("The journey of a thousand miles begins with a single step. - Lao Tzu");
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, quote]);

  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 font-body overflow-hidden">
      {luxuryBg && (
        <Image
          src={luxuryBg.imageUrl}
          alt={luxuryBg.description}
          fill
          className="object-cover z-0"
          data-ai-hint={luxuryBg.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
          MotivateNow
        </h1>
        <p className="max-w-md text-lg text-slate-200 md:text-xl">
          Your daily dose of inspiration. Click the button below to generate a new quote.
        </p>
        <Card className="w-full rounded-xl border-primary/20 bg-black/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-2xl">
          <CardContent className="flex min-h-[250px] flex-col items-center justify-center gap-8 p-8">
            <div className="relative flex w-full flex-grow items-center justify-center">
              {isLoading && !quote ? (
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              ) : (
                <blockquote className="transition-opacity duration-300">
                  <p className="text-2xl font-medium leading-relaxed text-slate-100 md:text-3xl">
                    “{quote}”
                  </p>
                </blockquote>
              )}
            </div>
            <Button
              onClick={fetchQuote}
              disabled={isLoading}
              size="lg"
              className="rounded-full bg-primary px-8 py-6 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/90 hover:shadow-primary/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate New Quote"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
