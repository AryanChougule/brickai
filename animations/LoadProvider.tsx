"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface LoadState {
  /** True once nothing is covering the page — entrance animations may start. */
  ready: boolean;
  markReady: () => void;
}

const LoadContext = createContext<LoadState>({
  ready: true,
  markReady: () => {},
});

/**
 * Gates entrance animations behind the preloader, so the hero headline and the
 * WebGL scene start together rather than mid-way through the load.
 *
 * `ready` is *derived* from `active`, not seeded from it. Seeding state from a
 * prop captures only the first render, and `active` is necessarily resolved in
 * an effect (it depends on sessionStorage) — so a seeded version would latch
 * open and the preloader would never appear.
 */
export function LoadProvider({
  children,
  /** True while a preloader is on screen and owning the viewport. */
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  const [finished, setFinished] = useState(false);
  const markReady = useCallback(() => setFinished(true), []);

  const ready = !active || finished;
  const value = useMemo(() => ({ ready, markReady }), [ready, markReady]);

  return <LoadContext.Provider value={value}>{children}</LoadContext.Provider>;
}

export function useLoadState() {
  return useContext(LoadContext);
}
