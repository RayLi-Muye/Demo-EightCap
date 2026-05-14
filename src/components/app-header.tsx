import { Bell, ChevronDown, Menu, Search } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { colors, radius, spacing } from "@/design/theme";

type AppHeaderProps = {
  searchPlaceholder?: string;
  centerLabel?: string;
  centerSubLabel?: string;
  rewardLabel?: string;
};

function IconButton({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={12}
      style={({ pressed }) => ({
        alignItems: "center",
        height: 44,
        justifyContent: "center",
        opacity: pressed ? 0.55 : 1,
        width: 44,
      })}
    >
      {children}
    </Pressable>
  );
}

export function AppHeader({ searchPlaceholder, centerLabel, centerSubLabel, rewardLabel }: AppHeaderProps) {
  return (
    <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.md }}>
      <IconButton label="Open menu">
        <Menu color={colors.muted} size={30} strokeWidth={2.4} />
      </IconButton>

      <View style={{ alignItems: "center", flex: 1, justifyContent: "center", minHeight: 44, minWidth: 0 }}>
        {searchPlaceholder ? (
          <View
            style={{
              alignItems: "center",
              backgroundColor: colors.surfaceAlt,
              borderRadius: radius.md,
              flex: 1,
              flexDirection: "row",
              gap: spacing.sm,
              height: 54,
              paddingHorizontal: spacing.md,
              width: "100%",
            }}
          >
            <Search color={colors.muted} size={25} strokeWidth={2.3} />
            <Text style={{ color: colors.subtle, fontSize: 20, fontWeight: "600" }}>{searchPlaceholder}</Text>
          </View>
        ) : centerLabel ? (
          <View style={{ alignItems: "center", gap: 2 }}>
            <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.xs }}>
              <Text selectable style={{ color: colors.ink, fontSize: 20, fontVariant: ["tabular-nums"], fontWeight: "700" }}>
                {centerLabel}
              </Text>
              <View
                style={{
                  alignItems: "center",
                  borderColor: colors.line,
                  borderRadius: radius.xs,
                  borderWidth: 1,
                  height: 20,
                  justifyContent: "center",
                  width: 24,
                }}
              >
                <ChevronDown color={colors.subtle} size={13} strokeWidth={2.4} />
              </View>
            </View>
            {centerSubLabel ? (
              <Text selectable style={{ color: colors.negative, fontSize: 13, fontVariant: ["tabular-nums"], fontWeight: "700" }}>
                {centerSubLabel}
              </Text>
            ) : null}
          </View>
        ) : rewardLabel ? (
          <View
            style={{
              alignItems: "center",
              borderColor: colors.brandAction,
              borderRadius: radius.full,
              borderWidth: 1,
              paddingHorizontal: spacing.lg,
              paddingVertical: 5,
            }}
          >
            <Text selectable style={{ color: colors.brandAction, fontSize: 18, fontWeight: "900" }}>
              {rewardLabel}
            </Text>
          </View>
        ) : null}
      </View>

      <IconButton label="Open notifications">
        <View>
          <Bell color={colors.ink} fill={colors.ink} size={26} strokeWidth={2.3} />
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#cf241b",
              borderColor: colors.surface,
              borderRadius: radius.full,
              borderWidth: 2,
              height: 24,
              justifyContent: "center",
              position: "absolute",
              right: -8,
              top: -9,
              width: 24,
            }}
          >
            <Text style={{ color: colors.inverse, fontSize: 13, fontWeight: "900" }}>1</Text>
          </View>
        </View>
      </IconButton>
    </View>
  );
}
