import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
 * Schedules an invalidation of the "currentShow" query exactly at the top
 * of each hour, then re-schedules itself for the next hour.
 */
export function useHourlyShowRefresh() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      timeoutId = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["currentShow"] });
        scheduleNext();
      }, msUntilNextHour());
    }

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [queryClient]);
}

export function useCurrentShow() {
  const { actor, isFetching } = useActor();
  return useQuery<Show | null>({
    queryKey: ["currentShow"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCurrentShow();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: false,
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
