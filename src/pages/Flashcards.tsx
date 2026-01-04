import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FlipCard } from "@/components/FlipCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard" | "forgot" | null;
  bookmarked: boolean;
  subject: string;
}

const filterOptions = [
  { value: "all", label: "All Cards" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "forgot", label: "Forgot" },
  { value: "bookmarked", label: "Bookmarked" },
  { value: "unrated", label: "Unrated" },
];

export default function Flashcards() {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    try {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setFlashcards(
        (data || []).map((card) => ({
          id: card.id,
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty as Flashcard["difficulty"],
          bookmarked: card.bookmarked || false,
          subject: card.subject || "General",
        }))
      );
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter flashcards
  const filteredCards = flashcards.filter((card) => {
    const matchesSearch =
      card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "easy":
      case "medium":
      case "hard":
      case "forgot":
        return card.difficulty === activeFilter;
      case "bookmarked":
        return card.bookmarked;
      case "unrated":
        return card.difficulty === null;
      default:
        return true;
    }
  });

  const currentCard = filteredCards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const toggleBookmark = async (id: string) => {
    const card = flashcards.find((c) => c.id === id);
    if (!card) return;

    const newBookmarked = !card.bookmarked;
    setFlashcards((cards) =>
      cards.map((c) => (c.id === id ? { ...c, bookmarked: newBookmarked } : c))
    );

    await supabase
      .from("flashcards")
      .update({ bookmarked: newBookmarked })
      .eq("id", id);
  };

  const setDifficulty = async (id: string, difficulty: "easy" | "medium" | "hard" | "forgot") => {
    setFlashcards((cards) =>
      cards.map((card) => (card.id === id ? { ...card, difficulty } : card))
    );

    await supabase.from("flashcards").update({ difficulty }).eq("id", id);

    // Auto-advance to next card after rating
    setTimeout(() => {
      if (filteredCards.length > 1) {
        nextCard();
      }
    }, 300);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Flashcards</h1>
          <p className="text-muted-foreground">Click on a card to flip and reveal the answer</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search flashcards..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
              }}
              className="pl-10 h-12 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                    activeFilter === option.value
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Counter */}
        {filteredCards.length > 0 && (
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>
              Card <span className="font-semibold text-foreground">{currentIndex + 1}</span> of{" "}
              <span className="font-semibold text-foreground">{filteredCards.length}</span>
            </span>
          </div>
        )}

        {/* Flashcard with Flip Animation */}
        {filteredCards.length > 0 && currentCard ? (
          <div className="space-y-6">
            <FlipCard
              question={currentCard.question}
              answer={currentCard.answer}
              subject={currentCard.subject}
              difficulty={currentCard.difficulty}
              bookmarked={currentCard.bookmarked}
              onBookmark={() => toggleBookmark(currentCard.id)}
            />

            {/* Difficulty Rating Buttons */}
            <div className="space-y-3 animate-fade-in">
              <p className="text-center text-sm text-muted-foreground">Rate your understanding</p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => setDifficulty(currentCard.id, "forgot")}
                  variant="outline"
                  className={cn(
                    "rounded-xl px-6 transition-all hover:scale-105",
                    "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  )}
                >
                  😕 Forgot
                </Button>
                <Button
                  onClick={() => setDifficulty(currentCard.id, "hard")}
                  variant="outline"
                  className={cn(
                    "rounded-xl px-6 transition-all hover:scale-105",
                    "border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
                  )}
                >
                  🤔 Hard
                </Button>
                <Button
                  onClick={() => setDifficulty(currentCard.id, "medium")}
                  variant="outline"
                  className={cn(
                    "rounded-xl px-6 transition-all hover:scale-105",
                    "border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20"
                  )}
                >
                  😐 Medium
                </Button>
                <Button
                  onClick={() => setDifficulty(currentCard.id, "easy")}
                  variant="outline"
                  className={cn(
                    "rounded-xl px-6 transition-all hover:scale-105",
                    "border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                  )}
                >
                  😊 Easy
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevCard}
                className="rounded-full h-12 w-12"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Progress Dots */}
              <div className="flex gap-1.5 max-w-[200px] overflow-hidden">
                {filteredCards.slice(Math.max(0, currentIndex - 3), Math.min(filteredCards.length, currentIndex + 4)).map((_, idx) => {
                  const actualIndex = Math.max(0, currentIndex - 3) + idx;
                  return (
                    <button
                      key={actualIndex}
                      onClick={() => setCurrentIndex(actualIndex)}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        actualIndex === currentIndex
                          ? "bg-primary w-6"
                          : "bg-muted hover:bg-muted-foreground/30 w-2"
                      )}
                    />
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextCard}
                className="rounded-full h-12 w-12"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No flashcards found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search or filter"
                : "Upload some notes to generate flashcards"}
            </p>
          </div>
        )}

        {/* Stats Summary */}
        {flashcards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {flashcards.filter((c) => c.difficulty === "easy").length}
              </p>
              <p className="text-sm text-green-600/80 dark:text-green-400/80">Easy</p>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {flashcards.filter((c) => c.difficulty === "medium").length}
              </p>
              <p className="text-sm text-amber-600/80 dark:text-amber-400/80">Medium</p>
            </div>
            <div className="rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {flashcards.filter((c) => c.difficulty === "hard").length}
              </p>
              <p className="text-sm text-orange-600/80 dark:text-orange-400/80">Hard</p>
            </div>
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {flashcards.filter((c) => c.difficulty === "forgot").length}
              </p>
              <p className="text-sm text-red-600/80 dark:text-red-400/80">Forgot</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
