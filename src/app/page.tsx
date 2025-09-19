
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  Zap,
  Copy,
  Send,
  Target,
  Mountain,
  Repeat,
  Image as ImageIcon,
  Download,
  Trophy,
  ShieldOff,
  TrendingUp,
  MoreVertical,
  History,
  QuoteIcon,
} from "lucide-react";
import { generateMotivationalQuote, GenerateMotivationalQuoteOutput } from "@/ai/flows/generate-motivational-quote";
import { generateQuoteImage } from "@/ai/flows/generate-quote-image";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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

type VisualizedQuote = {
  quote: string;
  imageUrl: string;
};

type QuoteHistoryItem = GenerateMotivationalQuoteOutput;

export default function Home() {
  const [quote, setQuote] = useState("");
  const [quoteEmojis, setQuoteEmojis] = useState<string[]>([]);
  const [mainWords, setMainWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [quoteImage, setQuoteImage] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [visualizationHistory, setVisualizationHistory] = useState<VisualizedQuote[]>([]);
  const [quoteHistory, setQuoteHistory] = useState<QuoteHistoryItem[]>([]);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [activeHistoryView, setActiveHistoryView] = useState<'visualization' | 'quote'>('visualization');

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
      const theme = customPrompt.trim()
        ? customPrompt.trim()
        : selectedConcepts.length > 0
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
      setQuoteHistory((prev) => [result, ...prev]);
    } catch (error) {
      console.error("Failed to generate quote:", error);
      toast({
        title: "Error Generating Quote",
        description: "Could not fetch a new quote. Please try again later.",
        variant: "destructive",
      });
      const fallbackQuote = {
        quote: "The journey of a thousand miles begins with a single step. - Lao Tzu",
        emojis: ["🚀", "🌟"],
        mainWords: ["journey", "thousand", "single", "step"],
      };
      setQuote(fallbackQuote.quote);
      setQuoteEmojis(fallbackQuote.emojis);
      setMainWords(fallbackQuote.mainWords);
    } finally {
      setIsLoading(false);
    }
  }, [toast, selectedConcepts, customPrompt]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);
  
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
      setVisualizationHistory((prev) => [
        { quote, imageUrl: result.imageUrl },
        ...prev,
      ]);
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

  const handleShare = (platform: "instagram" | "copy") => {
    if (!quote) return;

    const textToShare = `"${quote}" - Get your daily inspiration from MotivateNow!`;
    
    if (platform === "instagram" || platform === "copy") {
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

  const openHistorySheet = (view: 'visualization' | 'quote') => {
    setActiveHistoryView(view);
    setIsHistorySheetOpen(true);
  }

  const signatureText = "made by MUZIF MIRZA".split(" ");
  
  const handlePromptKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchQuote();
    }
  };

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

          <Card className="relative w-full rounded-2xl border-primary/30 bg-black/60 shadow-2xl shadow-primary/20 backdrop-blur-md transition-all duration-500 hover:border-primary/80 hover:shadow-primary/50">
            <div className="absolute top-4 right-4 z-10">
              <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
                <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                      >
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">Open History</span>
                      </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => openHistorySheet('visualization')}>
                      <History className="mr-2 h-4 w-4" />
                      <span>Visualization History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => openHistorySheet('quote')}>
                      <QuoteIcon className="mr-2 h-4 w-4" />
                      <span>Quote History</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>
                      {activeHistoryView === 'visualization' ? 'Visualization History' : 'Quote History'}
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100%-4rem)] mt-4">
                    {activeHistoryView === 'visualization' ? (
                       <div className="grid gap-4 pr-4">
                        {visualizationHistory.length > 0 ? (
                          visualizationHistory.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-2 p-2 rounded-lg bg-secondary"
                            >
                              <Image
                                src={item.imageUrl}
                                alt={item.quote}
                                width={400}
                                height={400}
                                className="rounded-md object-cover"
                              />
                              <p className="text-sm text-muted-foreground italic">
                                "{item.quote}"
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground mt-8">
                            <p>No visualizations yet.</p>
                            <p className="text-sm">Generate a quote and click "Visualize" to see your history here.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                       <div className="grid gap-4 pr-4">
                        {quoteHistory.length > 0 ? (
                          quoteHistory.map((item, index) => (
                            <div key={index} className="flex flex-col gap-2 p-3 rounded-lg bg-secondary">
                              <p className="text-base text-foreground italic">
                                "{item.quote}"
                              </p>
                               <div className="flex justify-start gap-2">
                                {item.emojis.map((emoji, i) => <span key={i}>{emoji}</span>)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground mt-8">
                              <p>No quotes generated yet.</p>
                              <p className="text-sm">Click "New Quote" to start your collection.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
            <CardContent className="flex flex-col items-center justify-center gap-6 p-4 md:p-8 md:gap-8">
              <div className="relative flex w-full min-h-[150px] md:min-h-[200px] flex-grow items-center justify-center">
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
                    <p className="font-quote text-lg font-medium leading-relaxed text-slate-100 md:text-2xl">
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
              <div className="flex w-full flex-col items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group">
                    <div
                      className={cn(
                        "absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 blur-xl opacity-75 transition duration-1000 group-hover:opacity-100 group-hover:duration-200 animate-tilt"
                      )}
                    ></div>
                    <Button
                      onClick={fetchQuote}
                      disabled={isLoading || isVisualizing}
                      size="lg"
                      className="relative group rounded-full bg-primary px-8 py-6 text-lg md:px-10 md:py-8 md:text-xl font-bold text-primary-foreground shadow-lg shadow-primary/40 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/90 hover:shadow-primary/60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
                      className="relative group rounded-full bg-black/50 border-2 px-8 py-6 text-lg md:px-10 md:py-8 md:text-xl font-bold text-primary shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 hover:shadow-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black animate-border-color-change"
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
                 <div className="w-full max-w-md mt-4">
                    <Input
                      type="text"
                      placeholder="Or type your own theme..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      onKeyDown={handlePromptKeyDown}
                      className="w-full rounded-full border-2 bg-black/60 px-6 py-4 text-base md:py-5 text-center text-white placeholder:text-white/50 focus:ring-0 animate-border-color-change focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isLoading || isVisualizing}
                    />
                  </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-center gap-4 mt-2">
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

        <div
          className="fixed bottom-4 right-4 z-30 cursor-pointer"
          onClick={() => setShowSignature(!showSignature)}
        >
          {!showSignature ? (
            <div className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
              <p className="text-xs font-mono">...</p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm font-medium">
              {signatureText.map((word, index) => (
                <span
                  key={index}
                  className="inline-block animate-fade-in-up bg-gradient-to-r from-fuchsia-500 via-red-500 to-amber-500 bg-clip-text text-transparent"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );

}
