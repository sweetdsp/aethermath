"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LastLesson = { topic: string; lesson: string; title: string };

type ProgressState = {
  xp: number;
  streak: number;
  lastActiveDay: string | null;
  last: LastLesson | null;
  completed: Record<string, boolean>;
  soundOn: boolean;
  visit: (l: LastLesson) => void;
  addXp: (n: number) => void;
  toggleSound: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) =>
  Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastActiveDay: null,
      last: null,
      completed: {},
      soundOn: false,
      visit: (l) => set({ last: l }),
      addXp: (n) => {
        const { lastActiveDay, streak, xp } = get();
        const t = today();
        let next = streak;
        if (lastActiveDay !== t) {
          next = lastActiveDay && daysBetween(lastActiveDay, t) === 1 ? streak + 1 : 1;
        }
        set({ xp: xp + n, streak: next, lastActiveDay: t });
      },
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
    }),
    { name: "aethermath-progress", skipHydration: true },
  ),
);
