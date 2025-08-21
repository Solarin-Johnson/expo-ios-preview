import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import PreviewBase from "@/components/preview-base";
import { Link } from "expo-router";

export default function Tab() {
  return (
    <PreviewBase>
      <View style={styles.container}>
        {/* <ThemedText type="title">Home Screen</ThemedText> */}
        {/* <Link href={"/modal"}>Open Modal</Link> */}
      </View>
    </PreviewBase>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    minHeight: 1000,
    alignItems: "center",
    // justifyContent: "center",
    padding: 20,
  },
});
