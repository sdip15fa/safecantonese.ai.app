import React, { useEffect } from "react";
import { Slot, Tabs, useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome';

import useShareIntent from "../hooks/useShareIntent";

export default function Layout() {
  const router = useRouter();
  const { shareIntent, resetShareIntent } = useShareIntent();

  useEffect(() => {
    if (shareIntent?.data) {
      console.log("change of shareIntent in _layout");
      router.replace({ pathname: "shareintent", params: shareIntent });
      // resetShareIntent();
    }
  }, [shareIntent]);

  return (
    <Tabs
      screenOptions={{
        headerTitle: "safecantonese.ai",
        headerTintColor: "purple",
      }}
    >
      <Tabs.Screen
        // Name of the route to hide.
        name="shareintent"
        options={{
          // This tab will no longer show up in the tab bar.
          href: null,
        }}
      />
      <Tabs.Screen
        // Name of the route to hide.
        name="index"
        options={{
          // This tab will no longer show up in the tab bar.
          title: "Home",
          tabBarIcon: (props) => <Icon name="home" {...props} />
        }}
      />
      <Tabs.Screen
        // Name of the route to hide.
        name="models"
        options={{
          // This tab will no longer show up in the tab bar.
          title: "Models",
          tabBarIcon: (props) => <Icon name="gears" {...props} />
        }}
      />
    </Tabs>
  );
}
