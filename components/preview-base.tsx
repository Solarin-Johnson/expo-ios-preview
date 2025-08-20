import { StyleSheet, View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedView } from "./themed-view";
import { BlurView } from "expo-blur";
import { ThemedText } from "./themed-text";
import { SafeAreaView } from "react-native-safe-area-context";

export const SPRING_CONFIG = {
  damping: 26,
  stiffness: 200,
  mass: 0.7,
};

export default function PreviewBase({
  children,
}: {
  children: React.ReactNode;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const card = useThemeColor("card");
  const text = useThemeColor("text");

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  console.log(card);

  return (
    <ThemedView style={styles.container}>
      <PreviewTray />
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        backgroundStyle={[
          styles.bgStyle,
          {
            backgroundColor: card + "AB",
          },
        ]}
        handleComponent={() => null}
        snapPoints={["50%", "100%"]}
        overDragResistanceFactor={3}
        animationConfigs={SPRING_CONFIG}
        topInset={-1}
        backgroundComponent={({ style }) => (
          <BlurView style={style} intensity={72} />
        )}
      >
        <BottomSheetScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    </ThemedView>
  );
}

const PreviewTray = () => {
  const bg = useThemeColor("background");
  const text = useThemeColor("text");
  return (
    <SafeAreaView style={styles.trayContainer}>
      <View style={styles.container}>
        <ThemedView
          colorName="baseTray"
          style={[styles.baseTray, { borderColor: text + "0A" }]}
        />
        <ThemedView colorName="tray" style={styles.floatingTray} />

        {/* <ThemedText>Preview Tray</ThemedText> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  bgStyle: {
    width: "100.4%",
    marginLeft: "-0.2%",
    borderRadius: 36,
    borderCurve: "continuous",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    boxShadow: "0px 0px 24px rgba(0, 0, 0, 0.08)",
  },
  trayContainer: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    // backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  baseTray: {
    flex: 1,
    borderRadius: 36,
    opacity: 0.8,
    borderCurve: "continuous",
    marginTop: 48,
    borderWidth: 1,
    boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.05)",
  },
  floatingTray: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    margin: 24,
    marginTop: 16,
    borderRadius: 24,
    borderCurve: "continuous",
    boxShadow: "0px 0px 54px rgba(0, 0, 0, 0.08)",
  },
});
