import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface QuizAnswers {
  name: string;
  age: string;
  skinType: "dry" | "normal" | "oily" | "";
  fitzpatrickType: "1-3" | "4+" | "";
  acneTypes: string[];
  isPregnantOrNursing: "yes" | "no" | "";
}

interface QuizFlowProps {
  onComplete: (answers: QuizAnswers) => void;
  onBack?: () => void;
}

export function QuizFlow({ onComplete, onBack }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    name: "",
    age: "",
    skinType: "",
    fitzpatrickType: "",
    acneTypes: [],
    isPregnantOrNursing: "",
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack?.();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return answers.name.trim().length > 0;
      case 1:
        return answers.age.trim().length > 0;
      case 2:
        return answers.skinType !== "";
      case 3:
        return answers.fitzpatrickType !== "";
      case 4:
        return answers.acneTypes.length > 0;
      case 5:
        return answers.isPregnantOrNursing !== "";
      default:
        return false;
    }
  };

  const toggleAcneType = (type: string) => {
    setAnswers((prev) => ({
      ...prev,
      acneTypes: prev.acneTypes.includes(type)
        ? prev.acneTypes.filter((t) => t !== type)
        : [...prev.acneTypes, type],
    }));
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-3xl mx-auto pt-8">
        <Progress value={progress} className="mb-8" data-testid="progress-quiz" />
        
        <Card className="p-8 md:p-12 border-border/50">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">What's your name?</h2>
                <p className="text-muted-foreground text-lg">Let's personalize your experience</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={answers.name}
                  onChange={(e) => setAnswers({ ...answers, name: e.target.value })}
                  placeholder="Enter your name"
                  data-testid="input-name"
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">How old are you?</h2>
                <p className="text-muted-foreground text-lg">Age helps us recommend the right products</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Your Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={answers.age}
                  onChange={(e) => setAnswers({ ...answers, age: e.target.value })}
                  placeholder="Enter your age"
                  data-testid="input-age"
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">What's your skin type?</h2>
                <p className="text-muted-foreground text-lg">This helps us choose the right formulations</p>
              </div>
              <RadioGroup
                value={answers.skinType}
                onValueChange={(value) => setAnswers({ ...answers, skinType: value as any })}
              >
                {["dry", "normal", "oily"].map((type) => (
                  <div key={type} className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                    <RadioGroupItem value={type} id={type} data-testid={`radio-skin-${type}`} />
                    <Label htmlFor={type} className="text-lg capitalize cursor-pointer flex-1">
                      {type}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">What's your Fitzpatrick skin type?</h2>
                <p className="text-muted-foreground text-lg">This helps prevent hyperpigmentation and scarring</p>
              </div>
              <RadioGroup
                value={answers.fitzpatrickType}
                onValueChange={(value) => setAnswers({ ...answers, fitzpatrickType: value as any })}
              >
                <div className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                  <RadioGroupItem value="1-3" id="1-3" data-testid="radio-fitzpatrick-1-3" />
                  <Label htmlFor="1-3" className="text-lg cursor-pointer flex-1">
                    Type 1-3 (Lighter skin tones)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                  <RadioGroupItem value="4+" id="4+" data-testid="radio-fitzpatrick-4+" />
                  <Label htmlFor="4+" className="text-lg cursor-pointer flex-1">
                    Type 4+ (Darker skin tones)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">What type of acne do you have?</h2>
                <p className="text-muted-foreground text-lg">Select all that apply</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: "inflamed", label: "Inflamed (Red, painful pimples)" },
                  { id: "noninflamed", label: "Non-inflamed (Blackheads, whiteheads)" },
                  { id: "acne-rosacea", label: "Acne Rosacea (Redness with bumps)" },
                ].map((type) => (
                  <div key={type.id} className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                    <Checkbox
                      id={type.id}
                      checked={answers.acneTypes.includes(type.id)}
                      onCheckedChange={() => toggleAcneType(type.id)}
                      data-testid={`checkbox-acne-${type.id}`}
                    />
                    <Label htmlFor={type.id} className="text-lg cursor-pointer flex-1">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">Are you pregnant or nursing?</h2>
                <p className="text-muted-foreground text-lg">Some ingredients aren't safe during pregnancy</p>
              </div>
              <RadioGroup
                value={answers.isPregnantOrNursing}
                onValueChange={(value) => setAnswers({ ...answers, isPregnantOrNursing: value as any })}
              >
                <div className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                  <RadioGroupItem value="yes" id="yes" data-testid="radio-pregnant-yes" />
                  <Label htmlFor="yes" className="text-lg cursor-pointer flex-1">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                  <RadioGroupItem value="no" id="no" data-testid="radio-pregnant-no" />
                  <Label htmlFor="no" className="text-lg cursor-pointer flex-1">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              data-testid="button-previous"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1"
              data-testid="button-next"
            >
              {currentStep === totalSteps - 1 ? "Complete Quiz" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
