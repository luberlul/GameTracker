"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { useRawgSearch } from "@/hooks/use-rawg";
import type { GameSuggestion } from "@/lib/rawg/types";
import { SearchResults } from "./search-results";
import { GamePreviewDialog } from "./game-preview-dialog";
import type { GameImport } from "@/lib/rawg/types";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (game: GameImport) => void;
}

export function SearchModal({ open, onClose, onImport }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<GameSuggestion | null>(null);

  const search = useRawgSearch(debouncedQuery);

  // Auto-focus input when the modal opens; reset state when it closes
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
    setQuery("");
    setSelected(null);
  }, [open]);

  const isPending = query !== debouncedQuery && query.trim().length >= 2;

  return (
    <>
      <Dialog
        open={open && !selected}
        onClose={onClose}
        title="Importar do RAWG"
        description="Busque um jogo na maior base de dados gamer e importe automaticamente."
        size="lg"
      >
        <div className="p-6 space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Cyberpunk 2077, Hollow Knight, Elden Ring…"
              className="w-full bg-input-background border border-border rounded-lg pl-10 pr-10 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              autoComplete="off"
              spellCheck={false}
            />
            {(isPending || search.isFetching) && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-1 -mr-1">
            <SearchResults
              query={debouncedQuery}
              results={search.data}
              isLoading={search.isLoading && search.fetchStatus !== "idle"}
              isFetching={search.isFetching}
              error={(search.error as Error | null) ?? null}
              onSelect={setSelected}
            />
          </div>
        </div>
      </Dialog>

      <GamePreviewDialog
        suggestion={selected}
        onBack={() => setSelected(null)}
        onConfirm={(imported) => {
          onImport(imported);
          setSelected(null);
          onClose();
        }}
      />
    </>
  );
}
