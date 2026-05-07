import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { Movie, TVShow, APIResponse } from "@/lib/types";
import { API_BASE_URL } from "@/lib/embed-config";
import { Button } from "@/components/ui/button";

interface SearchPageProps {
  query: string;
  type: "movie" | "tv";
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export default function SearchPage({ query, type, onNavigate }: SearchPageProps) {
  const [results, setResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const endpoint =
          type === "movie"
            ? `/search?q=${encodeURIComponent(query)}&page=${currentPage}`
            : `/searchtv?q=${encodeURIComponent(query)}&page=${currentPage}`;

        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const data: APIResponse<Movie | TVShow> = await response.json();
        setResults(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      fetchResults();
    }
  }, [query, type, currentPage]);

  const handleItemClick = (item: Movie | TVShow) => {
    if ("title" in item) {
      onNavigate("movie", { imdbId: item.imdb_id, title: item.title });
    } else {
      onNavigate("tv", { imdbId: item.imdb_id, title: item.name });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-cinzel text-4xl font-bold text-foreground mb-2">
            Results for "{query}"
          </h1>
          <p className="text-muted-foreground">
            {results.length} results found
          </p>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-2 mb-8">
          <Button
            onClick={() => {
              setCurrentPage(1);
            }}
            variant={type === "movie" ? "default" : "outline"}
            className={type === "movie" ? "bg-accent text-accent-foreground" : ""}
          >
            🎬 Movies
          </Button>
          <Button
            onClick={() => {
              setCurrentPage(1);
            }}
            variant={type === "tv" ? "default" : "outline"}
            className={type === "tv" ? "bg-accent text-accent-foreground" : ""}
          >
            📺 TV Shows
          </Button>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-full aspect-[2/3] bg-card/50 shimmer rounded-lg" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {results.map((item) => (
                <div key={item.imdb_id} onClick={() => handleItemClick(item)}>
                  <MovieCard item={item} onClick={() => handleItemClick(item)} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = currentPage - 2 + i;
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      className={
                        pageNum === currentPage ? "bg-accent text-accent-foreground" : ""
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
}
