import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Brain, BookOpen, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Welcome = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations for cursor following
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform mouse position to movement values for different layers
  const layer1X = useTransform(smoothMouseX, [0, 1], [-30, 30]);
  const layer1Y = useTransform(smoothMouseY, [0, 1], [-30, 30]);
  const layer2X = useTransform(smoothMouseX, [0, 1], [-50, 50]);
  const layer2Y = useTransform(smoothMouseY, [0, 1], [-50, 50]);
  const layer3X = useTransform(smoothMouseX, [0, 1], [-20, 20]);
  const layer3Y = useTransform(smoothMouseY, [0, 1], [-20, 20]);
  const rotateX = useTransform(smoothMouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Simulate loading
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowContent(true), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  // Floating particles with parallax - more particles
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    parallaxFactor: Math.random() * 0.5 + 0.2,
  }));

  // More floating shapes that follow cursor
  const floatingShapes = [
    { id: 1, shape: "circle", size: 80, x: 10, y: 15, color: "purple", parallax: 60 },
    { id: 2, shape: "circle", size: 50, x: 85, y: 10, color: "cyan", parallax: 40 },
    { id: 3, shape: "square", size: 40, x: 5, y: 60, color: "violet", parallax: 70 },
    { id: 4, shape: "circle", size: 70, x: 92, y: 70, color: "pink", parallax: 50 },
    { id: 5, shape: "square", size: 35, x: 80, y: 40, color: "blue", parallax: 55 },
    { id: 6, shape: "circle", size: 45, x: 20, y: 80, color: "indigo", parallax: 35 },
    { id: 7, shape: "hexagon", size: 55, x: 50, y: 5, color: "emerald", parallax: 45 },
    { id: 8, shape: "triangle", size: 45, x: 70, y: 85, color: "amber", parallax: 65 },
    { id: 9, shape: "circle", size: 30, x: 30, y: 45, color: "rose", parallax: 30 },
    { id: 10, shape: "square", size: 25, x: 60, y: 25, color: "sky", parallax: 50 },
    { id: 11, shape: "circle", size: 65, x: 40, y: 90, color: "fuchsia", parallax: 40 },
    { id: 12, shape: "hexagon", size: 35, x: 95, y: 50, color: "lime", parallax: 55 },
  ];

  // Orbiting elements
  const orbitingElements = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    radius: 200 + Math.random() * 150,
    duration: 20 + Math.random() * 20,
    delay: i * 2,
    color: ["purple", "cyan", "violet", "pink", "blue"][i % 5],
  }));

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0f] overflow-hidden relative">
      {/* Animated background gradient - follows cursor */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-600/10 via-transparent to-transparent rounded-full blur-3xl"
          style={{ x: layer2X, y: layer2Y }}
        />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse"
          style={{ x: layer1X, y: layer1Y }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl animate-pulse" 
          style={{ x: layer3X, y: layer3Y, animationDelay: "1s" }}
        />
      </div>

      {/* Floating shapes that follow cursor */}
      {floatingShapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${
            shape.shape === "circle" ? "rounded-full" : 
            shape.shape === "square" ? "rounded-lg rotate-45" :
            shape.shape === "hexagon" ? "rounded-lg rotate-[30deg]" :
            "rotate-[60deg]"
          } opacity-30 blur-[2px]`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            background: `linear-gradient(135deg, ${
              shape.color === "purple" ? "#a855f7, #7c3aed" :
              shape.color === "cyan" ? "#22d3ee, #06b6d4" :
              shape.color === "violet" ? "#8b5cf6, #6d28d9" :
              shape.color === "pink" ? "#ec4899, #db2777" :
              shape.color === "blue" ? "#3b82f6, #2563eb" :
              shape.color === "indigo" ? "#6366f1, #4f46e5" :
              shape.color === "emerald" ? "#10b981, #059669" :
              shape.color === "amber" ? "#f59e0b, #d97706" :
              shape.color === "rose" ? "#f43f5e, #e11d48" :
              shape.color === "sky" ? "#0ea5e9, #0284c7" :
              shape.color === "fuchsia" ? "#d946ef, #c026d3" :
              "#84cc16, #65a30d"
            })`,
            x: useTransform(smoothMouseX, [0, 1], [-shape.parallax, shape.parallax]),
            y: useTransform(smoothMouseY, [0, 1], [-shape.parallax, shape.parallax]),
            boxShadow: `0 0 ${shape.size / 2}px ${
              shape.color === "purple" ? "rgba(168, 85, 247, 0.5)" :
              shape.color === "cyan" ? "rgba(34, 211, 238, 0.5)" :
              "rgba(139, 92, 246, 0.5)"
            }`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: shape.shape === "square" ? [45, 135, 45] : 
                   shape.shape === "hexagon" ? [30, 90, 30] :
                   shape.shape === "triangle" ? [60, 120, 60] : 0,
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3 + shape.id * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Orbiting elements around center */}
      {orbitingElements.map((orbit) => (
        <motion.div
          key={`orbit-${orbit.id}`}
          className="absolute rounded-full"
          style={{
            width: orbit.size,
            height: orbit.size,
            left: "50%",
            top: "50%",
            background: `radial-gradient(circle, ${
              orbit.color === "purple" ? "#a855f7" :
              orbit.color === "cyan" ? "#22d3ee" :
              orbit.color === "violet" ? "#8b5cf6" :
              orbit.color === "pink" ? "#ec4899" :
              "#3b82f6"
            }, transparent)`,
            boxShadow: `0 0 ${orbit.size * 2}px ${
              orbit.color === "purple" ? "rgba(168, 85, 247, 0.8)" :
              orbit.color === "cyan" ? "rgba(34, 211, 238, 0.8)" :
              orbit.color === "violet" ? "rgba(139, 92, 246, 0.8)" :
              orbit.color === "pink" ? "rgba(236, 72, 153, 0.8)" :
              "rgba(59, 130, 246, 0.8)"
            }`,
          }}
          animate={{
            x: [
              Math.cos(0) * orbit.radius,
              Math.cos(Math.PI / 2) * orbit.radius,
              Math.cos(Math.PI) * orbit.radius,
              Math.cos(Math.PI * 1.5) * orbit.radius,
              Math.cos(Math.PI * 2) * orbit.radius,
            ],
            y: [
              Math.sin(0) * orbit.radius,
              Math.sin(Math.PI / 2) * orbit.radius,
              Math.sin(Math.PI) * orbit.radius,
              Math.sin(Math.PI * 1.5) * orbit.radius,
              Math.sin(Math.PI * 2) * orbit.radius,
            ],
          }}
          transition={{
            duration: orbit.duration,
            repeat: Infinity,
            ease: "linear",
            delay: orbit.delay,
          }}
        />
      ))}

      {/* Glowing cursor trail effect */}
      <motion.div
        className="pointer-events-none fixed w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)",
          x: useTransform(smoothMouseX, [0, 1], [0, typeof window !== 'undefined' ? window.innerWidth : 1000]),
          y: useTransform(smoothMouseY, [0, 1], [0, typeof window !== 'undefined' ? window.innerHeight : 800]),
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <AnimatePresence mode="wait">
        {!showContent ? (
          // Loading screen
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Central animated logo - with parallax */}
            <motion.div
              className="relative mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ x: layer1X, y: layer1Y }}
            >
              {/* Outer ring */}
              <div className="w-40 h-40 rounded-full border-2 border-purple-500/30 flex items-center justify-center">
                {/* Inner rotating elements */}
                <motion.div
                  className="absolute w-44 h-44"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${i * 45}deg) translateY(-88px)`,
                      }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                    />
                  ))}
                </motion.div>

                {/* Center brain icon */}
                <motion.div
                  className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />
            </motion.div>

            {/* Loading text */}
            <motion.h2
              className="text-2xl font-bold text-white mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading Learn Flow
            </motion.h2>

            {/* Progress bar */}
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 rounded-full"
                style={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="mt-2 text-white/50 text-sm">{loadingProgress}%</p>
          </motion.div>
        ) : (
          // Main content
          <motion.div
            key="content"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Top decorative elements */}
            <motion.div
              className="absolute top-8 left-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 text-white/60">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium">AI-Powered Learning</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-8 right-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-sm font-medium">Smart Study Platform</span>
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
            </motion.div>

            {/* Main content container */}
            <div className="text-center max-w-4xl mx-auto">
              {/* Animated badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-white/70 text-sm">Welcome to the Future of Learning</span>
              </motion.div>

              {/* Main title with gradient - parallax effect */}
              <motion.h1
                className="text-6xl md:text-8xl font-black mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                style={{ 
                  x: layer3X, 
                  y: layer3Y,
                  rotateX,
                  rotateY,
                  transformPerspective: 1000,
                }}
              >
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Learn
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  Flow
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                Your AI-powered companion for mastering any subject. 
                <br />
                <span className="text-white/80">Flashcards, quizzes, and intelligent doubt solving.</span>
              </motion.p>

              {/* Stats row */}
              <motion.div
                className="flex flex-wrap justify-center gap-8 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                {[
                  { icon: Brain, label: "AI Doubt Solver", color: "purple" },
                  { icon: BookOpen, label: "Smart Flashcards", color: "cyan" },
                  { icon: Zap, label: "Quick Quizzes", color: "yellow" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <item.icon 
                      className={`w-5 h-5 ${
                        item.color === 'purple' ? 'text-purple-400' : 
                        item.color === 'cyan' ? 'text-cyan-400' : 'text-yellow-400'
                      }`} 
                    />
                    <span className="text-white/80 font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.5, type: "spring" }}
              >
                <Button
                  onClick={handleGetStarted}
                  className="group relative px-10 py-7 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
                >
                  <span className="flex items-center gap-3">
                    Get Started
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                  
                  {/* Button glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 blur-xl opacity-50 -z-10 group-hover:opacity-75 transition-opacity" />
                </Button>
              </motion.div>

              {/* Bottom hint */}
              <motion.p
                className="mt-8 text-white/40 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Press Enter or click to begin your learning journey
              </motion.p>
            </div>

            {/* Decorative corner elements */}
            <motion.div
              className="absolute bottom-8 left-8 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
              ))}
            </motion.div>

            <motion.div
              className="absolute bottom-8 right-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
            >
              <p className="text-white/30 text-xs">Powered by AI</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Welcome;
