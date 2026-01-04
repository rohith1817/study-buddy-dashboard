import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Clock, ChevronRight, CheckCircle, XCircle, AlertCircle, Trophy, RotateCcw, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

type QuizState = "loading" | "select" | "intro" | "active" | "results";

export default function QuizPage() {
  const { user } = useAuth();
  const [quizState, setQuizState] = useState<QuizState>("loading");
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (user) {
      fetchQuizzes();
    }
  }, [user]);

  const fetchQuizzes = async () => {
    try {
      const { data: quizzes, error: quizzesError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (quizzesError) throw quizzesError;

      const quizzesWithQuestions: Quiz[] = [];

      for (const quiz of quizzes || []) {
        const { data: questions, error: questionsError } = await supabase
          .from("quiz_questions")
          .select("*")
          .eq("quiz_id", quiz.id);

        if (questionsError) throw questionsError;

        quizzesWithQuestions.push({
          id: quiz.id,
          title: quiz.title,
          questions: (questions || []).map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options as string[],
            correctAnswer: q.correct_answer,
            explanation: q.explanation || undefined,
          })),
        });
      }

      setAvailableQuizzes(quizzesWithQuestions);
      setQuizState(quizzesWithQuestions.length > 0 ? "select" : "select");
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      if (quizState === "loading") {
        setQuizState("select");
      }
    }
  };

  const totalQuestions = selectedQuiz?.questions.length || 0;
  const answeredCount = Object.keys(answers).length;

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

  const handleSelectQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizState("intro");
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
    setQuizState("select");
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeElapsed(0);
    setShowReview(false);
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    let correct = 0;
    selectedQuiz.questions.forEach((q, index) => {
      if (q.options[answers[index]] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  // Loading State
  if (quizState === "loading") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  // Quiz Selection Screen
  if (quizState === "select") {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-8 animate-fade-in">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
            <p className="text-muted-foreground">Select a quiz to test your knowledge</p>
          </div>

          {availableQuizzes.length > 0 ? (
            <div className="grid gap-4">
              {availableQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => handleSelectQuiz(quiz)}
                  className="rounded-xl border border-border bg-card p-6 shadow-soft hover:shadow-medium transition-all cursor-pointer hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">{quiz.questions.length} questions</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No quizzes yet</h3>
              <p className="text-muted-foreground">Upload some notes to generate quizzes</p>
            </div>
          )}
        </div>
      </MainLayout>
    );
  }

  // Intro Screen
  if (quizState === "intro" && selectedQuiz) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
          <div className="max-w-lg w-full text-center space-y-8">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-medium">
                <FileText className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">{selectedQuiz.title}</h1>
              <p className="text-muted-foreground text-lg">
                Test your knowledge with {totalQuestions} questions
              </p>
            </div>

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
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={handleRestart} className="rounded-xl">
                Back to Quizzes
              </Button>
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
        </div>
      </MainLayout>
    );
  }

  // Results Screen
  if (quizState === "results" && selectedQuiz) {
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 60;

    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto py-8 animate-fade-in">
          {!showReview ? (
            <div className="text-center space-y-8">
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

              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {passed ? "Congratulations!" : "Keep Practicing!"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {passed ? "You passed the quiz!" : "You can do better next time!"}
                </p>
              </div>

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

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setShowReview(true)} className="rounded-xl">
                  Review Answers
                </Button>
                <Button onClick={handleRestart} className="gradient-primary text-primary-foreground hover:opacity-90 rounded-xl">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Back to Quizzes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Answer Review</h2>
                <Button variant="outline" onClick={() => setShowReview(false)} className="rounded-xl">
                  Back to Results
                </Button>
              </div>

              <div className="space-y-4">
                {selectedQuiz.questions.map((q, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = q.options[userAnswer] === q.correctAnswer;

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
                                  option === q.correctAnswer
                                    ? "border-green-400 bg-green-100 text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300"
                                    : optIndex === userAnswer && !isCorrect
                                    ? "border-red-400 bg-red-100 text-red-800 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300"
                                    : "border-border bg-background text-muted-foreground"
                                )}
                              >
                                {option === q.correctAnswer && <CheckCircle className="inline h-3 w-3 mr-1" />}
                                {optIndex === userAnswer && !isCorrect && <XCircle className="inline h-3 w-3 mr-1" />}
                                {option}
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <strong>Explanation:</strong> {q.explanation}
                            </p>
                          )}
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
  if (!selectedQuiz) return null;
  const question = selectedQuiz.questions[currentQuestion];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-4 animate-fade-in">
        {/* Header Bar */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-soft mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono font-semibold text-foreground">{formatTime(timeElapsed)}</span>
            </div>

            <div className="flex-1 mx-8">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{answeredCount}/{totalQuestions} answered</span>
              </div>
              <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
            </div>

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
                {selectedQuiz.questions.map((_, index) => {
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
            </div>
          </div>

          {/* Question Card */}
          <div className="col-span-9">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestion + 1} of {totalQuestions}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-6">{question.question}</h2>

              <div className="space-y-3 mb-8">
                {question.options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === index;

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-foreground">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
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
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={answeredCount < totalQuestions}
                    className="gradient-primary text-primary-foreground hover:opacity-90 rounded-xl"
                  >
                    Finish Quiz
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
