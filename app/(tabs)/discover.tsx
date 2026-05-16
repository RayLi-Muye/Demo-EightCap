import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ChevronRight, Flame, Newspaper, Search, TrendingUp, X } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { ImageBackground, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { AssetLogo } from "@/components/asset-logo";
import { GlassSurface } from "@/components/glass-surface";
import { PageTitle } from "@/components/page-title";
import { PinnedAppHeaderScreen } from "@/components/pinned-app-header-screen";
import { ScreenScroll } from "@/components/screen-scroll";
import { Sparkline } from "@/components/sparkline";
import { holdings, watchlistAssets, type EquityAsset } from "@/data/portfolio";
import { colors, radius, shadows, spacing } from "@/design/theme";
import { useAppViewportDimensions } from "@/hooks/use-app-viewport";
import { useLiveAssets } from "@/hooks/use-live-market";
import { formatPercent, formatPrice } from "@/utils/format";

type Sector = "All" | "Crypto" | "US Stocks" | "ETFs" | "Forex" | "Bonds";

type ThemeCollection = {
  id: string;
  title: string;
  expectedReturn: string;
  description: string;
  assets: string[];
  imageUrl: string;
  overlayColor: string;
};

type DiscoverMover = {
  symbol: string;
  name: string;
  displayPrice: string;
  changePercent: number;
  sparkline: number[];
  logoLabel: string;
  logoBackground: string;
  logoColor: string;
  routeSymbol?: string;
};

type BusinessArticle = {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  source: string;
  readTime: string;
  accent: string;
};

const sectors: Sector[] = ["All", "Crypto", "US Stocks", "ETFs", "Forex", "Bonds"];

const collections: ThemeCollection[] = [
  {
    id: "ai-rev",
    title: "AI Revolution",
    expectedReturn: "+185%",
    description: "Companies leading the AI race",
    assets: ["NVDA", "MSFT", "TSMC"],
    imageUrl:
      "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc4NzQ0NTQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    overlayColor: "rgba(76, 77, 204, 0.62)",
  },
  {
    id: "crypto-l1",
    title: "Layer 1 Titans",
    expectedReturn: "+320%",
    description: "The foundational blockchains",
    assets: ["BTC", "ETH", "SOL"],
    imageUrl:
      "https://images.unsplash.com/photo-1502872364588-894d7d6ddfab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMG5lb258ZW58MXx8fHwxNzc4ODQ1OTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    overlayColor: "rgba(0, 123, 101, 0.66)",
  },
  {
    id: "green-nrg",
    title: "Clean Energy",
    expectedReturn: "+64%",
    description: "Powering the future",
    assets: ["TSLA", "ENPH", "FSLR"],
    imageUrl:
      "https://images.unsplash.com/photo-1614366502473-e54666693b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHNvbGFyJTIwcGFuZWxzfGVufDF8fHx8MTc3ODg0NTk4NHww&ixlib=rb-4.1.0&w=1080",
    overlayColor: "rgba(205, 117, 0, 0.62)",
  },
];

const businessArticles: BusinessArticle[] = [
  {
    id: "fed-path",
    kicker: "Markets",
    title: "Rate-cut timing keeps equities split between growth and cash yield",
    summary: "Portfolio managers are watching cash balances, duration, and quality growth as policy expectations reset.",
    source: "Market Desk",
    readTime: "4 min",
    accent: colors.brandAction,
  },
  {
    id: "ai-capex",
    kicker: "Business",
    title: "AI capital spending reshapes semiconductor and cloud leadership",
    summary: "Large platform budgets continue to pull attention toward chips, infrastructure, and power demand.",
    source: "Equity Brief",
    readTime: "3 min",
    accent: colors.purple,
  },
  {
    id: "crypto-liquidity",
    kicker: "Digital Assets",
    title: "Crypto liquidity improves as majors hold above key trend levels",
    summary: "Bitcoin and Ethereum flows remain mixed, while higher-beta layer 1 names keep leading intraday moves.",
    source: "Crypto Note",
    readTime: "5 min",
    accent: "#f7931a",
  },
];

const baseAssets = uniqueAssets([...watchlistAssets, ...holdings]);

const staticSectorData: Record<Exclude<Sector, "All" | "Crypto" | "US Stocks">, DiscoverMover[]> = {
  ETFs: [
    createStaticMover("SPY", "SPDR S&P 500", "$524.10", 0.8, [38, 39, 40.5, 41, 42.2, 42, 43.5, 44.1], "SPY", "#243b70", colors.inverse),
    createStaticMover("QQQ", "Invesco QQQ", "$452.30", 1.4, [32, 33.4, 34.1, 33.8, 35.2, 36.1, 36.9, 38.4], "QQQ", "#0f4a73", colors.inverse),
    createStaticMover("ARKK", "ARK Innovation", "$48.20", -1.2, [52, 51.4, 50.8, 51.1, 49.8, 48.9, 49.2, 48.1], "ARK", "#ffffff", "#111827"),
  ],
  Forex: [
    createStaticMover("EUR/USD", "Euro / US Dollar", "1.0842", 0.2, [41, 41.4, 41.1, 41.8, 42, 42.1, 42.5, 42.7], "EUR", "#1b4fd8", colors.inverse),
    createStaticMover("GBP/USD", "British Pound / USD", "1.2650", -0.1, [46, 46.2, 45.9, 45.6, 45.8, 45.4, 45.2, 45.1], "GBP", "#243b70", colors.inverse),
    createStaticMover("USD/JPY", "US Dollar / Yen", "155.40", 0.4, [35, 35.3, 35.1, 35.8, 36.4, 36.2, 36.7, 37.1], "JPY", "#cf241b", colors.inverse),
  ],
  Bonds: [
    createStaticMover("US10Y", "US 10-Year T-Note", "4.42%", 0.05, [29, 29.2, 29.1, 29.4, 29.7, 29.6, 29.9, 30.1], "10Y", "#667085", colors.inverse),
    createStaticMover("US02Y", "US 2-Year T-Note", "4.85%", -0.02, [33, 33.1, 32.9, 32.7, 32.8, 32.6, 32.5, 32.4], "2Y", "#98a2b3", colors.inverse),
  ],
};

function uniqueAssets(assets: EquityAsset[]) {
  const seen = new Set<string>();

  return assets.filter((asset) => {
    if (seen.has(asset.symbol)) {
      return false;
    }

    seen.add(asset.symbol);
    return true;
  });
}

function createStaticMover(
  symbol: string,
  name: string,
  displayPrice: string,
  changePercent: number,
  sparkline: number[],
  logoLabel: string,
  logoBackground: string,
  logoColor: string,
): DiscoverMover {
  return {
    changePercent,
    displayPrice,
    logoBackground,
    logoColor,
    logoLabel,
    name,
    sparkline,
    symbol,
  };
}

function assetMover(asset: EquityAsset): DiscoverMover {
  return {
    changePercent: asset.changePercent,
    displayPrice: `$${formatPrice(asset.price)}`,
    logoBackground: asset.logoBackground,
    logoColor: asset.logoColor,
    logoLabel: asset.logoLabel,
    name: asset.name,
    routeSymbol: asset.symbol,
    sparkline: asset.sparkline,
    symbol: asset.symbol,
  };
}

function buildSectorData(assets: EquityAsset[]): Record<Sector, DiscoverMover[]> {
  const bySymbol = new Map(assets.map((asset) => [asset.symbol, asset]));
  const pick = (symbols: string[]) => symbols.map((symbol) => bySymbol.get(symbol)).filter(Boolean).map((asset) => assetMover(asset as EquityAsset));

  return {
    All: pick(["NVDA", "SOL", "META", "ARM"]).concat(pick(["NFLX", "AMD"])).slice(0, 4),
    Crypto: pick(["BTC", "ETH", "SOL"]),
    "US Stocks": pick(["NVDA", "AAPL", "TSLA", "MSFT"]),
    ...staticSectorData,
  };
}

function hapticTap() {
  Haptics.selectionAsync().catch(() => {});
}

function ThemeCard({ collection, width }: { collection: ThemeCollection; width: number }) {
  return (
    <Pressable
      accessibilityLabel={`${collection.title} theme`}
      accessibilityRole="button"
      onPressIn={hapticTap}
      style={({ pressed }) => ({
        ...shadows.card,
        borderRadius: radius.lg,
        height: 160,
        opacity: pressed ? 0.78 : 1,
        overflow: "hidden",
        transform: [{ scale: pressed ? 0.98 : 1 }],
        width,
      })}
    >
      <ImageBackground
        imageStyle={{ borderRadius: radius.lg }}
        resizeMode="cover"
        source={{ uri: collection.imageUrl }}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <View style={{ backgroundColor: collection.overlayColor, bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }} />
        <View style={{ backgroundColor: "rgba(8,11,18,0.24)", bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }} />
        <View style={{ gap: spacing.sm, padding: spacing.lg }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
            {collection.assets.map((asset) => (
              <View
                key={asset}
                style={{
                  backgroundColor: "rgba(255,255,255,0.22)",
                  borderRadius: radius.xs,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ color: colors.inverse, fontSize: 10, fontWeight: "600" }}>{asset}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            <Text style={{ color: colors.inverse, fontSize: 21, fontWeight: "600" }}>{collection.title}</Text>
            <Text style={{ color: colors.brand, fontSize: 14, fontWeight: "600" }}>{collection.expectedReturn} 2Y</Text>
          </View>
          <Text numberOfLines={1} style={{ color: "rgba(255,255,255,0.82)", fontSize: 14, fontWeight: "500" }}>
            {collection.description}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

function SectorPills({ activeSector, onChange }: { activeSector: Sector; onChange: (sector: Sector) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -spacing.lg }}
      contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.lg }}
    >
      {sectors.map((sector) => {
        const active = activeSector === sector;

        return (
          <Pressable
            accessibilityLabel={`Show ${sector}`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={sector}
            onPress={() => {
              hapticTap();
              onChange(sector);
            }}
            style={({ pressed }) => ({
              backgroundColor: active ? colors.brandAction : "rgba(255,255,255,0.48)",
              borderColor: active ? colors.brandAction : "rgba(255,255,255,0.68)",
              borderRadius: radius.full,
              borderWidth: 1,
              opacity: pressed ? 0.72 : 1,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
            })}
          >
            <Text style={{ color: active ? colors.inverse : colors.muted, fontSize: 14, fontWeight: "600" }}>{sector}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function TopMoverRow({ mover }: { mover: DiscoverMover }) {
  const router = useRouter();
  const positive = mover.changePercent >= 0;
  const movementColor = positive ? colors.positive : colors.negative;
  const openMover = () => {
    if (!mover.routeSymbol) {
      return;
    }

    router.push({ pathname: "/instrument/[symbol]", params: { symbol: mover.routeSymbol } });
  };

  return (
    <Pressable
      accessibilityLabel={`${mover.symbol} ${mover.name}`}
      accessibilityRole="button"
      onPress={openMover}
      onPressIn={hapticTap}
      style={({ pressed }) => ({
        ...shadows.card,
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.58)",
        borderColor: "rgba(255,255,255,0.72)",
        borderRadius: radius.lg,
        borderWidth: 1,
        flexDirection: "row",
        gap: spacing.md,
        opacity: pressed ? 0.76 : 1,
        padding: spacing.md,
        width: "100%",
      })}
    >
      <AssetLogo background={mover.logoBackground} color={mover.logoColor} label={mover.logoLabel} size={42} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text selectable numberOfLines={1} style={{ color: colors.ink, fontSize: 16, fontWeight: "600" }}>
          {mover.symbol}
        </Text>
        <Text selectable numberOfLines={1} style={{ color: colors.muted, fontSize: 12, fontWeight: "500" }}>
          {mover.name}
        </Text>
      </View>
      <Sparkline
        color={movementColor}
        fillArea
        height={38}
        showDot={false}
        showGuide={false}
        values={mover.sparkline}
        width={82}
      />
      <View style={{ alignItems: "flex-end", flexShrink: 0, gap: 2, width: 82 }}>
        <Text selectable numberOfLines={1} adjustsFontSizeToFit style={{ color: colors.ink, fontSize: 15, fontVariant: ["tabular-nums"], fontWeight: "600" }}>
          {mover.displayPrice}
        </Text>
        <Text selectable style={{ color: movementColor, fontSize: 12, fontVariant: ["tabular-nums"], fontWeight: "600" }}>
          {formatPercent(mover.changePercent)}
        </Text>
      </View>
    </Pressable>
  );
}

function BusinessArticleCard({ article, width }: { article: BusinessArticle; width: number }) {
  return (
    <Pressable
      accessibilityLabel={article.title}
      accessibilityRole="button"
      onPressIn={hapticTap}
      style={({ pressed }) => ({
        ...shadows.card,
        backgroundColor: colors.surface,
        borderColor: "rgba(255,255,255,0.82)",
        borderRadius: radius.lg,
        borderWidth: 1,
        opacity: pressed ? 0.76 : 1,
        overflow: "hidden",
        width,
      })}
    >
      <View style={{ flexDirection: "row", minHeight: 178 }}>
        <View style={{ backgroundColor: article.accent, width: 6 }} />
        <View style={{ flex: 1, gap: spacing.md, padding: spacing.lg }}>
          <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: spacing.md }}>
            <Text selectable style={{ color: article.accent, fontSize: 11, fontWeight: "600", letterSpacing: 0.4, textTransform: "uppercase" }}>
              {article.kicker}
            </Text>
            <Text selectable style={{ color: colors.subtle, fontSize: 12, fontWeight: "500" }}>
              {article.readTime}
            </Text>
          </View>

          <Text selectable numberOfLines={3} style={{ color: colors.ink, fontSize: 18, fontWeight: "600", lineHeight: 23 }}>
            {article.title}
          </Text>
          <Text selectable numberOfLines={3} style={{ color: colors.muted, fontSize: 13, fontWeight: "500", lineHeight: 19 }}>
            {article.summary}
          </Text>

          <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: "auto" }}>
            <Text selectable style={{ color: colors.ink, fontSize: 13, fontWeight: "600" }}>
              {article.source}
            </Text>
            <ChevronRight color={colors.muted} size={17} strokeWidth={2.5} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function DiscoverScreen() {
  const { width } = useAppViewportDimensions();
  const inputRef = useRef<TextInput>(null);
  const [activeSector, setActiveSector] = useState<Sector>("All");
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const { assets } = useLiveAssets(baseAssets, { count: 4, intervalMs: 2200, scale: 0.0014 });
  const sectorData = useMemo(() => buildSectorData(assets), [assets]);
  const queryText = query.trim().toLowerCase();
  const currentMovers = useMemo(() => {
    const movers = sectorData[activeSector] ?? sectorData.All;

    if (!queryText) {
      return movers;
    }

    return movers.filter((mover) => mover.symbol.toLowerCase().includes(queryText) || mover.name.toLowerCase().includes(queryText));
  }, [activeSector, queryText, sectorData]);
  const themeCardWidth = Math.min(Math.max(width * 0.74, 280), 330);
  const articleCardWidth = Math.min(Math.max(width * 0.76, 292), 350);

  function openSearch() {
    setSearchFocused(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  function closeSearch() {
    setSearchFocused(false);
    setQuery("");
  }

  return (
    <PinnedAppHeaderScreen>
      <ScreenScroll bottomInset={118}>
        <Animated.View entering={FadeInUp.duration(520).springify()} style={{ gap: spacing.xl }}>
          <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.md, minHeight: 52 }}>
            {searchFocused ? null : (
              <PageTitle style={{ flex: 1 }}>Discover</PageTitle>
            )}

            {searchFocused ? (
              <View style={{ flex: 1 }}>
                <GlassSurface
                  interactive
                  style={{
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.82)",
                    borderColor: "rgba(5,184,63,0.32)",
                    borderRadius: radius.lg,
                    borderWidth: 1,
                    flexDirection: "row",
                    gap: spacing.sm,
                    height: 48,
                    paddingHorizontal: spacing.lg,
                    width: "100%",
                  }}
                >
                  <Search color={colors.brandAction} size={21} strokeWidth={2.4} />
                  <TextInput
                    autoCapitalize="characters"
                    autoCorrect={false}
                    onBlur={() => setSearchFocused(false)}
                    onChangeText={setQuery}
                    placeholder="Search assets, sectors..."
                    placeholderTextColor={colors.subtle}
                    ref={inputRef}
                    returnKeyType="search"
                    style={[{ color: colors.ink, flex: 1, fontSize: 15, fontWeight: "500" }, { outlineStyle: "none" } as never]}
                    value={query}
                  />
                  <Pressable accessibilityLabel="Clear search" accessibilityRole="button" hitSlop={10} onPress={closeSearch}>
                    <X color={colors.muted} size={18} strokeWidth={2.5} />
                  </Pressable>
                </GlassSurface>
              </View>
            ) : (
              <Pressable
                accessibilityLabel="Search discover"
                accessibilityRole="button"
                onPress={openSearch}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.72 : 1,
                })}
              >
                <GlassSurface
                  interactive
                  style={{
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.62)",
                    borderColor: "rgba(255,255,255,0.78)",
                    borderRadius: radius.full,
                    borderWidth: 1,
                    flexDirection: "row",
                    gap: spacing.sm,
                    height: 48,
                    justifyContent: "center",
                    paddingHorizontal: 0,
                    width: 48,
                  }}
                >
                  <Search color={colors.muted} size={21} strokeWidth={2.4} />
                </GlassSurface>
              </Pressable>
            )}
          </View>

          <View style={{ gap: spacing.md }}>
            <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm }}>
              <Flame color="#f97316" size={22} strokeWidth={2.4} />
              <Text selectable style={{ color: colors.ink, fontSize: 18, fontWeight: "600" }}>
                Trending Themes
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -spacing.lg }}
              contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }}
            >
              {collections.map((collection) => (
                <ThemeCard collection={collection} key={collection.id} width={themeCardWidth} />
              ))}
            </ScrollView>
          </View>

          <SectorPills activeSector={activeSector} onChange={setActiveSector} />

          <View style={{ gap: spacing.md }}>
            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: spacing.md }}>
              <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm }}>
                <TrendingUp color={colors.brandAction} size={22} strokeWidth={2.4} />
                <Text selectable style={{ color: colors.ink, fontSize: 18, fontWeight: "600" }}>
                  Top Movers
                </Text>
              </View>
              <Pressable accessibilityRole="button" onPress={hapticTap} style={{ alignItems: "center", flexDirection: "row", gap: 2 }}>
                <Text style={{ color: colors.brandAction, fontSize: 14, fontWeight: "600" }}>See All</Text>
                <ChevronRight color={colors.brandAction} size={17} strokeWidth={2.6} />
              </Pressable>
            </View>

            <View style={{ gap: spacing.md }}>
              {currentMovers.length > 0 ? (
                currentMovers.map((mover) => <TopMoverRow key={mover.symbol} mover={mover} />)
              ) : (
                <GlassSurface
                  interactive
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: radius.lg,
                    padding: spacing.lg,
                  }}
                >
                  <Text selectable style={{ color: colors.muted, fontSize: 15, fontWeight: "500" }}>
                    No matching markets in {activeSector}.
                  </Text>
                </GlassSurface>
              )}
            </View>
          </View>

          <View style={{ gap: spacing.md }}>
            <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm }}>
              <Newspaper color={colors.ink} size={22} strokeWidth={2.35} />
              <Text selectable style={{ color: colors.ink, fontSize: 18, fontWeight: "600" }}>
                Financial Business
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -spacing.lg }}
              contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.sm, paddingHorizontal: spacing.lg }}
            >
              {businessArticles.map((article) => (
                <BusinessArticleCard article={article} key={article.id} width={articleCardWidth} />
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      </ScreenScroll>
    </PinnedAppHeaderScreen>
  );
}
