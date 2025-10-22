import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import veryFairImg from "@assets/Very Fair_1760686161679.png";
import fairLightImg from "@assets/Fair-Light_1760686161678.png";
import lightMediumImg from "@assets/Light Medium_1760686161678.png";
import tanOliveImg from "@assets/Tan Olive_1760686161678.png";
import mediumBrownImg from "@assets/Medium Brown_1760686161678.png";
import deepBrownImg from "@assets/Deep Brown_1760686161673.png";

export interface QuizAnswers {
  name: string;
  age: string;
  skinType: "dry" | "normal" | "oily" | "";
  fitzpatrickType: "1-3" | "4+" | "";
  acneTypes: string[];
  acneSeverity: "mild" | "moderate" | "severe" | "";
  beautyProducts: string[];
  isPregnantOrNursing: "yes" | "no" | "";
}

interface QuizFlowProps {
  onComplete: (answers: QuizAnswers) => void;
  onBack?: () => void;
  userName?: string;
}

export function QuizFlow({ onComplete, onBack, userName }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(userName ? 1 : 0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    name: userName || "",
    age: "",
    skinType: "",
    fitzpatrickType: "",
    acneTypes: [],
    acneSeverity: "",
    beautyProducts: [],
    isPregnantOrNursing: "",
  });
  
  // State for two-step Fitzpatrick determination
  const [skinTone, setSkinTone] = useState<number>(0); // 1-6
  const [sunReaction, setSunReaction] = useState<string>(""); // A, B, or C
  
  // Calculate total steps - always 9 steps, but step 4 (sun reaction) is conditionally shown
  // Steps: name(0), age(1), skin(2), skinTone(3), sunReaction(4 - conditional), acneTypes(5), severity(6), beautyProducts(7), pregnancy(8)
  const needsSunReaction = skinTone === 3 || skinTone === 4;
  const totalSteps = 9;
  
  // Calculate visible step number for progress bar
  const getVisibleStepNumber = () => {
    if (currentStep <= 3) {
      return currentStep + 1; // Steps 0-3 are always shown
    }
    if (currentStep === 4) {
      return 5; // Step 4 (sun reaction) is the 5th visible step
    }
    // For steps 5, 6, 7, 8
    if (needsSunReaction) {
      return currentStep + 1; // All 9 steps are visible
    } else {
      return currentStep; // Step 4 is skipped, so step 5 becomes the 5th visible step, etc.
    }
  };
  
  const visibleSteps = needsSunReaction ? 9 : 8;
  const visibleStepNumber = getVisibleStepNumber();
  const progress = (visibleStepNumber / visibleSteps) * 100;

  // Calculate Fitzpatrick type based on skin tone and sun reaction
  const calculateFitzpatrickType = (): "1-3" | "4+" => {
    // If skin tone is 1 or 2 → Fitz 1-3
    if (skinTone === 1 || skinTone === 2) {
      return "1-3";
    }
    
    // If skin tone is 5 or 6 → Fitz 4+
    if (skinTone === 5 || skinTone === 6) {
      return "4+";
    }
    
    // If skin tone is 3 or 4, use sun reaction
    if (skinTone === 3 || skinTone === 4) {
      // If burns (A or B) → Fitz 1-3
      if (sunReaction === "A" || sunReaction === "B") {
        return "1-3";
      }
      // If tans easily (C) → Fitz 4+
      if (sunReaction === "C") {
        return "4+";
      }
    }
    
    return "1-3"; // Default fallback
  };

  const handleNext = () => {
    // Step 3: Skin tone selection
    if (currentStep === 3) {
      const fitzType = calculateFitzpatrickType();
      setAnswers({ ...answers, fitzpatrickType: fitzType });
      
      // If skin tone is 1, 2, 5, or 6, skip step 4 (sun reaction)
      if (skinTone === 1 || skinTone === 2 || skinTone === 5 || skinTone === 6) {
        setCurrentStep(5); // Skip to acne types (step 5)
      } else {
        // Proceed to sun reaction question (step 4)
        setCurrentStep(4);
      }
    }
    // Step 4: Sun reaction (only if skin tone is 3 or 4)
    else if (currentStep === 4) {
      const fitzType = calculateFitzpatrickType();
      setAnswers({ ...answers, fitzpatrickType: fitzType });
      setCurrentStep(5); // Go to acne types (step 5)
    }
    else if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    // Handle going back from acne types (step 5)
    if (currentStep === 5) {
      // If we skipped sun reaction, go back to skin tone (step 3)
      if (skinTone === 1 || skinTone === 2 || skinTone === 5 || skinTone === 6) {
        setCurrentStep(3);
      } else {
        // Otherwise go back to sun reaction (step 4)
        setCurrentStep(4);
      }
    } 
    // Handle going back from step 4 (sun reaction)
    else if (currentStep === 4) {
      setCurrentStep(3); // Go back to skin tone
    }
    else if (currentStep > 0) {
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
        return skinTone > 0; // Skin tone selected
      case 4:
        return sunReaction !== ""; // Sun reaction selected
      case 5:
        return answers.acneTypes.length > 0;
      case 6:
        return answers.acneSeverity !== "";
      case 7:
        return true; // Beauty products is optional
      case 8:
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <div className="font-serif text-3xl font-normal text-foreground">AcneAgent</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="max-w-3xl mx-auto">
          <Progress value={progress} className="mb-8" data-testid="progress-quiz" />
          
          <Card className="p-8 md:p-12 border-card-border">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canProceed()) {
                      handleNext();
                    }
                  }}
                  placeholder="Enter your name"
                  data-testid="input-name"
                  className="text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">What is your age?</h2>
                <p className="text-muted-foreground text-lg">Our skin's needs change as we get older. This information helps AcneAgent recommend the right products for you.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Your Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={answers.age}
                  onChange={(e) => setAnswers({ ...answers, age: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canProceed()) {
                      handleNext();
                    }
                  }}
                  placeholder="Enter your age"
                  data-testid="input-age"
                  className="text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">What's your skin type?</h2>
                <p className="text-muted-foreground text-lg">This helps AcneAgent choose the right concentration for your actives, and provides insight into why you might be breaking out. </p>
              </div>
              <RadioGroup
                value={answers.skinType}
                onValueChange={(value) => setAnswers({ ...answers, skinType: value as any })}
              >
                {["dry", "normal/combination", "oily"].map((type) => (
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
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">Which of the following is closest to your natural skin tone?</h2>
                <p className="text-muted-foreground text-lg">This is often overlooked in acne treatment, but is critical for preventing hyperpigmentation and scarring.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { value: 1, label: "Very Fair", img: veryFairImg },
                  { value: 2, label: "Fair Light", img: fairLightImg },
                  { value: 3, label: "Light Medium", img: lightMediumImg },
                  { value: 4, label: "Tan Olive", img: tanOliveImg },
                  { value: 5, label: "Medium Brown", img: mediumBrownImg },
                  { value: 6, label: "Deep Brown", img: deepBrownImg },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSkinTone(option.value)}
                    className={`p-4 rounded-lg border-2 hover-elevate transition-all ${
                      skinTone === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    data-testid={`button-skin-tone-${option.value}`}
                  >
                    <div className="aspect-square mb-3 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <img 
                        src={option.img} 
                        alt={option.label} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-center">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">When you're in the sun without SPF, what usually happens?</h2>
                <p className="text-muted-foreground text-lg">This is often overlooked in acne treatment, but is critical for preventing hyperpigmentation and scarring.</p>
              </div>
              <div className="space-y-3">
                {[
                  { value: "A", label: "I burn easily and rarely tan" },
                  { value: "B", label: "I burn sometimes, then tan" },
                  { value: "C", label: "I tan easily and rarely burn" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSunReaction(option.value)}
                    className={`w-full p-4 rounded-md border hover-elevate text-left transition-all ${
                      sunReaction === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    data-testid={`button-sun-reaction-${option.value}`}
                  >
                    <p className="text-lg">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">What type(s) of acne do you have?</h2>
                <p className="text-muted-foreground text-lg">If you have more than one or even all three, select all that apply.</p>
              </div>
              <div className="space-y-3">
                {[
                  { 
                    id: "inflamed", 
                    title: "Inflamed",
                    description: "Classic 'Acne': Raised, red, painful pimples (pustules and papules)." 
                  },
                  { 
                    id: "noninflamed", 
                    title: "Non-inflamed",
                    description: "Painless blackheads (sebaceous filaments on the nose are not blackheads!), whiteheads, and comedones (blackheads with a white center)." 
                  },
                  { 
                    id: "acne-rosacea", 
                    title: "Acne Rosacea",
                    description: "Redness across cheeks, nose, forehead, sometimes with bumps, pustules, or pimples." 
                  },
                ].map((type) => (
                  <div key={type.id} className="flex items-start space-x-3 p-4 rounded-md hover-elevate border">
                    <Checkbox
                      id={type.id}
                      checked={answers.acneTypes.includes(type.id)}
                      onCheckedChange={() => toggleAcneType(type.id)}
                      data-testid={`checkbox-acne-${type.id}`}
                      className="mt-1"
                    />
                    <div className="flex-1 cursor-pointer" onClick={() => toggleAcneType(type.id)}>
                      <Label htmlFor={type.id} className="text-lg font-semibold cursor-pointer">
                        {type.title}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">How severe is your acne?</h2>
                <p className="text-muted-foreground text-lg">This helps us find the right treatment strength</p>
              </div>

              {/* Severity Reference Chart */}
              <Card className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold">Severity</th>
                        <th className="text-left py-2 px-3 font-semibold">Definition (Total Lesions)</th>
                        <th className="text-left py-2 px-3 font-semibold">Other Criteria</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-medium">Mild</td>
                        <td className="py-2 px-3">&lt; 30 total lesions</td>
                        <td className="py-2 px-3">&lt; 20 comedones or &lt; 15 inflammatory lesions</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-medium">Moderate</td>
                        <td className="py-2 px-3">30–125 total lesions</td>
                        <td className="py-2 px-3">20–100 comedones or 15–50 inflammatory lesions</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">Severe</td>
                        <td className="py-2 px-3">&gt; 125 total lesions</td>
                        <td className="py-2 px-3">&gt; 100 comedones or &gt; 50 inflammatory lesions</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              <RadioGroup
                value={answers.acneSeverity}
                onValueChange={(value) => setAnswers({ ...answers, acneSeverity: value as any })}
              >
                <div className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                  <RadioGroupItem value="mild" id="mild" data-testid="radio-severity-mild" />
                  <Label htmlFor="mild" className="text-lg cursor-pointer flex-1">
                    Mild (Occasional breakouts, fewer blemishes)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                  <RadioGroupItem value="moderate" id="moderate" data-testid="radio-severity-moderate" />
                  <Label htmlFor="moderate" className="text-lg cursor-pointer flex-1">
                    Moderate (Regular breakouts, noticeable blemishes)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                  <RadioGroupItem value="severe" id="severe" data-testid="radio-severity-severe" />
                  <Label htmlFor="severe" className="text-lg cursor-pointer flex-1">
                    Severe (Persistent breakouts, widespread blemishes)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">Do you use any of the following?</h2>
                <p className="text-muted-foreground text-lg">Select all that apply</p>
              </div>
              <div className="space-y-3">
                {[
                  { id: "tinted-moisturizer", label: "Tinted Moisturizer" },
                  { id: "tinted-spf", label: "Tinted SPF" },
                  { id: "makeup", label: "Makeup" },
                ].map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-4 rounded-md hover-elevate border">
                    <Checkbox
                      id={product.id}
                      checked={answers.beautyProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAnswers({
                            ...answers,
                            beautyProducts: [...answers.beautyProducts, product.id],
                          });
                        } else {
                          setAnswers({
                            ...answers,
                            beautyProducts: answers.beautyProducts.filter((t) => t !== product.id),
                          });
                        }
                      }}
                      data-testid={`checkbox-beauty-${product.id}`}
                    />
                    <Label htmlFor={product.id} className="text-lg cursor-pointer flex-1">
                      {product.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 8 && (
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
    </div>
  );
}
