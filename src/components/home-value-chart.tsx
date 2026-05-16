import * as Haptics from "expo-haptics";
import { ArrowDownToLine, ArrowUpFromLine, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { PageTitle } from "@/components/page-title";
import { homeRangeDeltas, type HomeChartRange } from "@/data/portfolio";
import { colors, radius, spacing } from "@/design/theme";
import { useDemoAccountSummary } from "@/hooks/use-demo-portfolio";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/utils/format";

import { Sparkline, type SparklineDatum } from "./sparkline";

const RANGE_OPTIONS: { label: string; value: HomeChartRange }[] = [
  { label: "1H", value: "hourly" },
  { label: "1D", value: "daily" },
  { label: "1W", value: "weekly" },
  { label: "1M", value: "monthly" },
  { label: "1Q", value: "quarterly" },
  { label: "1Y", value: "yearly" },
];

const homeChartEnd = new Date(2026, 4, 15, 15, 30);
const homeDateFormatter = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" });
const homeTimeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const homeRangeStepMinutes: Record<HomeChartRange, number> = {
  hourly: 2,
  daily: 12,
  weekly: 360,
  monthly: 1440,
  quarterly: 4320,
  yearly: 17520,
};

function getHomeChartDate(index: number, total: number, range: HomeChartRange) {
  const offset = (total - 1 - index) * homeRangeStepMinutes[range] * 60 * 1000;
  return new Date(homeChartEnd.getTime() - offset);
}

function AccountMetric({ compact, label, value }: { compact: boolean; label: string; value: number }) {
  return (
    <View style={{ gap: spacing.xs, minWidth: 0 }}>
      <Text numberOfLines={1} style={{ color: colors.muted, fontSize: compact ? 11 : 12, fontWeight: "500" }}>
        {label}
      </Text>
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={{ color: colors.ink, fontSize: compact ? 15 : 17, fontVariant: ["tabular-nums"], fontWeight: "600" }}
      >
        {formatCurrency(value)}
      </Text>
    </View>
  );
}

function FundsActionButton({ compact, label, variant }: { compact: boolean; label: string; variant: "primary" | "secondary" }) {
  const primary = variant === "primary";
  const Icon = variant === "primary" ? ArrowDownToLine : ArrowUpFromLine;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
      }}
      style={({ pressed }) => ({
        alignItems: "center",
        backgroundColor: primary ? colors.brandAction : "rgba(255,255,255,0.64)",
        borderColor: primary ? "transparent" : "rgba(8,11,18,0.12)",
        borderRadius: radius.full,
        borderWidth: 1,
        height: compact ? 38 : 38,
        justifyContent: "center",
        minWidth: compact ? 38 : 88,
        opacity: pressed ? 0.72 : 1,
        paddingHorizontal: compact ? 0 : spacing.md,
        width: compact ? 38 : undefined,
      })}
    >
      {compact ? (
        <Icon color={primary ? colors.inverse : colors.ink} size={18} strokeWidth={2.5} />
      ) : (
        <Text style={{ color: primary ? colors.inverse : colors.ink, fontSize: 13, fontWeight: "600" }}>{label}</Text>
      )}
    </Pressable>
  );
}

