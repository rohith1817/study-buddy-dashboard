import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  question: string;
  answer: string;
  subject: string;
  difficulty?: "easy" | "medium" | "hard" | "forgot" | null;
  bookmarked: boolean;
  onBookmark: () => void;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  hard: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  forgot: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

export const FlipCard = ({
  question,
  answer,
  subject,
  difficulty,
  bookmarked,
  onBookmark,
}: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="perspective-1000 cursor-pointer w-full min-h-[320px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Question */}
        <div 
          className={cn(
            "absolute inset-0 rounded-2xl border bg-card p-8 shadow-medium backface-hidden",
            "flex flex-col"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide bg-secondary px-3 py-1 rounded-full">
              {subject}
            </span>
            <div className="flex items-center gap-2">
              {difficulty && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full border",
                    difficultyColors[difficulty]
                  )}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark();
                }}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  bookmarked
                    ? "text-amber-500 bg-amber-100 dark:bg-amber-900/30"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {bookmarked ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
              Question
            </p>
            <h2 className="text-xl font-semibold text-foreground leading-relaxed">
              {question}
            </h2>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Click to flip 👆
          </p>
        </div>

        {/* Back - Answer */}
        <div 
          className={cn(
            "absolute inset-0 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-8 shadow-medium backface-hidden",
            "flex flex-col"
          )}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold text-primary uppercase tracking-wide bg-primary/10 px-3 py-1 rounded-full">
              {subject}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-accent uppercase tracking-wide mb-3">
              Answer
            </p>
            <div className="rounded-xl bg-background/80 backdrop-blur p-5">
              <p className="text-foreground leading-relaxed">{answer}</p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Click to flip back 👆
          </p>
        </div>
      </motion.div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};
