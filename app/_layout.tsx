import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome";
import { PaperProvider } from 'react-native-paper';

import useShareIntent from "../hooks/useShareIntent";
import AppContextProvider from "../context/AppContext";
import RootContextProvider from "../context/RootContext";
import TipProvider from "react-native-tip";
import LicenseScreen from "../components/LicenseScreen";
import { LogBox } from 'react-native';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import { paperLightTheme, paperDarkTheme } from '../theme/theme';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

function TabsLayout() {
  const router = useRouter();
  const shareIntent = useShareIntent();
  const { theme, isDark } = useTheme();

  useEffect(() => {
    if (shareIntent?.data) {
      router.replace({ pathname: "/" });
      // resetShareIntent();
    }
  }, [shareIntent]);

  return (
    <PaperProvider theme={isDark ? paperDarkTheme : paperLightTheme}>
      <Tabs
        screenOptions={{
          headerTintColor: theme.colors.primary,
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.surfaceContainer,
            borderTopColor: theme.colors.outlineVariant,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
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
          name="settings"
          options={{
            headerTitle: "Settings - safecantonese.ai",
            title: "Settings",
            tabBarIcon: (props) => <Icon name="cog" {...props} />,
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            headerTitle: "About - safecantonese.ai",
            title: "About",
            tabBarIcon: (props) => <Icon name="info" {...props} />,
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <LicenseScreen>
        <RootContextProvider>
          <AppContextProvider>
            <TipProvider statusBarTranslucent />
            <TabsLayout />
          </AppContextProvider>
        </RootContextProvider>
      </LicenseScreen>
    </ThemeProvider>
  );
}
