import * as Haptics from "expo-haptics";
import { Pressable, ScrollView, Text, View } from "react-native";

import { colors, radius, spacing } from "@/design/theme";

export type FilterPillOption<T extends string> = {
  id: T;
  label: string;
};

type FilterPillBarProps<T extends string> = {
  options: readonly FilterPillOption<T>[];
  selectedIds: readonly T[];
  onToggle: (id: T) => void;
};

export function FilterPillBar<T extends string>({ options, selectedIds, onToggle }: FilterPillBarProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -spacing.lg }}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: spacing.lg,
      }}
    >
      {options.map((option, index) => {
        const selected = selectedIds.includes(option.id);

        return (
          <View key={option.id} style={{ alignItems: "center", flexDirection: "row" }}>
            {index > 0 ? (
              <View
                style={{
                  backgroundColor: colors.line,
                  height: 18,
                  marginHorizontal: spacing.xs,
                  width: 1,
                }}
              />
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Filter by ${option.label}`}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onToggle(option.id);
              }}
              style={({ pressed }) => ({
                backgroundColor: selected ? colors.brandSoft : "transparent",
                borderRadius: radius.full,
                opacity: pressed ? 0.68 : 1,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              })}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: selected ? colors.brandDark : colors.muted,
                  fontSize: 15,
                  fontWeight: selected ? "900" : "800",
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}
