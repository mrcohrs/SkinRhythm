import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { QuizFlow, type QuizAnswers } from "@/components/QuizFlow";
import { RoutineDisplay } from "@/components/RoutineDisplay";
import { AccountCreationModal } from "@/components/AccountCreationModal";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, User, FlaskConical } from "lucide-react";
import { useLocation } from "wouter";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showQuiz, setShowQuiz] = useState(false);
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
        <AccountCreationModal
          open={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          onSuccess={handleAccountCreated}
          userName={quizAnswers.name}
        />
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
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <div className="font-serif text-3xl font-normal text-foreground">free skin</div>
            <div className="flex items-center gap-4">
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => setLocation('/ingredient-checker')}
                  data-testid="button-ingredient-checker"
                >
                  <FlaskConical className="h-4 w-4" />
                  ingredient checker
                </Button>
              )}
              {user ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="button-logout"
                >
                  <User className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-login"
                >
                  login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground">
              If you have <span className="bg-yellow-300 dark:bg-yellow-400 px-2 text-foreground">acne</span>, you're in the right place.
            </h1>
            
            {/* Mission Statement */}
            <div className="border-l-4 border-primary pl-6 py-2 space-y-4">
              <p className="text-base text-foreground/80 leading-relaxed">
                I built free skin because I had been a victim of the unsuccessful dermatologist trial and error cycle. The truth is that modern skincare is riddled with ingredients that are acne-causing, even products that say they're non-comedogenic. Shea, coconut byproducts, many popular oils, are in 3/4 products on the market today, and they're all terrible for acne. Stick with free skin, and you'll never meet another comedogenic ingredient again.
              </p>
              <p className="text-base text-foreground/80 leading-relaxed">
                free skin is run by one person, not a corporation, who is just trying to help people find the products that are right for their skin.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground">
              how free skin <span className="bg-yellow-300 dark:bg-yellow-400 px-2 text-foreground">works</span> to get you acne-free (for free, btw)
            </h2>

            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <span className="font-serif text-2xl font-semibold text-primary">1</span>
              </div>
              <div className="flex-1 space-y-4 pt-2">
                <h3 className="text-xl md:text-2xl font-medium text-foreground">
                  Answer seven questions. Yes, just seven questions.
                </h3>
                <p className="text-base text-muted-foreground">
                  Name. Age. Skin type. Fitzpatrick type (we'll help you). Acne type(s) (we'll help you). Severity (we'll help you). Email.
                </p>
                <Button
                  size="lg"
                  onClick={() => setShowQuiz(true)}
                  className="gap-2"
                  data-testid="button-start-quiz"
                >
                  free skin quiz
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <span className="font-serif text-xl font-semibold text-primary">TWO</span>
              </div>
              <div className="flex-1 space-y-4 pt-2">
                <h3 className="text-xl md:text-2xl font-medium text-foreground">
                  Get a curated routine of acne-safe products that address your unique acne. For free.
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Brand-agnostic product recommendations, because we want what's best for your skin. It's free because we get affiliate kickbacks for every purchase you make through the links we provide. And because this is just a simple site ran by one guy who solved his acne, learned a lot, and wants to help other people solve theirs too.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center pt-8">
            <p className="font-serif text-2xl md:text-3xl text-foreground/60">
              ... and that's it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
