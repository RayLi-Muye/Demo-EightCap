import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import 'react-native-reanimated';

import { LaunchSplash } from "@/components/launch-splash";
import { colors } from "@/design/theme";

export {
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    border: colors.line,
    card: colors.surface,
    primary: colors.brand,
    text: colors.ink,
  },
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "SpaceMono-Bold": require("../assets/fonts/SpaceMono-Bold.ttf"),
    "SpaceMono-BoldItalic": require("../assets/fonts/SpaceMono-BoldItalic.ttf"),
    "SpaceMono-Italic": require("../assets/fonts/SpaceMono-Italic.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontError, fontsLoaded]);

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.canvas },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: {
            color: colors.ink,
            fontSize: 17,
            fontWeight: "500",
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="instrument/[symbol]" options={{ title: "Instrument" }} />
        <Stack.Screen name="disclaimer" options={{ title: "Demo Notice", presentation: "modal" }} />
      </Stack>
      <StatusBar style="dark" />
      <LaunchSplash />
    </ThemeProvider>
  );
}
