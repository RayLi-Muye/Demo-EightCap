import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import type { ReactNode } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

type GlassSurfaceProps = {
  children?: ReactNode;
  intensity?: number;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
};

export function GlassSurface({
  children,
  intensity = 72,
  interactive,
  style,
  tintColor = "rgba(255,255,255,0.68)",
}: GlassSurfaceProps) {
  const liquidGlass = Platform.OS === "ios" && isLiquidGlassAvailable();

  if (liquidGlass) {
    return (
      <GlassView
        colorScheme="light"
        glassEffectStyle="regular"
        isInteractive={interactive}
        style={[styles.base, style]}
        tintColor={tintColor}
      >
        {children}
      </GlassView>
    );
  }

  if (Platform.OS === "web") {
    return (
      <BlurView intensity={intensity} style={[styles.base, styles.fallback, style]} tint="systemUltraThinMaterial">
        {children}
      </BlurView>
    );
  }

  return <View style={[styles.base, styles.fallback, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
  fallback: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
  },
});
