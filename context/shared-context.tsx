import { createContext, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

interface SharedContextProps {
  fullscreen: SharedValue<boolean>;
  progress: SharedValue<number>;
}

const SharedContext = createContext<SharedContextProps | null>(null);

export const SharedContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const fullscreen = useSharedValue(false);
  const progress = useSharedValue(0);

  return (
    <SharedContext.Provider value={{ fullscreen, progress }}>
      {children}
    </SharedContext.Provider>
  );
};

export const useSharedContext = () => {
  const context = useContext(SharedContext);
  if (!context) {
    throw new Error(
      "useSharedContext must be used within a SharedContextProvider"
    );
  }
  return context;
};
