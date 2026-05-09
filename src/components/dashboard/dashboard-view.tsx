"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Clock,
  Gamepad2,
  TrendingUp,
  Flame,
} from "lucide-react";
import { useGames } from "@/hooks/use-games";
import { toGame } from "@/lib/data/games";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { GameCover } from "@/components/shared/game-cover";
import { ChartCard } from "@/components/charts/chart-card";
import { BarChart } from "@/components/charts/bar-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { RadarChart } from "@/components/charts/radar-chart";

export function DashboardView() {
  const { data: rawGames = [] } = useGames();
  const games = useMemo(() => rawGames.map(toGame), [rawGames]);

  const completedGames = games.filter(
    (g) => g.status === "completed" || g.status === "100%",
  );
  const avgRating =
    completedGames.reduce((acc, g) => acc + g.overallRating, 0) /
      completedGames.length || 0;
  const totalHours = games.reduce((acc, g) => acc + g.hoursPlayed, 0);
  const playingGames = games.filter((g) => g.status === "playing");

  const genreCounts = games.reduce(
    (acc, game) => {
      game.genre.forEach((g) => {
        acc[g] = (acc[g] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const genreData = Object.entries(genreCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const statusData = [
    { name: "Zerados", value: completedGames.length, color: "#10b981" },
    { name: "Jogando", value: playingGames.length, color: "#3b82f6" },
    {
      name: "Backlog",
      value: games.filter((g) => g.status === "backlog").length,
      color: "#f59e0b",
    },
    {
      name: "Dropados",
      value: games.filter((g) => g.status === "dropped").length,
      color: "#ef4444",
    },
  ];

  const ratedGames = games.filter((g) => g.overallRating > 0);
  const avgByCategory =
    ratedGames.length > 0
      ? [
          {
            category: "História",
            value:
              ratedGames.reduce((s, g) => s + g.storyRating, 0) /
              ratedGames.length,
          },
          {
            category: "Gameplay",
            value:
              ratedGames.reduce((s, g) => s + g.gameplayRating, 0) /
              ratedGames.length,
          },
          {
            category: "Gráficos",
            value:
              ratedGames.reduce((s, g) => s + g.graphicsRating, 0) /
              ratedGames.length,
          },
          {
            category: "Som",
            value:
              ratedGames.reduce((s, g) => s + g.soundtrackRating, 0) /
              ratedGames.length,
          },
          {
            category: "Dificuldade",
            value:
              ratedGames.reduce((s, g) => s + g.difficulty * 2, 0) /
              ratedGames.length,
          },
        ]
      : [];

  const recentGames = [...games]
    .sort(
      (a, b) =>
        new Date(b.startDate || 0).getTime() -
        new Date(a.startDate || 0).getTime(),
    )
    .slice(0, 4);

  const stats = [
    {
      label: "Jogos Zerados",
      value: completedGames.length,
      icon: Trophy,
      color: "from-primary to-purple-600",
    },
    {
      label: "Média de Notas",
      value: avgRating.toFixed(1),
      icon: Star,
      color: "from-neon-blue to-cyan-500",
    },
    {
      label: "Horas Totais",
      value: totalHours,
      icon: Clock,
      color: "from-neon-cyan to-teal-500",
    },
    {
      label: "Jogando Agora",
      value: playingGames.length,
      icon: Gamepad2,
      color: "from-neon-pink to-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Aqui está seu resumo gamer.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Status dos Jogos" icon={Flame}>
          <PieChart data={statusData} />
        </ChartCard>

        <ChartCard title="Gêneros Favoritos" icon={Gamepad2}>
          <BarChart
            data={genreData}
            dataKey="value"
            categoryKey="name"
            color="#06b6d4"
            layout="vertical"
          />
        </ChartCard>

        {avgByCategory.length > 0 && (
          <ChartCard title="Média de Categorias" icon={Star}>
            <RadarChart
              data={avgByCategory}
              dataKey="value"
              categoryKey="category"
            />
          </ChartCard>
        )}
      </div>

      {recentGames.length > 0 && (
        <Card glass>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Últimos Jogos Adicionados</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/library/${game.id}`} className="group block">
                  <GameCover
                    title={game.title}
                    coverColor={game.coverColor}
                    coverImage={game.coverImage}
                    letterSize="text-6xl"
                    className="aspect-[3/4] mb-3"
                  >
                    {game.overallRating > 0 && (
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold">
                          {game.overallRating}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </GameCover>
                  <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                    {game.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{game.platform}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {games.length === 0 && (
        <Card glass>
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum jogo ainda</h3>
            <p className="text-muted-foreground">
              Adicione seu primeiro jogo para ver as estatísticas aqui.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
