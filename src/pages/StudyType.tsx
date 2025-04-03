
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, Clock, Coffee, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const studyTypes = [
  {
    id: "focused",
    title: "Focused Learner",
    icon: Zap,
    color: "study-purple",
    description: "You concentrate deeply on one subject at a time and prefer uninterrupted study sessions.",
    tips: [
      "Use the Pomodoro technique with longer focus periods",
      "Find quiet, distraction-free environments",
      "Schedule dedicated time blocks for different subjects"
    ]
  },
  {
    id: "flexible",
    title: "Flexible Learner",
    icon: Coffee,
    color: "study-blue",
    description: "You adapt easily between subjects and can study effectively in various environments.",
    tips: [
      "Mix up study locations to maintain interest",
      "Use varied learning methods",
      "Balance structure with spontaneity"
    ]
  },
  {
    id: "visual",
    title: "Visual Learner",
    icon: BookOpen,
    color: "study-green",
    description: "You understand and retain information best through visual aids like charts and diagrams.",
    tips: [
      "Create mind maps and diagrams",
      "Use color-coding in notes",
      "Watch educational videos or animations"
    ]
  },
  {
    id: "time-sensitive",
    title: "Time-Sensitive Learner",
    icon: Clock,
    color: "study-pink",
    description: "You thrive under time pressure and are motivated by deadlines and schedules.",
    tips: [
      "Set mini-deadlines for larger projects",
      "Use timers for study sessions",
      "Create a detailed study calendar"
    ]
  }
];

const StudyType = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, number>>({
    focused: 0,
    flexible: 0,
    visual: 0,
    "time-sensitive": 0
  });

  const questions = [
    {
      id: 1,
      text: "How do you prefer to organize your study sessions?",
      options: [
        { text: "Long, uninterrupted blocks focused on one subject", type: "focused" },
        { text: "Flexible sessions where I can switch subjects as needed", type: "flexible" },
        { text: "Sessions with lots of visual aids and diagrams", type: "visual" },
        { text: "Strictly timed sessions with clear goals", type: "time-sensitive" }
      ]
    },
    {
      id: 2,
      text: "When learning new material, what helps you understand it best?",
      options: [
        { text: "Deep concentration and detailed notes", type: "focused" },
        { text: "Trying different approaches until it clicks", type: "flexible" },
        { text: "Charts, diagrams, and visual examples", type: "visual" },
        { text: "Setting a deadline to master it", type: "time-sensitive" }
      ]
    },
    {
      id: 3,
      text: "What's your biggest challenge when studying?",
      options: [
        { text: "Getting distracted or interrupted", type: "focused" },
        { text: "Getting bored with one approach", type: "flexible" },
        { text: "Understanding abstract concepts without visuals", type: "visual" },
        { text: "Managing time effectively", type: "time-sensitive" }
      ]
    },
    {
      id: 4,
      text: "What motivates you most to complete your work?",
      options: [
        { text: "The satisfaction of deep understanding", type: "focused" },
        { text: "Variety and new challenges", type: "flexible" },
        { text: "Creating and seeing visual progress", type: "visual" },
        { text: "Meeting or beating deadlines", type: "time-sensitive" }
      ]
    }
  ];

  const handleAnswer = (type: string) => {
    const newAnswers = { ...answers };
    newAnswers[type] += 1;
    setAnswers(newAnswers);
    
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Determine the dominant study type
      let maxScore = 0;
      let dominantType = "";
      
      Object.entries(newAnswers).forEach(([type, score]) => {
        if (score > maxScore) {
          maxScore = score;
          dominantType = type;
        }
      });
      
      setSelectedType(dominantType);
    }
  };

  const handleContinue = () => {
    if (selectedType) {
      const typeName = studyTypes.find(t => t.id === selectedType)?.title || "Learner";
      toast({
        title: `Welcome, ${typeName}!`,
        description: "Your dashboard has been customized based on your study type",
      });
      navigate("/dashboard");
    }
  };

  const currentQuestion = questions[currentStep - 1];

  // For step animations
  const questionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Discover Your Study Type</h1>
        <p className="text-gray-600">Let's personalize your StudySpark experience based on how you learn best</p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {!selectedType ? (
          <>
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-md bg-white rounded-full h-2">
                <motion.div
                  initial={{ width: `${((currentStep - 1) / questions.length) * 100}%` }}
                  animate={{ width: `${(currentStep / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-study-purple h-full rounded-full"
                />
              </div>
            </div>

            <motion.div
              key={currentStep}
              variants={questionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-xl font-semibold mb-6">
                Question {currentStep} of {questions.length}
              </h2>
              <p className="text-lg mb-8">{currentQuestion.text}</p>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.type)}
                    className="w-full text-left p-4 rounded-lg border hover:border-study-purple hover:bg-study-lightPurple transition-all"
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {studyTypes.map((type) => {
              if (type.id === selectedType) {
                return (
                  <div key={type.id}>
                    <div className="flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        className={`bg-${type.color} bg-opacity-10 p-4 rounded-full`}
                      >
                        <type.icon className={`h-12 w-12 text-${type.color}`} />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-center mt-6"
                    >
                      <h2 className="text-2xl font-bold mb-2">You're a {type.title}!</h2>
                      <p className="text-gray-600 mb-6">{type.description}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="bg-gray-50 rounded-lg p-6 mb-8"
                    >
                      <h3 className="font-semibold mb-4">Study Tips for Your Type:</h3>
                      <ul className="space-y-2">
                        {type.tips.map((tip, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            className="flex items-start"
                          >
                            <Brain className="h-5 w-5 text-study-purple mr-2 flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="text-center"
                    >
                      <Button 
                        onClick={handleContinue}
                        className="bg-study-purple hover:bg-opacity-90 px-8 py-6 text-lg"
                      >
                        Continue to Dashboard
                      </Button>
                    </motion.div>
                  </div>
                );
              }
              return null;
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudyType;
