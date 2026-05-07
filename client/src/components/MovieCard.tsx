import { useState } from "react";
import { Play } from "lucide-react";
import { posterUrl } from "@/lib/embed-config";
import { Movie, TVShow } from "@/lib/types";

interface MovieCardProps {
  item: Movie | TVShow;
  onClick: () => void;
}

export default function MovieCard({ item, onClick }: MovieCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);

  const title = "title" in item ? item.title : item.name;
  const year = ("release_date" in item ? item.release_date : item.first_air_date)?.split("-")[0];
  const posterPath = item.poster_path;
  const rating = item.vote_average;

  const getRatingColor = (rating: number) => {
    if (rating >= 7) return "rating-high";
    if (rating >= 5) return "rating-medium";
    return "rating-low";
  };

  return (
    <div
      className="relative group cursor-pointer h-full"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
      onClick={onClick}
    >
      {/* Poster Image */}
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg glass-card-hover">
        {isLoading && (
          <div className="absolute inset-0 bg-card/50 shimmer rounded-lg" />
        )}
        {posterPath && (
          <img
            src={posterUrl(posterPath)}
            alt={title}
            onLoad={() => setIsLoading(false)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Rating Badge */}
        <div className={`absolute top-2 right-2 ${getRatingColor(rating)}`}>
          ⭐ {rating.toFixed(1)}
        </div>

        {/* Overlay on Hover */}
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/50 to-transparent flex flex-col justify-end p-4 rounded-lg">
            <h3 className="font-cinzel font-bold text-foreground text-sm line-clamp-2 mb-1">
              {title}
            </h3>
            <p className="text-xs font-dm-mono text-muted-foreground mb-3">
              {year}
            </p>
            <button className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded font-dm-sans font-semibold text-sm hover:bg-accent/90 transition-colors w-full">
              <Play size={14} />
              Play
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
