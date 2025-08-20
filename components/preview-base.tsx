import { StyleSheet, useWindowDimensions, View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedView } from "./themed-view";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedText } from "./themed-text";
import Button from "./ui/Button";

export const SPRING_CONFIG = {
  damping: 26,
  stiffness: 200,
  mass: 0.7,
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const PARRALAX_FACTOR = 150;
const MIN_INTENSITY = 64;
const MAX_INTENSITY = 120;

export default function PreviewBase({
  children,
}: {
  children: React.ReactNode;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const card = useThemeColor("card");
  const animatedPosition = useSharedValue(0);
  const { height } = useWindowDimensions();
  const intensity = useSharedValue<number | undefined>(24);
  const animatedProgress = useDerivedValue(() => {
    const progress = 1 - animatedPosition.value / height / 0.5;
    return Math.min(progress, 1);
  });

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useAnimatedReaction(
    () => animatedProgress.value,
    (progress) => {
      intensity.value = interpolate(
        progress,
        [0, 1],
        [MIN_INTENSITY, MAX_INTENSITY],
        Extrapolation.CLAMP
      );
    }
  );

  return (
    <ThemedView style={styles.container}>
      <PreviewTray progress={animatedProgress} />
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        animatedPosition={animatedPosition}
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
          <AnimatedBlurView style={style} intensity={intensity} />
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

const PreviewTray = ({ progress }: { progress: SharedValue<number> }) => {
  const text = useThemeColor("text");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -progress.value * PARRALAX_FACTOR,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <SafeAreaView style={styles.trayContainer}>
        <View style={styles.container}>
          <ThemedView
            colorName="baseTray"
            style={[styles.baseTray, { borderColor: text + "0A" }]}
          />
          <ThemedView colorName="tray" style={styles.floatingTray}>
            <View style={styles.innerTray}>
              <ThemedText type="title" style={styles.title}>
                Preview
              </ThemedText>
              <View style={styles.buttonContainer}>
                <Button title="New Document" />
                <Button title="Scan Documents" />
              </View>
            </View>
          </ThemedView>
        </View>
      </SafeAreaView>
    </Animated.View>
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
  },
  baseTray: {
    flex: 1,
    borderRadius: 36,
    opacity: 0.8,
    borderCurve: "continuous",
    marginTop: 54,
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
  innerTray: {
    flex: 0.5,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  title: {
    fontSize: 62,
  },
  buttonContainer: {
    width: "100%",
    gap: 8,
  },
});
