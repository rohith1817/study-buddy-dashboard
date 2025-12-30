import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Eye, RotateCcw, CheckCircle, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StudyCard {
  id: string;
  question: string;
  answer: string;
  subject: string;
}

const studyCards: StudyCard[] = [
  {
    id: "1",
    question: "What is photosynthesis?",
    answer: "The process by which plants convert light energy into chemical energy, producing glucose and oxygen from carbon dioxide and water.",
    subject: "Biology",
  },
  {
    id: "2",
    question: "What is the Pythagorean theorem?",
    answer: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c²",
    subject: "Mathematics",
  },
  {
    id: "3",
    question: "When did World War II end?",
    answer: "September 2, 1945, with the formal surrender of Japan aboard the USS Missouri.",
    subject: "History",
  },
  {
    id: "4",
    question: "What is the chemical formula for water?",
    answer: "H₂O - Two hydrogen atoms bonded to one oxygen atom.",
    subject: "Chemistry",
  },
  {
    id: "5",
    question: "What is Newton's First Law of Motion?",
    answer: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an unbalanced force.",
    subject: "Physics",
  },
];

export default function StudyMode() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = studyCards[currentIndex];
  const progress = ((currentIndex) / studyCards.length) * 100;
  const completedCount = Object.keys(results).length;

  const handleDifficulty = (difficulty: string) => {
    setResults((prev) => ({ ...prev, [currentCard.id]: difficulty }));
    
    if (currentIndex < studyCards.length - 1) {
      setShowAnswer(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 200);
    } else {
      setIsComplete(true);
    }
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setResults({});
    setIsComplete(false);
  };

  const getResultCounts = () => {
    const counts = { easy: 0, medium: 0, hard: 0, forgot: 0 };
    Object.values(results).forEach((r) => {
      counts[r as keyof typeof counts]++;
    });
    return counts;
  };

  // Completion Screen
  if (isComplete) {
    const counts = getResultCounts();
    const score = Math.round(((counts.easy * 3 + counts.medium * 2 + counts.hard * 1) / (studyCards.length * 3)) * 100);

    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Trophy Icon */}
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full gradient-primary flex items-center justify-center shadow-glow animate-scale-in">
                <Trophy className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>

            {/* Completion Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Session Complete!</h1>
              <p className="text-muted-foreground text-lg">
                You've reviewed all {studyCards.length} cards
              </p>
            </div>

            {/* Score */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-5xl font-bold text-primary mb-2">{score}%</p>
              <p className="text-muted-foreground">Overall Score</p>
            </div>

            {/* Results Breakdown */}
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{counts.easy}</p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80">Easy</p>
              </div>
              <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{counts.medium}</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Medium</p>
              </div>
              <div className="rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{counts.hard}</p>
                <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Hard</p>
              </div>
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{counts.forgot}</p>
                <p className="text-xs text-red-600/80 dark:text-red-400/80">Forgot</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={restartSession} className="rounded-xl">
                <RotateCcw className="h-4 w-4 mr-2" />
                Study Again
              </Button>
              <Button className="gradient-primary text-primary-foreground hover:opacity-90 rounded-xl">
                Review Mistakes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col max-w-2xl mx-auto animate-fade-in">
        {/* Minimal Header */}
        <div className="py-6 space-y-4">
          {/* Progress Text */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Study Session</span>
            <span className="font-medium text-foreground">
              {currentIndex + 1} / {studyCards.length}
            </span>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />
        </div>

        {/* Card Container - Centered */}
        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="space-y-8">
            {/* Subject Badge */}
            <div className="flex justify-center">
              <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-secondary px-4 py-1.5 rounded-full">
                {currentCard.subject}
              </span>
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border border-border bg-card p-10 shadow-medium text-center min-h-[280px] flex flex-col justify-center">
              {/* Question */}
              <div className="space-y-6">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Question</p>
                <h2 className="text-2xl font-semibold text-foreground leading-relaxed">
                  {currentCard.question}
                </h2>
              </div>

              {/* Answer Section */}
              {!showAnswer ? (
                <div className="mt-10">
                  <Button
                    onClick={() => setShowAnswer(true)}
                    size="lg"
                    className="gradient-primary text-primary-foreground hover:opacity-90 shadow-soft rounded-xl px-10 py-6 text-base"
                  >
                    <Eye className="h-5 w-5 mr-3" />
                    Reveal Answer
                  </Button>
                </div>
              ) : (
                <div className="mt-8 animate-fade-in">
                  <div className="border-t border-border pt-8 space-y-4">
                    <p className="text-xs text-accent uppercase tracking-widest">Answer</p>
                    <p className="text-lg text-foreground leading-relaxed">
                      {currentCard.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Difficulty Buttons */}
            {showAnswer && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-center text-sm text-muted-foreground">
                  How well did you know this?
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => handleDifficulty("forgot")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:scale-105",
                      "border-red-200 bg-red-50 text-red-700 hover:border-red-400 hover:bg-red-100",
                      "dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                    )}
                  >
                    <span className="text-2xl">😕</span>
                    <span className="text-sm font-medium">Forgot</span>
                  </button>
                  <button
                    onClick={() => handleDifficulty("hard")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:scale-105",
                      "border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-400 hover:bg-orange-100",
                      "dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40"
                    )}
                  >
                    <span className="text-2xl">🤔</span>
                    <span className="text-sm font-medium">Hard</span>
                  </button>
                  <button
                    onClick={() => handleDifficulty("medium")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:scale-105",
                      "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400 hover:bg-amber-100",
                      "dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40"
                    )}
                  >
                    <span className="text-2xl">😐</span>
                    <span className="text-sm font-medium">Medium</span>
                  </button>
                  <button
                    onClick={() => handleDifficulty("easy")}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:scale-105",
                      "border-green-200 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100",
                      "dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                    )}
                  >
                    <span className="text-2xl">😊</span>
                    <span className="text-sm font-medium">Easy</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="py-6 flex justify-center">
          <button
            onClick={restartSession}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Restart Session
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
