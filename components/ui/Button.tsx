import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import React, { ReactElement } from "react";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ThemedText, ThemedTextWrapper } from "../themed-text";

interface ButtonProps {
  title?: string;
  children?: ReactElement;
  style?: StyleProp<ViewStyle>;
}

export default function Button({ title, children, style }: ButtonProps) {
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
        style,
      ]}
      activeOpacity={0.7}
    >
      {children ? (
        <ThemedTextWrapper>{children}</ThemedTextWrapper>
      ) : (
        <ThemedText
          type="defaultSemiBold"
          style={[styles.text, { color: text }]}
        >
          {title}
        </ThemedText>
      )}
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
