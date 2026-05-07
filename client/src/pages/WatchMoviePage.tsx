import { useEffect, useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie, APIResponse } from "@/lib/types";
import { API_BASE_URL, getMovieEmbedUrl, posterUrl } from "@/lib/embed-config";
import ContentRow from "@/components/ContentRow";

interface WatchMoviePageProps {
  imdbId: string;
  title: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export default function WatchMoviePage({
  imdbId,
  title,
  onNavigate,
}: WatchMoviePageProps) {
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

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container pb-20">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate("home")}
            className="glass-card p-2 rounded-full hover:bg-card/90 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="font-cinzel text-3xl font-bold text-foreground">{title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Section */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-lg overflow-hidden aspect-video bg-card/50">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin mb-4">
                      <Play size={32} className="text-accent" />
                    </div>
                    <p className="text-muted-foreground">Loading player...</p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={getMovieEmbedUrl(imdbId)}
                  title={title}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              )}
            </div>

            {/* Movie Info */}
            {movie && (
              <div className="mt-8 space-y-6">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-foreground mb-2">
                    {movie.title}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm font-dm-mono">
                    <span className="text-muted-foreground">
                      ⭐ {movie.vote_average.toFixed(1)}/10
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {movie.release_date?.split("-")[0]}
                    </span>
                    {movie.runtime && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{movie.runtime} min</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-cinzel text-lg font-bold text-foreground mb-2">
                    Overview
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">{movie.overview}</p>
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-foreground mb-2">
                      Genres
                    </h3>
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
                  </div>
                )}

                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-foreground mb-4">
                      Cast
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {movie.cast.slice(0, 8).map((actor, i) => (
                        <div key={i} className="text-center">
                          <p className="font-dm-sans font-semibold text-sm text-foreground truncate">
                            {actor.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {actor.character}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Similar Movies */}
            <div className="mt-12">
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

          {/* Sidebar - Trending */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-lg p-6 sticky top-24">
              <h3 className="font-cinzel text-lg font-bold text-foreground mb-4">
                🔥 Trending Now
              </h3>
              <div className="space-y-3">
                {/* Placeholder for trending mini list */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="glass-card p-3 rounded cursor-pointer hover:bg-card/90 transition-colors"
                  >
                    <div className="h-12 bg-card/50 shimmer rounded mb-2" />
                    <p className="text-xs text-muted-foreground">Trending #{i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
