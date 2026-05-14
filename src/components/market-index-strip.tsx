import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { marketIndexes } from "@/data/portfolio";
import { useLiveIndexes } from "@/hooks/use-live-market";
import { colors, spacing } from "@/design/theme";
import { formatPercent, formatPrice } from "@/utils/format";

const ITEM_WIDTH = 144;

export function MarketIndexStrip() {
  const indexes = useLiveIndexes(marketIndexes);
  const translateX = useSharedValue(0);
  const trackWidth = indexes.length * ITEM_WIDTH;

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-trackWidth, { duration: 18000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [trackWidth, translateX]);

  const tickerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const tickerItems = [...indexes, ...indexes, ...indexes];

  return (
    <View style={{ marginHorizontal: -spacing.lg, overflow: "hidden", paddingVertical: spacing.xs }}>
      <Animated.View style={[{ flexDirection: "row", paddingLeft: spacing.lg }, tickerStyle]}>
        {tickerItems.map((index, itemIndex) => (
          <View
            key={`${index.symbol}-${itemIndex}`}
            style={{
              borderLeftColor: colors.line,
              borderLeftWidth: 1,
              minWidth: ITEM_WIDTH,
              gap: 2,
              paddingHorizontal: spacing.lg,
            }}
          >
            <Text selectable style={{ color: colors.muted, fontSize: 14, fontWeight: "900" }}>
              {index.symbol}
            </Text>
            <Text selectable style={{ color: colors.ink, fontSize: 23, fontVariant: ["tabular-nums"], fontWeight: "900" }}>
              {formatPrice(index.value)}
            </Text>
            <Text selectable style={{ color: colors.positive, fontSize: 16, fontVariant: ["tabular-nums"], fontWeight: "700" }}>
              {formatPercent(index.changePercent)}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
