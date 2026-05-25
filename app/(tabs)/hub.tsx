import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PageHeader } from "../../src/components/ui/PageHeader";
import { Panel } from "../../src/components/ui/Panel";
import { colors, fonts, spacing } from "../../src/theme";

export default function HubScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <PageHeader
          kicker="DEEP UTILITIES"
          title="Hub"
          subtitle="Focus, journal, analytics, money, nutrition."
        />
        <Panel>
          <Text style={styles.panelBody}>
            Sub-tools come online in M5.
          </Text>
        </Panel>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, gap: spacing.lg },
  panelBody: { ...fonts.body, color: colors.textSecondary, lineHeight: 20 },
});
