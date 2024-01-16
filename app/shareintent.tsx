import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native-ui-lib";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranscribe } from "../hooks/useTranscribe";
import * as Notifications from "expo-notifications";
import RNFS from "react-native-fs";
import uuid from "react-native-uuid";

export default function ShareIntent() {
  const router = useRouter();
  const shareIntent = useLocalSearchParams() as {
    mimetype: string;
    data: string;
  };
  const [transcribeText, setTranscribeText] = useState<string | null>(null);
  const transcribe = useTranscribe();
  const [transcribing, setTranscribing] = useState(false);

  useEffect(() => {
    if (transcribing) {
      return;
    }
    const uri =
      typeof shareIntent.data === "string"
        ? shareIntent.data
        : shareIntent?.data?.[0];
    if (uri !== "") {
      console.log(uri);
      const filePath = `${RNFS.CachesDirectoryPath}/${uuid.v4()}.${
        shareIntent.mimetype?.split(";")?.[0]?.split("/")?.[1] || "mp3"
      }`;
      RNFS.copyFile(uri, filePath).then(() => {
        console.log(filePath);

        setTranscribing(true);
        transcribe(filePath)
          .then((text) => {
            setTranscribeText(text);
            setTranscribing(false);
            Notifications.scheduleNotificationAsync({
              content: {
                title: `${filePath} transcription complete!`,
                body: text,
              },
              trigger: null, // Display immediately
            });
          })
          .catch((err: any) => {
            setTranscribeText(`Error: ${String(err)}`);
            setTranscribing(false);
          });
      });
    }
  }, [shareIntent, transcribe]);

  return (
    <View style={styles.container}>
      {
        <>
          <Text>Transcribed text:</Text>
          <Text>{transcribeText}</Text>
        </>
      }
      {transcribing && <Text>Transcribing...</Text>}

      <Button onPress={() => router.replace("/")} label="Go home" />
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
