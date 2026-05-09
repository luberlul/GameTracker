"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Calendar,
  Gamepad2,
  Trophy,
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Game } from "@/lib/data/games";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameCover } from "@/components/shared/game-cover";
import { RatingStars } from "@/components/shared/rating-stars";
import { ChartCard } from "@/components/charts/chart-card";
import { RadarChart } from "@/components/charts/radar-chart";
import { HltbTimesCard } from "@/components/hltb/hltb-times-card";
import { HltbComparisonChart } from "@/components/hltb/hltb-comparison-chart";
import { HltbSpeedBadge } from "@/components/hltb/hltb-speed-badge";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { useDeleteGame } from "@/hooks/use-games";

interface GameDetailsViewProps {
  game: Game;
}

export function GameDetailsView({ game }: GameDetailsViewProps) {
  const router = useRouter();
  const deleteGame = useDeleteGame();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const userHours = game.hoursPlayed + (game.minutesPlayed ?? 0) / 60;

  const radarData = [
    { category: "História", value: game.storyRating },
    { category: "Gameplay", value: game.gameplayRating },
    { category: "Gráficos", value: game.graphicsRating },
    { category: "Trilha", value: game.soundtrackRating },
    { category: "Dificuldade", value: game.difficulty * 2 },
  ];

  const ratings: Array<{
    label: string;
    value: number;
    icon?: "star" | "sparkles";
    activeColor?: string;
    max?: number;
  }> = [
    { label: "História", value: game.storyRating },
    { label: "Gameplay", value: game.gameplayRating },
    { label: "Trilha Sonora", value: game.soundtrackRating },
    { label: "Gráficos", value: game.graphicsRating },
    {
      label: "Dificuldade",
      value: game.difficulty,
      icon: "sparkles",
      activeColor: "text-red-400 fill-red-400",
      max: 5,
    },
  ];

  const handleDelete = () => {
    deleteGame.mutate(game.id, {
      onSuccess: () => router.push("/library"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link href="/library">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Biblioteca
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/library/${game.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil className="w-4 h-4" />
              Editar
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-400 hover:text-red-300 hover:border-red-400/50"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <Card glass className="border-red-500/30 bg-red-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-red-400">Excluir jogo</p>
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja excluir <strong>{game.title}</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 border-red-600"
                onClick={handleDelete}
                disabled={deleteGame.isPending}
              >
                {deleteGame.isPending ? "Excluindo..." : "Confirmar Exclusão"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card glass className="lg:sticky lg:top-6">
            <GameCover
              title={game.title}
              coverColor={game.coverColor}
              coverImage={game.coverImage}
              className="aspect-[3/4] mb-6 shadow-2xl"
              letterSize="text-9xl"
            >
              <div className="absolute top-4 left-4">
                <div
                  className={`${STATUS_COLORS[game.status]} px-3 py-1.5 rounded-lg text-sm font-medium text-white shadow-lg`}
                >
                  {STATUS_LABELS[game.status]}
                </div>
              </div>
            </GameCover>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Nota Geral
                </span>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold">
                    {game.overallRating}/10
                  </span>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-3">
                {ratings.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm text-muted-foreground">
                      {r.label}
                    </span>
                    <RatingStars
                      value={r.value}
                      max={r.max ?? 10}
                      icon={r.icon}
                      activeColor={r.activeColor}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card glass>
            <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {game.genre.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <InfoTile
                icon={<Clock className="w-5 h-5 text-cyan-400" />}
                label="Tempo Jogado"
                value={`${game.hoursPlayed}h${game.minutesPlayed ? ` ${game.minutesPlayed}min` : ""}`}
              />
              <InfoTile
                icon={<Gamepad2 className="w-5 h-5 text-purple-400" />}
                label="Plataforma"
                value={game.platform || "—"}
              />
              <InfoTile
                icon={<Calendar className="w-5 h-5 text-blue-400" />}
                label="Início"
                value={game.startDate ? formatDate(game.startDate) : "—"}
              />
              {game.endDate && (
                <InfoTile
                  icon={<Trophy className="w-5 h-5 text-green-400" />}
                  label="Conclusão"
                  value={formatDate(game.endDate)}
                />
              )}
            </div>

            {game.notes && (
              <div>
                <h3 className="font-bold mb-3 text-lg">Notas Pessoais</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {game.notes}
                </p>
              </div>
            )}
          </Card>

          {game.achievements && (
            <Card glass>
              <h3 className="font-bold mb-4 text-lg">Conquistas & Progresso</h3>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-accent">
                <Trophy className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{game.achievements}</p>
                  <p className="text-sm text-muted-foreground">
                    Status de Conquistas
                  </p>
                </div>
              </div>
            </Card>
          )}

          <ChartCard title="Análise Visual">
            <RadarChart
              data={radarData}
              dataKey="value"
              categoryKey="category"
              name={game.title}
              height={350}
              domain={[0, 10]}
            />
          </ChartCard>

          {game.hltb && (
            <>
              <Card glass>
                <h3 className="font-bold mb-4 text-lg">
                  Tempos de Conclusão · HowLongToBeat
                </h3>
                <HltbTimesCard
                  hltb={game.hltb}
                  userHours={userHours > 0 ? userHours : undefined}
                />
                <div className="mt-4">
                  <HltbSpeedBadge
                    hltb={game.hltb}
                    userHours={userHours}
                    status={game.status}
                  />
                </div>
              </Card>

              <ChartCard title="Seu Tempo vs. Médias HLTB">
                <HltbComparisonChart
                  hltb={game.hltb}
                  userHours={userHours}
                  height={300}
                />
              </ChartCard>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
      {icon}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-sm truncate">{value}</p>
      </div>
    </div>
  );
}
