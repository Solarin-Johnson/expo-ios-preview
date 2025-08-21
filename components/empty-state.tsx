import React from "react";
import { ThemedText } from "./themed-text";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSharedContext } from "@/context/shared-context";
import { StyleSheet, View } from "react-native";
import { BOTTOM_INSET } from "@/constants";
import { SymbolView, SymbolViewProps } from "expo-symbols";
import { useThemeColor } from "@/hooks/use-theme-color";
import { hexToRgba } from "@/functions";

interface EmptyStateProps {
  title?: string;
  symbol?: SymbolViewProps["name"];
}

export default function EmptyState({
  title,
  symbol = "doc.fill",
}: EmptyStateProps) {
  const displayedTitle = `No${title ? ` ${title}` : ""} Files`;
  const displayedSubtitle = `${title ? title : ""} files will appear here.`;

  const text = useThemeColor("text");
  const tintColor = hexToRgba(text, 0.65);

  const { progress } = useSharedContext();
  const height = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const h = height.value;
    return {
      height: interpolate(progress.value, [0, 1], [h / 2 - BOTTOM_INSET, h]),
    };
  });

  const onLayout = (event: any) => {
    const { height: newHeight } = event.nativeEvent.layout;
    height.value = newHeight;
  };

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <SymbolView
          name={symbol}
          style={styles.symbol}
          type="palette"
          tintColor={tintColor}
        />
        <ThemedText type="title" style={styles.title}>
          {displayedTitle}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{displayedSubtitle}</ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.65,
  },
  symbol: {
    width: 64,
    height: 64,
    margin: 8,
  },
});
