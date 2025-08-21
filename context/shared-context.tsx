import { createContext, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

interface SharedContextProps {
  fullscreen: SharedValue<boolean>;
}

const SharedContext = createContext<SharedContextProps | null>(null);

export const SharedContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const fullscreen = useSharedValue(false);

  return (
    <SharedContext.Provider value={{ fullscreen }}>
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
