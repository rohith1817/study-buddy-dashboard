import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  Target,
  Trash2,
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  icon: "flashcards" | "quiz" | "revise" | "study" | "custom";
  completed: boolean;
  createdAt: Date;
}

const iconMap = {
  flashcards: Layers,
  quiz: HelpCircle,
  revise: Target,
  study: BookOpen,
  custom: Sparkles,
};

const iconColorMap = {
  flashcards: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  quiz: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
  revise: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
  study: "text-green-500 bg-green-100 dark:bg-green-900/30",
  custom: "text-primary bg-secondary",
};

const initialTasks: Task[] = [
  { id: "1", title: "Review Flashcards", icon: "flashcards", completed: false, createdAt: new Date() },
  { id: "2", title: "Take Quiz", icon: "quiz", completed: false, createdAt: new Date() },
  { id: "3", title: "Revise Hard Cards", icon: "revise", completed: false, createdAt: new Date() },
  { id: "4", title: "Study Biology Chapter 5", icon: "study", completed: false, createdAt: new Date() },
  { id: "5", title: "Practice Math Problems", icon: "custom", completed: true, createdAt: new Date() },
  { id: "6", title: "Review Yesterday's Notes", icon: "flashcards", completed: true, createdAt: new Date() },
];

const quickAddTasks = [
  { label: "Review Flashcards", icon: "flashcards" as const },
  { label: "Take Quiz", icon: "quiz" as const },
  { label: "Revise Hard Cards", icon: "revise" as const },
  { label: "Study Session", icon: "study" as const },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addTask = (title: string, icon: Task["icon"] = "custom") => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      icon,
      completed: false,
      createdAt: new Date(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
  };

  const addQuickTask = (label: string, icon: Task["icon"]) => {
    addTask(label, icon);
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Daily Tasks</h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{today}</span>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Today's Progress</p>
              <p className="text-2xl font-bold text-foreground">
                {completedTasks.length} of {tasks.length} completed
              </p>
            </div>
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={176}
                  strokeDashoffset={176 - (176 * completedTasks.length) / Math.max(tasks.length, 1)}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Quick Add</p>
          <div className="flex flex-wrap gap-2">
            {quickAddTasks.map((task) => {
              const Icon = iconMap[task.icon];
              return (
                <button
                  key={task.label}
                  onClick={() => addQuickTask(task.label, task.icon)}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary hover:text-foreground transition-all hover:shadow-soft"
                >
                  <Icon className="h-4 w-4" />
                  {task.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Custom Task */}
        <div className="flex gap-3">
          <Input
            placeholder="Add a custom task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask(newTaskTitle)}
            className="flex-1 h-12 rounded-xl"
          />
          <Button
            onClick={() => addTask(newTaskTitle)}
            disabled={!newTaskTitle.trim()}
            className="gradient-primary text-primary-foreground hover:opacity-90 rounded-xl h-12 px-6"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Pending Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Pending</h2>
              <span className="text-sm text-muted-foreground">({pendingTasks.length})</span>
            </div>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-foreground font-medium">All tasks completed!</p>
              <p className="text-sm text-muted-foreground mt-1">Great job! Add more tasks or take a break.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingTasks.map((task) => {
                const Icon = iconMap[task.icon];
                return (
                  <div
                    key={task.id}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:shadow-medium animate-fade-in"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 focus:outline-none"
                    >
                      <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    </button>

                    <div className={cn(
                      "flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center",
                      iconColorMap[task.icon]
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="flex-1 font-medium text-foreground">{task.title}</span>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-semibold text-foreground">Completed</h2>
                <span className="text-sm text-muted-foreground">({completedTasks.length})</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompleted}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2">
              {completedTasks.map((task) => {
                const Icon = iconMap[task.icon];
                return (
                  <div
                    key={task.id}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 transition-all animate-fade-in"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 focus:outline-none"
                    >
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </button>

                    <div className={cn(
                      "flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center opacity-50",
                      iconColorMap[task.icon]
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="flex-1 font-medium text-muted-foreground line-through">
                      {task.title}
                    </span>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Motivation Message */}
        {pendingTasks.length > 0 && completedTasks.length > 0 && (
          <div className="text-center py-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              🎯 You're making great progress! Keep going!
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
