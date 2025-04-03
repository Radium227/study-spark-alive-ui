import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Clock, Eye, Moon, Sun, User, Volume2, Lock, Download, BellRing } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [soundVolume, setSoundVolume] = useState(70);
  const [language, setLanguage] = useState("english");
  const [pomodoroFocus, setPomodoroFocus] = useState(25);
  const [pomodoroBreak, setPomodoroBreak] = useState(5);
  const [dailyGoal, setDailyGoal] = useState(120);

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data is being prepared for download",
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Customize your study experience</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="bg-white rounded-lg p-1 shadow-sm border">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-gray-100">
            <TabsTrigger value="profile" className="py-2 data-[state=active]:bg-white rounded-md">
              <User className="h-4 w-4 mr-2" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="py-2 data-[state=active]:bg-white rounded-md">
              <Eye className="h-4 w-4 mr-2" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="py-2 data-[state=active]:bg-white rounded-md">
              <Bell className="h-4 w-4 mr-2" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="py-2 data-[state=active]:bg-white rounded-md">
              <Lock className="h-4 w-4 mr-2" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="h-24 w-24 rounded-full bg-study-lightPurple flex items-center justify-center overflow-hidden">
                    <span className="text-3xl font-bold text-study-purple">
                      {name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-study-purple"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value="************"
                  readOnly
                />
                <Button 
                  variant="link" 
                  className="text-study-purple p-0 h-auto text-sm"
                >
                  Change password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Preferences</CardTitle>
              <CardDescription>Customize your study type settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Study Type</Label>
                <Select defaultValue="focused">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a study type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="focused">Focused Learner</SelectItem>
                    <SelectItem value="flexible">Flexible Learner</SelectItem>
                    <SelectItem value="visual">Visual Learner</SelectItem>
                    <SelectItem value="time-sensitive">Time-Sensitive Learner</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  This helps us customize your study experience
                </p>
              </div>

              <div className="space-y-2">
                <Label>Daily Study Goal (minutes)</Label>
                <div className="pt-2">
                  <Slider
                    value={[dailyGoal]}
                    min={30}
                    max={240}
                    step={30}
                    onValueChange={(val) => setDailyGoal(val[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>30 min</span>
                  <span>{dailyGoal} minutes</span>
                  <span>240 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how StudySpark looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-gray-500">
                    Switch between light and dark themes
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Moon className="h-5 w-5 text-slate-900" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Language</Label>
                  <p className="text-sm text-gray-500">
                    Choose your preferred language
                  </p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
              <CardDescription>Customize the Pomodoro timer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Focus Duration (minutes)</Label>
                <div className="pt-2">
                  <Slider
                    value={[pomodoroFocus]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(val) => setPomodoroFocus(val[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 min</span>
                  <span>{pomodoroFocus} minutes</span>
                  <span>60 min</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label className="text-base">Break Duration (minutes)</Label>
                <div className="pt-2">
                  <Slider
                    value={[pomodoroBreak]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(val) => setPomodoroBreak(val[0])}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 min</span>
                  <span>{pomodoroBreak} minutes</span>
                  <span>30 min</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Sound Effects</Label>
                  <p className="text-sm text-gray-500">
                    Enable timer sounds and notifications
                  </p>
                </div>
                <Switch
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                />
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Sound Volume</Label>
                  <span className="text-sm text-gray-500">{soundVolume}%</span>
                </div>
                <div className="pt-2 flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-gray-500" />
                  <Slider
                    value={[soundVolume]}
                    min={0}
                    max={100}
                    step={5}
                    disabled={!soundEffects}
                    onValueChange={(val) => setSoundVolume(val[0])}
                    className={!soundEffects ? "opacity-50" : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive important alerts and reminders
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="pt-4 space-y-3">
                <h3 className="font-medium">Notification Types</h3>
                
                {[
                  {
                    icon: Clock,
                    title: "Timer Notifications",
                    description: "Get notified when timers end"
                  },
                  {
                    icon: BellRing,
                    title: "Daily Reminders",
                    description: "Reminders to achieve your daily study goal"
                  },
                  {
                    icon: Download,
                    title: "Updates & News",
                    description: "Learn about new features and improvements"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center">
                      <div className="bg-study-lightPurple p-2 rounded-full mr-3">
                        <item.icon className="h-4 w-4 text-study-purple" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <Switch disabled={!notifications} checked={notifications} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Activity Tracking</Label>
                  <p className="text-sm text-gray-500">
                    Track your study patterns and productivity
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Anonymous Usage Data</Label>
                  <p className="text-sm text-gray-500">
                    Share anonymous data to help improve the app
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>

              <div className="pt-6">
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Download a copy of your study data and statistics
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button 
            onClick={handleSaveSettings}
            className="bg-study-purple hover:bg-opacity-90 px-8"
          >
            Save Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
