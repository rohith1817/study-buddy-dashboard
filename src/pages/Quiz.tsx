import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const mockQuestions: Question[] = [
  {
    id: "1",
    question: "What is the primary function of chloroplasts in plant cells?",
    options: ["Store water", "Perform photosynthesis", "Produce proteins", "Cell division"],
    correctAnswer: 1,
    explanation:
      "Chloroplasts are organelles that contain chlorophyll and are responsible for photosynthesis, converting light energy into chemical energy.",
  },
  {
    id: "2",
    question: "What is the value of x in the equation 2x + 5 = 15?",
    options: ["x = 3", "x = 5", "x = 7", "x = 10"],
    correctAnswer: 1,
    explanation: "2x + 5 = 15 → 2x = 10 → x = 5",
  },
  {
    id: "3",
    question: "In what year did World War I begin?",
    options: ["1912", "1914", "1916", "1918"],
    correctAnswer: 1,
    explanation:
      "World War I began on July 28, 1914, following the assassination of Archduke Franz Ferdinand.",
  },
  {
    id: "4",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    explanation:
      "Au comes from the Latin word 'Aurum' meaning gold. Ag is the symbol for Silver (Argentum).",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const percentage = Math.round((score / mockQuestions.length) * 100);
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full gradient-primary shadow-glow">
                <Trophy className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Quiz Complete!</h1>
              <p className="text-muted-foreground">Great job on finishing the quiz</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="text-5xl font-bold text-primary mb-2">{percentage}%</div>
              <p className="text-muted-foreground">
                You got {score} out of {mockQuestions.length} questions correct
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={restartQuiz}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button className="gradient-primary text-primary-foreground hover:opacity-90">
                View Results
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {mockQuestions.length}
            </span>
            <span className="text-sm font-medium text-primary">Score: {score}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-foreground mb-8">{question.question}</h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showIncorrect = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={cn(
                    "w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                    !showResult && isSelected && "border-primary bg-secondary",
                    !showResult && !isSelected && "border-border hover:border-primary/50 hover:bg-secondary/50",
                    showCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20",
                    showIncorrect && "border-destructive bg-destructive/10"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                      !showResult && isSelected && "border-primary bg-primary text-primary-foreground",
                      !showResult && !isSelected && "border-border text-muted-foreground",
                      showCorrect && "border-green-500 bg-green-500 text-primary-foreground",
                      showIncorrect && "border-destructive bg-destructive text-primary-foreground"
                    )}
                  >
                    {showCorrect ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : showIncorrect ? (
                      <XCircle className="h-5 w-5" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span
                    className={cn(
                      "font-medium",
                      showCorrect && "text-green-700 dark:text-green-300",
                      showIncorrect && "text-destructive"
                    )}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="mt-6 rounded-xl bg-secondary/50 p-4 animate-fade-in">
              <h4 className="font-medium text-foreground mb-2">Explanation</h4>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="gradient-primary text-primary-foreground hover:opacity-90 shadow-soft"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gradient-primary text-primary-foreground hover:opacity-90 shadow-soft"
            >
              {currentQuestion < mockQuestions.length - 1 ? (
                <>
                  Next Question
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "View Results"
              )}
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
