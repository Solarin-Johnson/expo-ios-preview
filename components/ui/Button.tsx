import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { ThemedViewWrapper } from "../themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText } from "../themed-text";

interface ButtonProps {
  title: string;
}

export default function Button({ title }: ButtonProps) {
  const text = useThemeColor("text");
  const card = useThemeColor("card");

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: text + "20",
          backgroundColor: card + "BB",
        },
      ]}
      activeOpacity={0.7}
    >
      <ThemedText type="defaultSemiBold" style={[styles.text, { color: text }]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 16,
    borderRadius: 100,
    borderWidth: 1,
  },
  text: {
    textAlign: "center",
  },
});
