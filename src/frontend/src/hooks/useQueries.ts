import { useQuery } from "@tanstack/react-query";
import type { DJ, Show } from "../backend.d";
import { useActor } from "./useActor";

export function useCurrentShow() {
  const { actor, isFetching } = useActor();
  return useQuery<Show | null>({
    queryKey: ["currentShow"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCurrentShow();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
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
  return useQuery<DJ[]>({
    queryKey: ["djs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDJs();
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
