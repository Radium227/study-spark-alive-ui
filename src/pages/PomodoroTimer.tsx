import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Coffee, Volume2, Volume1, VolumeX, Music, Settings, BellRing } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PomodoroTimer = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<{ type: string; duration: number; date: Date }[]>([]);
  
  const [times, setTimes] = useState({
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  });

  const alarmSound = useRef<HTMLAudioElement | null>(null);
  const tickingSound = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    alarmSound.current = new Audio("/notification.mp3");
    tickingSound.current = new Audio("/ticking.mp3");
    tickingSound.current.loop = true;
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tickingSound.current) {
        tickingSound.current.pause();
        tickingSound.current = null;
      }
      if (alarmSound.current) {
        alarmSound.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setTimeLeft(times[mode]);
  }, [mode, times]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start ticking sound if not muted
      if (tickingSound.current && !muted) {
        tickingSound.current.volume = volume / 100;
        tickingSound.current.play();
      }
    } else {
      // Stop ticking sound
      if (tickingSound.current) {
        tickingSound.current.pause();
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, muted, volume]);

  const handleTimerComplete = () => {
    // Play alarm if not muted
    if (alarmSound.current && !muted) {
      alarmSound.current.volume = volume / 100;
      alarmSound.current.play();
    }

    // Stop the timer
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Save session to history
    setSessionHistory(prev => [
      { 
        type: mode, 
        duration: times[mode] - timeLeft,
        date: new Date()
      },
      ...prev
    ]);

    // Increment cycle counter if focus session completed
    if (mode === "focus") {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      toast({
        title: "Focus session completed!",
        description: `Great job! You've completed ${newCycles} ${newCycles === 1 ? 'session' : 'sessions'} today.`,
      });

      // Automatically switch to break mode
      if (newCycles % 4 === 0) {
        setMode("longBreak");
        toast({
          description: "Time for a long break!",
        });
      } else {
        setMode("shortBreak");
        toast({
          description: "Time for a short break!",
        });
      }
    } else {
      // If break is done, switch to focus mode
      setMode("focus");
      toast({
        description: "Break time is over. Ready to focus again?",
      });
    }

    // Reset timer based on new mode
    setTimeLeft(mode === "focus" ? 
      (cycles % 4 === 0 ? times.longBreak : times.shortBreak) : 
      times.focus
    );
  };

  const toggleTimer = () => {
    if (timeLeft <= 0) {
      // Reset timer if it's completed
      setTimeLeft(times[mode]);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(times[mode]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (tickingSound.current) {
      tickingSound.current.pause();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    return 100 - (timeLeft / times[mode] * 100);
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (tickingSound.current) {
      if (muted) {
        tickingSound.current.volume = volume / 100;
        if (isRunning) tickingSound.current.play();
      } else {
        tickingSound.current.pause();
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (tickingSound.current && isRunning && !muted) {
      tickingSound.current.volume = newVolume / 100;
    }
  };

  const updateTimerSettings = (type: "focus" | "shortBreak" | "longBreak", mins: number) => {
    setTimes(prev => ({
      ...prev,
      [type]: mins * 60
    }));
    if (mode === type && !isRunning) {
      setTimeLeft(mins * 60);
    }
  };

  const getTimerColor = () => {
    switch (mode) {
      case "focus":
        return "study-purple";
      case "shortBreak":
        return "study-blue";
      case "longBreak":
        return "study-green";
      default:
        return "study-purple";
    }
  };

  const getBackgroundColor = () => {
    switch (mode) {
      case "focus":
        return "study-lightPurple";
      case "shortBreak":
        return "study-lightBlue";
      case "longBreak":
        return "study-lightGreen";
      default:
        return "study-lightPurple";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Pomodoro Timer</h1>
      <p className="text-gray-500 mb-8">Stay focused with timed work sessions and breaks</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="p-6">
                <Tabs defaultValue="focus" value={mode} onValueChange={value => setMode(value as "focus" | "shortBreak" | "longBreak")}>
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="focus" className="text-sm">
                      Focus
                    </TabsTrigger>
                    <TabsTrigger value="shortBreak" className="text-sm">
                      Short Break
                    </TabsTrigger>
                    <TabsTrigger value="longBreak" className="text-sm">
                      Long Break
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="focus" className="mt-0">
                    <div className="flex flex-col items-center">
                      <div className={`relative w-64 h-64 flex items-center justify-center rounded-full border-8 border-${getBackgroundColor()} mb-8`}>
                        <div className="text-5xl font-bold text-gray-800">
                          {formatTime(timeLeft)}
                        </div>
                        <div className="absolute inset-0">
                          <svg viewBox="0 0 100 100" className="-rotate-90">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={`hsl(var(--${getBackgroundColor()}))`}
                              strokeWidth="10"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={`hsl(var(--${getTimerColor()}))`}
                              strokeWidth="10"
                              strokeDasharray="282.74"
                              strokeDashoffset={282.74 - (calculateProgress() / 100 * 282.74)}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            onClick={toggleTimer}
                            className={`h-14 w-14 rounded-full bg-${getTimerColor()} hover:bg-opacity-90`}
                          >
                            {isRunning ? <Pause size={24} /> : <Play size={24} />}
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={resetTimer}
                            className="h-14 w-14 rounded-full"
                          >
                            <RotateCcw size={20} />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="shortBreak" className="mt-0">
                    <div className="flex flex-col items-center">
                      <div className={`relative w-64 h-64 flex items-center justify-center rounded-full border-8 border-${getBackgroundColor()} mb-8`}>
                        <div className="text-5xl font-bold text-gray-800">
                          {formatTime(timeLeft)}
                        </div>
                        <div className="absolute inset-0">
                          <svg viewBox="0 0 100 100" className="-rotate-90">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={`hsl(var(--${getBackgroundColor()}))`}
                              strokeWidth="10"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={`hsl(var(--${getTimerColor()}))`}
                              strokeWidth="10"
                              strokeDasharray="282.74"
                              strokeDashoffset={282.74 - (calculateProgress() / 100 * 282.74)}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            onClick={toggleTimer}
                            className={`h-14 w-14 rounded-full bg-${getTimerColor()} hover:bg-opacity-90`}
                          >
                            {isRunning ? <Pause size={24} /> : <Play size={24} />}
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={resetTimer}
                            className="h-14 w-14 rounded-full"
                          >
                            <RotateCcw size={20} />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="longBreak" className="mt-0">
                    <div className="flex flex-col items-center">
                      <div className={`relative w-64 h-64 flex items-center justify-center rounded-full border-8 border-${getBackgroundColor()} mb-8`}>
                        <div className="text-5xl font-bold text-gray-800">
                          {formatTime(timeLeft)}
                        </div>
                        <div className="absolute inset-0">
                          <svg viewBox="0 0 100 100" className="-rotate-90">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={`hsl(var(--${getBackgroundColor()}))`}
                              strokeWidth="10"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={`hsl(var(--${getTimerColor()}))`}
                              strokeWidth="10"
                              strokeDasharray="282.74"
                              strokeDashoffset={282.74 - (calculateProgress() / 100 * 282.74)}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            onClick={toggleTimer}
                            className={`h-14 w-14 rounded-full bg-${getTimerColor()} hover:bg-opacity-90`}
                          >
                            {isRunning ? <Pause size={24} /> : <Play size={24} />}
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={resetTimer}
                            className="h-14 w-14 rounded-full"
                          >
                            <RotateCcw size={20} />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center mt-4 rounded-b-lg">
                <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                  <button
                    onClick={toggleMute}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {muted ? <VolumeX size={20} /> : volume > 50 ? <Volume2 size={20} /> : <Volume1 size={20} />}
                  </button>
                  
                  <div className="w-32">
                    <Slider
                      disabled={muted}
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className={muted ? "opacity-50" : ""}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Music size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Session count: {cycles}</span>
                </div>
                
                <motion.button
                  whileHover={{ rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Settings size={20} />
                </motion.button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="mt-6"
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Timer Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Focus Duration (minutes)
                        </label>
                        <Slider
                          value={[times.focus / 60]}
                          min={5}
                          max={60}
                          step={5}
                          onValueChange={(val) => updateTimerSettings("focus", val[0])}
                          className="mb-1"
                        />
                        <div className="text-center text-sm text-gray-500">
                          {times.focus / 60} minutes
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Short Break (minutes)
                        </label>
                        <Slider
                          value={[times.shortBreak / 60]}
                          min={1}
                          max={15}
                          step={1}
                          onValueChange={(val) => updateTimerSettings("shortBreak", val[0])}
                          className="mb-1"
                        />
                        <div className="text-center text-sm text-gray-500">
                          {times.shortBreak / 60} minutes
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Long Break (minutes)
                        </label>
                        <Slider
                          value={[times.longBreak / 60]}
                          min={5}
                          max={30}
                          step={5}
                          onValueChange={(val) => updateTimerSettings("longBreak", val[0])}
                          className="mb-1"
                        />
                        <div className="text-center text-sm text-gray-500">
                          {times.longBreak / 60} minutes
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Session History</h3>
              
              {sessionHistory.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {sessionHistory.map((session, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg ${
                        session.type === "focus" 
                          ? "bg-study-lightPurple" 
                          : session.type === "shortBreak" 
                            ? "bg-study-lightBlue" 
                            : "bg-study-lightGreen"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {session.type === "focus" ? (
                            <BellRing className="h-4 w-4 text-study-purple mr-2" />
                          ) : (
                            <Coffee className="h-4 w-4 text-study-blue mr-2" />
                          )}
                          <span className={`text-sm font-medium ${
                            session.type === "focus" 
                              ? "text-study-purple" 
                              : session.type === "shortBreak" 
                                ? "text-study-blue" 
                                : "text-study-green"
                          }`}>
                            {session.type === "focus" 
                              ? "Focus Session" 
                              : session.type === "shortBreak" 
                                ? "Short Break" 
                                : "Long Break"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        Duration: {Math.floor(session.duration / 60)}m {session.duration % 60}s
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Coffee className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No sessions completed yet</p>
                  <p className="text-sm">Complete a session to see it here</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Pomodoro Technique</h3>
              <p className="text-sm text-gray-600 mb-4">
                The Pomodoro Technique is a time management method that uses timed intervals of focused work followed by short breaks.
              </p>
              
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="bg-study-lightPurple text-study-purple rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">1</span>
                  <span>Set a timer for 25 minutes and focus solely on one task</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-study-lightBlue text-study-blue rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">2</span>
                  <span>When the timer rings, take a 5-minute break</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-study-lightPurple text-study-purple rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">3</span>
                  <span>Repeat the process</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-study-lightGreen text-study-green rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">4</span>
                  <span>After 4 pomodoros, take a longer 15-30 minute break</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
