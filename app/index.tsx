import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Colors, ProgressBar, Text } from "react-native-ui-lib";
import { AppContext } from "../context/AppContext";
import { ScrollView } from "react-native-gesture-handler";
import * as DocumentPicker from "expo-document-picker";
import Icon from "@expo/vector-icons/MaterialIcons";

export default function Page() {
  const { transcribe, result, transcribing, segments, progress, stop } =
    useContext(AppContext).transcribe;
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 24 }}>
        <Text text30 style={{ margin: 10 }}>
          Transcribe
        </Text>
        <Button
          style={{ margin: 10 }}
          iconSource={(props) => (
            <Icon
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
          style={{ margin: 10 }}
          disabled={!transcribe}
          iconSource={(props) => (
            <Icon
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
