import { QuizFlow } from "../QuizFlow";
import { ThemeProvider } from "../ThemeProvider";

export default function QuizFlowExample() {
  return (
    <ThemeProvider>
      <QuizFlow
        onComplete={(answers) => console.log("Quiz completed:", answers)}
        onBack={() => console.log("Back clicked")}
      />
    </ThemeProvider>
  );
}
