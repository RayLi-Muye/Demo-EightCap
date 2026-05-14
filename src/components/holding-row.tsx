import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { Holding } from "@/data/portfolio";
import { colors, radius, spacing } from "@/design/theme";
import { formatCurrency, formatPercent, formatPrice, formatSignedCurrency } from "@/utils/format";

import { AssetLogo } from "./asset-logo";

type HoldingRowProps = {
  holding: Holding;
};

export function HoldingRow({ holding }: HoldingRowProps) {
  const router = useRouter();
  const movementColor = holding.changePercent >= 0 ? colors.positive : colors.negative;
  const pnlColor = holding.pnl >= 0 ? colors.positive : colors.negative;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${holding.symbol}`}
      onPress={() => router.push({ pathname: "/instrument/[symbol]", params: { symbol: holding.symbol } })}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderBottomColor: colors.line,
        borderBottomWidth: 1,
        height: 96,
        opacity: pressed ? 0.72 : 1,
        position: "relative",
      })}
    >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: spacing.sm,
            left: spacing.lg,
            minWidth: 0,
            position: "absolute",
            top: 18,
            width: 150,
          }}
        >
          <AssetLogo background={holding.logoBackground} color={holding.logoColor} label={holding.logoLabel} size={42} />
          <View style={{ minWidth: 0, width: 98 }}>
            <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.xs }}>
              <Text selectable numberOfLines={1} style={{ color: colors.ink, flexShrink: 1, fontSize: 17, fontWeight: "900" }}>
                {holding.symbol}
              </Text>
              <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: radius.full, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text selectable style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>
                  {holding.dateLabel}
                </Text>
              </View>
            </View>
            <Text selectable style={{ color: colors.ink, fontSize: 15, fontVariant: ["tabular-nums"], fontWeight: "600" }}>
              {formatPrice(holding.price)}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end", justifyContent: "center", left: 166, position: "absolute", top: 36, width: 56 }}>
          <Text selectable numberOfLines={1} adjustsFontSizeToFit style={{ color: movementColor, fontSize: 15, fontVariant: ["tabular-nums"], fontWeight: "700" }}>
            {formatPercent(holding.changePercent)}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end", justifyContent: "center", left: 222, position: "absolute", top: 36, width: 76 }}>
          <Text selectable numberOfLines={1} adjustsFontSizeToFit style={{ color: pnlColor, fontSize: 13, fontVariant: ["tabular-nums"], fontWeight: "700" }}>
            {formatSignedCurrency(holding.pnl)}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end", justifyContent: "center", left: 298, position: "absolute", top: 36, width: 76 }}>
          <Text selectable numberOfLines={1} adjustsFontSizeToFit style={{ color: colors.ink, fontSize: 13, fontVariant: ["tabular-nums"], fontWeight: "700" }}>
            {formatCurrency(holding.value)}
          </Text>
        </View>
    </Pressable>
  );
}
