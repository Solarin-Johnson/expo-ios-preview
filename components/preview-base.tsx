import { Text, StyleSheet, StyleProp, ViewStyle, View } from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedView } from "./themed-view";
import { BlurView } from "expo-blur";
import { ThemedText } from "./themed-text";

export const SPRING_CONFIG = {
  damping: 26,
  stiffness: 200,
  mass: 0.7,
};

const curveConfig = {
  borderTopLeftRadius: 32,
  borderTopRightRadius: 32,
  borderCurve: "continuous",
} as const;

export default function PreviewBase({
  children,
}: {
  children: React.ReactNode;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bg = useThemeColor("background");

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  return (
    <ThemedView style={styles.container}>
      <Text>preview-base</Text>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor: bg,
          overflow: "hidden",
          ...curveConfig,
        }}
        snapPoints={[450, "100%"]}
        overDragResistanceFactor={4}
        animationConfigs={SPRING_CONFIG}
        backgroundComponent={({ style }) => (
          <BlurView
            style={[{ backgroundColor: bg }, style]}
            tint="dark"
            intensity={60}
          />
        )}
      >
        <BottomSheetScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <ThemedText>Awesome 🎉</ThemedText>
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  bgCompStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
