"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Zap,
  Copy,
  Send,
  Target,
  Mountain,
  Repeat,
  Sunrise,
  Image as ImageIcon,
  Download,
  Sparkles,
  Trophy,
  ShieldOff,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";
import { generateMotivationalQuote } from "@/ai/flows/generate-motivational-quote";
import { generateQuoteImage } from "@/ai/flows/generate-quote-image";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.523.074-.797.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.206 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const motivationalConcepts = [
  {
    Icon: Target,
    text: "Discipline",
    color: "text-purple-400",
    hoverColor: "hover:border-purple-400 hover:shadow-purple-400/50",
    activeColor: "bg-purple-500/30 border-purple-400",
  },
  {
    Icon: Mountain,
    text: "Hard Work",
    color: "text-sky-400",
    hoverColor: "hover:border-sky-400 hover:shadow-sky-400/50",
    activeColor: "bg-sky-500/30 border-sky-400",
  },
  {
    Icon: Repeat,
    text: "Consistency",
    color: "text-emerald-400",
    hoverColor: "hover:border-emerald-400 hover:shadow-emerald-400/50",
    activeColor: "bg-emerald-500/30 border-emerald-400",
  },
  {
    Icon: Trophy,
    text: "Success",
    color: "text-yellow-400",
    hoverColor: "hover:border-yellow-400 hover:shadow-yellow-400/50",
    activeColor: "bg-yellow-500/30 border-yellow-400",
  },
  {
    Icon: ShieldOff,
    text: "Failure",
    color: "text-red-400",
    hoverColor: "hover:border-red-400 hover:shadow-red-400/50",
    activeColor: "bg-red-500/30 border-red-400",
  },
  {
    Icon: TrendingUp,
    text: "Growth",
    color: "text-lime-400",
    hoverColor: "hover:border-lime-400 hover:shadow-lime-400/50",
    activeColor: "bg-lime-500/30 border-lime-400",
  },
];

const themes = [
  "success", "perseverance", "hard work", "discipline", "consistency", 
  "self-belief", "resilience", "overcoming adversity", "growth mindset",
  "ambition", "dreams", "goals", "focus", "determination", "courage",
  "innovation", "leadership", "positivity", "gratitude", "mindfulness"
];

const styles = [
  "inspirational", "concise", "profound", "poetic", "direct", 
  "metaphorical", "powerful", "uplifting", "thought-provoking", "witty",
  "philosophical", "encouraging", "visionary", "reflective"
];

