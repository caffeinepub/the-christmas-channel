import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { DJ as DJExtended, Show } from "../backend.d";
import { useActor } from "./useActor";

/** Re-export the extended DJ type for consumers */
export type { DJExtended as DJ };

/** Returns ms until the next top-of-hour tick */
function msUntilNextHour(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(next.getHours() + 1, 0, 0, 0);
  return next.getTime() - now.getTime();
}

/**
 * Returns a value that increments every hour on the hour.
 * Used as a query key so React Query re-fetches exactly at the top of each hour.
 */
export function useHourTick(): number {
  const [tick, setTick] = useState(() => new Date().getHours());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      timeoutId = setTimeout(() => {
        setTick(new Date().getHours());
        scheduleNext();
      }, msUntilNextHour());
    }

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  return tick;
}

export function useCurrentShow() {
  const { actor, isFetching } = useActor();
  const hourTick = useHourTick();
  return useQuery<Show | null>({
    queryKey: ["currentShow", hourTick],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCurrentShow();
    },
    enabled: !!actor && !isFetching,
    // Stale after 1 hour; refetch at the next top-of-hour via queryKey change.
    staleTime: 60 * 60 * 1000,
  });
}

export function useSchedule() {
  const { actor, isFetching } = useActor();
  return useQuery<Show[]>({
    queryKey: ["schedule"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShows();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDJs() {
  const { actor, isFetching } = useActor();
  return useQuery<DJExtended[]>({
    queryKey: ["djs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDJs() as unknown as Promise<DJExtended[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
