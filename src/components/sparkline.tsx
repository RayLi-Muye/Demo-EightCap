import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

import { colors } from "@/design/theme";

type SparklineProps = {
  values: number[];
  color: string;
  height?: number;
  width?: number;
  variant?: "light" | "dark";
  fillArea?: boolean;
  showDot?: boolean;
  showGuide?: boolean;
};

export function Sparkline({
  values,
  color,
  height = 54,
  width = 132,
  variant = "light",
  fillArea,
  showDot = true,
  showGuide = true,
}: SparklineProps) {
  const padding = 4;
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

  return (
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
      {showDot && lastPoint ? <Circle cx={lastPoint.x} cy={lastPoint.y} fill={color} r={3.5} /> : null}
    </Svg>
  );
}
