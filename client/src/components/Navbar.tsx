import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onSearch: (query: string, type: "movie" | "tv") => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
  currentPage: string;
}

export default function Navbar({ onSearch, onNavigate, currentPage }: NavbarProps) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "tv">("movie");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, searchType);
      setSearchQuery("");
      setSearchExpanded(false);
    }
  };

  const isActive = (page: string) => currentPage === page;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50 backdrop-blur-[20px] bg-card/40">
      <div className="container flex items-center justify-between h-16">
        {/* Logo & Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onNavigate("home")}
        >
          <img src="/logo.png" alt="MovieCorner" className="h-8 w-8" />
          <span className="font-cinzel text-lg font-bold text-foreground">MovieCorner</span>
          <span className="text-xs font-dm-mono text-muted-foreground ml-2">by Synaptom</span>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate("home")}
            className={`font-dm-sans text-sm font-medium transition-colors ${
              isActive("home")
                ? "text-accent"
                : "text-foreground/70 hover:text-foreground"
            } nav-underline`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("search", { type: "movie" })}
            className={`font-dm-sans text-sm font-medium transition-colors ${
              currentPage === "search"
                ? "text-accent"
                : "text-foreground/70 hover:text-foreground"
            } nav-underline`}
          >
            Movies
          </button>
          <button
            onClick={() => onNavigate("search", { type: "tv" })}
            className={`font-dm-sans text-sm font-medium transition-colors ${
              currentPage === "search"
                ? "text-accent"
                : "text-foreground/70 hover:text-foreground"
            } nav-underline`}
          >
            TV Shows
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          {searchExpanded ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-popover/50 px-3 py-2 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  onClick={() => setSearchType(searchType === "movie" ? "tv" : "movie")}
                  className="text-xs font-dm-mono text-muted-foreground hover:text-accent transition-colors"
                >
                  {searchType === "movie" ? "🎬" : "📺"}
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none w-32"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchExpanded(false);
                  setSearchQuery("");
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchExpanded(true)}
              className="text-foreground hover:text-accent hover:bg-accent/10"
            >
              <Search size={18} />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
