import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PageHeader } from "../../src/components/ui/PageHeader";
import { Panel } from "../../src/components/ui/Panel";
import { colors, fonts, spacing } from "../../src/theme";

export default function HQScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <PageHeader
          kicker="DAY 1 · STANDING BY"
          title="HQ"
          subtitle="Your daily command surface. Dashboard lights up in M4."
        />
        <Panel>
          <Text style={styles.panelKicker}>MILESTONE STATUS</Text>
          <Text style={styles.panelTitle}>M1 — Foundations</Text>
          <Text style={styles.panelBody}>
            Auth, navigation, and design tokens are live. Data layer and
            real screens land in M2 + M4.
          </Text>
        </Panel>
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, gap: spacing.lg },
  panelKicker: {
    ...fonts.kicker,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  panelTitle: {
    ...fonts.body,
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  panelBody: { ...fonts.body, color: colors.textSecondary, lineHeight: 20 },
  spacer: { height: spacing.xl },
});
