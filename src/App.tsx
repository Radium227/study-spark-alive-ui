
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import StudyType from "./pages/StudyType";
import Dashboard from "./pages/Dashboard";
import PomodoroTimer from "./pages/PomodoroTimer";
import TasksPage from "./pages/TasksPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layouts/MainLayout";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in when app loads
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Dashboard />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/study-type" element={<StudyType />} />
            <Route path="/dashboard" element={
              <MainLayout onLogout={handleLogout}>
                <Dashboard />
              </MainLayout>
            } />
            <Route path="/pomodoro" element={
              <MainLayout onLogout={handleLogout}>
                <PomodoroTimer />
              </MainLayout>
            } />
            <Route path="/tasks" element={
              <MainLayout onLogout={handleLogout}>
                <TasksPage />
              </MainLayout>
            } />
            <Route path="/settings" element={
              <MainLayout onLogout={handleLogout}>
                <Settings />
              </MainLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
