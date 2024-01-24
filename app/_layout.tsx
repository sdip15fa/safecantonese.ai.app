import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome";

import useShareIntent from "../hooks/useShareIntent";
import AppContextProvider from "../context/AppContext";
import RootContextProvider from "../context/RootContext";
import TipProvider from "react-native-tip";
import LicenseScreen from "../components/LicenseScreen";

export default function Layout() {
  const router = useRouter();
  const shareIntent = useShareIntent();

  useEffect(() => {
    if (shareIntent?.data) {
      router.replace({ pathname: "/" });
      // resetShareIntent();
    }
  }, [shareIntent]);

  return (
    <LicenseScreen>
      <RootContextProvider>
        <AppContextProvider>
          <TipProvider statusBarTranslucent />
          <Tabs
            screenOptions={{
              headerTintColor: "purple",
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                headerTitle: "Home - safecantonese.ai",
                title: "Home",
                tabBarIcon: (props) => <Icon name="home" {...props} />,
              }}
            />
            <Tabs.Screen
              name="history"
              options={{
                headerTitle: "History - safecantonese.ai",
                title: "History",
                tabBarIcon: (props) => <Icon name="history" {...props} />,
              }}
            />
            <Tabs.Screen
              name="models"
              options={{
                headerTitle: "Models - safecantonese.ai",
                title: "Models",
                tabBarIcon: (props) => <Icon name="gears" {...props} />,
              }}
            />
            <Tabs.Screen
              name="about"
              options={{
                // This tab will no longer show up in the tab bar.
                headerTitle: "About - safecantonese.ai",
                title: "About",
                tabBarIcon: (props) => <Icon name="info" {...props} />,
              }}
            />
          </Tabs>
        </AppContextProvider>
      </RootContextProvider>
    </LicenseScreen>
  );
}
