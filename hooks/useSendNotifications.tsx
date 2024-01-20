import * as Notifications from "expo-notifications";
import { useEffect } from "react";

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
  }, []);

  return (
    content: { title?: string; subtitle?: string; body: string },
    trigger?: Notifications.NotificationTriggerInput | null
  ) => {
    // Second, call the method
    Notifications.scheduleNotificationAsync({
      content: {
        title: content.title,
        subtitle: content.subtitle,
        body: content.body,
      },
      trigger: trigger || null,
    });
  };
}
