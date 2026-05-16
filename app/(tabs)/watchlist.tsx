import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { FilterPillBar } from "@/components/filter-pill-bar";
import { PageTitle } from "@/components/page-title";
import { PinnedAppHeaderScreen } from "@/components/pinned-app-header-screen";
import { ScreenScroll } from "@/components/screen-scroll";
import { WatchlistQuoteRow } from "@/components/watchlist-quote-row";
import { holdings, type EquityAsset } from "@/data/portfolio";
import { colors, spacing } from "@/design/theme";
import { useLiveAssets } from "@/hooks/use-live-market";
import { useWatchlistAssets } from "@/hooks/use-watchlist";

const holdingSymbols = new Set(holdings.map((holding) => holding.symbol.toUpperCase()));

const watchlistFilters = [
  { id: "portfolio", label: "Portfolio", predicate: (asset: EquityAsset) => holdingSymbols.has(asset.symbol.toUpperCase()) },
  { id: "open", label: "Open", predicate: (asset: EquityAsset) => asset.bid > 0 && asset.ask > 0 },
  { id: "stocks", label: "Stocks", predicate: (asset: EquityAsset) => asset.assetClass !== "crypto" },
] as const;

type WatchlistFilterId = (typeof watchlistFilters)[number]["id"];

export default function WatchlistScreen() {
  const watchlistAssets = useWatchlistAssets();
  const { assets, pulses } = useLiveAssets(watchlistAssets, { count: 3, intervalMs: 2000, scale: 0.0017 });
  const [selectedFilters, setSelectedFilters] = useState<WatchlistFilterId[]>([]);
  const visibleAssets = useMemo(() => {
    if (selectedFilters.length === 0) {
      return assets;
    }

    return assets.filter((asset) =>
      selectedFilters.every((filterId) => watchlistFilters.find((filter) => filter.id === filterId)?.predicate(asset) ?? true),
    );
  }, [assets, selectedFilters]);

  function toggleFilter(filterId: WatchlistFilterId) {
    setSelectedFilters((current) =>
      current.includes(filterId) ? current.filter((currentFilter) => currentFilter !== filterId) : [...current, filterId],
    );
  }

  return (
    <PinnedAppHeaderScreen>
      <ScreenScroll bottomInset={118}>
        <Animated.View entering={FadeInUp.duration(520).springify()} style={{ gap: spacing.xl }}>
          <PageTitle>Watch List</PageTitle>

          <FilterPillBar options={watchlistFilters} selectedIds={selectedFilters} onToggle={toggleFilter} />
        </Animated.View>

        <View style={{ backgroundColor: colors.surface, marginHorizontal: -spacing.lg }}>
          <View
            style={{
              borderBottomColor: colors.line,
              borderBottomWidth: 1,
              flexDirection: "row",
              paddingBottom: spacing.md,
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
            }}
          >
            <Text selectable style={{ color: colors.muted, flex: 1, fontSize: 14, fontWeight: "600" }}>
              Market
            </Text>
            <Text selectable style={{ color: colors.muted, flex: 0.56, fontSize: 14, fontWeight: "600", textAlign: "center" }}>
              Sell
            </Text>
            <Text selectable style={{ color: colors.muted, flex: 0.56, fontSize: 14, fontWeight: "600", textAlign: "center" }}>
              Buy
            </Text>
          </View>

          {visibleAssets.map((asset) => (
            <WatchlistQuoteRow
              key={asset.symbol}
              asset={asset}
              hotSide={pulses[asset.symbol]?.direction === "down" ? "ask" : pulses[asset.symbol]?.direction === "up" ? "bid" : undefined}
              pulse={pulses[asset.symbol]}
            />
          ))}
        </View>
      </ScreenScroll>
    </PinnedAppHeaderScreen>
  );
}
