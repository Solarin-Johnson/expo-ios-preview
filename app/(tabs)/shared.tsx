import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import PreviewBase from "@/components/preview-base";

export default function Tab() {
  return (
    <PreviewBase>
      <View style={styles.container}>
        <ThemedText type="title">Shared Screen</ThemedText>
      </View>
    </PreviewBase>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // padding: 16,
    minHeight: 1000,
    // backgroundColor: "red",
  },
});
