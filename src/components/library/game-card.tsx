"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";
import type { Game } from "@/lib/data/games";
import { GameCover } from "@/components/shared/game-cover";
import { STATUS_COLORS, STATUS_LABELS_SHORT } from "@/lib/constants";

interface GameCardProps {
  game: Game;
  index?: number;
}

export function GameCard({ game, index = 0 }: GameCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.02 }}
    >
      <Link href={`/library/${game.id}`} className="group block">
        <div className="relative">
          <GameCover
            title={game.title}
            coverColor={game.coverColor}
            coverImage={game.coverImage}
            className="aspect-[3/4] mb-3"
          >
            <div className="absolute top-3 left-3">
              <div
                className={`${STATUS_COLORS[game.status]} px-2 py-1 rounded-lg text-xs font-medium text-white shadow-lg`}
              >
                {STATUS_LABELS_SHORT[game.status]}
              </div>
            </div>

            {game.overallRating > 0 && (
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">
                  {game.overallRating}
                </span>
              </div>
            )}

            {game.hoursPlayed > 0 && (
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  {game.hoursPlayed}h
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-primary transition-all duration-300 rounded-xl" />
          </GameCover>

          <h4 className="font-semibold mb-1 truncate group-hover:text-primary transition-colors">
            {game.title}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {game.platform}
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {game.genre.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs px-2 py-0.5 rounded bg-accent text-accent-foreground"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
