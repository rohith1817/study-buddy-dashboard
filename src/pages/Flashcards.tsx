import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Plus, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  deck: string;
}

const mockFlashcards: Flashcard[] = [
  {
    id: "1",
    front: "What is photosynthesis?",
    back: "The process by which plants convert light energy into chemical energy, producing glucose and oxygen from carbon dioxide and water.",
    deck: "Biology",
  },
  {
    id: "2",
    front: "What is the Pythagorean theorem?",
    back: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c²",
    deck: "Mathematics",
  },
  {
    id: "3",
    front: "When did World War II end?",
    back: "September 2, 1945, with the formal surrender of Japan aboard the USS Missouri.",
    deck: "History",
  },
  {
    id: "4",
    front: "What is the chemical formula for water?",
    back: "H₂O - Two hydrogen atoms bonded to one oxygen atom.",
    deck: "Chemistry",
  },
];

const decks = [
  { name: "All Cards", count: 24 },
  { name: "Biology", count: 8 },
  { name: "Mathematics", count: 6 },
  { name: "History", count: 5 },
  { name: "Chemistry", count: 5 },
];

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState("All Cards");

  const currentCard = mockFlashcards[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mockFlashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + mockFlashcards.length) % mockFlashcards.length);
    }, 150);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Flashcards</h1>
            <p className="text-muted-foreground">Review and memorize your study materials</p>
          </div>
          <Button className="gradient-primary text-primary-foreground hover:opacity-90 shadow-soft">
            <Plus className="h-4 w-4 mr-2" />
            Create Deck
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Deck Sidebar */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Decks
            </h3>
            <div className="space-y-2">
              {decks.map((deck) => (
                <button
                  key={deck.name}
                  onClick={() => setSelectedDeck(deck.name)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all",
                    selectedDeck === deck.name
                      ? "bg-secondary text-secondary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-secondary/50"
                  )}
                >
                  <span>{deck.name}</span>
                  <span className="text-xs bg-muted rounded-full px-2 py-0.5">{deck.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard Display */}
          <div className="lg:col-span-3 flex flex-col items-center">
            {/* Card Counter */}
            <div className="mb-4 text-sm text-muted-foreground">
              Card {currentIndex + 1} of {mockFlashcards.length}
            </div>

            {/* Flashcard */}
            <div
              onClick={flipCard}
              className={cn("flip-card w-full max-w-xl aspect-[3/2] cursor-pointer", isFlipped && "flipped")}
            >
              <div className="flip-card-inner relative w-full h-full">
                {/* Front */}
                <div className="flip-card-front absolute inset-0 rounded-2xl border border-border bg-card p-8 shadow-medium flex flex-col items-center justify-center">
                  <span className="text-xs text-primary font-medium mb-4 uppercase tracking-wide">
                    {currentCard.deck}
                  </span>
                  <p className="text-xl font-medium text-foreground text-center">
                    {currentCard.front}
                  </p>
                  <span className="absolute bottom-4 text-xs text-muted-foreground">
                    Click to flip
                  </span>
                </div>

                {/* Back */}
                <div className="flip-card-back absolute inset-0 rounded-2xl border border-primary/20 gradient-subtle p-8 shadow-medium flex flex-col items-center justify-center">
                  <span className="text-xs text-accent font-medium mb-4 uppercase tracking-wide">
                    Answer
                  </span>
                  <p className="text-lg text-foreground text-center leading-relaxed">
                    {currentCard.back}
                  </p>
                  <span className="absolute bottom-4 text-xs text-muted-foreground">
                    Click to flip back
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevCard}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex(0);
                }}
                className="rounded-full"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextCard}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 mt-6">
              {mockFlashcards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-muted hover:bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
