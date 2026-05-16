import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import type { EquityAsset } from "@/data/portfolio";
import type { PricePulse } from "@/hooks/use-live-market";
import { colors, radius, spacing } from "@/design/theme";
import { formatPercent, formatPrice } from "@/utils/format";

import { AssetLogo } from "./asset-logo";

type WatchlistQuoteRowProps = {
  asset: EquityAsset;
  hotSide?: "bid" | "ask";
  pulse?: PricePulse;
};

export function WatchlistQuoteRow({ asset, hotSide, pulse }: WatchlistQuoteRowProps) {
  const flash = useSharedValue(0);
  const scale = useSharedValue(1);
  const positive = asset.changePercent >= 0;
  const movementColor = positive ? colors.positive : colors.negative;

  useEffect(() => {
    if (!pulse) {
      return;
    }

    flash.value = withSequence(
      withTiming(1, { duration: 90 }),
      withDelay(430, withTiming(0, { duration: 260 })),
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
    <Link asChild href={{ pathname: "/instrument/[symbol]", params: { symbol: asset.symbol } }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${asset.symbol}`}
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
          minHeight: 78,
          position: "relative",
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: pulse?.direction === "down" ? "rgba(255,47,61,0.14)" : "rgba(13,187,79,0.14)",
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
                  <AssetLogo background={asset.logoBackground} color={asset.logoColor} label={asset.logoLabel} size={40} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text selectable numberOfLines={1} style={{ color: colors.ink, fontSize: 18, fontWeight: "600" }}>
                      {asset.symbol}
                    </Text>
                    <Text selectable numberOfLines={1} style={{ color: colors.muted, fontSize: 12, fontWeight: "500" }}>
                      {asset.name}
                    </Text>
                    <Text selectable numberOfLines={1} style={{ color: movementColor, fontSize: 13, fontVariant: ["tabular-nums"], fontWeight: "500" }}>
                      {formatPercent(asset.changePercent)}
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 1.12, flexDirection: "row", gap: spacing.sm, minWidth: 0 }}>
                  {(["bid", "ask"] as const).map((side) => (
                    <View
                      key={side}
                      style={{
                        alignItems: "center",
                        backgroundColor: colors.surfaceAlt,
                        borderRadius: radius.sm,
                        flex: 1,
                        justifyContent: "center",
                        minHeight: 48,
                        minWidth: 0,
                        overflow: "hidden",
                        paddingHorizontal: spacing.xs,
                      }}
                    >
                      {hotSide === side ? (
                        <Animated.View
                          style={[
                            {
                              backgroundColor: positive ? "rgba(13,187,79,0.9)" : "rgba(255,47,61,0.9)",
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
                      ) : null}
                      <Text
                        selectable
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={{
                          color: colors.ink,
                          fontSize: 15,
                          fontVariant: ["tabular-nums"],
                          fontWeight: "600",
                        }}
                      >
                        {formatPrice(side === "bid" ? asset.bid : asset.ask)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          </View>
        </Link.AppleZoom>
      </Pressable>
    </Link>
  );
}
