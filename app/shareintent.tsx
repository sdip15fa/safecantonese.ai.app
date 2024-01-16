import React, { useEffect, useState } from "react";
import { Colors, ProgressBar, Text } from "react-native-ui-lib";
import { StyleSheet, View } from "react-native";

import { useLocalSearchParams } from "expo-router";
import { useTranscribe } from "../hooks/useTranscribe";
import RNFS from "react-native-fs";
import uuid from "react-native-uuid";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShareIntent() {
  const shareIntent = useLocalSearchParams() as {
    mimetype: string;
    data: string;
  };
  const [oldData, setOldData] = useState<string | undefined>(undefined);
  const {
    transcribe,
    result,
    setTranscribing,
    transcribing,
    segments,
    progress,
  } = useTranscribe();
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (transcribing) {
      return;
    }
    const uri =
      typeof shareIntent.data === "string"
        ? shareIntent.data
        : shareIntent?.data?.[0];
    if (uri && shareIntent?.data !== oldData) {
      setOldData(shareIntent?.data);
      console.log(uri);
      const filePath = `${RNFS.CachesDirectoryPath}/${uuid.v4()}.${
        shareIntent.mimetype?.split(";")?.[0]?.split("/")?.[1] || "mp3"
      }`;
      RNFS.copyFile(uri, filePath).then(() => {
        console.log(filePath);

        transcribe(filePath).catch((err: any) => {
          setError(`Error: ${String(err)}`);
          setTranscribing(false);
        });
      });
    }
  }, [shareIntent, transcribe]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {transcribing && <Text>Transcribing For you...</Text>}
        <ProgressBar progress={progress} progressColor={Colors.purple10} />
        <Text>Transcribed text:</Text>
        <Text>{result?.result || segments?.segments.join("\n") || ""}</Text>
        <Text>{error}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    margin: 10,
    //alignItems: "center",
    //justifyContent: "center",
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
