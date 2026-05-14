import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NativeTabs, Icon, Label, Badge, VectorIcon } from "expo-router/unstable-native-tabs";
import type { ComponentProps } from "react";

import { colors } from "@/design/theme";

function TabIcon({ name }: { name: ComponentProps<typeof MaterialCommunityIcons>["name"] }) {
  return <Icon src={<VectorIcon family={MaterialCommunityIcons} name={name} />} />;
}

export default function NativeTabLayout() {
  return (
    <NativeTabs
      backgroundColor="transparent"
      badgeBackgroundColor="#cf241b"
      blurEffect="systemUltraThinMaterial"
      disableTransparentOnScrollEdge
      iconColor={{ default: colors.muted, selected: colors.brandAction }}
      labelStyle={{
        default: { color: colors.muted, fontSize: 12, fontWeight: "700" },
        selected: { color: colors.brandAction, fontSize: 12, fontWeight: "700" },
      }}
      minimizeBehavior="onScrollDown"
      shadowColor="rgba(8, 11, 18, 0.10)"
      tintColor={colors.brandAction}
    >
      <NativeTabs.Trigger name="index">
        <TabIcon name="home-outline" />
        <Label>主页</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="portfolio">
        <TabIcon name="chart-pie" />
        <Label>我的投资</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="watchlist">
        <TabIcon name="eye-outline" />
        <Label>关注列表</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="wallet">
        <TabIcon name="wallet-outline" />
        <Label>钱包</Label>
        <Badge hidden />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
