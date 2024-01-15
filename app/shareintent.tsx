import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranscribe } from "../hooks/useTranscribe";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";

export default function ShareIntent() {
  const router = useRouter();
  const shareIntent = useLocalSearchParams() as {
    mimetype: string;
    data: string;
  };
  const [transcribeText, setTranscribeText] = useState<string | null>(null);
  const transcribe = useTranscribe();
  const [transcribing, setTranscribing] = useState(true);

  useEffect(() => {
    if (shareIntent.data === "string" || shareIntent.data?.[0] === "string") {
      const uri =
        shareIntent.data === "string" ? shareIntent.data : shareIntent.data[0];
      const uriComponents = uri.split("/");
      const fileNameAndExtension = uriComponents[uriComponents.length - 1];
      const filePath = `${FileSystem.cacheDirectory}/${fileNameAndExtension}`;
      FileSystem.downloadAsync(uri, filePath);
      transcribe(filePath)
        .then((text) => {
          setTranscribeText(text);
          setTranscribing(false);
          Notifications.scheduleNotificationAsync({
            content: {
              title: `Transcription complete!`,
              body: text,
            },
            trigger: null, // Display immediately
          });
        })
        .catch((err: any) => {
          setTranscribeText(`Error: ${String(err)}`);
        });
    }
  });

  return (
    <View style={styles.container}>
      {!shareIntent && <Text>No Share intent detected</Text>}
      {!!shareIntent && (
        <Text style={[styles.gap, { fontSize: 20 }]}>
          Congratz, a share intent value is available
        </Text>
      )}
      {!!shareIntent && (
        <Text style={styles.gap}>{JSON.stringify(shareIntent)}</Text>
      )}
      
      {!!shareIntent && (
        <Button onPress={() => router.replace("/")} title="Go home" />
      )}
      {
        <>
          <Text>Transcribed text:</Text>
          <Text>{transcribeText}</Text>
        </>
      }
      {transcribing && <Text>Transcribing...</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  gap: {
    marginBottom: 20,
  },
});
