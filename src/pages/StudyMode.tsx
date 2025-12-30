import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const studyTopics = [
  {
    id: "1",
    title: "Photosynthesis Process",
    subject: "Biology",
    duration: "15 min",
    progress: 65,
    content:
      "Photosynthesis is the process by which plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose. This process occurs primarily in the leaves of plants, within specialized cell structures called chloroplasts.",
  },
  {
    id: "2",
    title: "Quadratic Equations",
    subject: "Mathematics",
    duration: "20 min",
    progress: 30,
    content:
      "A quadratic equation is a second-degree polynomial equation in a single variable x. The standard form is ax² + bx + c = 0, where a ≠ 0. The solutions can be found using the quadratic formula, factoring, or completing the square.",
  },
  {
    id: "3",
    title: "World War II Timeline",
    subject: "History",
    duration: "25 min",
    progress: 0,
    content:
      "World War II was a global conflict that lasted from 1939 to 1945. It involved the vast majority of the world's countries forming two opposing military alliances: the Allies and the Axis powers.",
  },
];

export default function StudyMode() {
  const [selectedTopic, setSelectedTopic] = useState(studyTopics[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [studyTime, setStudyTime] = useState(0);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Study Mode</h1>
            <p className="text-muted-foreground">Focus on your learning with distraction-free study</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2">
              <Clock className="h-4 w-4 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">
                {Math.floor(studyTime / 60)}:{String(studyTime % 60).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Topic List */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Study Topics
            </h3>
            <div className="space-y-3">
              {studyTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition-all",
                    selectedTopic.id === topic.id
                      ? "border-primary bg-secondary shadow-soft"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-primary">{topic.subject}</span>
                    <span className="text-xs text-muted-foreground">{topic.duration}</span>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">{topic.title}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-muted-foreground">{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Study Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Study Card */}
            <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
              {/* Topic Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-primary">{selectedTopic.subject}</span>
                    <h2 className="text-xl font-semibold text-foreground">{selectedTopic.title}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="rounded-full"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-slate max-w-none mb-8">
                <p className="text-foreground leading-relaxed text-lg">{selectedTopic.content}</p>
              </div>

              {/* Key Points */}
              <div className="rounded-xl bg-secondary/50 p-5 mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Key Points
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Occurs in chloroplasts within plant cells</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Converts light energy to chemical energy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>Produces glucose and oxygen as outputs</span>
                  </li>
                </ul>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Topic Progress</span>
                  <span className="text-foreground font-medium">{selectedTopic.progress}%</span>
                </div>
                <Progress value={selectedTopic.progress} className="h-2" />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setStudyTime(0)}
                className="rounded-full h-12 w-12"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="gradient-primary text-primary-foreground h-14 w-14 rounded-full shadow-medium hover:opacity-90"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              <Button variant="outline" className="rounded-full">
                Mark Complete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
