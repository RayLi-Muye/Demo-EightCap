import { Tabs } from "expo-router";
import { ChartPie, Compass, Eye, House, Search } from "lucide-react-native";

import { HeaderPanelProvider } from "@/components/header-panel-provider";
import { SearchTabBar } from "@/components/search-tab-bar";
import { colors } from "@/design/theme";

export default function NativeTabLayout() {
  return (
    <HeaderPanelProvider>
      <Tabs
        tabBar={(props) => <SearchTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.brandAction,
          tabBarInactiveTintColor: colors.muted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => <House color={color} size={focused ? 25 : 23} strokeWidth={2.4} />,
          }}
        />
        <Tabs.Screen
          name="portfolio"
          options={{
            title: "Investments",
            tabBarLabel: "Invest",
            tabBarIcon: ({ color, focused }) => <ChartPie color={color} size={focused ? 25 : 23} strokeWidth={2.4} />,
          }}
        />
        <Tabs.Screen
          name="watchlist"
          options={{
            title: "Watchlist",
            tabBarIcon: ({ color, focused }) => <Eye color={color} size={focused ? 25 : 23} strokeWidth={2.4} />,
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: "Discover",
            tabBarIcon: ({ color, focused }) => <Compass color={color} size={focused ? 25 : 23} strokeWidth={2.4} />,
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Search",
            tabBarIcon: ({ color, focused }) => <Search color={color} size={focused ? 25 : 23} strokeWidth={2.4} />,
          }}
        />
      </Tabs>
    </HeaderPanelProvider>
  );
}
