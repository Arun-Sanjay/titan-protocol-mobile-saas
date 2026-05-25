import { useEffect, useRef, useState } from "react";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { pullIfEmpty } from "../sync/first-run-pull";
import type { RestoreProgress } from "../sync/restore";
import { colors, fonts, spacing } from "../theme";

interface Props {
  userId: string;
  children: React.ReactNode;
}

/**
 * On the first sign-in for this device + this user, run `pullIfEmpty` to
 * restore the cloud snapshot into the local SQLite cache before rendering
 * children. Subsequent renders (cache populated) pass through immediately.
 *
 * Mirrors web's component — same logic, RN primitives instead of `<div>`.
 */
export function FirstRunPullGate({ userId, children }: Props) {
  const [status, setStatus] = useState<"checking" | "syncing" | "ready">(
    "checking",
  );
  const [progress, setProgress] = useState<RestoreProgress | null>(null);
  const ranForRef = useRef<string | null>(null);

  useEffect(() => {
    if (ranForRef.current === userId) return;
    ranForRef.current = userId;
    let cancelled = false;

    void (async () => {
      try {
        const { pulled } = await pullIfEmpty(userId, (p) => {
          if (!cancelled) {
            setStatus("syncing");
            setProgress(p);
          }
        });
        if (!cancelled) {
          void pulled;
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("ready");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (status === "syncing") return <PullSplash progress={progress} />;
  if (status === "checking") return null;
  return <>{children}</>;
}

function PullSplash({ progress }: { progress: RestoreProgress | null }) {
  const tablesTotal = progress?.tablesTotal ?? 0;
  const tablesDone = progress?.tablesCompleted ?? 0;
  const pct = tablesTotal ? Math.floor((tablesDone / tablesTotal) * 100) : 0;
  const currentTable = progress?.currentTable ?? "…";
  const rows = progress?.rowsDownloaded ?? 0;

  return (
    <View style={styles.root}>
      <Text style={styles.label}>SYNCING YOUR DATA</Text>
      <Text style={styles.headline}>Restoring from cloud · {pct}%</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.meta}>
        {currentTable} · {rows} rows
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    padding: spacing["2xl"],
  },
  label: {
    ...fonts.caption,
    color: colors.textMuted,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  headline: { ...fonts.body, color: colors.text },
  barTrack: {
    width: 320,
    maxWidth: "80%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: colors.accent },
  meta: { ...fonts.caption, color: colors.textMuted, letterSpacing: 1.5 },
});
