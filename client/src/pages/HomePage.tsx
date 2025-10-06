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
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <div className="font-serif text-2xl font-semibold text-foreground">SkinRhythm</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground">
                Welcome, {(user as any)?.firstName || 'there'}!
              </h1>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground/80">
                Your Personalized Skincare Journey
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started with our expert-curated skincare quiz to receive personalized 
                product recommendations tailored to your unique skin needs.
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => setShowQuiz(true)}
              className="min-w-[200px]"
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
