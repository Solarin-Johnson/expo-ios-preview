import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Label>Recent</Label>
          <Icon sf="clock.fill" drawable="ic_history" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="shared">
          <Icon sf="folder.fill.badge.person.crop" drawable="folder_shared" />
          <Label>Shared</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="browse">
          <Icon sf="folder.fill" drawable="folder" />
          <Label>Browse</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </GestureHandlerRootView>
  );
}
