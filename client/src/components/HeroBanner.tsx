import { useEffect, useState } from "react";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie, APIResponse } from "@/lib/types";
import { API_BASE_URL, backdropUrl } from "@/lib/embed-config";

interface HeroBannerProps {
  onPlayClick: (movie: Movie) => void;
  onInfoClick: (movie: Movie) => void;
}

export default function HeroBanner({ onPlayClick, onInfoClick }: HeroBannerProps) {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/trending?time_window=day&page=1`);
        const data: APIResponse<Movie> = await response.json();
        setMovies(data.results.slice(0, 5));
        setCurrentMovie(data.results[0]);
      } catch (error) {
        console.error("Error fetching trending:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      setCurrentMovie(movies[(currentIndex + 1) % movies.length]);
    }, 8000);

    return () => clearInterval(interval);
  }, [movies, currentIndex]);

  if (loading || !currentMovie) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-card/50 to-background shimmer" />
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      {currentMovie.backdrop_path && (
        <img
          src={backdropUrl(currentMovie.backdrop_path)}
          alt={currentMovie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />

      {/* Lens Flare Effect */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-accent/20 to-transparent rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-40 left-40 w-72 h-72 bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl opacity-20" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Title */}
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-foreground leading-tight">
            {currentMovie.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm font-dm-mono text-muted-foreground">
            <span>⭐ {currentMovie.vote_average.toFixed(1)}/10</span>
            <span>•</span>
            <span>{currentMovie.release_date?.split("-")[0]}</span>
            {currentMovie.runtime && (
              <>
                <span>•</span>
                <span>{currentMovie.runtime} min</span>
              </>
            )}
          </div>

          {/* Overview */}
          <p className="text-foreground/80 text-lg leading-relaxed line-clamp-3">
            {currentMovie.overview}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => onPlayClick(currentMovie)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-dm-sans font-semibold gap-2"
            >
              <Play size={18} />
              Watch Now
            </Button>
            <Button
              onClick={() => onInfoClick(currentMovie)}
              variant="outline"
              className="border-accent/50 text-foreground hover:bg-accent/10 font-dm-sans font-semibold gap-2"
            >
              <Info size={18} />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-8 md:left-16 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setCurrentMovie(movies[index]);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-accent w-8" : "bg-accent/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
