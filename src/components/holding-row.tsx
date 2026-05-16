import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from "react-native-reanimated";

import type { Holding } from "@/data/portfolio";
import type { PricePulse } from "@/hooks/use-live-market";
import { colors, spacing } from "@/design/theme";
import { formatCurrency, formatPercent, formatPrice } from "@/utils/format";

import { AssetLogo } from "./asset-logo";

type HoldingRowProps = {
  holding: Holding;
  pulse?: PricePulse;
};

export function HoldingRow({ holding, pulse }: HoldingRowProps) {
  const flash = useSharedValue(0);
  const scale = useSharedValue(1);
  const movementColor = holding.changePercent >= 0 ? colors.positive : colors.negative;
  const pnlColor = holding.pnl >= 0 ? colors.positive : colors.negative;

  useEffect(() => {
    if (!pulse) {
      return;
    }

    flash.value = withSequence(
      withTiming(1, { duration: 90 }),
      withDelay(360, withTiming(0, { duration: 260 })),
    );
  }, [flash, pulse]);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value,
  }));

  const pressStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Link asChild href={{ pathname: "/instrument/[symbol]", params: { symbol: holding.symbol } }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${holding.symbol}`}
        onPressIn={() => {
          Haptics.selectionAsync().catch(() => {});
          scale.value = withSpring(0.985, { damping: 18, stiffness: 260 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 16, stiffness: 240 });
        }}
        style={{
          backgroundColor: colors.surface,
          borderBottomColor: colors.line,
          borderBottomWidth: 1,
          minHeight: 76,
          position: "relative",
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: pulse?.direction === "down" ? "rgba(255,47,61,0.12)" : "rgba(13,187,79,0.12)",
              bottom: 0,
              left: 0,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              top: 0,
            },
            flashStyle,
          ]}
        />
        <Link.AppleZoom>
          <View style={{ flex: 1 }}>
            <Animated.View style={pressStyle}>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  gap: spacing.sm,
                  minWidth: 0,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                }}
              >
                <View style={{ alignItems: "center", flex: 1, flexDirection: "row", gap: spacing.sm, minWidth: 0 }}>
                  <AssetLogo background={holding.logoBackground} color={holding.logoColor} label={holding.logoLabel} size={32} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text selectable numberOfLines={1} style={{ color: colors.ink, fontSize: 18, fontWeight: "600" }}>
                      {holding.symbol}
                    </Text>
                    <Text selectable numberOfLines={1} style={{ color: colors.muted, fontSize: 12, fontVariant: ["tabular-nums"], fontWeight: "500" }}>
                      {formatPrice(holding.price)}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    flexShrink: 0,
                    justifyContent: "flex-end",
                    width: 232,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ color: movementColor, fontSize: 12, fontVariant: ["tabular-nums"], fontWeight: "600", textAlign: "right", width: 52 }}
                  >
                    {formatPercent(holding.changePercent)}
                  </Text>
                  <Text style={{ color: colors.line, fontSize: 14, fontWeight: "500", textAlign: "center", width: 6 }}>|</Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ color: pnlColor, fontSize: 12, fontVariant: ["tabular-nums"], fontWeight: "600", textAlign: "right", width: 82 }}
                  >
                    {formatCurrency(holding.pnl)}
                  </Text>
                  <Text style={{ color: colors.line, fontSize: 14, fontWeight: "500", textAlign: "center", width: 6 }}>|</Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ color: colors.ink, fontSize: 12, fontVariant: ["tabular-nums"], fontWeight: "600", textAlign: "right", width: 86 }}
                  >
                    {formatCurrency(holding.value)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </Link.AppleZoom>
      </Pressable>
    </Link>
  );
}
