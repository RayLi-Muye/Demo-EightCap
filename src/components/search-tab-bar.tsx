import { useRouter } from "expo-router";
import { ChartPie, Compass, Eye, House, Search, Wallet, X } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { holdings, watchlistAssets, type EquityAsset } from "@/data/portfolio";
import { colors, radius, spacing } from "@/design/theme";
import { useAppViewportDimensions } from "@/hooks/use-app-viewport";

const tabIcons = {
  discover: Compass,
  index: House,
  portfolio: ChartPie,
  watchlist: Eye,
  wallet: Search,
} as const;

const searchRouteName = "wallet";
const primaryRouteNames = ["index", "portfolio", "watchlist", "discover"];

function uniqueAssets() {
  const assets = [...watchlistAssets, ...holdings];
  const seen = new Set<string>();

  return assets.filter((asset) => {
    if (seen.has(asset.symbol)) {
      return false;
    }

    seen.add(asset.symbol);
    return true;
  });
}

export function SearchTabBar({ descriptors, navigation, state }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useAppViewportDimensions();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const tabWidth = Math.min(Math.max(width - 32, 0), 620);
  const floatingPosition = "absolute";
  const floatingFrameWidth = tabWidth;
  const floatingShellStyle = {
    left: 0,
    right: 0,
  };
  const searchButtonSize = 74;
  const primaryBarWidth = Math.max(tabWidth - searchButtonSize - spacing.sm, 0);
  const primaryButtonWidth = primaryBarWidth / primaryRouteNames.length;
  const navGlassStyle = {
    backgroundColor: "rgba(246,249,245,0.3)",
    backdropFilter: "blur(24px)",
  };
  const assets = useMemo(uniqueAssets, []);
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return assets
      .filter((asset) => asset.symbol.toLowerCase().includes(normalizedQuery) || asset.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 4);
  }, [assets, query]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function openAsset(asset: EquityAsset) {
    closeSearch();
    router.push({ pathname: "/instrument/[symbol]", params: { symbol: asset.symbol } });
  }

  if (searchOpen) {
    return (
      <View
        pointerEvents="box-none"
        style={{
          alignItems: "center",
          bottom: 14 + insets.bottom,
          position: floatingPosition,
          zIndex: 80,
          ...floatingShellStyle,
        }}
      >
        {results.length > 0 ? (
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              borderColor: "rgba(255,255,255,0.86)",
              borderRadius: radius.lg,
              borderWidth: 1,
              boxShadow: "0 18px 42px rgba(8, 11, 18, 0.16)",
              gap: spacing.xs,
              marginBottom: spacing.sm,
              maxWidth: 620,
              overflow: "hidden",
              padding: spacing.sm,
              width: floatingFrameWidth as never,
            }}
          >
            {results.map((asset) => (
              <Pressable
                accessibilityLabel={`Open ${asset.name}`}
                accessibilityRole="button"
                key={asset.symbol}
                onPress={() => openAsset(asset)}
                style={({ pressed }) => ({
                  alignItems: "center",
                  backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
                  borderRadius: radius.md,
                  flexDirection: "row",
                  gap: spacing.md,
                  opacity: pressed ? 0.76 : 1,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                })}
              >
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: asset.logoBackground,
                    borderColor: colors.line,
                    borderRadius: radius.sm,
                    borderWidth: asset.logoBackground === "#ffffff" ? 1 : 0,
                    height: 34,
                    justifyContent: "center",
                    width: 34,
                  }}
                >
                  <Text style={{ color: asset.logoColor, fontSize: 12, fontWeight: "600" }}>{asset.logoLabel}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={{ color: colors.ink, fontSize: 15, fontWeight: "600" }}>
                    {asset.symbol}
                  </Text>
                  <Text numberOfLines={1} style={{ color: colors.muted, fontSize: 12, fontWeight: "500" }}>
                    {asset.name} · {asset.assetClass === "crypto" ? "Crypto" : "Stock"}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View
          style={{
            ...navGlassStyle,
            borderRadius: radius.full,
            boxShadow: "0 18px 42px rgba(8, 11, 18, 0.16)",
            flexDirection: "row",
            height: 64,
            maxWidth: 620,
            overflow: "hidden",
            paddingHorizontal: spacing.lg,
            width: floatingFrameWidth as never,
          }}
        >
          <View style={{ alignItems: "center", flexDirection: "row", flex: 1, gap: spacing.sm }}>
            <Search color={colors.brandAction} size={22} strokeWidth={2.4} />
            <TextInput
              accessibilityLabel="Search stocks or crypto"
              autoCapitalize="characters"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="Search stocks or crypto"
              placeholderTextColor={colors.subtle}
              ref={inputRef}
              returnKeyType="search"
              style={[{ color: colors.ink, flex: 1, fontSize: 17, fontWeight: "500" }, { outlineStyle: "none" } as never]}
              value={query}
            />
            <Pressable
              accessibilityLabel="Close search"
              accessibilityRole="button"
              hitSlop={10}
              onPress={closeSearch}
              style={({ pressed }) => ({
                alignItems: "center",
                backgroundColor: colors.surface,
                borderRadius: radius.full,
                height: 36,
                justifyContent: "center",
                opacity: pressed ? 0.68 : 1,
                width: 36,
              })}
            >
              <X color={colors.muted} size={20} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const primaryRoutes = state.routes.filter((route) => primaryRouteNames.includes(route.name));
  const searchRoute = state.routes.find((route) => route.name === searchRouteName);

  return (
    <View
      pointerEvents="box-none"
      style={{
        alignItems: "center",
        bottom: 14 + insets.bottom,
        position: floatingPosition,
        zIndex: 80,
        ...floatingShellStyle,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: spacing.sm,
          height: 74,
          maxWidth: 620,
          width: floatingFrameWidth as never,
        }}
      >
      <View
        style={{
          ...navGlassStyle,
          borderRadius: radius.full,
          boxShadow: "0 18px 42px rgba(8, 11, 18, 0.16)",
          height: 74,
          overflow: "hidden",
          width: primaryBarWidth,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", paddingBottom: 8, paddingTop: 8 }}>
          {primaryRoutes.map((route) => {
            const routeIndex = state.routes.findIndex((stateRoute) => stateRoute.key === route.key);
            const isFocused = state.index === routeIndex;
            const options = descriptors[route.key]?.options ?? {};
            const optionLabel = typeof options.tabBarLabel === "string" ? options.tabBarLabel : undefined;
            const label = optionLabel ?? options.title ?? route.name;
            const Icon = tabIcons[route.name as keyof typeof tabIcons] ?? Wallet;
            const color = isFocused ? colors.brandAction : colors.muted;

            return (
              <Pressable
                accessibilityLabel={`${label} tab`}
                accessibilityRole="button"
                key={route.key}
                onPress={() => {
                  const event = navigation.emit({
                    canPreventDefault: true,
                    target: route.key,
                    type: "tabPress",
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                }}
                style={({ pressed }) => ({
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 0,
                  opacity: pressed ? 0.65 : 1,
                  width: primaryButtonWidth,
                })}
              >
                <Icon color={color} size={isFocused ? 25 : 23} strokeWidth={2.4} />
                <Text
                  numberOfLines={1}
                  style={{
                    color,
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 2,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {searchRoute ? (
        <View
          style={{
            ...navGlassStyle,
            alignItems: "center",
            borderRadius: radius.full,
            boxShadow: "0 18px 42px rgba(8, 11, 18, 0.16)",
            height: 74,
            justifyContent: "center",
            overflow: "hidden",
            width: searchButtonSize,
          }}
        >
          <Pressable
            accessibilityLabel="Search tab"
            accessibilityRole="button"
            onPress={() => setSearchOpen(true)}
            style={({ pressed }) => ({
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
              opacity: pressed ? 0.65 : 1,
              width: "100%",
            })}
          >
            <Search color={colors.muted} size={23} strokeWidth={2.4} />
            <Text
              numberOfLines={1}
              style={{
                color: colors.muted,
                fontSize: 12,
                fontWeight: "500",
                marginTop: 2,
              }}
            >
              Search
            </Text>
          </Pressable>
        </View>
      ) : null}
      </View>
    </View>
  );
}
