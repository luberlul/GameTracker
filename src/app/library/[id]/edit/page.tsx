"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useGame } from "@/hooks/use-games";
import { toGame } from "@/lib/data/games";
import { EditGameForm } from "@/components/game-details/edit-game-form";

export default function EditGamePage({
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

  return <EditGameForm game={toGame(raw)} />;
}
