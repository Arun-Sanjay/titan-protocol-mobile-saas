import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import { PageHeader } from "../../src/components/ui/PageHeader";
import { Panel } from "../../src/components/ui/Panel";
import { colors, fonts, radius, spacing } from "../../src/theme";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { logError } from "../../src/lib/error-log";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBusy(true);
    try {
      await signOut();
    } catch (e) {
      logError("profile.signOut", e);
      Alert.alert("Sign-out failed", "Try again.");
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <PageHeader
          kicker="OPERATOR"
          title="Profile"
          subtitle="Account, settings, and sign-out."
        />

        <Panel>
          <Text style={styles.kicker}>SIGNED IN AS</Text>
          <Text style={styles.email}>{user?.email ?? "—"}</Text>
          <Text style={styles.userId}>id: {user?.id?.slice(0, 8) ?? "—"}…</Text>
        </Panel>

        <Panel>
          <Text style={styles.kicker}>SETTINGS</Text>
          <Text style={styles.body}>
            Theme, notifications, data tools, and account deletion arrive in M5.
          </Text>
        </Panel>

        <Pressable
          onPress={handleSignOut}
          disabled={busy}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.buttonPressed,
            busy && styles.buttonDisabled,
          ]}
        >
          {busy ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <View style={styles.signOutInner}>
              <Ionicons name="log-out-outline" size={18} color={colors.text} />
              <Text style={styles.signOutText}>Sign out</Text>
            </View>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, gap: spacing.lg },
  kicker: {
    ...fonts.kicker,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  email: {
    ...fonts.body,
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  userId: { ...fonts.small, color: colors.textMuted, fontSize: 11 },
  body: { ...fonts.body, color: colors.textSecondary, lineHeight: 20 },
  signOutButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  signOutInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  signOutText: { ...fonts.caption, color: colors.text, fontSize: 14 },
  buttonPressed: { opacity: 0.7 },
  buttonDisabled: { opacity: 0.5 },
});
