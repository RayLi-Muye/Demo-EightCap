import { Eye, ScanLine } from "lucide-react-native";
import { Text, View, useWindowDimensions } from "react-native";

import { accountSummary, homeCurve } from "@/data/portfolio";
import { colors, spacing } from "@/design/theme";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/utils/format";

import { Sparkline } from "./sparkline";

export function HomeValueChart() {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width, 520);

  return (
    <View style={{ gap: spacing.xl, marginHorizontal: -spacing.lg }}>
      <View style={{ gap: spacing.md, paddingHorizontal: spacing.lg }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: spacing.md }}>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text selectable style={{ color: colors.ink, fontSize: 26, fontWeight: "900", lineHeight: 31 }}>
              欢迎回来!{"\n"}现金及持有物
            </Text>
            <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm }}>
              <Text
                selectable
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ color: colors.ink, fontSize: 48, fontVariant: ["tabular-nums"], fontWeight: "900", letterSpacing: 0 }}
              >
                {formatCurrency(accountSummary.totalValue)}
              </Text>
              <Eye color={colors.muted} size={22} strokeWidth={2.3} />
            </View>
            <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm }}>
              <Text selectable style={{ color: colors.negative, fontSize: 18, fontVariant: ["tabular-nums"], fontWeight: "700" }}>
                {formatSignedCurrency(accountSummary.totalChange)} ({formatPercent(accountSummary.totalChangePercent)})
              </Text>
              <Text selectable style={{ color: colors.ink, fontSize: 18, fontWeight: "700" }}>
                今日
              </Text>
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              borderColor: colors.line,
              borderRadius: 10,
              borderWidth: 1,
              height: 38,
              justifyContent: "center",
              marginTop: 42,
              width: 38,
            }}
          >
            <ScanLine color={colors.muted} size={22} strokeWidth={2.1} />
          </View>
        </View>
      </View>

      <View style={{ height: 210, width: "100%" }}>
        <Sparkline
          values={homeCurve}
          color={colors.brandAction}
          fillArea
          height={210}
          width={chartWidth}
          showDot={false}
          showGuide={false}
        />
      </View>
    </View>
  );
}
