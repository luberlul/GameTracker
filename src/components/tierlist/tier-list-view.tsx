"use client";

import { useState, useRef, useMemo } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useGames } from "@/hooks/use-games";
import { toGame, type Game } from "@/lib/data/games";
import { Card } from "@/components/ui/card";
import { GameCover } from "@/components/shared/game-cover";
import { cn } from "@/lib/utils";

const TIERS = [
  { name: "S", color: "bg-gradient-to-br from-red-500 to-pink-600" },
  { name: "A", color: "bg-gradient-to-br from-orange-500 to-yellow-500" },
  { name: "B", color: "bg-gradient-to-br from-green-500 to-emerald-500" },
  { name: "C", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  { name: "D", color: "bg-gradient-to-br from-gray-500 to-slate-600" },
];

function GameItem({ game }: { game: Pick<Game, "id" | "title" | "coverColor"> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "game",
    item: { id: game.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));
  drag(ref);

  return (
    <div
      ref={ref}
      className={cn(
        "cursor-move transition-all",
        isDragging ? "opacity-50 scale-95" : "hover:scale-105",
      )}
    >
      <GameCover
        title={game.title}
        coverColor={game.coverColor}
        className="w-20 h-28"
        letterSize="text-4xl"
      />
      <p className="text-xs mt-1 text-center truncate w-20">{game.title}</p>
    </div>
  );
}

interface TierRowProps {
  tier: string;
  color: string;
  games: Game[];
  onDrop: (gameId: string, tier: string) => void;
}

function TierRow({ tier, color, games, onDrop }: TierRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "game",
    drop: (item: { id: string }) => onDrop(item.id, tier),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));
  drop(ref);

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-4 p-4 rounded-xl border-2 transition-all",
        isOver ? "border-primary bg-primary/5" : "border-border bg-card/50",
      )}
    >
      <div
        className={cn(
          "w-20 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-2xl text-white shadow-lg",
          color,
        )}
      >
        {tier}
      </div>
      <div className="flex-1 flex flex-wrap gap-3 min-h-[120px] items-center">
        {games.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Arraste jogos para cá
          </p>
        )}
        {games.map((game) => (
          <GameItem key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

export function TierListView() {
  const { data: rawGames = [] } = useGames();
  const allGames = useMemo(() => rawGames.map(toGame), [rawGames]);

  const gamesWithTier = allGames.filter(
    (g) => g.status === "completed" || g.status === "100%",
  );

  const [tierAssignments, setTierAssignments] = useState<
    Record<string, string>
  >(() =>
    gamesWithTier.reduce(
      (acc, game) => {
        acc[game.id] = game.tier || "unranked";
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  // Update assignments when new games arrive
  useMemo(() => {
    setTierAssignments((prev) => {
      const next = { ...prev };
      for (const game of gamesWithTier) {
        if (!(game.id in next)) {
          next[game.id] = game.tier || "unranked";
        }
      }
      return next;
    });
  }, [gamesWithTier]);

  const handleDrop = (gameId: string, tier: string) => {
    setTierAssignments((prev) => ({ ...prev, [gameId]: tier }));
  };

  const getGamesForTier = (tier: string) =>
    gamesWithTier.filter((game) => tierAssignments[game.id] === tier);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Tier List</h1>
            <p className="text-muted-foreground">
              Organize seus jogos por ranking de qualidade
            </p>
          </div>
        </div>

        <Card glass>
          <div className="space-y-4">
            {TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TierRow
                  tier={tier.name}
                  color={tier.color}
                  games={getGamesForTier(tier.name)}
                  onDrop={handleDrop}
                />
              </motion.div>
            ))}
          </div>
        </Card>

        <Card glass>
          <h3 className="font-bold mb-4 text-xl">Jogos Não Classificados</h3>
          <div className="flex flex-wrap gap-3">
            {getGamesForTier("unranked").length === 0 && (
              <p className="text-muted-foreground">
                {gamesWithTier.length === 0
                  ? "Zere jogos para classificá-los aqui."
                  : "Todos os jogos foram classificados!"}
              </p>
            )}
            {getGamesForTier("unranked").map((game) => (
              <GameItem key={game.id} game={game} />
            ))}
          </div>
        </Card>

        <div className="bg-accent/30 border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Dica:</strong> Arraste e solte os jogos entre as tiers para
            criar seu ranking pessoal. Apenas jogos zerados aparecem aqui.
          </p>
        </div>
      </div>
    </DndProvider>
  );
}
