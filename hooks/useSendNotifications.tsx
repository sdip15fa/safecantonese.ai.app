import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";
import { useEffect } from "react";
import { Share } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useSendNotifications() {
  // First, set the handler that will cause the notification
  // to show the alert

  useEffect(() => {
    Notifications.getPermissionsAsync().then((value) => {
      if (value.granted) return;
      else if (value.status === "undetermined" || value.canAskAgain) {
        Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
          },
        });
      }
    });
    Notifications.setNotificationCategoryAsync("transcribedText", [
      {
        buttonTitle: "Copy",
        identifier: "copy",
        options: { opensAppToForeground: false },
      },
      {
        buttonTitle: "Share",
        identifier: "share",
        options: { opensAppToForeground: true },
      },
    ]);
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (response.notification.request.content.body) {
          if (response.actionIdentifier === "copy") {
            Clipboard.setStringAsync(
              response.notification.request.content.body
            );
          } else if (response.actionIdentifier === "share") {
            Share.share({
              message: response.notification.request.content.body,
            });
          }
        }
      }
    );
    return () => subscription.remove();
  }, []);

  return (
    content: {
      title?: string;
      subtitle?: string;
      priority?: "high" | "low";
      categoryIdentifier?: string;
      body: string;
    },
    trigger?: Notifications.NotificationTriggerInput | null,
    identifier?: string
  ) => {
    // Second, call the method
    Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: content.title,
        subtitle: content.subtitle,
        body: content.body,
        priority: content.priority,
        categoryIdentifier: content.categoryIdentifier,
      },
      trigger: trigger || null,
    });
  };
}
