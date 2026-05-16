import { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

function readWebViewport(fallback: { height: number; scale: number; fontScale: number; width: number }) {
  if (typeof window === "undefined") {
    return {
      ...fallback,
      height: fallback.height > 0 ? fallback.height : 932,
      width: fallback.width > 0 ? fallback.width : 430,
    };
  }

  return {
    ...fallback,
    height: window.innerHeight,
    width: window.innerWidth,
  };
}

export function useAppViewportDimensions() {
  const dimensions = useWindowDimensions();
  const [webViewport, setWebViewport] = useState(() => readWebViewport(dimensions));

  useEffect(() => {
    if (Platform.OS !== "web") {
      return undefined;
    }

    const update = () => setWebViewport(readWebViewport(dimensions));
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [dimensions.fontScale, dimensions.height, dimensions.scale, dimensions.width]);

  return Platform.OS === "web" ? webViewport : dimensions;
}
