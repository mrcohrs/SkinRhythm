import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { QuizFlow, type QuizAnswers } from "@/components/QuizFlow";
import { RoutineDisplay } from "@/components/RoutineDisplay";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showQuiz, setShowQuiz] = useState(false);
  const [routineData, setRoutineData] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: QuizAnswers) => {
      const response = await apiRequest('POST', '/api/quiz/submit', answers);
      return await response.json();
    },
    onSuccess: (data) => {
      setRoutineData(data.routine);
      setShowQuiz(false);
      
      if (user) {
        saveRoutineMutation.mutate({
          name: quizAnswers?.name,
          age: quizAnswers?.age,
          skinType: data.answers.skinType,
          fitzpatrickType: data.answers.fitzpatrickType,
          acneTypes: data.answers.acneTypes,
          isPregnantOrNursing: data.answers.isPregnantOrNursing === 'yes',
          routineData: data.routine,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate routine. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveRoutineMutation = useMutation({
    mutationFn: async (routineData: any) => {
      const response = await apiRequest('POST', '/api/routines/save', routineData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your routine has been saved!",
      });
    },
  });

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    submitQuizMutation.mutate(answers);
  };

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-background">
        <QuizFlow
          onComplete={handleQuizComplete}
          onBack={() => setShowQuiz(false)}
        />
      </div>
    );
  }

  if (routineData && quizAnswers) {
    return (
      <div className="min-h-screen bg-background">
        <RoutineDisplay
          userName={quizAnswers.name}
          skinType={quizAnswers.skinType}
          products={routineData.products}
          isPremiumUser={(user as any)?.isPremium || false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h1 className="font-playfair text-4xl font-bold text-foreground">
              Welcome, {(user as any)?.firstName || 'there'}!
            </h1>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/api/logout'}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>

          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="font-playfair text-3xl font-semibold">
                Your Personalized Skincare Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                Get started with our expert-curated acne skincare quiz
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => setShowQuiz(true)}
              data-testid="button-start-quiz"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
