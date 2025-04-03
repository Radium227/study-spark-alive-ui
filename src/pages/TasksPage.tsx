
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  BarChart2,
  CalendarClock,
  Bookmark,
  BookOpen,
  Star,
  AlarmClock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  category: string;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
}

const TasksPage = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("study");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [filter, setFilter] = useState("all");
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem("studysparkTasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        setTasks(parsedTasks);
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
      }
    } else {
      // Set sample tasks if none exist
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Complete math assignment",
          completed: false,
          createdAt: new Date(),
          category: "study",
          priority: "high",
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        },
        {
          id: "2",
          title: "Review lecture notes",
          completed: false,
          createdAt: new Date(),
          category: "study",
          priority: "medium"
        },
        {
          id: "3",
          title: "Prepare for presentation",
          completed: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          category: "project",
          priority: "high"
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem("studysparkTasks", JSON.stringify(sampleTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("studysparkTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") {
      toast({
        title: "Task title required",
        description: "Please enter a title for your task",
        variant: "destructive"
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      createdAt: new Date(),
      category: newTaskCategory,
      priority: newTaskPriority
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskCategory("study");
    setNewTaskPriority("medium");
    setIsAddingTask(false);

    toast({
      title: "Task added",
      description: "Your new task has been added successfully"
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed"
    });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));

    const task = tasks.find(t => t.id === id);
    if (task) {
      toast({
        description: !task.completed 
          ? "Task marked as completed!" 
          : "Task marked as incomplete"
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return task.category === filter;
  });

  const getTaskIcon = (category: string) => {
    switch (category) {
      case "study":
        return BookOpen;
      case "project":
        return Bookmark;
      case "exam":
        return AlarmClock;
      default:
        return CheckSquare;
    }
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-600";
      case "medium":
        return "bg-blue-100 text-blue-600";
      case "high":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks Manager</h1>
          <p className="text-gray-500">Organize your study tasks and track progress</p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="bg-study-purple hover:bg-opacity-90"
          >
            {isAddingTask ? "Cancel" : "Add Task"}
            {!isAddingTask && <Plus className="ml-2 h-4 w-4" />}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Add New Task</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      placeholder="Enter task title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {["study", "project", "exam"].map(category => (
                          <Button
                            key={category}
                            type="button"
                            variant={newTaskCategory === category ? "default" : "outline"}
                            className={`capitalize ${
                              newTaskCategory === category ? "bg-study-purple hover:bg-opacity-90" : ""
                            }`}
                            onClick={() => setNewTaskCategory(category)}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Priority</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {(["low", "medium", "high"] as const).map(priority => (
                          <Button
                            key={priority}
                            type="button"
                            variant="outline"
                            className={`capitalize ${
                              newTaskPriority === priority 
                                ? priority === "low" 
                                  ? "bg-gray-200 text-gray-800 border-gray-300" 
                                  : priority === "medium" 
                                    ? "bg-blue-100 text-blue-800 border-blue-300" 
                                    : "bg-red-100 text-red-800 border-red-300"
                                : ""
                            }`}
                            onClick={() => setNewTaskPriority(priority)}
                          >
                            {priority}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleAddTask}
                      className="bg-study-purple hover:bg-opacity-90"
                    >
                      Add Task
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>My Tasks</CardTitle>
                <Tabs value={filter} onValueChange={setFilter}>
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
                    <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
                    <TabsTrigger value="study" className="text-xs">Study</TabsTrigger>
                    <TabsTrigger value="project" className="text-xs">Project</TabsTrigger>
                    <TabsTrigger value="exam" className="text-xs">Exam</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filteredTasks.length > 0 ? (
                <div className="space-y-2">
                  <AnimatePresence>
                    {filteredTasks.map(task => {
                      const Icon = getTaskIcon(task.category);
                      
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          whileHover={{ scale: 1.01 }}
                          className={`p-3 border rounded-lg flex items-start gap-3 ${
                            task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="mt-0.5">
                            <Checkbox 
                              checked={task.completed}
                              onCheckedChange={() => handleToggleComplete(task.id)}
                              className="h-5 w-5"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                                {task.title}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Icon className="h-3 w-3" />
                                <span className="capitalize">{task.category}</span>
                              </div>
                              
                              {task.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-gray-700">No tasks found</h3>
                  <p className="text-gray-500 mt-1">
                    {filter !== "all" 
                      ? `There are no ${filter} tasks yet.`
                      : "Start by adding your first task!"}
                  </p>
                  {filter !== "all" && (
                    <Button 
                      variant="link"
                      onClick={() => setFilter("all")}
                      className="mt-2 text-study-purple"
                    >
                      View all tasks
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Task Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Completion Rate</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="bg-study-purple h-full rounded-full"
                  />
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                  <div className="bg-study-lightPurple rounded-lg p-3 text-center">
                    <div className="font-semibold text-xl text-study-purple">
                      {completedCount}
                    </div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  
                  <div className="bg-study-lightBlue rounded-lg p-3 text-center">
                    <div className="font-semibold text-xl text-study-blue">
                      {tasks.length - completedCount}
                    </div>
                    <div className="text-xs text-gray-600">Remaining</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tasks by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["study", "project", "exam"].map(category => {
                  const count = tasks.filter(t => t.category === category).length;
                  const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
                  const Icon = getTaskIcon(category);
                  
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Icon className="h-4 w-4 text-gray-600 mr-2" />
                          <span className="text-sm capitalize">{category}</span>
                        </div>
                        <span className="text-sm text-gray-500">{count} tasks</span>
                      </div>
                      
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className={`h-full rounded-full ${
                            category === "study" 
                              ? "bg-study-blue" 
                              : category === "project" 
                                ? "bg-study-purple" 
                                : "bg-study-green"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Productivity Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    icon: Star, 
                    tip: "Focus on high-priority tasks first to maximize productivity" 
                  },
                  { 
                    icon: CalendarClock, 
                    tip: "Break large tasks into smaller, manageable chunks" 
                  },
                  { 
                    icon: BarChart2, 
                    tip: "Use the Pomodoro timer for structured study sessions" 
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="bg-study-lightPurple rounded-full p-1.5 h-7 w-7 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-study-purple" />
                    </div>
                    <p className="text-sm text-gray-600">{item.tip}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
