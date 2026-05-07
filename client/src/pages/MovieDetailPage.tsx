import { useEffect, useState } from "react";
import { Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie, APIResponse } from "@/lib/types";
import { API_BASE_URL, backdropUrl, posterUrl, profileUrl } from "@/lib/embed-config";
import ContentRow from "@/components/ContentRow";

interface MovieDetailPageProps {
  imdbId: string;
  title: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export default function MovieDetailPage({
  imdbId,
  title,
  onNavigate,
}: MovieDetailPageProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movie?imdb_id=${imdbId}`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [imdbId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-card/50 rounded-lg" />
            <div className="h-8 bg-card/50 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Movie not found</p>
          <Button
            onClick={() => onNavigate("home")}
            className="mt-4"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full h-96 overflow-hidden pt-16">
        {movie.backdrop_path && (
          <img
            src={backdropUrl(movie.backdrop_path)}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => onNavigate("home")}
          className="absolute top-20 left-8 z-10 glass-card p-2 rounded-full hover:bg-card/90 transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="container relative -mt-32 pb-20">
        <div className="flex gap-8 mb-12">
          {/* Poster */}
          {movie.poster_path && (
            <div className="flex-shrink-0 w-48 h-72 rounded-lg overflow-hidden glass-card shadow-2xl shadow-accent/20">
              <img
                src={posterUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Details */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="font-cinzel text-5xl font-bold text-foreground mb-2">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-lg text-muted-foreground italic">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm font-dm-mono">
              <div className="glass-card px-4 py-2 rounded">
                <span className="text-muted-foreground">Rating</span>
                <p className="text-accent font-bold">⭐ {movie.vote_average.toFixed(1)}/10</p>
              </div>
              <div className="glass-card px-4 py-2 rounded">
                <span className="text-muted-foreground">Release</span>
                <p className="text-foreground font-bold">
                  {movie.release_date?.split("-")[0]}
                </p>
              </div>
              {movie.runtime && (
                <div className="glass-card px-4 py-2 rounded">
                  <span className="text-muted-foreground">Runtime</span>
                  <p className="text-foreground font-bold">{movie.runtime} min</p>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="glass-card px-3 py-1 rounded text-sm text-accent border border-accent/50"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Play Button */}
            <Button
              onClick={() =>
                onNavigate("watch-movie", { imdbId: movie.imdb_id, title: movie.title })
              }
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-dm-sans font-semibold gap-2 w-full md:w-auto"
            >
              <Play size={18} />
              Watch Now
            </Button>
          </div>
        </div>

        {/* Overview */}
        <div className="glass-card p-6 rounded-lg mb-12">
          <h2 className="font-cinzel text-2xl font-bold text-foreground mb-4">Overview</h2>
          <p className="text-foreground/80 leading-relaxed">{movie.overview}</p>
        </div>

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mb-12">
            <h2 className="font-cinzel text-2xl font-bold text-foreground mb-4">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.cast.slice(0, 12).map((actor, i) => (
                <div key={i} className="glass-card rounded-lg overflow-hidden text-center">
                  {actor.profile_path && (
                    <img
                      src={profileUrl(actor.profile_path)}
                      alt={actor.name}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <p className="font-dm-sans font-semibold text-sm text-foreground truncate">
                      {actor.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        <ContentRow
          title="Similar Movies"
          type="movie"
          timeWindow="day"
          onItemClick={(item) => {
            if ("title" in item) {
              onNavigate("movie", { imdbId: item.imdb_id, title: item.title });
            }
          }}
        />
      </div>
    </div>
  );
}
