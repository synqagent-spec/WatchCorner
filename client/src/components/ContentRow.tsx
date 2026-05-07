import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import { Movie, TVShow, APIResponse, TimeWindow } from "@/lib/types";
import { API_BASE_URL } from "@/lib/embed-config";

interface ContentRowProps {
  title: string;
  type: "movie" | "tv";
  timeWindow: TimeWindow;
  onItemClick: (item: Movie | TVShow) => void;
}

export default function ContentRow({
  title,
  type,
  timeWindow,
  onItemClick,
}: ContentRowProps) {
  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const endpoint =
          type === "movie"
            ? `/trending?time_window=${timeWindow}&page=1`
            : `/trendingtv?time_window=${timeWindow}&page=1`;

        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const data: APIResponse<Movie | TVShow> = await response.json();
        setItems(data.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type, timeWindow]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-cinzel text-xl font-bold text-foreground border-b-2 border-accent pb-2 inline-block">
        {title}
      </h2>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="glass-card p-2 rounded-full hover:bg-card/90 transition-colors">
            <ChevronLeft size={20} className="text-accent" />
          </div>
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-40 h-60 bg-card/50 shimmer rounded-lg"
                />
              ))
            : items.map((item) => (
                <div
                  key={item.imdb_id}
                  className="flex-shrink-0 w-40"
                  onClick={() => onItemClick(item)}
                >
                  <MovieCard item={item} onClick={() => onItemClick(item)} />
                </div>
              ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="glass-card p-2 rounded-full hover:bg-card/90 transition-colors">
            <ChevronRight size={20} className="text-accent" />
          </div>
        </button>
      </div>
    </div>
  );
}
