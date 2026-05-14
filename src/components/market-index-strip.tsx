import { ScrollView, Text, View } from "react-native";

import { marketIndexes } from "@/data/portfolio";
import { colors, spacing } from "@/design/theme";
import { formatPercent, formatPrice } from "@/utils/format";

export function MarketIndexStrip() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg }}>
      <View style={{ flexDirection: "row" }}>
        {marketIndexes.map((index) => (
          <View
            key={index.symbol}
            style={{
              borderLeftColor: colors.line,
              borderLeftWidth: 1,
              gap: 2,
              minWidth: 130,
              paddingHorizontal: spacing.xl,
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
      </View>
    </ScrollView>
  );
}
