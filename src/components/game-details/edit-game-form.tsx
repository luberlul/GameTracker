"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { RatingSelector } from "@/components/add-game/rating-selector";
import { PLATFORMS, STATUS_OPTIONS_FORM } from "@/lib/constants";
import type { Game } from "@/lib/data/games";
import { useUpdateGame } from "@/hooks/use-games";

interface EditFormState {
  title: string;
  platform: string;
  status: string;
  overallRating: number;
  storyRating: number;
  gameplayRating: number;
  soundtrackRating: number;
  graphicsRating: number;
  difficulty: number;
  hoursPlayed: number;
  minutesPlayed: number;
  startDate: string;
  endDate: string;
  genre: string;
  notes: string;
  achievements: string;
}

function gameToForm(game: Game): EditFormState {
  return {
    title: game.title,
    platform: game.platform,
    status: game.status,
    overallRating: game.overallRating,
    storyRating: game.storyRating,
    gameplayRating: game.gameplayRating,
    soundtrackRating: game.soundtrackRating,
    graphicsRating: game.graphicsRating,
    difficulty: game.difficulty,
    hoursPlayed: game.hoursPlayed,
    minutesPlayed: game.minutesPlayed ?? 0,
    startDate: game.startDate ?? "",
    endDate: game.endDate ?? "",
    genre: game.genre.join(", "),
    notes: game.notes,
    achievements: game.achievements,
  };
}

export function EditGameForm({ game }: { game: Game }) {
  const router = useRouter();
  const updateGame = useUpdateGame();
  const [formData, setFormData] = useState<EditFormState>(() =>
    gameToForm(game),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (updateGame.isSuccess) {
      router.push(`/library/${game.id}`);
    }
  }, [updateGame.isSuccess, router, game.id]);

  const update = <K extends keyof EditFormState>(
    key: K,
    value: EditFormState[K],
  ) => setFormData((s) => ({ ...s, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    const genres = formData.genre
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);

    updateGame.mutate({
      id: game.id,
      input: {
        title: formData.title.trim(),
        platform: formData.platform,
        status: formData.status,
        overallRating: formData.overallRating,
        storyRating: formData.storyRating,
        gameplayRating: formData.gameplayRating,
        soundtrackRating: formData.soundtrackRating,
        graphicsRating: formData.graphicsRating,
        difficulty: formData.difficulty,
        hoursPlayed: formData.hoursPlayed,
        minutesPlayed: formData.minutesPlayed,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        genre: genres,
        notes: formData.notes,
        achievements: formData.achievements,
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/library/${game.id}`}>
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Jogo</h1>
          <p className="text-muted-foreground text-sm">{game.title}</p>
        </div>
      </div>

      <Card glass>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Título do Jogo *
              </label>
              <Input
                placeholder="Ex: The Last Guardian"
                value={formData.title}
                onChange={(e) => update("title", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Plataforma
              </label>
              <Combobox
                options={PLATFORMS}
                value={formData.platform}
                onChange={(v) => update("platform", v)}
                placeholder="Selecione uma plataforma..."
                searchPlaceholder="Buscar plataforma..."
                emptyMessage="Nenhuma plataforma encontrada."
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onChange={(e) => update("status", e.target.value)}
              >
                {STATUS_OPTIONS_FORM.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Tempo Jogado
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formData.hoursPlayed || ""}
                    onChange={(e) =>
                      update("hoursPlayed", parseInt(e.target.value) || 0)
                    }
                    className="w-full pr-8 pl-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    h
                  </span>
                </div>
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    max={59}
                    placeholder="0"
                    value={formData.minutesPlayed || ""}
                    onChange={(e) =>
                      update(
                        "minutesPlayed",
                        Math.min(59, parseInt(e.target.value) || 0),
                      )
                    }
                    className="w-full pr-10 pl-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    min
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Data de Início
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Data de Conclusão
              </label>
              <input
                type="date"
                value={formData.endDate}
                min={formData.startDate || undefined}
                onChange={(e) => update("endDate", e.target.value)}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [color-scheme:dark]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium">
                Gêneros (separados por vírgula)
              </label>
              <Input
                placeholder="Ex: RPG, Action, Adventure"
                value={formData.genre}
                onChange={(e) => update("genre", e.target.value)}
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <h3 className="font-bold mb-4 text-xl">Avaliações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RatingSelector
                label="Nota Geral"
                value={formData.overallRating}
                onChange={(v) => update("overallRating", v)}
              />
              <RatingSelector
                label="História"
                value={formData.storyRating}
                onChange={(v) => update("storyRating", v)}
              />
              <RatingSelector
                label="Gameplay"
                value={formData.gameplayRating}
                onChange={(v) => update("gameplayRating", v)}
              />
              <RatingSelector
                label="Trilha Sonora"
                value={formData.soundtrackRating}
                onChange={(v) => update("soundtrackRating", v)}
              />
              <RatingSelector
                label="Gráficos"
                value={formData.graphicsRating}
                onChange={(v) => update("graphicsRating", v)}
              />
              <RatingSelector
                label="Dificuldade"
                value={formData.difficulty}
                onChange={(v) => update("difficulty", v)}
                max={5}
                icon="sparkles"
                activeColor="text-red-400 fill-red-400"
                hoverColor="hover:text-red-400/50"
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <label className="block mb-2 text-sm font-medium">
              Notas Pessoais
            </label>
            <textarea
              placeholder="Escreva suas impressões sobre o jogo..."
              value={formData.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Conquistas / Troféus
            </label>
            <Input
              placeholder="Ex: Platina obtida, 100% completo"
              value={formData.achievements}
              onChange={(e) => update("achievements", e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 font-medium">{error}</p>
          )}

          {updateGame.isError && (
            <p className="text-sm text-red-400 font-medium">
              Erro ao salvar. Tente novamente.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={updateGame.isPending}
            >
              <Save className="w-5 h-5" />
              {updateGame.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Link href={`/library/${game.id}`}>
              <Button type="button" variant="secondary" size="lg">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
