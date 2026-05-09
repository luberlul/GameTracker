"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useGame } from "@/hooks/use-games";
import { toGame } from "@/lib/data/games";
import { GameDetailsView } from "@/components/game-details/game-details-view";

export default function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: raw, isLoading } = useGame(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!raw) {
    notFound();
  }

  return <GameDetailsView game={toGame(raw)} />;
}
