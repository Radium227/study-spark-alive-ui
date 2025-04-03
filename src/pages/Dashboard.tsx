
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Zap, BarChart2, Check, Brain, CalendarClock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [screenTime, setScreenTime] = useState(0);
  const [productiveTime, setProductiveTime] = useState(0);
  const [productivityScore, setProductivityScore] = useState(0);
  const [mostUsedApp, setMostUsedApp] = useState("");

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setScreenTime(440); // 7h 20m in minutes
      setProductiveTime(315); // 5h 15m in minutes
      setProductivityScore(87);
      setMostUsedApp("VS Code");
    };
    
    loadData();
  }, []);

  // Format time display (7h 32m)
  const formatTimeDisplay = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Chart data for screen time analysis
  const hourlyData = [
    { hour: '12 AM', minutes: 5 },
    { hour: '2 AM', minutes: 3 },
    { hour: '4 AM', minutes: 0 },
    { hour: '6 AM', minutes: 12 },
    { hour: '8 AM', minutes: 25 },
    { hour: '10 AM', minutes: 35 },
    { hour: '12 PM', minutes: 22 },
    { hour: '2 PM', minutes: 42 },
    { hour: '4 PM', minutes: 38 },
    { hour: '6 PM', minutes: 30 },
    { hour: '8 PM', minutes: 25 },
    { hour: '10 PM', minutes: 15 },
  ];

  // App usage data for pie chart
  const appUsageData = [
    { name: 'Work Apps', value: 45 },
    { name: 'Productivity', value: 25 },
    { name: 'Social Media', value: 15 },
    { name: 'Entertainment', value: 10 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#4AA9FF', '#9b87f5', '#FF7EAE', '#4AD991', '#F4D03F'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold"
          >
            Productivity Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500"
          >
            Track your digital time and maximize productivity
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center bg-white rounded-lg shadow px-4 py-2"
        >
          <CalendarClock className="h-5 w-5 text-gray-500 mr-2" />
          <div>
            <div className="text-sm font-medium">{formattedDate}</div>
            <div className="text-sm text-gray-500">{formattedTime}</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Daily Screen Time */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-study-blue" />
                Daily Screen Time
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold">{formatTimeDisplay(screenTime)}</div>
              <div className="text-sm text-gray-500">Today</div>
              <div className="mt-2 text-xs font-medium text-red-500">
                ↑ 12% vs. last week
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Productive Time */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-study-purple" />
                Productive Time
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold">{formatTimeDisplay(productiveTime)}</div>
              <div className="text-sm text-gray-500">70% of screen time</div>
              <div className="mt-2 text-xs font-medium text-green-500">
                ↑ 8% vs. last week
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Productivity Score */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <BarChart2 className="h-4 w-4 mr-2 text-study-green" />
                Productivity Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold">{productivityScore}</div>
              <div className="text-sm text-gray-500">Out of 100</div>
              <div className="mt-2 text-xs font-medium text-green-500">
                ↑ 5 points vs. last week
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Most Used App */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                <Check className="h-4 w-4 mr-2 text-study-pink" />
                Most Used App
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold">{mostUsedApp}</div>
              <div className="text-sm text-gray-500">2h 45m today</div>
              <div className="mt-2 text-xs font-medium text-gray-500">
                Same as last week
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Screen Time Analysis</CardTitle>
              <Tabs defaultValue="daily">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#888' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#888' }}
                    domain={[0, 'dataMax + 10']}
                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#888', fontSize: 12 } }}
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#9b87f5" 
                    fillOpacity={1} 
                    fill="url(#colorMinutes)" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col justify-center items-center">
              <ResponsiveContainer width="100%" height="75%">
                <PieChart>
                  <Pie
                    data={appUsageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {appUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                {appUsageData.map((entry, index) => (
                  <div key={`legend-${index}`} className="flex items-center text-sm">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-600">{entry.name}: {entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Productivity Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold flex items-center">
                  <Brain className="h-5 w-5 text-study-purple mr-2" />
                  Peak Productivity
                </h3>
                <p className="text-gray-600 text-sm mt-1">Your most productive time is between:</p>
                <div className="mt-3 bg-study-lightPurple rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-study-purple">3 PM - 5 PM</p>
                  <p className="text-xs text-gray-500">Focus score: 90/100</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Suggestions</h3>
                <ul className="space-y-4">
                  {[
                    "Schedule important tasks during your peak hours",
                    "Consider taking a break around 1 PM when focus dips",
                    "Reduce social media usage during work hours"
                  ].map((suggestion, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (index * 0.1) }}
                      className="flex items-start"
                    >
                      <div className="bg-study-lightBlue rounded-full p-1 mr-3 flex-shrink-0">
                        <Check className="h-4 w-4 text-study-blue" />
                      </div>
                      <p className="text-gray-700 text-sm">{suggestion}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/pomodoro")}
                className="bg-study-lightPurple hover:bg-study-purple hover:text-white transition-colors rounded-xl p-4 flex flex-col items-center justify-center text-study-purple"
              >
                <Clock className="h-8 w-8 mb-2" />
                <span className="font-medium">Start Pomodoro</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/tasks")}
                className="bg-study-lightBlue hover:bg-study-blue hover:text-white transition-colors rounded-xl p-4 flex flex-col items-center justify-center text-study-blue"
              >
                <Check className="h-8 w-8 mb-2" />
                <span className="font-medium">Manage Tasks</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-study-lightGreen hover:bg-study-green hover:text-white transition-colors rounded-xl p-4 flex flex-col items-center justify-center text-study-green"
              >
                <BarChart2 className="h-8 w-8 mb-2" />
                <span className="font-medium">View Reports</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/settings")}
                className="bg-study-lightPink hover:bg-study-pink hover:text-white transition-colors rounded-xl p-4 flex flex-col items-center justify-center text-study-pink"
              >
                <Zap className="h-8 w-8 mb-2" />
                <span className="font-medium">Study Goals</span>
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
