import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Colors } from "@/constants/theme";
import { cloneElement } from "react";

export type ThemedViewProps = ViewProps & {
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedView({
  style,
  colorName = "background",
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(colorName);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ThemedViewWrapper({
  children,
  colorName = "background",
  style,
  ...rest
}: ThemedViewProps & { children: React.ReactElement<any> }) {
  const backgroundColor = useThemeColor(colorName);

  const combinedStyle = [{ backgroundColor }, style];

  return cloneElement(children, {
    style: [(children.props as any).style ?? {}, ...combinedStyle],
    ...rest,
  });
}
