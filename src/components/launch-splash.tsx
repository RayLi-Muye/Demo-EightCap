import { BlurView } from "expo-blur";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Text as SvgText } from "react-native-svg";

import { colors } from "@/design/theme";

const CORE_GLYPHS = "00112233445566778899";
const EDGE_GLYPHS = "..::--++==";
const START_TILT_RADIANS = (-24 * Math.PI) / 180;

type CloudPoint = {
  char: string;
  phase: number;
  weight: number;
  x: number;
  y: number;
  z: number;
};

type ProjectedPoint = CloudPoint & {
  color: string;
  fontSize: number;
  opacity: number;
  screenX: number;
  screenY: number;
};

function random(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function chooseGlyph(seed: number, weight: number) {
  const source = weight > 0.36 ? CORE_GLYPHS : EDGE_GLYPHS;
  return source[Math.floor(random(seed) * source.length)];
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function mix(from: number, to: number, amount: number) {
  return Math.round(from + (to - from) * amount);
}

function greenTone(depth: number, shimmer: number) {
  const amount = clamp(0.28 + depth * 0.5 + shimmer * 0.22, 0, 1);
  return `rgb(${mix(5, 67, amount)}, ${mix(158, 225, amount)}, ${mix(76, 126, amount)})`;
}

function createEightCloud() {
  const points: CloudPoint[] = [];
  const cols = 40;
  const rows = 58;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const seed = row * 173 + col * 97 + 13;
      const x = -0.82 + (col / (cols - 1)) * 1.64;
      const y = -0.96 + (row / (rows - 1)) * 1.92;

      const topOuter = (x / 0.56) ** 2 + ((y + 0.36) / 0.43) ** 2;
      const bottomOuter = (x / 0.64) ** 2 + ((y - 0.34) / 0.52) ** 2;
      const topInner = (x / 0.29) ** 2 + ((y + 0.36) / 0.22) ** 2;
      const bottomInner = (x / 0.34) ** 2 + ((y - 0.34) / 0.28) ** 2;
      const topBand = topOuter < 1 && topInner > 1;
      const bottomBand = bottomOuter < 1 && bottomInner > 1;
      const bridge = Math.abs(x) < 0.19 && y > -0.19 && y < 0.18;
      const edge = (topOuter < 1.08 && topInner > 0.88) || (bottomOuter < 1.07 && bottomInner > 0.9);

      if (!topBand && !bottomBand && !bridge && !edge) {
        continue;
      }

      const jitterX = (random(seed + 1) - 0.5) * 0.018;
      const jitterY = (random(seed + 2) - 0.5) * 0.018;
      const ringEnergy = Math.min(Math.abs(topOuter - 0.68), Math.abs(bottomOuter - 0.67));
      const weight = clamp((topBand || bottomBand || bridge ? 0.68 : 0.34) + (0.22 - ringEnergy) + random(seed + 3) * 0.16, 0, 1);

      points.push({
        char: chooseGlyph(seed + 4, weight),
        phase: random(seed + 5) * Math.PI * 2,
        weight,
        x: x + jitterX,
        y: y + jitterY,
        z: Math.sin(x * 4.2 + y * 1.8) * 0.11 + (random(seed + 6) - 0.5) * 0.14,
      });
    }
  }

  return points;
}

function rotatePoint(point: CloudPoint, time: number) {
  const wave = Math.sin(time * 0.9 + point.phase) * 0.018;
  let x = point.x + wave;
  let y = point.y + Math.cos(time * 0.72 + point.phase) * 0.014;
  let z = point.z + Math.sin(time * 1.1 + point.phase) * 0.025;

  const rotX = Math.sin(time * 0.65) * 0.2;
  const rotY = Math.sin(time * 0.48 + 1.1) * 0.26;
  const rotZ = START_TILT_RADIANS + Math.sin(time * 0.36) * 0.08;

  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;
  y = y1;
  z = z1;

  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const x1 = x * cosY + z * sinY;
  const z2 = -x * sinY + z * cosY;
  x = x1;
  z = z2;

  const cosZ = Math.cos(rotZ);
  const sinZ = Math.sin(rotZ);

  return {
    x: x * cosZ - y * sinZ,
    y: x * sinZ + y * cosZ,
    z,
  };
}

