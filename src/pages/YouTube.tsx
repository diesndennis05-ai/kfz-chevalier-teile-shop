import { useState, useEffect } from "react";
import { Youtube, ExternalLink, Play, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface YoutubeVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  description: string;
  url: string;
}

export default function YouTubePage() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    fetch(`${base}/api/youtube/videos`)
      .then(r => r.json())
      .then(data => {
        if (data.videos) {
          setVideos(data.videos);
          if (data.videos.length > 0) setActiveVideo(data.videos[0].id);
        } else {
          setError("Keine Videos gefunden.");
        }
      })
      .catch(() => setError("Videos konnten nicht geladen werden."))
      .finally(() => setIsLoading(false));
  }, []);

  const formatDate = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header banner */}
      <div className="bg-sidebar border-b border-sidebar-border">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="w-0.5 h-8 bg-sidebar-border"></div>
                <span className="text-sidebar-foreground/60 text-sm font-mono uppercase tracking-widest">YouTube</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-sidebar-foreground mb-2">
                ChevSache – Unser Kanal
              </h1>
              <p className="text-sidebar-foreground/60 max-w-xl">
                Einblicke in unsere Werkstatt, Motor-Checks, DSG-Reparaturen und mehr. Abonnieren und nichts verpassen.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 font-bold shrink-0"
              onClick={() => window.open("https://www.youtube.com/@ChevSache", "_blank")}
            >
              <Youtube className="w-5 h-5 mr-2" />
              Kanal abonnieren
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        <div className="h-0.5 bg-primary"></div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="w-full aspect-video rounded-sm" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-video rounded-sm" />)}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-muted/30 rounded-sm border border-dashed">
            <Youtube className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Videos nicht verfügbar</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => window.open("https://www.youtube.com/@ChevSache", "_blank")}
            >
              <Youtube className="w-4 h-4 mr-2" /> Direkt auf YouTube ansehen
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured / Active Player */}
            {activeVideo && (
              <div>
                <div className="relative w-full aspect-video bg-black rounded-sm overflow-hidden shadow-2xl border border-border">
                  <iframe
                    key={activeVideo}
                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
                    title="YouTube Video Player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                {videos.find(v => v.id === activeVideo) && (
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold leading-tight">
                        {videos.find(v => v.id === activeVideo)?.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(videos.find(v => v.id === activeVideo)?.published ?? "")}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${activeVideo}`, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" /> Bei YouTube öffnen
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Video Grid */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-primary"></div>
                <h2 className="text-lg font-bold uppercase tracking-wider">Alle Videos</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      setActiveVideo(video.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`group text-left rounded-sm overflow-hidden border transition-all hover:shadow-md ${
                      activeVideo === video.id
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border/60 hover:border-primary/40"
                    }`}
                  >
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Play overlay */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                        activeVideo === video.id ? "bg-primary/20" : "bg-black/20 opacity-0 group-hover:opacity-100"
                      }`}>
                        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                      {activeVideo === video.id && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                          Läuft
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-card">
                      <p className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(video.published)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Channel CTA */}
            <div className="bg-sidebar border border-sidebar-border rounded-sm p-8 text-center mt-8">
              <Youtube className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-sidebar-foreground mb-2">Mehr Videos auf unserem Kanal</h3>
              <p className="text-sidebar-foreground/60 mb-6 max-w-md mx-auto text-sm">
                Abonnieren Sie @ChevSache und verpassen Sie keine neuen Videos über Motoren, Getriebe und Kfz-Technik.
              </p>
              <Button
                className="bg-primary hover:bg-primary/90 font-bold"
                onClick={() => window.open("https://www.youtube.com/@ChevSache", "_blank")}
              >
                <Youtube className="w-5 h-5 mr-2" />
                @ChevSache abonnieren
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
