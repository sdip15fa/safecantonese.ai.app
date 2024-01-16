import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Colors,
  Dialog,
  PanningProvider,
  ProgressBar,
  Text,
} from "react-native-ui-lib";
import { ScrollView, StyleSheet, View } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { useTranscribe } from "../hooks/useTranscribe";
import RNFS from "react-native-fs";
import uuid from "react-native-uuid";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../context/AppContext";

export default function ShareIntent() {
  const { shareIntent } = useContext(AppContext);
  const {
    transcribe,
    result,
    setTranscribing,
    transcribing,
    segments,
    progress,
  } = useTranscribe();
  const [error, setError] = useState<any>();
  const [lastURI, setLastURI] = useState<string>("");

  useEffect(() => {
    if (transcribing || !transcribe) {
      return;
    }
    const uri =
      typeof shareIntent.data === "string"
        ? shareIntent.data
        : shareIntent?.data?.[0];
    if (uri === lastURI) return;
    if (uri) {
      setLastURI(uri);
      const filePath = `${RNFS.CachesDirectoryPath}/${uuid.v4()}.${
        shareIntent.mimetype?.split(";")?.[0]?.split("/")?.[1] || "mp3"
      }`;
      RNFS.copyFile(uri, filePath).then(() => {
        transcribe(filePath, uri).catch((err: any) => {
          setError(`Error: ${String(err)}`);
          setTranscribing(false);
        });
      });
    }
  }, [shareIntent, transcribe]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {transcribing && (
          <Text style={{ margin: 10 }}>
            Transcribing For you. This may take a while...
          </Text>
        )}
        <Text style={{ margin: 10 }}>Progress: {progress}%</Text>
        <ProgressBar
          style={{ margin: 10 }}
          progress={progress}
          progressColor={Colors.purple10}
        />
        <Dialog
          visible={!!error}
          panDirection={PanningProvider.Directions.DOWN}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
            }}
          >
            <Text text60 style={{ margin: 10 }}>
              Error
            </Text>
            <Text text80 style={{ margin: 10 }}>
              {error}
            </Text>
            {typeof error === "string" && error.includes("download") && (
              <Button
                style={{ margin: 10 }}
                onPress={() => {
                  router.push("/models");
                }}
                label="Download"
                fullWidth={false}
              />
            )}
          </View>
        </Dialog>
        <Text style={{ margin: 10 }}>
          {result?.result || segments?.segments.join("\n") || ""}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    margin: 20,
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
