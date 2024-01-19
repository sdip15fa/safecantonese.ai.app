import { useContext, useEffect, useState } from "react";
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
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import IonIcon from "@expo/vector-icons/Ionicons";
import { Share } from "react-native";
import uuid from "react-native-uuid";
import RNFS from "react-native-fs";
import { Tip, showTip } from "react-native-tip";

export default function Page() {
  const { transcribe, result, transcribing, segments, progress, stop } =
    useContext(AppContext).transcribe;
  const { shareIntent } = useContext(AppContext);
  const [lastShareData, setLastShareData] = useState<string | null>(null);
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );
  const [error, setError] = useState<{
    error: string;
    dismissed: boolean;
  } | null>(null);

  useEffect(() => {
    if (
      shareIntent.data &&
      !transcribing &&
      shareIntent.data !== lastShareData &&
      transcribe
    ) {
      setLastShareData(shareIntent.data);
      const filePath = `${RNFS.CachesDirectoryPath}/${uuid.v4()}.${
        shareIntent.mimetype?.split(";")?.[0]?.split("/")?.[1] || "mp3"
      }`;
      RNFS.copyFile(shareIntent.data, filePath).then(() => {
        setFile({
          name: filePath.split("/")[filePath.split("/").length - 1],
          uri: filePath,
        });
        if (shareIntent.data)
          transcribe(filePath, shareIntent.data).catch((err: any) => {
            setError({ error: String(err), dismissed: false });
          });
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
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Tip
            id="help"
            body={`To transcribe, select a file from your device using the "Select File" button, then press the "Transcribe" button. Alternatively, you can share an audio file from any application.`}
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
                <MaterialIcon
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
              <MaterialIcon
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
                }
              });
            }}
            label="Select File"
          />

          {!!file && <Text style={{ margin: 10 }}>File: {file.name}</Text>}
          <Button
            backgroundColor={
              transcribing ? Colors.$iconDanger : Colors.$iconSuccess
            }
            style={{ marginVertical: 10 }}
            disabled={!transcribe || transcribing || !file}
            iconSource={(props) => (
              <MaterialIcon
                name={transcribing ? "stop" : "play-arrow"}
                color={Colors.white}
                size={24}
                style={{ marginRight: 5 }}
                {...props}
              />
            )}
            onPress={() => {
              if (transcribing && stop) {
                return stop();
              }
              if (file?.uri && transcribe) {
                transcribe(file.uri);
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
              {!!result?.result && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    label="Copy"
                    onPress={() => {
                      if (result?.result) {
                        Clipboard.setStringAsync(result?.result);
                      }
                    }}
                    style={{ marginRight: 10 }}
                    iconSource={(props) => (
                      <IonIcon
                        name="copy"
                        style={{ marginRight: 5, color: Colors.white }}
                        size={14}
                        {...props}
                      />
                    )}
                  />
                  <Button
                    label="Share"
                    onPress={() => {
                      Share.share({
                        message: result?.result,
                      });
                    }}
                    iconSource={(props) => (
                      <IonIcon
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