export default function Home() {
  const [quote, setQuote] = useState("");
  const [quoteEmojis, setQuoteEmojis] = useState<string[]>([]);
  const [mainWords, setMainWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [quoteImage, setQuoteImage] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const { toast } = useToast();

  const luxuryBg = PlaceHolderImages.find((p) => p.id === "luxury-background");
  const quoteWords = quote.split(" ");

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    setQuoteImage(null);
    setQuote("");
    setQuoteEmojis([]);
    setMainWords([]);
    try {
      const theme =
        selectedConcepts.length > 0
          ? selectedConcepts.join(", ")
          : themes[Math.floor(Math.random() * themes.length)];

      const randomStyle = styles[Math.floor(Math.random() * styles.length)];

      const result = await generateMotivationalQuote({
        theme: theme,
        style: randomStyle,
      });
      setQuote(result.quote);
      setQuoteEmojis(result.emojis);
      setMainWords(result.mainWords || []);
    } catch (error) {
      console.error("Failed to generate quote:", error);
      toast({
        title: "Error Generating Quote",
        description: "Could not fetch a new quote. Please try again later.",
        variant: "destructive",
      });
      setQuote(
        "The journey of a thousand miles begins with a single step. - Lao Tzu"
      );
      setQuoteEmojis(["🚀", "🌟"]);
      setMainWords(["journey", "thousand", "single", "step"]);
    } finally {
      setIsLoading(false);
    }
  }, [toast, selectedConcepts]);

  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleConceptClick = (concept: string) => {
    setSelectedConcepts((prev) =>
      prev.includes(concept)
        ? prev.filter((c) => c !== concept)
        : [...prev, concept]
    );
  };

  const handleVisualize = async () => {
    if (!quote) return;
    setIsVisualizing(true);
    try {
      const result = await generateQuoteImage({ quote });
      setQuoteImage(result.imageUrl);
    } catch (error) {
      console.error("Failed to generate quote image:", error);
      toast({
        title: "Error Visualizing Quote",
        description: "Could not generate an image. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsVisualizing(false);
    }
  };

  const handleShare = (platform: "whatsapp" | "instagram" | "copy") => {
    if (!quote) return;

    const textToShare = `"${quote}" - Get your daily inspiration from MotivateNow!`;
    const encodedText = encodeURIComponent(textToShare);

    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodedText}`, "_blank");
    } else if (platform === "instagram" || platform === "copy") {
      navigator.clipboard.writeText(textToShare).then(() => {
        toast({
          title: "Copied to Clipboard!",
          description:
            platform === "instagram"
              ? "Ready to paste in your Instagram story or post."
              : "You can now share the quote anywhere.",
        });
      });
    }
  };

  const handleDownload = () => {
    if (!quoteImage) {
      toast({
        title: "No Image to Download",
        description: "Please visualize a quote first before downloading.",
        variant: "destructive",
      });
      return;
    }

    const link = document.createElement("a");
    link.href = quoteImage;
    link.download = `motivate-now-quote.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Image Downloading...",
      description: "Your inspirational image is being saved.",
    });
  };

  const signatureText = "made by MUFIZ MIRZA".split(" ");

  return (
    <div className="relative">
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
        <div className="relative z-20 flex w-full max-w-4xl flex-col items-center gap-8 text-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full mb-4">
            {motivationalConcepts.map((concept, index) => {
              const isActive = selectedConcepts.includes(concept.text);
              return (
                <button
                  key={index}
                  onClick={() => handleConceptClick(concept.text)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-full bg-black/50 px-4 py-2 border-2 border-transparent shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-black/70",
                    concept.hoverColor,
                    isActive && concept.activeColor
                  )}
                >
                  <concept.Icon className={cn("h-5 w-5", concept.color)} />
                  <span
                    className={cn(
                      "font-semibold text-sm tracking-wide text-white/80",
                      concept.color
                    )}
                  >
                    {concept.text}
                  </span>
                </button>
              );
            })}
          </div>

          <Card className="w-full rounded-2xl border-primary/30 bg-black/60 shadow-2xl shadow-primary/20 backdrop-blur-md transition-all duration-500 hover:border-primary hover:shadow-primary/50">
            <CardContent className="flex min-h-[280px] flex-col items-center justify-center gap-8 p-8 md:p-12">
              <div className="relative flex w-full flex-grow items-center justify-center">
                {isLoading && !quote ? (
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                ) : isVisualizing ? (
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                ) : quoteImage ? (
                  <Image
                    src={quoteImage}
                    alt={quote}
                    width={512}
                    height={512}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <blockquote className="transition-opacity duration-500 ease-in-out">
                    <p className="font-quote text-2xl font-medium leading-relaxed text-slate-100 md:text-3xl">
                      “
                      {quoteWords.map((word, i) => (
                        <span
                          key={i}
                          className="inline-block animate-fade-in-up"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <span
                            className={cn(
                              mainWords.some(
                                (mainWord) =>
                                  mainWord.toLowerCase() ===
                                  word.replace(/[.,]/g, "").toLowerCase()
                              ) && "text-primary font-semibold"
                            )}
                          >
                            {word}
                          </span>
                          &nbsp;
                        </span>
                      ))}
                      ”
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                      {quoteEmojis.map((emoji, index) => (
                        <span
                          key={index}
                          className="text-2xl inline-block animate-fade-in-up"
                          style={{
                            animationDelay: `${
                              (quoteWords.length + index) * 100
                            }ms`,
                          }}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </blockquote>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group">
                  <div
                    className={cn(
                      "absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 blur opacity-75 transition duration-1000 group-hover:opacity-100 group-hover:duration-200",
                      !isLoading && "animate-tilt"
                    )}
                  ></div>
                  <Button
                    onClick={fetchQuote}
                    disabled={isLoading || isVisualizing}
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
                        New Quote
                      </>
                    )}
                  </Button>
                </div>
                {quote && !isLoading && (
                  <Button
                    onClick={handleVisualize}
                    disabled={isVisualizing}
                    size="lg"
                    variant="outline"
                    className="relative group rounded-full bg-black/50 border-primary/50 px-10 py-8 text-xl font-bold text-primary shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 hover:shadow-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {isVisualizing ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        Visualizing...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-6 w-6" />
                        Visualize Quote
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Button
              onClick={() => handleShare("whatsapp")}
              variant="ghost"
              size="icon"
              className="group rounded-full bg-black/50 text-[#25D366] hover:bg-[#25D366]/90 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <WhatsAppIcon />
              <span className="sr-only">Share on WhatsApp</span>
            </Button>
            <Button
              onClick={() => handleShare("instagram")}
              variant="ghost"
              size="icon"
              className="group rounded-full bg-black/50 text-[#E4405F] hover:bg-[#E4405F]/90 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Copy for Instagram</span>
            </Button>
            <Button
              onClick={() => handleShare("copy")}
              variant="ghost"
              size="icon"
              className="group rounded-full bg-black/50 text-[#60A5FA] hover:bg-[#60A5FA]/90 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Copy className="h-5 w-5" />
              <span className="sr-only">Copy quote</span>
            </Button>
            <Button
              onClick={handleDownload}
              variant="ghost"
              size="icon"
              disabled={!quoteImage}
              className="group rounded-full bg-black/50 text-slate-300 hover:bg-slate-500/90 hover:text-white transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              <span className="sr-only">Download image</span>
            </Button>
          </div>
        </div>
      </main>

      <div
        className="fixed bottom-4 right-4 z-30 cursor-pointer"
        onClick={() => setShowSignature(!showSignature)}
      >
        {!showSignature ? (
          <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-xs font-mono">...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm font-medium">
            {signatureText.map((word, index) => (
              <span
                key={index}
                className="inline-block bg-gradient-to-r from-fuchsia-500 via-red-500 to-amber-500 bg-clip-text text-transparent opacity-0 transition-all duration-500"
                style={{
                  transform: showSignature ? "translateY(0)" : "translateY(10px)",
                  opacity: showSignature ? 1 : 0,
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
