import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Upload, FileText, X, CheckCircle, Loader2, Sparkles, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  status: "uploading" | "processing" | "complete" | "error";
  progress: number;
}

export default function UploadNotes() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      status: "uploading" as const,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "processing", progress: 100 } : f
          )
        );
        // Simulate processing
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, status: "complete" } : f
            )
          );
        }, 2000);
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
          )
        );
      }
    }, 300);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleGenerateFlashcards = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const completedFiles = files.filter((f) => f.status === "complete").length;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Upload Your Notes</h1>
          <p className="text-muted-foreground text-lg">
            Upload your study materials and we'll create flashcards for you
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer",
            isDragOver
              ? "border-primary bg-primary/5 shadow-glow scale-[1.02]"
              : "border-border bg-card hover:border-primary/50 hover:bg-secondary/30"
          )}
        >
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            multiple
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-5">
            <div className={cn(
              "flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300",
              isDragOver ? "gradient-primary shadow-glow scale-110" : "bg-secondary"
            )}>
              <Upload className={cn(
                "h-10 w-10 transition-colors",
                isDragOver ? "text-primary-foreground" : "text-muted-foreground"
              )} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {isDragOver ? "Drop your files here!" : "Drag & drop your files"}
              </h3>
              <p className="text-muted-foreground">
                or click to browse from your computer
              </p>
            </div>

            {/* Accepted Files Info */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">PDF</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                <File className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">TXT</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">DOCX</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
          </div>
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Your Files ({files.length})
              </h2>
              {completedFiles > 0 && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {completedFiles} ready
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:shadow-medium animate-scale-in"
                >
                  <div className="flex items-center gap-4">
                    {/* File Icon */}
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      file.status === "complete" ? "bg-green-100 dark:bg-green-900/20" : "bg-secondary"
                    )}>
                      {file.status === "complete" ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : file.status === "processing" ? (
                        <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                      ) : file.status === "error" ? (
                        <AlertCircle className="h-6 w-6 text-destructive" />
                      ) : (
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{file.size}</p>
                      
                      {/* Progress Bar */}
                      {file.status === "uploading" && (
                        <div className="mt-2 space-y-1">
                          <Progress value={file.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Uploading... {Math.round(file.progress)}%
                          </p>
                        </div>
                      )}
                      
                      {/* Status Messages */}
                      {file.status === "processing" && (
                        <div className="flex items-center gap-2 mt-2 text-accent">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm font-medium">Processing your file...</span>
                        </div>
                      )}
                      
                      {file.status === "complete" && (
                        <p className="text-sm text-green-600 mt-1 font-medium">
                          Ready to generate flashcards!
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        {completedFiles > 0 && (
          <div className="flex flex-col items-center gap-4 pt-4 animate-fade-in">
            <Button
              onClick={handleGenerateFlashcards}
              disabled={isGenerating}
              size="lg"
              className="gradient-primary text-primary-foreground hover:opacity-90 shadow-medium px-8 py-6 text-lg rounded-xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Generating flashcards...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-3" />
                  Generate Flashcards
                </>
              )}
            </Button>
            
            {isGenerating && (
              <div className="text-center space-y-3 animate-fade-in">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <p className="text-muted-foreground">
                  Our AI is reading your notes and creating flashcards...
                </p>
                <p className="text-sm text-muted-foreground">This usually takes about 30 seconds</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State Hint */}
        {files.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Upload your first file to get started!
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
