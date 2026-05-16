import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { FilterPillBar } from "@/components/filter-pill-bar";
import { HoldingRow } from "@/components/holding-row";
import { PageTitle } from "@/components/page-title";
import { PinnedAppHeaderScreen } from "@/components/pinned-app-header-screen";
import { ScreenScroll } from "@/components/screen-scroll";
import type { Holding } from "@/data/portfolio";
import { colors, spacing } from "@/design/theme";
import { usePortfolioHoldings } from "@/hooks/use-demo-portfolio";
import { useLiveHoldings } from "@/hooks/use-live-market";

const portfolioFilters = [
  { id: "orders", label: "Orders", predicate: (holding: Holding) => holding.units > 0 },
  { id: "trades", label: "Trades", predicate: (holding: Holding) => holding.pnl !== 0 },
  { id: "open", label: "Open", predicate: (holding: Holding) => holding.bid > 0 && holding.ask > 0 },
  { id: "stocks", label: "Stocks", predicate: (holding: Holding) => holding.assetClass !== "crypto" },
] as const;

type PortfolioFilterId = (typeof portfolioFilters)[number]["id"];

export default function PortfolioScreen() {
  const portfolioHoldings = usePortfolioHoldings();
  const live = useLiveHoldings(portfolioHoldings);
  const [selectedFilters, setSelectedFilters] = useState<PortfolioFilterId[]>([]);
  const visibleHoldings = useMemo(() => {
    if (selectedFilters.length === 0) {
      return live.holdings;
    }

    return live.holdings.filter((holding) =>
      selectedFilters.every((filterId) => portfolioFilters.find((filter) => filter.id === filterId)?.predicate(holding) ?? true),
    );
  }, [live.holdings, selectedFilters]);

  function toggleFilter(filterId: PortfolioFilterId) {
    setSelectedFilters((current) =>
      current.includes(filterId) ? current.filter((currentFilter) => currentFilter !== filterId) : [...current, filterId],
    );
  }

  return (
    <PinnedAppHeaderScreen>
      <ScreenScroll bottomInset={110}>
        <Animated.View entering={FadeInUp.duration(520).springify()} style={{ gap: spacing.xl }}>
          <PageTitle>My Portfolio</PageTitle>

          <FilterPillBar options={portfolioFilters} selectedIds={selectedFilters} onToggle={toggleFilter} />
        </Animated.View>

        <View style={{ backgroundColor: colors.surface, marginHorizontal: -spacing.lg }}>
          <View
            style={{
              borderBottomColor: colors.line,
              borderBottomWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            <Text selectable style={{ color: colors.muted, flex: 1, fontSize: 15, fontWeight: "600" }}>
              Assets ({visibleHoldings.length})
            </Text>
            <View style={{ alignItems: "center", flexDirection: "row", width: 232 }}>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600", textAlign: "right", width: 52 }}>
                Move
              </Text>
              <Text style={{ color: colors.line, fontSize: 13, fontWeight: "500", textAlign: "center", width: 6 }}>|</Text>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "600", textAlign: "right", width: 82 }}>
                P/L
              </Text>
              <Text style={{ color: colors.line, fontSize: 13, fontWeight: "500", textAlign: "center", width: 6 }}>|</Text>
              <Text numberOfLines={2} style={{ color: colors.muted, fontSize: 12, fontWeight: "600", lineHeight: 13, textAlign: "right", width: 86 }}>
                Value
              </Text>
            </View>
          </View>

          {visibleHoldings.map((holding) => (
            <HoldingRow key={holding.symbol} holding={holding} pulse={live.pulses[holding.symbol]} />
          ))}
        </View>
      </ScreenScroll>
    </PinnedAppHeaderScreen>
  );
}
