import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Brain, Lock } from "lucide-react";
import { trackConsentSubmitted } from "@/lib/analytics";

interface ConsentModalProps {
  open: boolean;
  onConsent: (dataCollection: boolean, aiTraining: boolean) => void;
  onSkip?: () => void;
  allowSkip?: boolean;
}

export function ConsentModal({ 
  open, 
  onConsent, 
  onSkip, 
  allowSkip = false 
}: ConsentModalProps) {
  const [dataCollectionConsent, setDataCollectionConsent] = useState(false);
  const [aiTrainingConsent, setAiTrainingConsent] = useState(false);

  const handleSubmit = () => {
    // Track consent submission
    trackConsentSubmitted({
      dataCollection: dataCollectionConsent,
      aiTraining: aiTrainingConsent
    });
    
    onConsent(dataCollectionConsent, aiTrainingConsent);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && allowSkip && onSkip?.()}>
      <DialogContent className="max-w-2xl" data-testid="modal-consent">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Your Privacy & Data Consent
          </DialogTitle>
          <DialogDescription>
            Help us improve skincare recommendations while protecting your privacy
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Data Collection Consent */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 mt-0.5 text-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="data-collection"
                      checked={dataCollectionConsent}
                      onCheckedChange={(checked) => 
                        setDataCollectionConsent(checked as boolean)
                      }
                      data-testid="checkbox-data-collection"
                    />
                    <Label 
                      htmlFor="data-collection" 
                      className="text-base font-semibold cursor-pointer"
                    >
                      Save my skincare data (Optional)
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    Store your skincare routines, skin type, acne concerns, and quiz responses. 
                    This allows us to personalize your experience and track your skincare journey over time.
                    All data is anonymized and stored securely.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Training Consent */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 mt-0.5 text-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="ai-training"
                      checked={aiTrainingConsent}
                      onCheckedChange={(checked) => 
                        setAiTrainingConsent(checked as boolean)
                      }
                      data-testid="checkbox-ai-training"
                    />
                    <Label 
                      htmlFor="ai-training" 
                      className="text-base font-semibold cursor-pointer"
                    >
                      Use my data to improve AI recommendations (Optional)
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    Allow your anonymized skincare data to train our AI model. In the future, 
                    this will include skin analysis from photos you upload, product usage data, 
                    and treatment results. This helps us provide better recommendations to all users 
                    based on real results from people with similar skin concerns.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Information */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">How we protect your privacy:</h4>
              <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                <li>All data is anonymized - no personally identifiable information is used for AI training</li>
                <li>You can withdraw consent at any time from your account settings</li>
                <li>Your data is never sold to third parties</li>
                <li>You maintain full control over your data and can request deletion</li>
                <li>Future photo analyses will be linked to products to track effectiveness</li>
              </ul>
              <p className="text-xs text-muted-foreground pt-2">
                For more details, see our{" "}
                <a 
                  href="/privacy-policy" 
                  target="_blank" 
                  className="text-secondary hover:underline"
                  data-testid="link-privacy-policy"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          {allowSkip && (
            <Button
              variant="ghost"
              onClick={onSkip}
              data-testid="button-skip-consent"
            >
              Skip for now
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            data-testid="button-save-consent"
          >
            Save preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
