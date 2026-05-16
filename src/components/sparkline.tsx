import { useMemo, useState } from "react";
import { PanResponder, Text, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

import { colors, radius, shadows, spacing } from "@/design/theme";

export type SparklineDatum = {
  dateLabel: string;
  timeLabel: string;
  valueLabel: string;
};

type SparklineProps = {
  values: number[];
  color: string;
  data?: SparklineDatum[];
  height?: number;
  width?: number;
  variant?: "light" | "dark";
  fillArea?: boolean;
  interactive?: boolean;
  showDot?: boolean;
  showGuide?: boolean;
};

export function Sparkline({
  values,
  color,
  data,
  height = 54,
  width = 132,
  variant = "light",
  fillArea,
  interactive,
  showDot = true,
  showGuide = true,
}: SparklineProps) {
  const padding = 4;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
    const y = padding + (1 - (value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const areaPath = `${path} L ${width - padding} ${height} L ${padding} ${height} Z`;
  const lastPoint = points[points.length - 1];
  const guideColor = variant === "dark" ? "rgba(255,255,255,0.15)" : colors.line;
  const activePoint = activeIndex === null ? null : points[activeIndex];
  const activeDatum = activeIndex === null ? null : data?.[activeIndex];

  const updateActiveIndex = useMemo(
    () => (locationX: number) => {
      const chartWidth = Math.max(width - padding * 2, 1);
      const boundedX = Math.max(padding, Math.min(locationX, width - padding));
      const index = Math.round(((boundedX - padding) / chartWidth) * Math.max(values.length - 1, 1));
      setActiveIndex(Math.max(0, Math.min(index, values.length - 1)));
    },
    [values.length, width],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
      onMoveShouldSetPanResponder: () => Boolean(interactive),
      onPanResponderGrant: (event) => updateActiveIndex(event.nativeEvent.locationX),
      onPanResponderMove: (event) => updateActiveIndex(event.nativeEvent.locationX),
      onPanResponderRelease: () => setActiveIndex(null),
      onPanResponderTerminate: () => setActiveIndex(null),
      onStartShouldSetPanResponder: () => Boolean(interactive),
    }),
    [interactive, updateActiveIndex],
  );

  const tooltipWidth = width < 360 ? 136 : 156;
  const tooltipLeft = activePoint ? Math.max(8, Math.min(activePoint.x - tooltipWidth / 2, width - tooltipWidth - 8)) : 0;
  const tooltipTop = activePoint ? Math.max(8, Math.min(activePoint.y - 74, height - 78)) : 0;

  return (
    <View
      {...(interactive ? panResponder.panHandlers : {})}
      style={{ height, position: "relative", width }}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="sparklineFill" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.18" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {showGuide ? <Line x1={padding} x2={width - padding} y1={height / 2} y2={height / 2} stroke={guideColor} strokeWidth={1} /> : null}
        {fillArea ? <Path d={areaPath} fill="url(#sparklineFill)" /> : null}
        <Path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
        {activePoint ? (
          <>
            <Line x1={activePoint.x} x2={activePoint.x} y1={padding} y2={height - padding} stroke="rgba(8,11,18,0.20)" strokeDasharray="4 5" strokeWidth={1.2} />
            <Circle cx={activePoint.x} cy={activePoint.y} fill={colors.surface} r={7} stroke={color} strokeWidth={3} />
          </>
        ) : showDot && lastPoint ? (
          <Circle cx={lastPoint.x} cy={lastPoint.y} fill={color} r={3.5} />
        ) : null}
      </Svg>

      {activePoint && activeDatum ? (
        <View
          style={{
            ...shadows.card,
            backgroundColor: "rgba(255,255,255,0.88)",
            borderColor: "rgba(255,255,255,0.86)",
            borderRadius: radius.md,
            borderWidth: 1,
            gap: spacing.xs,
            left: tooltipLeft,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            pointerEvents: "none",
            position: "absolute",
            top: tooltipTop,
            width: tooltipWidth,
          }}
        >
          <Text numberOfLines={1} style={{ color: colors.ink, fontSize: 16, fontVariant: ["tabular-nums"], fontWeight: "600" }}>
            {activeDatum.valueLabel}
          </Text>
          <Text numberOfLines={1} style={{ color: colors.muted, fontSize: 12, fontWeight: "500" }}>
            {activeDatum.dateLabel}
          </Text>
          <Text numberOfLines={1} style={{ color: colors.subtle, fontSize: 12, fontWeight: "500" }}>
            {activeDatum.timeLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
