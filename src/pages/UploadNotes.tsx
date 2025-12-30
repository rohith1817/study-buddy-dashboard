import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: "uploading" | "processing" | "complete";
}

const mockFiles: UploadedFile[] = [
  { id: "1", name: "Biology_Chapter5_Notes.pdf", size: "2.4 MB", status: "complete" },
  { id: "2", name: "Math_Formulas.docx", size: "1.1 MB", status: "complete" },
  { id: "3", name: "History_Timeline.pdf", size: "3.2 MB", status: "processing" },
];

export default function UploadNotes() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file drop logic here
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Upload Notes</h1>
          <p className="text-muted-foreground">
            Upload your study materials and let AI generate flashcards and quizzes
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200",
            isDragOver
              ? "border-primary bg-primary/5 shadow-glow"
              : "border-border bg-card hover:border-primary/50"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-medium">
              <Upload className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Drag and drop your files here
              </h3>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOCX, TXT, and image files up to 10MB
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">or</span>
            </div>
            <Button className="gradient-primary text-primary-foreground hover:opacity-90 shadow-soft">
              Browse Files
            </Button>
          </div>
        </div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Uploaded Files</h2>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-soft transition-all hover:shadow-medium animate-scale-in"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <FileText className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {file.status === "uploading" && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                    {file.status === "processing" && (
                      <div className="flex items-center gap-2 text-accent">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processing with AI...</span>
                      </div>
                    )}
                    {file.status === "complete" && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Complete</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-medium transition-all">
            <h3 className="font-semibold text-foreground mb-2">Generate Flashcards</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create flashcards from your uploaded notes automatically
            </p>
            <Button variant="secondary" size="sm">
              Generate
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-medium transition-all">
            <h3 className="font-semibold text-foreground mb-2">Create Quiz</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Turn your notes into an interactive quiz
            </p>
            <Button variant="secondary" size="sm">
              Create
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-medium transition-all">
            <h3 className="font-semibold text-foreground mb-2">Summarize Notes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get an AI-powered summary of your materials
            </p>
            <Button variant="secondary" size="sm">
              Summarize
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
