import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Plus, Calendar, Flag, MoreHorizontal, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate: string;
  subject?: string;
}

const initialTasks: Task[] = [
  { id: "1", title: "Complete Biology Chapter 5 notes", completed: false, priority: "high", dueDate: "Today", subject: "Biology" },
  { id: "2", title: "Practice quadratic equations", completed: false, priority: "medium", dueDate: "Tomorrow", subject: "Mathematics" },
  { id: "3", title: "Review flashcards for Chemistry", completed: true, priority: "low", dueDate: "Yesterday", subject: "Chemistry" },
  { id: "4", title: "Write essay outline for History", completed: false, priority: "high", dueDate: "In 2 days", subject: "History" },
  { id: "5", title: "Watch lecture video on photosynthesis", completed: true, priority: "medium", dueDate: "Last week", subject: "Biology" },
];

const priorityColors = {
  high: "text-destructive",
  medium: "text-accent",
  low: "text-muted-foreground",
};

const priorityBg = {
  high: "bg-destructive/10",
  medium: "bg-accent/10",
  low: "bg-muted",
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      priority: "medium",
      dueDate: "Today",
    };
    setTasks([task, ...tasks]);
    setNewTask("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground">Manage your study tasks and assignments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{completedCount}</span> of{" "}
              <span className="font-medium text-foreground">{tasks.length}</span> completed
            </div>
          </div>
        </div>

        {/* Add Task */}
        <div className="flex gap-3">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1"
          />
          <Button
            onClick={addTask}
            className="gradient-primary text-primary-foreground hover:opacity-90 shadow-soft"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({tasks.length})
          </Button>
          <Button
            variant={filter === "active" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active ({activeCount})
          </Button>
          <Button
            variant={filter === "completed" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed ({completedCount})
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:shadow-medium animate-scale-in",
                  task.completed && "opacity-60"
                )}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex-shrink-0 focus:outline-none"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium text-foreground",
                      task.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {task.subject && (
                      <span className="text-xs text-primary font-medium">{task.subject}</span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                      priorityBg[task.priority],
                      priorityColors[task.priority]
                    )}
                  >
                    <Flag className="h-3 w-3" />
                    <span className="capitalize">{task.priority}</span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Flag className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tasks.filter((t) => t.priority === "high" && !t.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {tasks.filter((t) => t.dueDate === "Today" && !t.completed).length}
                </p>
                <p className="text-sm text-muted-foreground">Due Today</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
