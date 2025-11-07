/**
 * Home Screen - Main Transcription Interface
 * Revamped with Material Design 3
 */

import { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, StyleSheet, Share } from "react-native";
import { Portal, Dialog as PaperDialog, IconButton, ProgressBar as PaperProgressBar } from 'react-native-paper';
import { AppContext } from "../context/AppContext";
import * as DocumentPicker from "expo-document-picker";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import RNFS from "react-native-fs";
import { Tip, showTip } from "react-native-tip";
import AudioPlayer from "../components/AudioPlayer";
import { RootContext } from "../context/RootContext";
import { useTheme } from "../theme/ThemeContext";
import { Surface, Text, Card, Button } from "../components/themed";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function Page() {
  const { theme } = useTheme();
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

  const transcribedText = result?.result || segments?.segments
    .map((v) => v.text.trim())
    .filter(Boolean)
    .join("\n");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Error Dialog */}
      <Portal>
        <PaperDialog
          visible={!!(error && !error?.dismissed)}
          onDismiss={() => error && setError({ ...error, dismissed: true })}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <PaperDialog.Icon icon="alert-circle" color={theme.colors.error} />
          <PaperDialog.Title style={{ color: theme.colors.onSurface }}>
            Error
          </PaperDialog.Title>
          <PaperDialog.Content>
            <Text variant="bodyMedium" color="onSurface">
              {error?.error}
            </Text>
          </PaperDialog.Content>
          <PaperDialog.Actions>
            <Button
              variant="text"
              onPress={() => error && setError({ ...error, dismissed: true })}
            >
              Dismiss
            </Button>
          </PaperDialog.Actions>
        </PaperDialog>
      </Portal>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Surface variant="container" style={styles.headerSection}>
            <MaterialIcons
              name="audiotrack"
              size={48}
              color={theme.colors.primary}
            />
            <Text variant="headlineSmall" color="onSurface" style={styles.headerTitle}>
              Cantonese Transcription
            </Text>
            <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.headerSubtitle}>
              Privacy-focused on-device speech-to-text
            </Text>
          </Surface>
        </Animated.View>

        {/* Help Tip */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Tip
            id="help"
            body={`To transcribe, select a file from your device using the "Select File" button, then press the "Transcribe" button. Alternatively, you can share an audio file from any application.

Note that transcribing may take a long time. You can try switching to a faster model in the models tab.

There is currently no way to stop the transcription. You can close and re-open the app instead.

Once the "Transcribing..." notification appears, you are free to exit the app and wait for your audio to be transcribed. (DO NOT kill the app)`}
            showItemPulseAnimation={false}
          >
            <Button
              variant="outlined"
              size="small"
              onPress={() => showTip("help")}
              style={styles.helpButton}
              icon={<MaterialIcons name="help-outline" size={18} color={theme.colors.primary} />}
            >
              Help
            </Button>
          </Tip>
        </Animated.View>

        {/* File Selection Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Card variant="elevated" style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="folder-open" size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" color="onSurface" style={styles.cardTitle}>
                Select Audio File
              </Text>
            </View>

            <Button
              variant="filled"
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
              icon={<MaterialIcons name="upload-file" size={20} color={theme.colors.onPrimary} />}
              style={styles.button}
            >
              Choose File
            </Button>

            {file && (
              <Surface variant="containerHigh" style={styles.fileInfo}>
                <Ionicons name="musical-notes" size={20} color={theme.colors.primary} />
                <Text variant="bodyMedium" color="onSurface" style={styles.fileName}>
                  {file.name}
                </Text>
              </Surface>
            )}

            {file?.uri && (
              <View style={styles.audioPlayerContainer}>
                <AudioPlayer audioUri={file.uri} />
              </View>
            )}
          </Card>
        </Animated.View>

        {/* Transcribe Button */}
        {file && (
          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <Button
              variant={transcribing ? "tonal" : "filled"}
              size="large"
              disabled={!transcribe || transcribing || !file}
              loading={transcribing}
              onPress={() => {
                if (transcribing && stop) {
                  return stop();
                }
                if (file?.uri && transcribe) {
                  startTranscribe(file.uri, file.name);
                }
              }}
              icon={
                transcribing ? (
                  <MaterialIcons name="stop" size={24} color={theme.colors.onSecondaryContainer} />
                ) : (
                  <MaterialIcons name="transcribe" size={24} color={theme.colors.onPrimary} />
                )
              }
              style={styles.transcribeButton}
            >
              {transcribing ? "Transcribing..." : "Transcribe"}
            </Button>
          </Animated.View>
        )}

        {/* Progress Section */}
        {(transcribing || typeof result?.result === "string") && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <Card variant="outlined" style={styles.card}>
              <View style={styles.progressHeader}>
                <Text variant="titleMedium" color="primary">
                  Progress
                </Text>
                <Text variant="titleLarge" color="primary" style={styles.progressText}>
                  {progress}%
                </Text>
              </View>

              <PaperProgressBar
                progress={progress / 100}
                color={theme.colors.primary}
                style={styles.progressBar}
              />

              {inBackground && (
                <Surface variant="containerHigh" style={styles.infoBox}>
                  <MaterialIcons
                    name="info-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text variant="bodySmall" color="onSurfaceVariant" style={styles.infoText}>
                    You can now switch to other apps while waiting for the result, but DO NOT close this app.
                  </Text>
                </Surface>
              )}
            </Card>
          </Animated.View>
        )}

        {/* Result Card */}
        {transcribedText && (
          <Animated.View entering={FadeInUp.duration(400).delay(100)}>
            <Card variant="filled" style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="description" size={24} color={theme.colors.primary} />
                <Text variant="titleMedium" color="onSurface" style={styles.cardTitle}>
                  Transcription Result
                </Text>
              </View>

              <Surface variant="containerLowest" style={styles.resultText}>
                <ScrollView style={styles.resultScrollView}>
                  <Text variant="bodyLarge" color="onSurface" selectable>
                    {transcribedText}
                  </Text>
                </ScrollView>
              </Surface>

              <View style={styles.actionButtons}>
                <Button
                  variant="tonal"
                  onPress={() => {
                    if (transcribedText) {
                      Clipboard.setStringAsync(transcribedText);
                    }
                  }}
                  icon={<Ionicons name="copy-outline" size={18} color={theme.colors.onSecondaryContainer} />}
                  style={styles.actionButton}
                >
                  Copy
                </Button>

                <Button
                  variant="tonal"
                  onPress={() => {
                    if (transcribedText) {
                      Share.share({ message: transcribedText });
                    }
                  }}
                  icon={<Ionicons name="share-outline" size={18} color={theme.colors.onSecondaryContainer} />}
                  style={styles.actionButton}
                >
                  Share
                </Button>
              </View>
            </Card>
          </Animated.View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerSection: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    marginTop: 4,
    textAlign: 'center',
  },
  helpButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginLeft: 12,
    flex: 1,
  },
  button: {
    marginBottom: 12,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  fileName: {
    marginLeft: 12,
    flex: 1,
  },
  audioPlayerContainer: {
    marginTop: 16,
  },
  transcribeButton: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  resultText: {
    padding: 16,
    borderRadius: 8,
    maxHeight: 300,
    marginBottom: 16,
  },
  resultScrollView: {
    maxHeight: 268,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  bottomSpacer: {
    height: 24,
  },
});
