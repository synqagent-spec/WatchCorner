import { Movie, TVShow } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const handlePlayClick = (movie: Movie) => {
    onNavigate("watch-movie", { imdbId: movie.imdb_id, title: movie.title });
  };

  const handleInfoClick = (movie: Movie) => {
    onNavigate("movie", { imdbId: movie.imdb_id, title: movie.title });
  };

  const handleItemClick = (item: Movie | TVShow) => {
    if ("title" in item) {
      onNavigate("movie", { imdbId: item.imdb_id, title: item.title });
    } else {
      onNavigate("tv", { imdbId: item.imdb_id, title: item.name });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <HeroBanner onPlayClick={handlePlayClick} onInfoClick={handleInfoClick} />

      {/* Content Rows */}
      <div className="bg-background pt-16 pb-20">
        <div className="container space-y-16">
          <ContentRow
            title="🔥 Trending Today"
            type="movie"
            timeWindow="day"
            onItemClick={handleItemClick}
          />
          <ContentRow
            title="📺 Trending TV"
            type="tv"
            timeWindow="week"
            onItemClick={handleItemClick}
          />
          <ContentRow
            title="🌙 Trending This Week"
            type="movie"
            timeWindow="week"
            onItemClick={handleItemClick}
          />
          <ContentRow
            title="🎬 Popular TV Series"
            type="tv"
            timeWindow="month"
            onItemClick={handleItemClick}
          />
        </div>
      </div>
    </div>
  );
}
