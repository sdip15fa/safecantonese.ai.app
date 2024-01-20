import React, { useEffect, useState } from "react";
import { Dialog, Button, Text, Colors } from "react-native-ui-lib";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Battery from "expo-battery";
import notifee from "@notifee/react-native";

export default function BatteryOptimizationScreen() {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const checkBatteryOptimization = async () => {
    const isEnabled = await Battery.isBatteryOptimizationEnabledAsync();
    const isPromptRejected = JSON.parse(
      (await AsyncStorage.getItem("disableOptimizationPromptRejected")) ||
        "false"
    );

    if (isEnabled && !isPromptRejected) {
      setIsDialogVisible(true);
    }
  };

  const handleDisableOptimization = () => {
    notifee.openBatteryOptimizationSettings();
    setIsDialogVisible(false);
  };

  const handleRejectPrompt = async () => {
    setIsDialogVisible(false);
    await AsyncStorage.setItem("disableOptimizationPromptRejected", "true");
  };

  useEffect(() => {
    checkBatteryOptimization();
  }, []);

  return (
    <Dialog
      visible={isDialogVisible}
      onDismiss={() => setIsDialogVisible(false)}
      containerStyle={{ backgroundColor: Colors.white, borderRadius: 20 }}
    >
      <View style={{ margin: 20 }}>
        <Text text40>Battery Optimization</Text>
        <Text style={{ marginTop: 5 }}>
          To ensure proper functionality, it's recommended to disable battery
          optimization for this app.
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button
            onPress={handleDisableOptimization}
            label="Disable"
            style={{ margin: 10, marginRight: 8, marginBottom: 0 }}
          />
          <Button
            onPress={handleRejectPrompt}
            label="Cancel"
            style={{ marginTop: 10 }}
          />
        </View>
      </View>
    </Dialog>
  );
}
