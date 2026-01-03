import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { 
  BookOpen, 
  Layers, 
  CheckCircle, 
  Clock, 
  Flame, 
  Target,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

// Weekly study data
const weeklyData = [
  { day: "Mon", cards: 24, minutes: 45 },
  { day: "Tue", cards: 18, minutes: 32 },
  { day: "Wed", cards: 32, minutes: 55 },
  { day: "Thu", cards: 28, minutes: 48 },
  { day: "Fri", cards: 15, minutes: 25 },
  { day: "Sat", cards: 42, minutes: 72 },
  { day: "Sun", cards: 35, minutes: 58 },
];

// Card performance distribution
const performanceData = [
  { name: "Mastered", value: 45, color: "hsl(var(--primary))" },
  { name: "Learning", value: 30, color: "hsl(var(--accent))" },
  { name: "New", value: 25, color: "hsl(var(--muted-foreground))" },
];

// Upcoming reviews schedule
const upcomingReviews = [
  { id: 1, subject: "Biology - Cell Division", cards: 12, dueTime: "In 2 hours" },
  { id: 2, subject: "Chemistry - Organic Compounds", cards: 8, dueTime: "Today 6 PM" },
  { id: 3, subject: "Physics - Mechanics", cards: 15, dueTime: "Tomorrow" },
  { id: 4, subject: "Math - Calculus", cards: 10, dueTime: "In 2 days" },
];

const chartConfig = {
  cards: {
    label: "Cards",
    color: "hsl(var(--primary))",
  },
  minutes: {
    label: "Minutes",
    color: "hsl(var(--accent))",
  },
};

export default function Dashboard() {
  const totalProgress = 68; // Overall mastery percentage
  const studyStreak = 12; // Days in a row

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Welcome back, Student! 👋</h1>
            <p className="text-muted-foreground">Ready to continue your learning journey?</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-semibold text-foreground">{studyStreak} day streak!</span>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Due Today"
            value="24"
            subtitle="Flashcards to review"
            icon={<Clock className="h-5 w-5" />}
            className="border-l-4 border-l-primary"
          />
          <StatCard
            title="Upcoming Reviews"
            value="45"
            subtitle="Next 7 days"
            icon={<Calendar className="h-5 w-5" />}
          />
          <StatCard
            title="Completed Today"
            value="18"
            subtitle="Cards reviewed"
            icon={<CheckCircle className="h-5 w-5" />}
            trend={{ value: 15, positive: true }}
          />
          <StatCard
            title="Study Streak"
            value={`${studyStreak}`}
            subtitle="Days in a row"
            icon={<Flame className="h-5 w-5 text-orange-500" />}
          />
          <StatCard
            title="Progress"
            value={`${totalProgress}%`}
            subtitle="Overall mastery"
            icon={<Target className="h-5 w-5" />}
            trend={{ value: 5, positive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Weekly Activity Chart */}
          <Card className="lg:col-span-2 shadow-soft">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Cards</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-accent" />
                    <span className="text-muted-foreground">Minutes</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="cards" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#colorCards)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 0, r: 3 }}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Card Mastery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ChartContainer config={chartConfig} className="h-[160px] w-[160px]">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="mt-4 space-y-2">
                {performanceData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress & Reviews Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Overall Progress */}
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">Subject Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">Biology</span>
                    <span className="text-muted-foreground">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">Chemistry</span>
                    <span className="text-muted-foreground">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">Physics</span>
                    <span className="text-muted-foreground">58%</span>
                  </div>
                  <Progress value={58} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">Mathematics</span>
                    <span className="text-muted-foreground">64%</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Reviews */}
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg font-semibold">Upcoming Reviews</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">{review.subject}</p>
                      <p className="text-xs text-muted-foreground">{review.cards} cards</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {review.dueTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium text-foreground">Start Review</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-accent/5 hover:bg-accent/10 border border-accent/20 transition-colors">
                <Layers className="h-6 w-6 text-accent" />
                <span className="text-sm font-medium text-foreground">Practice Quiz</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-secondary/70 border border-border transition-colors">
                <Target className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Study Mode</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-secondary/70 border border-border transition-colors">
                <CheckCircle className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">View Tasks</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}