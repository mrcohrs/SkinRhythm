import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { QuizFlow, type QuizAnswers } from "@/components/QuizFlow";
import { RoutineDisplay } from "@/components/RoutineDisplay";
import { AccountCreationModal } from "@/components/AccountCreationModal";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Quiz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showQuiz, setShowQuiz] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
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
      
      // Show account creation modal if not logged in
      if (!user) {
        setShowAccountModal(true);
      } else {
        // Save routine if already logged in
        saveRoutineMutation.mutate({
          name: quizAnswers?.name,
          age: quizAnswers?.age,
          skinType: data.answers.skinType,
          fitzpatrickType: data.answers.fitzpatrickType,
          acneTypes: data.answers.acneTypes,
          acneSeverity: data.answers.acneSeverity,
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
      queryClient.invalidateQueries({ queryKey: ['/api/routines/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/routines'] });
      toast({
        title: "Success",
        description: "Your routine has been saved!",
      });
      // Redirect to dashboard if user is logged in
      if (user) {
        setLocation('/dashboard');
      }
    },
  });

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    submitQuizMutation.mutate(answers);
  };

  const handleAccountCreated = async (newUser: any) => {
    // Refresh user data
    await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    
    // Save routine after account creation
    if (routineData && quizAnswers) {
      saveRoutineMutation.mutate({
        name: quizAnswers.name,
        age: quizAnswers.age,
        skinType: quizAnswers.skinType,
        fitzpatrickType: quizAnswers.fitzpatrickType,
        acneTypes: quizAnswers.acneTypes,
        acneSeverity: quizAnswers.acneSeverity,
        isPregnantOrNursing: quizAnswers.isPregnantOrNursing === 'yes',
        routineData: routineData,
      });
    }
    
    setShowAccountModal(false);
  };

  const handleBack = () => {
    setLocation('/');
  };

  if (showQuiz) {
    return (
      <QuizFlow
        onComplete={handleQuizComplete}
        onBack={handleBack}
        userName={user ? `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() : undefined}
      />
    );
  }

  if (routineData && quizAnswers) {
    return (
      <>
        <AccountCreationModal
          open={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          onSuccess={handleAccountCreated}
          userName={quizAnswers.name}
        />
        <RoutineDisplay
          userName={quizAnswers.name}
          skinType={quizAnswers.skinType}
          routineType={routineData.routineType}
          products={routineData.products}
          isPremiumUser={(user as any)?.isPremium || false}
        />
      </>
    );
  }

  return null;
}
