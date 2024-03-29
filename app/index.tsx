import { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Card,
  Colors,
  Dialog,
  PanningProvider,
  ProgressBar,
  Text,
  View,
} from "react-native-ui-lib";
import { AppContext } from "../context/AppContext";
import { ScrollView } from "react-native-gesture-handler";
import * as DocumentPicker from "expo-document-picker";
import * as Clipboard from "expo-clipboard";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Share } from "react-native";
import uuid from "react-native-uuid";
import RNFS from "react-native-fs";
import { Tip, showTip } from "react-native-tip";
import AudioPlayer from "../components/AudioPlayer";
import { RootContext } from "../context/RootContext";

export default function Page() {
  const {
    transcribe,
    result,
    transcribing,
    segments,
    progress,
    stop,
    inBackground,
  } = useContext(AppContext).transcribe;
  const { shareIntent, setShareIntent } = useContext(AppContext).shareIntent;
  const { sendNotifications } = useContext(RootContext);
  const [lastShareData, setLastShareData] = useState<string | null>(null);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );
  const [error, setError] = useState<{
    error: string;
    dismissed: boolean;
  } | null>(null);

  const startTranscribe = useCallback(
    (uri: string, fileName?: string, shareData?: string) => {
      if (transcribe)
        transcribe(uri, fileName, shareData)
          .then((result) => {
            if (result?.result && !result.isAborted)
              sendNotifications({
                title: "Transcription completed!",
                body: result.result,
                priority: "high",
                categoryIdentifier: "transcribedText",
              });
          })
          .catch((err: any) => {
            setError({ error: String(err), dismissed: false });
          });
    },
    [transcribe, sendNotifications]
  );

  useEffect(() => {
    if (
      shareIntent &&
      shareIntent.data &&
      !transcribing &&
      shareIntent.data !== lastShareData &&
      transcribe
    ) {
      setLastShareData(shareIntent.data);
      const filePath = `${RNFS.CachesDirectoryPath}/${uuid.v4()}.${
        shareIntent.mimeType?.split(";")?.[0]?.split("/")?.[1] || "mp3"
      }`;
      RNFS.copyFile(shareIntent.data, filePath).then(() => {
        const fileName = filePath.split("/").pop() || "";
        setFile({
          name: fileName,
          uri: filePath,
        });

        startTranscribe(
          filePath,
          fileName || undefined,
          shareIntent.data || undefined
        );

        setShareIntent(null);
        setLastShareData(null);
      });
    }
  }, [transcribe, lastShareData, shareIntent]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Dialog
        visible={!!(error && !error?.dismissed)}
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
            {error?.error}
          </Text>
          <Button
            style={{ margin: 10 }}
            onPress={() => {
              if (error) setError({ ...error, dismissed: true });
            }}
            label="Dismiss"
            fullWidth={false}
          />
        </View>
      </Dialog>
      <ScrollView style={{ paddingHorizontal: 24 }}>
        <View style={{ flex: 1, margin: 5, marginHorizontal: 10 }}>
          <Tip
            id="help"
            body={`To transcribe, select a file from your device using the "Select File" button, then press the "Transcribe" button. Alternatively, you can share an audio file from any application.

Note that transcribing may take a long time. You can try switching to a faster model in the models tab.

There is currently no way to stop the transcription. You can close and re-open the app instead.

Once the "Transcribing..." notification appears, you are free to exit the app and wait for your audio to be transcribed. (DO NOT kill the app)`}
            showItemPulseAnimation={false}
          >
            <Button
              label="Help"
              color={Colors.purple30}
              style={{
                backgroundColor: Colors.transparent,
                borderColor: Colors.purple30,
                borderWidth: 0.5,
                alignSelf: "flex-end",
                marginBottom: 10,
              }}
              onPress={() => showTip("help")}
              text80
              iconSource={(props) => (
                <MaterialIcons
                  name="help"
                  size={22}
                  style={{ marginRight: 3 }}
                  color={Colors.purple30}
                  {...props}
                />
              )}
            />
          </Tip>
          <Button
            style={{ marginVertical: 10 }}
            iconSource={(props) => (
              <MaterialIcons
                name="audiotrack"
                size={22}
                style={{ marginRight: 5 }}
                color={Colors.white}
                {...props}
              />
            )}
            onPress={() => {
              DocumentPicker.getDocumentAsync({
                type: "audio/*",
                copyToCacheDirectory: true,
                multiple: false,
              }).then((result) => {
                if (!result.canceled) {
                  setFile(result.assets[0]);
                  // setLastShareData(null);
                }
              });
            }}
            label="Select File"
          />
          {!!file && <Text style={{ margin: 10 }}>File: {file.name}</Text>}
          {file?.uri && <AudioPlayer audioUri={file.uri} />}
          <Button
            backgroundColor={
              transcribing ? Colors.$iconDanger : Colors.$iconSuccess
            }
            style={{ marginVertical: 10 }}
            disabled={!transcribe || transcribing || !file}
            iconSource={(props) =>
              transcribing ? (
                <MaterialIcons
                  name="stop"
                  color={Colors.white}
                  size={24}
                  style={{ marginRight: 5 }}
                  {...props}
                />
              ) : (
                <Entypo
                  name="text"
                  size={24}
                  color={Colors.white}
                  style={{ marginRight: 5 }}
                  {...props}
                />
              )
            }
            onPress={() => {
              if (transcribing && stop) {
                return stop();
              }
              if (file?.uri && transcribe) {
                startTranscribe(file.uri, file.name);
              }
            }}
            label={transcribing ? "Transcribing..." : "Transcribe"}
          />
          {(transcribing || typeof result?.result === "string") && (
            <>
              <Text style={{ marginHorizontal: 10, marginVertical: 5 }}>
                Progress: {progress}%
              </Text>
              <ProgressBar
                style={{ marginHorizontal: 10, marginVertical: 5 }}
                progress={progress}
                progressColor={Colors.purple10}
              />
              {inBackground && (
                <Text
                  style={{
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}
                >
                  You can now switch to other apps while waiting for the result,
                  but DO NOT close this app.
                </Text>
              )}
              {(result?.result || segments?.segments.length) && (
                <Card style={{ marginVertical: 10 }}>
                  <Card.Section
                    style={{ padding: 10 }}
                    content={[
                      {
                        text:
                          result?.result ||
                          segments?.segments
                            .map((v) => v.text.trim())
                            .filter(Boolean)
                            .join("\n"),
                        text70: true,
                      },
                    ]}
                  />
                </Card>
              )}
              {!!(result?.result || segments?.segments.length) && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Button
                    label="Copy"
                    onPress={() => {
                      if (result?.result) {
                        Clipboard.setStringAsync(result?.result);
                      } else if (segments) {
                        Clipboard.setStringAsync(
                          segments.segments
                            .map((v) => v.text)
                            .filter(Boolean)
                            .join("\n")
                        );
                      }
                    }}
                    style={{ margin: 5 }}
                    iconSource={(props) => (
                      <Ionicons
                        name="copy"
                        style={{ marginRight: 5, color: Colors.white }}
                        size={14}
                        {...props}
                      />
                    )}
                  />
                  <Button
                    label="Share"
                    style={{ margin: 5 }}
                    onPress={() => {
                      if (result?.result) {
                        Share.share({
                          message: result?.result,
                        });
                      } else if (segments) {
                        Share.share({
                          message: segments.segments
                            .map((v) => v.text)
                            .filter(Boolean)
                            .join("\n"),
                        });
                      }
                    }}
                    iconSource={(props) => (
                      <Ionicons
                        name="share"
                        style={{ marginRight: 5, color: Colors.white }}
                        size={14}
                        {...props}
                      />
                    )}
                  />
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
