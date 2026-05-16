import type { ReactNode } from "react";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { colors, spacing } from "@/design/theme";

type PinnedAppHeaderScreenProps = {
  children: ReactNode;
};

export function PinnedAppHeaderScreen({ children }: PinnedAppHeaderScreenProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const horizontalPadding = isWide ? spacing.xl : spacing.lg;
  const headerHeight = insets.top + 72;

  return (
    <View style={{ backgroundColor: colors.canvas, flex: 1 }}>
      <View
        style={{
          backgroundColor: "rgba(245,248,244,0.88)",
          borderBottomColor: "rgba(230,234,240,0.42)",
          borderBottomWidth: 1,
          left: 0,
          paddingBottom: spacing.sm,
          paddingHorizontal: horizontalPadding,
          paddingTop: insets.top + spacing.sm,
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 20,
        }}
      >
        <View style={{ alignSelf: "center", maxWidth: isWide ? 820 : undefined, width: "100%" }}>
          <AppHeader />
        </View>
      </View>

      <View style={{ flex: 1, paddingTop: headerHeight }}>{children}</View>
    </View>
  );
}
