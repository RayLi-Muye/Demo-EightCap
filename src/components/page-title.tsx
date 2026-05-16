import { Text, type TextProps } from "react-native";

import { typography } from "@/design/theme";

type PageTitleProps = TextProps & {
  size?: "default" | "large";
};

export function PageTitle({ size = "default", style, ...props }: PageTitleProps) {
  return (
    <Text
      adjustsFontSizeToFit
      numberOfLines={1}
      selectable
      {...props}
      style={[size === "large" ? typography.pageTitleLarge : typography.pageTitle, style]}
    />
  );
}