function TimeSlotControl({
  onChange,
  value,
}: {
  onChange: (value: HomeChartRange) => void;
  value: HomeChartRange;
}) {
  const [trackWidth, setTrackWidth] = useState(1);
  const activeIndex = Math.max(
    0,
    RANGE_OPTIONS.findIndex((option) => option.value === value),
  );
  const pillX = useSharedValue(0);
  const slotWidth = Math.max((trackWidth - 8) / RANGE_OPTIONS.length, 1);

  useEffect(() => {
    pillX.value = withSpring(activeIndex * slotWidth, {
      damping: 20,
      mass: 0.75,
      stiffness: 260,
    });
  }, [activeIndex, pillX, slotWidth]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: slotWidth,
  }));

  return (
    <View
      onLayout={(event) => setTrackWidth(Math.max(event.nativeEvent.layout.width, 1))}
      style={{
        backgroundColor: "rgba(255,255,255,0.42)",
        borderColor: "rgba(255,255,255,0.72)",
        borderRadius: radius.full,
        borderWidth: 1,
        flexDirection: "row",
        height: 46,
        overflow: "hidden",
        padding: 4,
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: colors.surface,
            borderColor: "rgba(5,184,63,0.18)",
            borderRadius: radius.full,
            borderWidth: 1,
            bottom: 4,
            boxShadow: "0 8px 22px rgba(5, 184, 63, 0.16)",
            left: 4,
            position: "absolute",
            top: 4,
          },
          pillStyle,
        ]}
      />
      {RANGE_OPTIONS.map((option, index) => {
        const isActive = index === activeIndex;
        return (
          <Pressable
            accessibilityLabel={`Set chart range to ${option.label}`}
            accessibilityRole="button"
            key={option.value}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(option.value);
            }}
            style={{
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <Text style={{ color: isActive ? colors.ink : colors.muted, fontSize: 13, fontWeight: "600" }}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function HomeValueChart() {
  const { width } = useWindowDimensions();
  const isPad = width >= 768;
  const accountSummary = useDemoAccountSummary();
  const [range, setRange] = useState<HomeChartRange>("daily");
  const [liveOffset, setLiveOffset] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const tickRef = useRef(0);
  const chartHeightValue = useSharedValue(isPad ? 181 : 150);
  const expandedProgress = useSharedValue(0);

  useEffect(() => {
    const timer = setInterval(() => {
      tickRef.current += 1;
      setLiveOffset(Math.sin(tickRef.current * 1.43) * 18 + Math.cos(tickRef.current * 0.78) * 6);
    }, 3400);

    return () => clearInterval(timer);
  }, []);

  const liveValue = accountSummary.totalValue + liveOffset;

  const rangeCurve = useMemo(() => {
    return homeRangeDeltas[range].map((delta) => liveValue + delta);
  }, [liveValue, range]);

  const chartData = useMemo<SparklineDatum[]>(() => {
    return rangeCurve.map((value, index) => {
      const date = getHomeChartDate(index, rangeCurve.length, range);
      return {
        dateLabel: homeDateFormatter.format(date),
        timeLabel: homeTimeFormatter.format(date),
        valueLabel: hidden ? "$********" : formatCurrency(value),
      };
    });
  }, [hidden, range, rangeCurve]);

  const firstRangeValue = rangeCurve[0] ?? liveValue;
  const lastRangeValue = rangeCurve[rangeCurve.length - 1] ?? liveValue;
  const scaledChange = lastRangeValue - firstRangeValue;
  const scaledPercent = firstRangeValue === 0 ? 0 : (scaledChange / firstRangeValue) * 100;
  const movementColor = scaledChange >= 0 ? colors.positive : colors.negative;
  const collapsedChartHeight = isPad ? 181 : 150;
  const expandedChartHeight = isPad ? 210 : 174;
  const chartHeight = expanded ? expandedChartHeight : collapsedChartHeight;
  const expandedPanelHeight = isPad ? 126 : 122;

  useEffect(() => {
    chartHeightValue.value = withTiming(expanded ? expandedChartHeight : collapsedChartHeight, {
      duration: 520,
      easing: Easing.out(Easing.cubic),
    });
    expandedProgress.value = withTiming(expanded ? 1 : 0, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });
  }, [chartHeightValue, collapsedChartHeight, expanded, expandedChartHeight, expandedProgress]);

  const chartAnimatedStyle = useAnimatedStyle(() => ({
    height: chartHeightValue.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.72 + expandedProgress.value * 0.28,
    transform: [{ rotate: `${expandedProgress.value * -90}deg` }, { scale: 1 + expandedProgress.value * 0.04 }],
  }));

  const expandedPanelStyle = useAnimatedStyle(() => ({
    height: expandedProgress.value * expandedPanelHeight,
    opacity: expandedProgress.value,
  }));

  const expandedPanelInnerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - expandedProgress.value) * -8 }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.duration(560).springify()}
      layout={LinearTransition.duration(300)}
      style={{ gap: spacing.md, marginHorizontal: -spacing.lg }}
    >
      <View style={{ gap: spacing.sm, paddingHorizontal: spacing.lg }}>
        <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <PageTitle style={{ fontSize: isPad ? 28 : 25, lineHeight: isPad ? 34 : 31 }}>
              Cash and Holding
            </PageTitle>
          </View>

          <Pressable
            accessibilityLabel={expanded ? "Collapse cash and holding" : "Expand cash and holding"}
            accessibilityRole="button"
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setExpanded((current) => !current);
            }}
            style={({ pressed }) => ({
              alignItems: "center",
              height: 34,
              justifyContent: "center",
              opacity: pressed ? 0.58 : 1,
              width: 34,
            })}
          >
            <Animated.View style={iconAnimatedStyle}>
              {expanded ? (
                <Minimize2 color={colors.muted} size={20} strokeWidth={2.2} />
              ) : (
                <Maximize2 color={colors.muted} size={20} strokeWidth={2.2} />
              )}
            </Animated.View>
          </Pressable>
        </View>

        <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm, justifyContent: "space-between" }}>
          <View style={{ alignItems: "center", flex: 1, flexDirection: "row", gap: spacing.xs, minWidth: 0 }}>
            <Text
              selectable
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{
                color: colors.ink,
                flexShrink: 1,
                fontSize: isPad ? 48 : 31,
                fontVariant: ["tabular-nums"],
                fontWeight: "500",
                letterSpacing: 0,
              }}
            >
              {hidden ? "$********" : formatCurrency(liveValue)}
            </Text>
            <Pressable
              accessibilityLabel={hidden ? "Show cash amount" : "Hide cash amount"}
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setHidden((current) => !current);
              }}
            >
              {hidden ? (
                <EyeOff color={colors.muted} size={21} strokeWidth={2.3} />
              ) : (
                <Eye color={colors.muted} size={21} strokeWidth={2.3} />
              )}
            </Pressable>
          </View>

          <Text
            selectable
            numberOfLines={1}
            style={{ color: movementColor, fontSize: isPad ? 16 : 12, fontVariant: ["tabular-nums"], fontWeight: "600" }}
          >
            {formatSignedCurrency(scaledChange)} ({formatPercent(scaledPercent)})
          </Text>
        </View>
      </View>

      <Animated.View
        style={[
          {
            justifyContent: "center",
            overflow: "hidden",
            width,
          },
          chartAnimatedStyle,
        ]}
      >
        <Sparkline
          color={movementColor}
          data={chartData}
          fillArea
          height={chartHeight}
          interactive
          showDot={false}
          showGuide={false}
          values={rangeCurve}
          width={width}
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            overflow: "hidden",
            paddingHorizontal: spacing.lg,
            pointerEvents: expanded ? "auto" : "none",
          },
          expandedPanelStyle,
        ]}
      >
        <Animated.View layout={LinearTransition.duration(240)} style={[{ gap: spacing.md }, expandedPanelInnerStyle]}>
          <TimeSlotControl onChange={setRange} value={range} />

          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: spacing.md,
              justifyContent: "space-between",
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", gap: spacing.lg, minWidth: 0 }}>
              <AccountMetric compact={!isPad} label="Invested" value={accountSummary.investmentValue} />
              <AccountMetric compact={!isPad} label="Available" value={accountSummary.availableCash} />
            </View>
            <View style={{ alignSelf: "stretch", backgroundColor: "rgba(8,11,18,0.12)", width: 1 }} />
            <View style={{ flexDirection: "row", flexShrink: 0, gap: spacing.sm }}>
              <FundsActionButton compact={!isPad} label="Deposit" variant="primary" />
              <FundsActionButton compact={!isPad} label="Withdraw" variant="secondary" />
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}