function projectCloud(points: CloudPoint[], frame: number, width: number, height: number) {
  const time = frame / 30;
  const scale = Math.min(width * 0.52, height * 0.56);
  const centerX = width / 2;
  const centerY = height / 2 + 8;
  const cameraDistance = 2.8;

  return points
    .map((point) => {
      const rotated = rotatePoint(point, time);
      const depth = clamp((rotated.z + 0.85) / 1.7, 0, 1);
      const perspective = cameraDistance / (cameraDistance - rotated.z);
      const shimmer = (Math.sin(time * 3.2 + point.phase) + 1) / 2;
      const opacity = clamp(0.18 + depth * 0.48 + point.weight * 0.28 + shimmer * 0.08, 0.16, 0.98);

      return {
        ...point,
        color: greenTone(depth, shimmer),
        fontSize: clamp(10.5 + perspective * 4 + point.weight * 2.5, 10, 18),
        opacity,
        screenX: centerX + rotated.x * scale * perspective,
        screenY: centerY + rotated.y * scale * perspective,
        z: rotated.z,
      };
    })
    .sort((a, b) => a.z - b.z);
}

export function LaunchSplash() {
  const [frame, setFrame] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { height, width } = useWindowDimensions();
  const fade = useSharedValue(1);
  const points = useMemo(createEightCloud, []);
  const stageWidth = width;
  const stageHeight = Math.max(360, height - 184);
  const projectedPoints = useMemo(
    () => projectCloud(points, frame, stageWidth, stageHeight),
    [frame, points, stageHeight, stageWidth],
  );

  useEffect(() => {
    let frameId = 0;
    let lastTick = 0;

    function tick(now: number) {
      if (now - lastTick > 33) {
        lastTick = now;
        setFrame((value) => value + 1);
      }

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  function enterApp() {
    fade.value = withTiming(0, { duration: 460, easing: Easing.inOut(Easing.cubic) }, (finished) => {
      if (finished) {
        runOnJS(setIsVisible)(false);
      }
    });
  }

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View accessibilityViewIsModal style={[StyleSheet.absoluteFillObject, styles.root, containerStyle]}>
      <View style={[styles.corner, styles.cornerTopLeft]} />
      <View style={[styles.corner, styles.cornerTopRight]} />
      <View style={[styles.corner, styles.cornerBottomLeft]} />
      <View style={[styles.corner, styles.cornerBottomRight]} />

      <Text style={styles.title}>EightCap-Frontend Prototype</Text>

      <View style={[styles.characterStage, { height: stageHeight }]}>
        <Svg height={stageHeight} width={stageWidth}>
          {projectedPoints.map((point, index) => (
            <SvgText
              key={`${index}-${point.phase}`}
              fill={point.color}
              fontFamily="Courier"
              fontSize={point.fontSize}
              fontWeight="700"
              opacity={point.opacity}
              textAnchor="middle"
              x={point.screenX}
              y={point.screenY}
            >
              {point.char}
            </SvgText>
          ))}
        </Svg>
      </View>

      <Pressable
        accessibilityLabel="Enter main interface"
        accessibilityRole="button"
        onPress={enterApp}
        style={({ pressed }) => [styles.enterButton, pressed && styles.enterButtonPressed]}
      >
        <BlurView intensity={54} tint="light" style={styles.buttonBlur}>
          <Text style={styles.enterButtonText}>Enter Prototype</Text>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonBlur: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.42)",
    borderColor: "rgba(255, 255, 255, 0.68)",
    borderRadius: 26,
    borderWidth: 1,
    height: "100%",
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 26,
  },
  characterStage: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 104,
  },
  corner: {
    borderColor: "rgba(8, 11, 18, 0.78)",
    height: 22,
    position: "absolute",
    width: 22,
  },
  cornerBottomLeft: {
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    bottom: 22,
    left: 22,
  },
  cornerBottomRight: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    bottom: 22,
    right: 22,
  },
  cornerTopLeft: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    left: 22,
    top: 22,
  },
  cornerTopRight: {
    borderRightWidth: 2,
    borderTopWidth: 2,
    right: 22,
    top: 22,
  },
  enterButton: {
    borderRadius: 26,
    bottom: 42,
    boxShadow: "0 16px 42px rgba(0, 255, 106, 0.18)",
    height: 52,
    minWidth: 190,
    overflow: "hidden",
    position: "absolute",
    transform: [{ scale: 1 }],
  },
  enterButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  enterButtonText: {
    color: colors.brandDark,
    fontFamily: "Courier",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  root: {
    alignItems: "center",
    backgroundColor: colors.canvas,
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 1000,
  },
  title: {
    color: colors.ink,
    fontFamily: "Courier",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1.4,
    position: "absolute",
    textAlign: "center",
    top: 54,
  },
});
