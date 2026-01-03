import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UploadNotes from "./pages/UploadNotes";
import Flashcards from "./pages/Flashcards";
import StudyMode from "./pages/StudyMode";
import Quiz from "./pages/Quiz";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import DoubtSolver from "./pages/DoubtSolver";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadNotes />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/study" element={<StudyMode />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/doubt-solver" element={<DoubtSolver />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
