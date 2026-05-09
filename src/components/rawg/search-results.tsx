"use client";

import { motion } from "framer-motion";
import { Star, Loader2, AlertCircle, SearchX } from "lucide-react";
import type { GameSuggestion } from "@/lib/rawg/types";
import { useCachedImage } from "@/lib/image-cache";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  query: string;
  results: GameSuggestion[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  onSelect: (suggestion: GameSuggestion) => void;
}

export function SearchResults({
  query,
  results,
  isLoading,
  isFetching,
  error,
  onSelect,
}: SearchResultsProps) {
  if (query.trim().length < 2) {
    return (
      <EmptyState
        icon={<SearchX className="w-10 h-10" />}
        title="Comece a digitar"
        message="Digite ao menos 2 letras para buscar no RAWG."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-lg bg-accent/40 animate-pulse"
          >
            <div className="w-16 h-20 rounded bg-muted/50" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 rounded bg-muted/50" />
              <div className="h-3 w-1/2 rounded bg-muted/40" />
              <div className="h-3 w-2/3 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-10 h-10 text-destructive" />}
        title="Falha na busca"
        message={error.message}
      />
    );
  }

  if (!results || results.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="w-10 h-10" />}
        title="Nada encontrado"
        message={`Nenhum resultado para "${query}".`}
      />
    );
  }

  return (
    <div className="space-y-2">
      {isFetching && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground px-1 pb-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Atualizando…
        </div>
      )}
      {results.map((game, i) => (
        <ResultRow
          key={game.id}
          game={game}
          index={i}
          onSelect={() => onSelect(game)}
        />
      ))}
    </div>
  );
}

function ResultRow({
  game,
  index,
  onSelect,
}: {
  game: GameSuggestion;
  index: number;
  onSelect: () => void;
}) {
  const status = useCachedImage(game.cover);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.15 }}
      className="w-full flex gap-3 p-3 rounded-lg bg-accent/40 hover:bg-accent border border-transparent hover:border-primary/40 transition-all text-left group"
    >
      <div
        className={cn(
          "w-16 h-20 rounded-md flex-shrink-0 bg-muted overflow-hidden relative",
          "ring-1 ring-border",
        )}
      >
        {game.cover && status === "loaded" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.cover}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 text-2xl font-bold">
            {game.name.charAt(0)}
          </div>
        )}
        {status === "loading" && (
          <div className="absolute inset-0 bg-muted/40 animate-pulse" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
          {game.name}
        </h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          {game.releaseYear && <span>{game.releaseYear}</span>}
          {game.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {game.rating.toFixed(1)}
            </span>
          )}
          {game.metacritic !== null && (
            <span className="px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 font-medium">
              MC {game.metacritic}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {game.genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
            >
              {g}
            </span>
          ))}
          {game.platforms.slice(0, 3).map((p) => (
            <span
              key={p}
              className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function EmptyState({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
      <div className="mb-3 opacity-60">{icon}</div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm mt-1 max-w-xs">{message}</p>
    </div>
  );
}
