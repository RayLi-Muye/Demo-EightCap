import { Tabs } from "expo-router";
import { ChartPie, Eye, House, Wallet } from "lucide-react-native";

import { colors } from "@/design/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandAction,
        tabBarInactiveTintColor: colors.muted,
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 88,
          paddingBottom: 22,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "主页",
          tabBarIcon: ({ color, focused }) => (
            <House color={color} size={focused ? 25 : 23} strokeWidth={2.4} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: "我的投资",
          tabBarIcon: ({ color, focused }) => (
            <ChartPie color={color} size={focused ? 25 : 23} strokeWidth={2.4} />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "关注列表",
          tabBarIcon: ({ color, focused }) => (
            <Eye color={color} size={focused ? 25 : 23} strokeWidth={2.4} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "钱包",
          tabBarIcon: ({ color, focused }) => (
            <Wallet color={color} size={focused ? 25 : 23} strokeWidth={2.4} />
          ),
        }}
      />
    </Tabs>
  );
}
