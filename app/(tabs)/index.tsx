import { PenLine } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { HomeValueChart } from "@/components/home-value-chart";
import { MarketIndexStrip } from "@/components/market-index-strip";
import { MoverCard } from "@/components/mover-card";
import { ScreenScroll } from "@/components/screen-scroll";
import { colors, radius, shadows, spacing } from "@/design/theme";

export default function HomeScreen() {
  return (
    <ScreenScroll includeTopInset bottomInset={110}>
      <AppHeader rewardLabel="获得 $200" />

      <HomeValueChart />

      <MoverCard />

      <MarketIndexStrip />

      <Pressable
        accessibilityLabel="Edit quick actions"
        accessibilityRole="button"
        style={({ pressed }) => ({
          ...shadows.card,
          alignItems: "center",
          alignSelf: "flex-end",
          backgroundColor: colors.brandAction,
          borderRadius: radius.full,
          height: 64,
          justifyContent: "center",
          marginTop: -spacing.md,
          opacity: pressed ? 0.75 : 1,
          width: 64,
        })}
      >
        <PenLine color={colors.inverse} size={27} strokeWidth={2.4} />
      </Pressable>

      <View style={{ height: spacing.md }} />
    </ScreenScroll>
  );
}
