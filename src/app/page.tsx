"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";
import { generateMotivationalQuote } from "@/ai/flows/generate-motivational-quote";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

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
        style: "inspirational and concise",
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
          className="object-cover z-0 brightness-50"
          data-ai-hint={luxuryBg.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
      <div className="relative z-20 flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          Ignite Your Spark
        </h1>
        <p className="max-w-xl text-lg text-slate-300 md:text-xl leading-relaxed">
          Tap into a universe of motivation. A new powerful quote is just a click away.
        </p>
        <Card className="w-full rounded-2xl border-primary/30 bg-black/60 shadow-2xl shadow-primary/20 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:shadow-primary/30">
          <CardContent className="flex min-h-[280px] flex-col items-center justify-center gap-8 p-8 md:p-12">
            <div className="relative flex w-full flex-grow items-center justify-center">
              {isLoading && !quote ? (
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              ) : (
                <blockquote className="transition-opacity duration-500 ease-in-out">
                  <p className="text-3xl font-medium leading-relaxed text-slate-100 md:text-4xl">
                    “{quote}”
                  </p>
                </blockquote>
              )}
            </div>
            <div className="relative group">
              <div
                className={cn(
                  "absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 blur opacity-75 transition duration-1000 group-hover:opacity-100 group-hover:duration-200",
                  !isLoading && "animate-tilt"
                )}
              ></div>
              <Button
                onClick={fetchQuote}
                disabled={isLoading}
                size="lg"
                className="relative group rounded-full bg-primary px-10 py-8 text-xl font-bold text-primary-foreground shadow-lg shadow-primary/40 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/90 hover:shadow-primary/60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
                    Generate Inspiration
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
