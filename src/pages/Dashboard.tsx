import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { BookOpen, Layers, CheckCircle, Clock, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const recentActivity = [
  { id: 1, action: "Completed flashcard set", subject: "Biology Chapter 5", time: "2h ago" },
  { id: 2, action: "Scored 85% on quiz", subject: "Math Fundamentals", time: "4h ago" },
  { id: 3, action: "Uploaded notes", subject: "History Notes", time: "1d ago" },
  { id: 4, action: "Created 12 flashcards", subject: "Chemistry Reactions", time: "1d ago" },
];

const upcomingTasks = [
  { id: 1, title: "Review Biology Notes", dueDate: "Today", priority: "high" },
  { id: 2, title: "Complete Math Quiz", dueDate: "Tomorrow", priority: "medium" },
  { id: 3, title: "Study for History Exam", dueDate: "In 3 days", priority: "low" },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Welcome back, Student! 👋</h1>
          <p className="text-muted-foreground">Here's your study progress overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Study Hours"
            value="24.5"
            subtitle="This week"
            icon={<Clock className="h-5 w-5" />}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title="Flashcards Reviewed"
            value="156"
            subtitle="This month"
            icon={<Layers className="h-5 w-5" />}
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            title="Quizzes Completed"
            value="12"
            subtitle="85% avg score"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <StatCard
            title="Tasks Done"
            value="8/12"
            subtitle="This week"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Study Progress */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Study Progress</h2>
              <span className="text-sm text-muted-foreground">This week</span>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">Biology</span>
                  <span className="text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">Mathematics</span>
                  <span className="text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">History</span>
                  <span className="text-muted-foreground">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">Chemistry</span>
                  <span className="text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Tasks</h2>
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      task.priority === "high"
                        ? "bg-destructive"
                        : task.priority === "medium"
                        ? "bg-accent"
                        : "bg-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
