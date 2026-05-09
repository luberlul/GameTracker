"use client";

import { ArrowLeft, Star, Calendar, Loader2, AlertCircle, Download } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRawgGame } from "@/hooks/use-rawg";
import type { GameImport, GameSuggestion } from "@/lib/rawg/types";
import { useCachedImage } from "@/lib/image-cache";

interface Props {
  suggestion: GameSuggestion | null;
  onBack: () => void;
  onConfirm: (game: GameImport) => void;
}

export function GamePreviewDialog({ suggestion, onBack, onConfirm }: Props) {
  const { data, isLoading, error } = useRawgGame(suggestion?.id ?? null);

  const banner = data?.banner ?? suggestion?.cover ?? null;
  const bannerStatus = useCachedImage(banner);

  return (
    <Dialog open={suggestion !== null} onClose={onBack} size="xl">
      {!suggestion ? null : (
        <div>
          <div className="relative h-56 rounded-t-2xl overflow-hidden bg-muted">
            {banner && bannerStatus === "loaded" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={banner}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            <button
              type="button"
              onClick={onBack}
              className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-sm flex items-center gap-2 hover:bg-black/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar à busca
            </button>
            <div className="absolute bottom-4 left-6 right-6">
              <h2 className="text-3xl font-bold drop-shadow-lg">
                {suggestion.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                {suggestion.releaseYear && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {suggestion.releaseYear}
                  </span>
                )}
                {suggestion.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    {suggestion.rating.toFixed(1)}
                    <span className="text-muted-foreground text-xs">
                      ({suggestion.ratingsCount})
                    </span>
                  </span>
                )}
                {suggestion.metacritic !== null && (
                  <span className="px-2 py-0.5 rounded bg-green-500/15 text-green-400 font-medium">
                    Metacritic {suggestion.metacritic}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                Carregando detalhes…
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-sm">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">
                    Falha ao buscar detalhes
                  </p>
                  <p className="text-muted-foreground mt-1">
                    {(error as Error).message}
                  </p>
                </div>
              </div>
            )}

            {data && (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {data.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <Stat label="Plataformas" value={data.platforms.length} />
                  <Stat
                    label="Tempo médio"
                    value={data.playtime ? `${data.playtime}h` : "—"}
                  />
                  <Stat label="ESRB" value={data.esrb ?? "—"} />
                  <Stat
                    label="Lançamento"
                    value={data.released ?? "—"}
                  />
                </div>

                {data.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Descrição</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                      {data.description}
                    </p>
                  </div>
                )}

                {data.screenshots.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Screenshots</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {data.screenshots.slice(0, 6).map((src) => (
                        <Screenshot key={src} src={src} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="secondary" onClick={onBack}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              disabled={!data || isLoading}
              onClick={() => data && onConfirm(data)}
            >
              <Download className="w-4 h-4" />
              Importar este jogo
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 rounded-lg bg-accent/40">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold truncate">{value}</p>
    </div>
  );
}

function Screenshot({ src }: { src: string }) {
  const status = useCachedImage(src);
  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
      {status === "loaded" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-muted/50 animate-pulse" />
      )}
    </div>
  );
}
