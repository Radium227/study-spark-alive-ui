
import { ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Clock, Home, LogOut, Settings, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MainLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

const MainLayout = ({ children, onLogout }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Clock, label: "Pomodoro", path: "/pomodoro" },
    { icon: CheckSquare, label: "Tasks", path: "/tasks" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been successfully logged out",
    });
    onLogout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white shadow-md flex flex-col z-10"
      >
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="font-bold text-xl"
            >
              Study<span className="text-study-purple">Spark</span>
            </motion.h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-gray-100 rounded-full h-8 w-8"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <BarChart3 size={18} />
            </motion.div>
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} className="block">
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-study-lightPurple text-study-purple"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <item.icon
                        size={20}
                        className={cn(
                          isActive ? "text-study-purple" : "text-gray-500"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="ml-3 font-medium">{item.label}</span>
                      )}
                    </motion.div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex items-center p-2 text-red-500 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default MainLayout;
