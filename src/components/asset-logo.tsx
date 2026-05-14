import { Text, View } from "react-native";

import { colors, radius } from "@/design/theme";

type AssetLogoProps = {
  label: string;
  background: string;
  color: string;
  size?: number;
};

export function AssetLogo({ label, background, color, size = 48 }: AssetLogoProps) {
  const compact = label.length > 2;

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: background,
        borderColor: background === colors.surface ? colors.line : "transparent",
        borderRadius: radius.sm,
        borderWidth: 1,
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          color,
          fontSize: compact ? size * 0.22 : size * 0.38,
          fontWeight: "900",
          letterSpacing: 0,
          maxWidth: size - 8,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
