"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  catalog,
  nextThemeName,
  PULLS_TO_DRAWER,
  ROOM_PULLS_KEY,
  ROOM_STORAGE_KEY,
  ROOM_UNLOCK_KEY,
} from "@/lib/theme";
import { RoomDrawer } from "@/components/chrome/RoomDrawer";

/* ============================================================================
   THEME ROOT
   ----------------------------------------------------------------------------
   site.json still decides the first paint. After that the plumb can change
   the room, and the choice is remembered. The fifth pull opens the drawer
   that was always there — every palette in theme.json, nothing invented.
   ========================================================================= */

type ThemeApi = {
  name: string;
  pulls: number;
  unlocked: boolean;
  drawerOpen: boolean;
  pull: () => void;
  choose: (name: string) => void;
  closeDrawer: () => void;
};

const ThemeContext = createContext<ThemeApi | null>(null);

export function useRoomTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useRoomTheme must sit inside ThemeRoot");
  }
  return value;
}

export function ThemeRoot({
  initialName,
  children,
}: {
  initialName: string;
  children: ReactNode;
}) {
  const [name, setName] = useState(initialName);
  const [pulls, setPulls] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pullsRef = useRef(0);

  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(ROOM_STORAGE_KEY);
      if (stored && catalog.some((theme) => theme.name === stored)) {
        applyTheme(stored);
        setName(stored);
      }
      setUnlocked(localStorage.getItem(ROOM_UNLOCK_KEY) === "1");
      const storedPulls = Number(sessionStorage.getItem(ROOM_PULLS_KEY) || "0") || 0;
      pullsRef.current = storedPulls;
      setPulls(storedPulls);
    } catch {
      /* ignore */
    }
  }, []);

  const choose = useCallback((next: string) => {
    const theme = applyTheme(next);
    setName(theme.name);
  }, []);

  const pull = useCallback(() => {
    setName((current) => {
      const next = nextThemeName(current);
      applyTheme(next);
      return next;
    });

    const next = pullsRef.current + 1;
    pullsRef.current = next;
    setPulls(next);
    try {
      sessionStorage.setItem(ROOM_PULLS_KEY, String(next));
    } catch {
      /* ignore */
    }

    const shouldOpen = next === PULLS_TO_DRAWER || next % PULLS_TO_DRAWER === 0;
    if (shouldOpen) {
      setUnlocked(true);
      setDrawerOpen(true);
      try {
        localStorage.setItem(ROOM_UNLOCK_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }, []);

  const value = useMemo<ThemeApi>(
    () => ({
      name,
      pulls,
      unlocked,
      drawerOpen,
      pull,
      choose,
      closeDrawer: () => setDrawerOpen(false),
    }),
    [name, pulls, unlocked, drawerOpen, pull, choose],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <RoomDrawer
        open={drawerOpen}
        current={name}
        pulls={pulls}
        onChoose={choose}
        onClose={() => setDrawerOpen(false)}
      />
    </ThemeContext.Provider>
  );
}
