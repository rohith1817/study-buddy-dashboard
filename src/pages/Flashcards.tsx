import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Search, Bookmark, BookmarkCheck, Filter, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard" | "forgot" | null;
  bookmarked: boolean;
  subject: string;
}

const initialFlashcards: Flashcard[] = [
  {
    id: "1",
    question: "What is photosynthesis?",
    answer: "The process by which plants convert light energy into chemical energy, producing glucose and oxygen from carbon dioxide and water using chlorophyll in chloroplasts.",
    difficulty: null,
    bookmarked: false,
    subject: "Biology",
  },
  {
    id: "2",
    question: "What is the Pythagorean theorem?",
    answer: "In a right triangle, the square of the hypotenuse (c) equals the sum of squares of the other two sides: a² + b² = c²",
    difficulty: "easy",
    bookmarked: true,
    subject: "Mathematics",
  },
  {
    id: "3",
    question: "When did World War II end?",
    answer: "September 2, 1945, with the formal surrender of Japan aboard the USS Missouri in Tokyo Bay.",
    difficulty: "medium",
    bookmarked: false,
    subject: "History",
  },
  {
    id: "4",
    question: "What is the chemical formula for water?",
    answer: "H₂O - Two hydrogen atoms covalently bonded to one oxygen atom.",
    difficulty: null,
    bookmarked: true,
    subject: "Chemistry",
  },
  {
    id: "5",
    question: "What is Newton's First Law of Motion?",
    answer: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced force.",
    difficulty: "hard",
    bookmarked: false,
    subject: "Physics",
  },
  {
    id: "6",
    question: "What is the mitochondria's function?",
    answer: "The mitochondria is the powerhouse of the cell, responsible for producing ATP (adenosine triphosphate) through cellular respiration.",
    difficulty: "forgot",
    bookmarked: false,
    subject: "Biology",
  },
];

const difficultyColors = {
  easy: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  hard: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  forgot: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

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
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

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
    setShowAnswer(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const toggleBookmark = (id: string) => {
    setFlashcards((cards) =>
      cards.map((card) =>
        card.id === id ? { ...card, bookmarked: !card.bookmarked } : card
      )
    );
  };

  const setDifficulty = (id: string, difficulty: "easy" | "medium" | "hard" | "forgot") => {
    setFlashcards((cards) =>
      cards.map((card) =>
        card.id === id ? { ...card, difficulty } : card
      )
    );
    // Auto-advance to next card after rating
    setTimeout(() => {
      nextCard();
    }, 300);
  };

  // Reset current index when filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Flashcards</h1>
          <p className="text-muted-foreground">Review and rate your cards to improve learning</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
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

          {/* Filter Dropdown Style Buttons */}
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

        {/* Flashcard */}
        {filteredCards.length > 0 && currentCard ? (
          <div className="space-y-6">
            {/* Card Container */}
            <div
              className={cn(
                "relative rounded-2xl border bg-card p-8 shadow-medium transition-all duration-300 min-h-[320px]",
                showAnswer ? "border-primary/30" : "border-border"
              )}
            >
              {/* Subject Badge & Bookmark */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide bg-secondary px-3 py-1 rounded-full">
                  {currentCard.subject}
                </span>
                <button
                  onClick={() => toggleBookmark(currentCard.id)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    currentCard.bookmarked
                      ? "text-amber-500 bg-amber-100 dark:bg-amber-900/30"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {currentCard.bookmarked ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Difficulty Badge (if rated) */}
              {currentCard.difficulty && (
                <div className="absolute top-4 right-16">
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full border",
                      difficultyColors[currentCard.difficulty]
                    )}
                  >
                    {currentCard.difficulty.charAt(0).toUpperCase() + currentCard.difficulty.slice(1)}
                  </span>
                </div>
              )}

              {/* Question */}
              <div className="text-center mb-8">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Question</p>
                <h2 className="text-xl font-semibold text-foreground leading-relaxed">
                  {currentCard.question}
                </h2>
              </div>

              {/* Answer Section */}
              <div className="text-center">
                {!showAnswer ? (
                  <Button
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    className="gradient-primary text-primary-foreground hover:opacity-90 shadow-soft rounded-xl px-8"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Show Answer
                  </Button>
                ) : (
                  <div className="animate-fade-in">
                    <p className="text-xs text-accent uppercase tracking-wide mb-3">Answer</p>
                    <div className="rounded-xl bg-secondary/50 p-5 mb-2">
                      <p className="text-foreground leading-relaxed">{currentCard.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Difficulty Rating Buttons */}
            {showAnswer && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-center text-sm text-muted-foreground">How well did you know this?</p>
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
            )}

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
                      onClick={() => {
                        setShowAnswer(false);
                        setCurrentIndex(actualIndex);
                      }}
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
      </div>
    </MainLayout>
  );
}
