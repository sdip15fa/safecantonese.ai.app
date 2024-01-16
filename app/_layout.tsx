import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

import useShareIntent from "../hooks/useShareIntent";
import AppContextProvider from "../context/AppContext";

export default function Layout() {
  const router = useRouter();
  const shareIntent = useShareIntent();

  useEffect(() => {
    if (shareIntent?.data) {
      router.replace({ pathname: "shareintent" });
      // resetShareIntent();
    }
  }, [shareIntent]);

  return (
    <AppContextProvider>
      <Tabs
        screenOptions={{
          headerTintColor: "purple",
        }}
      >
        <Tabs.Screen
          // Name of the route to hide.
          name="shareintent"
          options={{
            title: "Transcribe - safecantonese.ai",
            // This tab will no longer show up in the tab bar.
            href: null,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: "Home - safecantonese.ai",
            title: "Home",
            tabBarIcon: (props) => <Icon name="home" {...props} />,
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
  );
}
