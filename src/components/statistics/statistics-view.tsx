"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, Clock, Zap } from "lucide-react";
import { useGames } from "@/hooks/use-games";
import { toGame } from "@/lib/data/games";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/components/charts/chart-card";
import { AreaChart } from "@/components/charts/area-chart";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { HltbProfileSection } from "@/components/hltb/hltb-profile-section";

export function StatisticsView() {
  const { data: rawGames = [] } = useGames();
  const games = useMemo(() => rawGames.map(toGame), [rawGames]);

  const totalGames = games.length;
  const totalHours = games.reduce((acc, g) => acc + g.hoursPlayed, 0);
  const ratedGames = games.filter((g) => g.overallRating > 0);
  const avgRating =
    ratedGames.reduce((acc, g) => acc + g.overallRating, 0) /
      ratedGames.length || 0;
  const avgHours = totalHours / totalGames || 0;

  const ratingDistribution = [
    { range: "9-10", count: games.filter((g) => g.overallRating >= 9).length },
    {
      range: "7-8",
      count: games.filter(
        (g) => g.overallRating >= 7 && g.overallRating < 9,
      ).length,
    },
    {
      range: "5-6",
      count: games.filter(
        (g) => g.overallRating >= 5 && g.overallRating < 7,
      ).length,
    },
    {
      range: "0-4",
      count: games.filter(
        (g) => g.overallRating > 0 && g.overallRating < 5,
      ).length,
    },
  ];

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
    .sort((a, b) => b.value - a.value);

  const platformCounts = games.reduce(
    (acc, game) => {
      if (game.platform) acc[game.platform] = (acc[game.platform] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const platformData = Object.entries(platformCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const hardestGames = [...games]
    .filter((g) => g.difficulty > 0)
    .sort((a, b) => b.difficulty - a.difficulty)
    .slice(0, 5);

  const completedByYear = Object.entries(
    games
      .filter((g) => g.status === "completed" || g.status === "100%")
      .reduce(
        (acc, g) => {
          const year = g.endDate
            ? new Date(g.endDate).getFullYear().toString()
            : g.startDate
              ? new Date(g.startDate).getFullYear().toString()
              : "?";
          if (year !== "?") {
            acc[year] = acc[year] ?? { year, games: 0, hours: 0 };
            acc[year].games += 1;
            acc[year].hours += g.hoursPlayed;
          }
          return acc;
        },
        {} as Record<string, { year: string; games: number; hours: number }>,
      ),
  )
    .map(([, v]) => v)
    .sort((a, b) => a.year.localeCompare(b.year));

  const stats = [
    {
      label: "Total de Jogos",
      value: totalGames,
      icon: Award,
      color: "from-primary to-purple-600",
    },
    {
      label: "Horas Totais",
      value: totalHours,
      icon: Clock,
      color: "from-neon-blue to-cyan-500",
    },
    {
      label: "Nota Média",
      value: avgRating.toFixed(1),
      icon: TrendingUp,
      color: "from-neon-cyan to-teal-500",
    },
    {
      label: "Média Horas/Jogo",
      value: Math.round(avgHours),
      icon: Zap,
      color: "from-neon-pink to-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Estatísticas</h1>
        <p className="text-muted-foreground">
          Análise completa da sua jornada gamer
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
        {completedByYear.length > 0 && (
          <ChartCard title="Jogos Zerados por Ano">
            <LineChart
              data={completedByYear}
              dataKey="games"
              categoryKey="year"
            />
          </ChartCard>
        )}

        {ratingDistribution.some((r) => r.count > 0) && (
          <ChartCard title="Distribuição de Notas">
            <BarChart
              data={ratingDistribution}
              dataKey="count"
              categoryKey="range"
              color="#ec4899"
            />
          </ChartCard>
        )}

        {genreData.length > 0 && (
          <ChartCard title="Ranking de Gêneros">
            <BarChart
              data={genreData}
              dataKey="value"
              categoryKey="name"
              color="#10b981"
              layout="vertical"
            />
          </ChartCard>
        )}

        {platformData.length > 0 && (
          <ChartCard title="Ranking de Plataformas">
            <BarChart
              data={platformData}
              dataKey="value"
              categoryKey="name"
              color="#3b82f6"
            />
          </ChartCard>
        )}

        <Card glass className="lg:col-span-2">
          <HltbProfileSection games={games} />
        </Card>

        {hardestGames.length > 0 && (
          <Card glass>
            <h3 className="font-bold mb-6 text-xl">Jogos Mais Difíceis</h3>
            <div className="space-y-4">
              {hardestGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                >
                  <div className="text-2xl font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </div>
                  <div
                    className="w-12 h-16 rounded-lg flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${game.coverColor}, ${game.coverColor}dd)`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{game.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {game.platform}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: game.difficulty }).map((_, i) => (
                      <Zap
                        key={i}
                        className="w-4 h-4 text-red-400 fill-red-400"
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
