import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Clock, ChevronRight, CheckCircle, XCircle, AlertCircle, Trophy, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: Question[] = [
  {
    id: "1",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
    correctAnswer: 1,
  },
  {
    id: "2",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctAnswer: 2,
  },
  {
    id: "3",
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
  },
  {
    id: "4",
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
  },
  {
    id: "5",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
  },
  {
    id: "6",
    question: "What year did World War I begin?",
    options: ["1912", "1914", "1916", "1918"],
    correctAnswer: 1,
  },
  {
    id: "7",
    question: "What is the formula for calculating the area of a circle?",
    options: ["πr", "2πr", "πr²", "πd"],
    correctAnswer: 2,
  },
  {
    id: "8",
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctAnswer: 2,
  },
];

type QuizState = "intro" | "active" | "review" | "results";

export default function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const totalQuestions = quizQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizState === "active") {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setQuizState("results");
  };

  const handleRestart = () => {
    setQuizState("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setTimeElapsed(0);
    setShowReview(false);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  // Intro Screen
  if (quizState === "intro") {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
          <div className="max-w-lg w-full text-center space-y-8">
            {/* Quiz Icon */}
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-medium">
                <FileText className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            {/* Quiz Info */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">General Knowledge Quiz</h1>
              <p className="text-muted-foreground text-lg">
                Test your knowledge with {totalQuestions} questions
              </p>
            </div>

            {/* Quiz Details Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft text-left space-y-4">
              <h3 className="font-semibold text-foreground">Quiz Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Questions</p>
                    <p className="font-medium text-foreground">{totalQuestions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time Limit</p>
                    <p className="font-medium text-foreground">No Limit</p>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  • Each question has 4 options with one correct answer<br />
                  • You can navigate between questions<br />
                  • Review your answers before submitting
                </p>
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={() => setQuizState("active")}
              size="lg"
              className="gradient-primary text-primary-foreground hover:opacity-90 shadow-medium rounded-xl px-12 py-6 text-lg"
            >
              Start Quiz
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Results Screen
  if (quizState === "results") {
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;

    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-8 animate-fade-in">
          {!showReview ? (
            <div className="text-center space-y-8">
              {/* Result Icon */}
              <div className="flex justify-center">
                <div className={cn(
                  "h-24 w-24 rounded-full flex items-center justify-center shadow-glow animate-scale-in",
                  passed ? "bg-green-500" : "bg-orange-500"
                )}>
                  {passed ? (
                    <Trophy className="h-12 w-12 text-white" />
                  ) : (
                    <AlertCircle className="h-12 w-12 text-white" />
                  )}
                </div>
              </div>

              {/* Result Message */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {passed ? "Congratulations!" : "Keep Practicing!"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {passed ? "You passed the quiz!" : "You can do better next time!"}
                </p>
              </div>

              {/* Score Card */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">{score}</p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <p className={cn(
                      "text-4xl font-bold",
                      passed ? "text-green-600" : "text-orange-600"
                    )}>{percentage}%</p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-foreground">{formatTime(timeElapsed)}</p>
                    <p className="text-sm text-muted-foreground">Time</p>
                  </div>
                </div>
              </div>

              {/* Answer Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <div className="text-left">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</p>
                      <p className="text-sm text-green-600/80 dark:text-green-400/80">Correct Answers</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                  <div className="flex items-center justify-center gap-3">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    <div className="text-left">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalQuestions - score}</p>
                      <p className="text-sm text-red-600/80 dark:text-red-400/80">Wrong Answers</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setShowReview(true)} className="rounded-xl">
                  Review Answers
                </Button>
                <Button onClick={handleRestart} className="gradient-primary text-primary-foreground hover:opacity-90 rounded-xl">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            /* Review Mode */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Answer Review</h2>
                <Button variant="outline" onClick={() => setShowReview(false)} className="rounded-xl">
                  Back to Results
                </Button>
              </div>

              <div className="space-y-4">
                {quizQuestions.map((q, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "rounded-xl border p-5",
                        isCorrect
                          ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10"
                          : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                          isCorrect ? "bg-green-500" : "bg-red-500"
                        )}>
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <p className="font-medium text-foreground">{q.question}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={cn(
                                  "text-sm px-3 py-2 rounded-lg border",
                                  optIndex === q.correctAnswer
                                    ? "border-green-400 bg-green-100 text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300"
                                    : optIndex === userAnswer && !isCorrect
                                    ? "border-red-400 bg-red-100 text-red-800 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300"
                                    : "border-border bg-background text-muted-foreground"
                                )}
                              >
                                {optIndex === q.correctAnswer && <CheckCircle className="inline h-3 w-3 mr-1" />}
                                {optIndex === userAnswer && !isCorrect && <XCircle className="inline h-3 w-3 mr-1" />}
                                {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  // Active Quiz
  const question = quizQuestions[currentQuestion];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-4 animate-fade-in">
        {/* Header Bar */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-soft mb-6">
          <div className="flex items-center justify-between">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono font-semibold text-foreground">{formatTime(timeElapsed)}</span>
            </div>

            {/* Progress */}
            <div className="flex-1 mx-8">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{answeredCount}/{totalQuestions} answered</span>
              </div>
              <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={answeredCount < totalQuestions}
              className={cn(
                "rounded-xl",
                answeredCount === totalQuestions
                  ? "gradient-primary text-primary-foreground hover:opacity-90"
                  : ""
              )}
            >
              Submit Quiz
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Question Navigator */}
          <div className="col-span-3">
            <div className="rounded-xl border border-border bg-card p-4 shadow-soft sticky top-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Questions</h3>
              <div className="grid grid-cols-4 gap-2">
                {quizQuestions.map((_, index) => {
                  const isAnswered = answers[index] !== undefined;
                  const isCurrent = index === currentQuestion;

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={cn(
                        "h-9 w-9 rounded-lg text-sm font-medium transition-all",
                        isCurrent
                          ? "gradient-primary text-primary-foreground shadow-soft"
                          : isAnswered
                          ? "bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-green-100 border border-green-300 dark:bg-green-900/30 dark:border-green-700" />
                  <span className="text-muted-foreground">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-secondary" />
                  <span className="text-muted-foreground">Not Answered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="col-span-9">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
              {/* Question Number */}
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center h-10 w-10 rounded-xl gradient-primary text-primary-foreground font-bold">
                  {currentQuestion + 1}
                </span>
                <span className="text-sm text-muted-foreground">of {totalQuestions} questions</span>
              </div>

              {/* Question Text */}
              <h2 className="text-xl font-semibold text-foreground mb-8 leading-relaxed">
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === index;
                  const optionLabel = String.fromCharCode(65 + index);

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      className={cn(
                        "w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all",
                          isSelected
                            ? "gradient-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {optionLabel}
                      </div>
                      <span className={cn(
                        "font-medium",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {option}
                      </span>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="rounded-xl"
                >
                  Previous
                </Button>

                {currentQuestion < totalQuestions - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="gradient-primary text-primary-foreground hover:opacity-90 rounded-xl"
                  >
                    Next Question
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={answeredCount < totalQuestions}
                    className="gradient-primary text-primary-foreground hover:opacity-90 rounded-xl"
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
