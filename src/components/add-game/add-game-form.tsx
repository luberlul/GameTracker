"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle, Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { RatingSelector } from "@/components/add-game/rating-selector";
import { PageHeader } from "@/components/shared/page-header";
import { SearchModal } from "@/components/igdb/search-modal";
import { PLATFORMS, STATUS_OPTIONS_FORM } from "@/lib/constants";
import type { GameImport } from "@/lib/igdb/types";
import type { HltbData } from "@/lib/hltb/types";
import { searchHltb } from "@/lib/hltb/client";
import { HltbTimesCard } from "@/components/hltb/hltb-times-card";
import { useCreateGame } from "@/hooks/use-games";

interface FormState {
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
  releaseYear: string;
  coverImage: string;
  bannerImage: string;
  igdbId: number | null;
}

const INITIAL: FormState = {
  title: "",
  platform: "",
  status: "backlog",
  overallRating: 0,
  storyRating: 0,
  gameplayRating: 0,
  soundtrackRating: 0,
  graphicsRating: 0,
  difficulty: 0,
  hoursPlayed: 0,
  minutesPlayed: 0,
  startDate: "",
  endDate: "",
  genre: "",
  notes: "",
  achievements: "",
  releaseYear: "",
  coverImage: "",
  bannerImage: "",
  igdbId: null,
};

function matchPlatform(imported: string[]): string {
  for (const name of imported) {
    const hit = PLATFORMS.find(
      (p) => p.toLowerCase() === name.toLowerCase(),
    );
    if (hit) return hit;
  }
  for (const name of imported) {
    const hit = PLATFORMS.find((p) =>
      name.toLowerCase().includes(p.toLowerCase()),
    );
    if (hit) return hit;
  }
  return "";
}

const COLORS = [
  "#8b5cf6", "#3b82f6", "#06b6d4", "#10b981",
  "#f59e0b", "#ec4899", "#ef4444", "#6366f1",
];
function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function AddGameForm() {
  const router = useRouter();
  const createGame = useCreateGame();
  const [formData, setFormData] = useState<FormState>(INITIAL);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hltbData, setHltbData] = useState<HltbData | null>(null);
  const [hltbLoading, setHltbLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (createGame.isSuccess) {
      router.push("/library");
    }
  }, [createGame.isSuccess, router]);

  const handleSubmit = async (e: FormEvent) => {
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

    createGame.mutate({
      title: formData.title.trim(),
      coverColor: randomColor(),
      coverImage: formData.coverImage || undefined,
      bannerImage: formData.bannerImage || undefined,
      status: formData.status,
      platform: formData.platform,
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
      releaseYear: formData.releaseYear || undefined,
      genre: genres,
      notes: formData.notes,
      achievements: formData.achievements,
      screenshots: [],
      igdbId: formData.igdbId ?? undefined,
      hltbId: hltbData?.id,
      hltbName: hltbData?.name,
      hltbImageUrl: hltbData?.imageUrl,
      hltbMainStory: hltbData?.mainStory,
      hltbMainExtra: hltbData?.mainExtra,
      hltbCompletionist: hltbData?.completionist,
    });
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setFormData((s) => ({ ...s, [key]: value }));

  const applyIgdbImport = (game: GameImport) => {
    setFormData((s) => ({
      ...s,
      title: game.name,
      platform: matchPlatform(game.platforms) || s.platform,
      genre: game.genres.join(", "),
      notes: game.description.slice(0, 600),
      releaseYear: game.releaseYear ? String(game.releaseYear) : "",
      coverImage: game.cover ?? "",
      bannerImage: game.banner ?? "",
      igdbId: game.id,
    }));
    setHltbData(null);
    setHltbLoading(true);
    searchHltb(game.name)
      .then((data) => setHltbData(data))
      .catch(() => {})
      .finally(() => setHltbLoading(false));
  };

  const clearIgdbImport = () => {
    setFormData((s) => ({
      ...s,
      coverImage: "",
      bannerImage: "",
      igdbId: null,
      releaseYear: "",
    }));
    setHltbData(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Adicionar Jogo"
        description="Registre um novo jogo na sua coleção"
        icon={PlusCircle}
      />

      <Card glass className="!p-0 overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border-b border-border">
          <div className="flex-1">
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Importar do IGDB
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Busque um jogo pelo nome e preencha o formulário automaticamente.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={() => setSearchOpen(true)}
          >
            <Sparkles className="w-4 h-4" />
            Buscar no IGDB
          </Button>
        </div>
      </Card>

      {formData.igdbId !== null && (
        <IgdbImportPreview
          title={formData.title}
          coverImage={formData.coverImage}
          bannerImage={formData.bannerImage}
          releaseYear={formData.releaseYear}
          onClear={clearIgdbImport}
        />
      )}

      {(hltbLoading || hltbData) && (
        <Card glass>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold">HowLongToBeat</span>
            {hltbLoading && (
              <span className="text-xs text-muted-foreground animate-pulse">
                buscando tempos de conclusão...
              </span>
            )}
          </div>
          {hltbData && <HltbTimesCard hltb={hltbData} compact />}
        </Card>
      )}

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
                Plataforma *
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
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [color-scheme:dark]"
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
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all [color-scheme:dark]"
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

          {createGame.isError && (
            <p className="text-sm text-red-400 font-medium">
              Erro ao salvar o jogo. Tente novamente.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={createGame.isPending}
            >
              <PlusCircle className="w-5 h-5" />
              {createGame.isPending ? "Salvando..." : "Adicionar Jogo"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => {
                setFormData(INITIAL);
                setHltbData(null);
              }}
            >
              Limpar
            </Button>
          </div>
        </form>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-accent/30 border border-border rounded-xl p-4"
      >
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> Preencha o máximo de informações possível para
          ter estatísticas mais precisas. Você pode editar os dados depois.
        </p>
      </motion.div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onImport={applyIgdbImport}
      />
    </div>
  );
}

interface IgdbImportPreviewProps {
  title: string;
  coverImage: string;
  bannerImage: string;
  releaseYear: string;
  onClear: () => void;
}

function IgdbImportPreview({
  title,
  coverImage,
  bannerImage,
  releaseYear,
  onClear,
}: IgdbImportPreviewProps) {
  const banner = bannerImage || coverImage;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-xl overflow-hidden border border-primary/30 bg-card"
    >
      <div className="relative h-32">
        {banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/70 to-transparent" />
        <button
          type="button"
          onClick={onClear}
          aria-label="Remover importação"
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute inset-0 p-4 flex items-end gap-3">
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt=""
              className="w-16 h-20 rounded-md object-cover ring-1 ring-border shadow-lg"
            />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold">
              <Sparkles className="w-3 h-3" />
              Importado do IGDB
            </div>
            <p className="font-bold truncate">{title}</p>
            {releaseYear && (
              <p className="text-xs text-muted-foreground">{releaseYear}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
