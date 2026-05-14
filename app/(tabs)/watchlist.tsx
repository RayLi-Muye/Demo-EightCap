import { ChevronDown, EllipsisVertical, Plus, SlidersHorizontal } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { ScreenScroll } from "@/components/screen-scroll";
import { WatchlistQuoteRow } from "@/components/watchlist-quote-row";
import { watchlistAssets } from "@/data/portfolio";
import { colors, radius, shadows, spacing } from "@/design/theme";

const chips = ["全部", "我的投资组合", "开盘", "投资者", "股票"];

export default function WatchlistScreen() {
  return (
    <ScreenScroll includeTopInset bottomInset={118}>
      <AppHeader searchPlaceholder="搜索" />

      <View style={{ gap: spacing.xl }}>
        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: spacing.md }}>
          <View style={{ alignItems: "center", flexDirection: "row", flex: 1, gap: spacing.sm }}>
            <Text selectable numberOfLines={1} adjustsFontSizeToFit style={{ color: colors.ink, fontSize: 31, fontWeight: "900" }}>
              我的关注列表
            </Text>
            <ChevronDown color={colors.ink} size={23} strokeWidth={2.4} />
          </View>

          <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.lg }}>
            <SlidersHorizontal color={colors.positive} size={28} strokeWidth={2.5} />
            <EllipsisVertical color={colors.muted} size={26} strokeWidth={2.5} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          {chips.map((chip, index) => (
            <View
              key={chip}
              style={{
                backgroundColor: index === 0 ? "#303544" : colors.surface,
                borderColor: index === 0 ? "#303544" : "#c9ceda",
                borderRadius: radius.full,
                borderWidth: 1,
                paddingHorizontal: spacing.xl,
                paddingVertical: spacing.md,
              }}
            >
              <Text selectable style={{ color: index === 0 ? colors.inverse : colors.muted, fontSize: 18, fontWeight: "800" }}>
                {chip}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ backgroundColor: colors.surface, marginHorizontal: -spacing.lg }}>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
          }}
        >
          <Text selectable style={{ color: colors.muted, fontSize: 17, fontWeight: "800", width: 138 }}>
            市场
          </Text>
          <Text selectable style={{ color: colors.muted, flex: 1, fontSize: 17, fontWeight: "800", textAlign: "center" }}>
            做空
          </Text>
          <Text selectable style={{ color: colors.muted, flex: 1.05, fontSize: 17, fontWeight: "800", textAlign: "center" }}>
            买入
          </Text>
        </View>

        {watchlistAssets.map((asset) => (
          <WatchlistQuoteRow
            key={asset.symbol}
            asset={asset}
            hotSide={asset.symbol === "NVDA" ? "bid" : asset.symbol === "INTC" ? "ask" : undefined}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add asset"
        style={({ pressed }) => ({
          ...shadows.card,
          alignItems: "center",
          alignSelf: "flex-end",
          backgroundColor: colors.brandAction,
          borderRadius: radius.full,
          flexDirection: "row",
          gap: spacing.sm,
          marginTop: -84,
          opacity: pressed ? 0.72 : 1,
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
        })}
      >
        <Text style={{ color: colors.inverse, fontSize: 21, fontWeight: "900" }}>添加</Text>
        <Plus color={colors.inverse} size={27} strokeWidth={2.4} />
      </Pressable>
    </ScreenScroll>
  );
}
