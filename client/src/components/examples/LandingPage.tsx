import { LandingPage } from "../LandingPage";
import { ThemeProvider } from "../ThemeProvider";

export default function LandingPageExample() {
  return (
    <ThemeProvider>
      <LandingPage onStartQuiz={() => console.log("Start quiz clicked")} />
    </ThemeProvider>
  );
}
