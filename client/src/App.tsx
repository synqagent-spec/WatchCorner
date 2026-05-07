import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import WatchMoviePage from "./pages/WatchMoviePage";

interface AppState {
  page: string;
  params: Record<string, any>;
}

function App() {
  const [state, setState] = useState<AppState>({
    page: "home",
    params: {},
  });

  const handleNavigate = (page: string, params?: Record<string, any>) => {
    setState({
      page,
      params: params || {},
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string, type: "movie" | "tv") => {
    setState({
      page: "search",
      params: { query, type },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (state.page) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "search":
        return (
          <SearchPage
            query={state.params.query}
            type={state.params.type || "movie"}
            onNavigate={handleNavigate}
          />
        );
      case "movie":
        return (
          <MovieDetailPage
            imdbId={state.params.imdbId}
            title={state.params.title}
            onNavigate={handleNavigate}
          />
        );
      case "watch-movie":
        return (
          <WatchMoviePage
            imdbId={state.params.imdbId}
            title={state.params.title}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <div className="bg-background text-foreground min-h-screen">
            <Navbar
              onSearch={handleSearch}
              onNavigate={handleNavigate}
              currentPage={state.page}
            />
            <main>{renderPage()}</main>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
