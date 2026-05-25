import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import { subscribeUserChanges } from "../sync/realtime";

/**
 * Opens the Supabase Realtime channel for the signed-in user. Subscribes
 * to INSERT / UPDATE / DELETE on every synced table, applies each event
 * to local SQLite, and invalidates the matching React Query keys.
 *
 * Mount inside the authenticated tree so it can `useQueryClient()`.
 * Teardown fires automatically on sign-out (the `userId` dep changes
 * back to undefined and the cleanup closes the channel).
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const teardown = subscribeUserChanges(userId, queryClient);
    return teardown;
  }, [userId, queryClient]);

  return <>{children}</>;
}
