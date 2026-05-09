"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Star, Clock, Gamepad2, Award, Target } from "lucide-react";
import { useGames } from "@/hooks/use-games";
import { toGame } from "@/lib/data/games";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { GameCover } from "@/components/shared/game-cover";
import { cn } from "@/lib/utils";

export function ProfileView() {
  const { data: rawGames = [] } = useGames();
  const games = useMemo(() => rawGames.map(toGame), [rawGames]);

  const completedGames = games.filter(
    (g) => g.status === "completed" || g.status === "100%",
  );
  const totalHours = games.reduce((acc, g) => acc + g.hoursPlayed, 0);
  const avgRating =
    completedGames.reduce((acc, g) => acc + g.overallRating, 0) /
      completedGames.length || 0;

  const favoriteGames = [...games]
    .filter((g) => g.overallRating >= 9)
    .sort((a, b) => b.overallRating - a.overallRating)
    .slice(0, 6);

  const recentGames = [...games]
    .sort(
      (a, b) =>
        new Date(b.startDate || 0).getTime() -
        new Date(a.startDate || 0).getTime(),
    )
    .slice(0, 5);

  const achievements = [
    {
      title: "Mestre dos 100%",
      description: "Complete um jogo com 100%",
      icon: Trophy,
      unlocked: games.some((g) => g.status === "100%"),
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Maratonista",
      description: "Jogue por mais de 500 horas",
      icon: Clock,
      unlocked: totalHours >= 500,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Crítico Exigente",
      description: "Avalie 10 jogos com nota 9 ou superior",
      icon: Star,
      unlocked: games.filter((g) => g.overallRating >= 9).length >= 10,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Colecionador",
      description: "Registre 50 jogos na biblioteca",
      icon: Gamepad2,
      unlocked: games.length >= 50,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Desafiante",
      description: "Zere 5 jogos com dificuldade máxima",
      icon: Target,
      unlocked:
        games.filter(
          (g) =>
            (g.status === "completed" || g.status === "100%") &&
            g.difficulty >= 5,
        ).length >= 5,
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Lenda Gamer",
      description: "Alcance 100 jogos zerados",
      icon: Award,
      unlocked: completedGames.length >= 100,
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const stats = [
    {
      label: "Jogos Zerados",
      value: completedGames.length,
      icon: Trophy,
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
      icon: Star,
      color: "from-neon-cyan to-teal-500",
    },
    {
      label: "Total de Jogos",
      value: games.length,
      icon: Gamepad2,
      color: "from-neon-pink to-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      <Card glass className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-neon-pink to-neon-cyan p-1">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-5xl font-bold">
              G
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">Gamer</h1>
            <p className="text-xl text-muted-foreground mb-4">
              {games.length} jogos na coleção
            </p>
          </div>
        </div>
      </Card>

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

      {favoriteGames.length > 0 && (
        <Card glass>
          <h2 className="text-2xl font-bold mb-6">Jogos Favoritos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {favoriteGames.map((game, index) => (
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
                    className="aspect-[3/4] mb-2"
                    letterSize="text-6xl"
                  >
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-white">
                        {game.overallRating}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </GameCover>
                  <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {game.title}
                  </h4>
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      <Card glass>
        <h2 className="text-2xl font-bold mb-6">Conquistas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-xl border-2",
                  achievement.unlocked
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/30 bg-card/30 opacity-60",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                      achievement.color,
                      !achievement.unlocked && "grayscale",
                    )}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold mb-1">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Trophy className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {recentGames.length > 0 && (
        <Card glass>
          <h2 className="text-2xl font-bold mb-6">Atividade Recente</h2>
          <div className="space-y-3">
            {recentGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/library/${game.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                >
                  <div
                    className="w-16 h-20 rounded-lg flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${game.coverColor}, ${game.coverColor}dd)`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{game.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {game.platform} • {game.hoursPlayed}h jogadas
                    </p>
                    {game.startDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Iniciado em{" "}
                        {new Date(game.startDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                  {game.overallRating > 0 && (
                    <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold">{game.overallRating}</span>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
