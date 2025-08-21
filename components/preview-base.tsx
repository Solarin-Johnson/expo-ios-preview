import { StyleSheet, useWindowDimensions, View } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedView } from "./themed-view";
import { BlurView } from "expo-blur";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedText } from "./themed-text";
import Button from "./ui/Button";
import { useSharedContext } from "@/context/shared-context";
import { useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hexToRgba } from "@/functions";

export const SPRING_CONFIG = {
  damping: 26,
  stiffness: 200,
  mass: 0.7,
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedBottomSheetScrollView = Animated.createAnimatedComponent(
  BottomSheetScrollView
);

const PARRALAX_FACTOR = 150;
const MIN_INTENSITY = 42;
const MAX_INTENSITY = 100;
const HEADER_HEIGHT = 72;
const BOTTOM_INSET = 92;

export default function PreviewBase({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fullscreen } = useSharedContext();
  const { top } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const card = useThemeColor("card");
  const animatedPosition = useSharedValue(0);
  const { height } = useWindowDimensions();
  const cardBg = hexToRgba(card, 0.4);
  const intensity = useSharedValue<number | undefined>(24);
  const animatedProgress = useDerivedValue(() => {
    const progress = 1 - animatedPosition.value / height / 0.5;
    return Math.min(progress, 1);
  });

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const toggleBottomSheet = useCallback(() => {
    if (fullscreen.value) {
      bottomSheetRef.current?.expand({ duration: 0 });
    } else {
      bottomSheetRef.current?.collapse({ duration: 0 });
    }
  }, [fullscreen]);

  useFocusEffect(
    useCallback(() => {
      toggleBottomSheet();
    }, [toggleBottomSheet])
  );

  useDerivedValue(() => {
    console.log(fullscreen.value);
  });

  useAnimatedReaction(
    () => animatedProgress.value,
    (progress) => {
      fullscreen.value = progress > 0.5;

      intensity.value = interpolate(
        progress,
        [0, 1],
        [MIN_INTENSITY, MAX_INTENSITY],
        Extrapolation.CLAMP
      );
    }
  );

  const scrollAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        animatedProgress.value,
        [0, 1],
        [HEADER_HEIGHT, HEADER_HEIGHT + top / 1.5],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <ThemedView style={styles.container}>
      <PreviewTray progress={animatedProgress} />
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        animatedPosition={animatedPosition}
        backgroundStyle={[styles.bgStyle, { backgroundColor: cardBg }]}
        handleComponent={() => null}
        snapPoints={["50%", "100%"]}
        overDragResistanceFactor={3}
        animationConfigs={SPRING_CONFIG}
        topInset={-1}
        backgroundComponent={({ style }) => (
          <AnimatedBlurView style={[style]} intensity={intensity} />
        )}
      >
        <Header progress={animatedProgress} />
        <AnimatedBottomSheetScrollView
          style={[styles.container, scrollAnimatedStyle]}
          contentContainerStyle={styles.contentContainer}
          scrollIndicatorInsets={{ top, bottom: BOTTOM_INSET }}
        >
          {children}
        </AnimatedBottomSheetScrollView>
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
      <SafeAreaView style={styles.trayContainer} edges={["top"]}>
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

const Header = ({ progress }: { progress: SharedValue<number> }) => {
  const { top } = useSafeAreaInsets();
  const card = useThemeColor("card");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        progress.value,
        [0, 1],
        [HEADER_HEIGHT, HEADER_HEIGHT + top / 2],
        Extrapolation.CLAMP
      ),
      paddingTop: interpolate(
        progress.value,
        [0, 1],
        [0, top],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.View
      style={[
        styles.headerWrapper,
        {
          experimental_backgroundImage: `linear-gradient(to bottom, ${card}BB, ${card}00)`,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.header]}>
        <Button style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={23} />
        </Button>
        <Button style={styles.headerBtn}>
          <Ionicons name="search" size={23} />
        </Button>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: BOTTOM_INSET,
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
    paddingBottom: 0,
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
    paddingBottom: 48,
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
  headerWrapper: {
    position: "absolute",
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    width: "100%",
    height: HEADER_HEIGHT,
    top: 0,
    zIndex: 1000,
    overflow: "hidden",
    justifyContent: "center",
  },
  header: {
    padding: 16,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
  },
  headerBtn: {
    width: 40,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  },
});
