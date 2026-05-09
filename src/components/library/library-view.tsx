"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useGames } from "@/hooks/use-games";
import { toGame } from "@/lib/data/games";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GameCard } from "@/components/library/game-card";
import { cn } from "@/lib/utils";

type SortKey = "recent" | "rating" | "hours";

export function LibraryView() {
  const { data: rawGames = [], isLoading } = useGames();
  const games = useMemo(() => rawGames.map(toGame), [rawGames]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("recent");

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        const matchesSearch = game.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || game.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.overallRating - a.overallRating;
        if (sortBy === "hours") return b.hoursPlayed - a.hoursPlayed;
        return (
          new Date(b.startDate || 0).getTime() -
          new Date(a.startDate || 0).getTime()
        );
      });
  }, [games, searchTerm, statusFilter, sortBy]);

  const statusOptions = [
    { value: "all", label: "Todos", count: games.length },
    {
      value: "completed",
      label: "Zerados",
      count: games.filter((g) => g.status === "completed").length,
    },
    {
      value: "playing",
      label: "Jogando",
      count: games.filter((g) => g.status === "playing").length,
    },
    {
      value: "backlog",
      label: "Backlog",
      count: games.filter((g) => g.status === "backlog").length,
    },
    {
      value: "dropped",
      label: "Dropados",
      count: games.filter((g) => g.status === "dropped").length,
    },
    {
      value: "100%",
      label: "100%",
      count: games.filter((g) => g.status === "100%").length,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Biblioteca</h1>
        <p className="text-muted-foreground">
          {isLoading ? "Carregando..." : `${filteredGames.length} jogos na sua coleção`}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="md:w-auto"
        >
          <option value="recent">Mais Recentes</option>
          <option value="rating">Maior Nota</option>
          <option value="hours">Mais Jogados</option>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value)}
            className={cn(
              "px-4 py-2 rounded-lg border transition-all",
              statusFilter === option.value
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                : "bg-card border-border hover:border-primary/50",
            )}
          >
            {option.label} ({option.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {!isLoading && filteredGames.length === 0 && (
        <div className="text-center py-20">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum jogo encontrado</h3>
          <p className="text-muted-foreground">
            {games.length === 0
              ? "Adicione seu primeiro jogo para começar!"
              : "Tente ajustar os filtros ou busca"}
          </p>
        </div>
      )}
    </div>
  );
}
