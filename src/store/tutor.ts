"use client";

import { create } from "zustand";
import { askTutor, type ChatMessage, type TutorContext } from "@/lib/tutor";

type TutorState = {
  open: boolean;
  typing: boolean;
  context: TutorContext | null;
  messages: ChatMessage[];
  setOpen: (o: boolean) => void;
  /** Point the tutor at a problem; resets the thread when the problem changes */
  focus: (ctx: TutorContext) => void;
  send: (text: string) => Promise<void>;
};

let n = 0;
const msg = (role: ChatMessage["role"], text: string): ChatMessage => ({ id: `m${++n}`, role, text });

export const useTutor = create<TutorState>((set, get) => ({
  open: false,
  typing: false,
  context: null,
  messages: [],
  setOpen: (open) => set({ open }),
  focus: (ctx) => {
    if (get().context?.problem === ctx.problem) return;
    set({ context: ctx, messages: [msg("assistant", "Hi! I'm MathCopilot. I won't give answers, but I'll ask the questions that get you there. What have you tried so far?")] });
  },
  send: async (text) => {
    const { context, messages } = get();
    if (!context || !text.trim()) return;
    const history = [...messages, msg("user", text.trim())];
    set({ messages: history, typing: true, open: true });
    const reply = await askTutor(context, history, text.trim());
    // ignore the reply if the user switched problems while we were "thinking"
    if (get().context !== context) return set({ typing: false });
    set({ messages: [...get().messages, msg("assistant", reply)], typing: false });
  },
}));
