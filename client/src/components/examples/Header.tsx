import { Header } from "../Header";
import { ThemeProvider } from "../ThemeProvider";

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <Header
        onLoginClick={() => console.log("Login clicked")}
        isAuthenticated={false}
      />
    </ThemeProvider>
  );
}
