/**
 * Models Screen - Whisper Model Management
 * Revamped with Material Design 3
 */

import React, { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar as PaperProgressBar, Chip } from "react-native-paper";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeContext";
import { Surface, Text, Card, Button } from "../components/themed";

export default function Models() {
  const { theme } = useTheme();
  const { models } = useContext(AppContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Surface variant="container" style={styles.headerSection}>
            <MaterialIcons name="memory" size={48} color={theme.colors.primary} />
            <Text variant="headlineSmall" color="onSurface" style={styles.headerTitle}>
              AI Models
            </Text>
            <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.headerSubtitle}>
              Download and manage Whisper transcription models
            </Text>
          </Surface>
        </Animated.View>

        {/* Models List */}
        {!models ? (
          <View style={styles.centerContainer}>
            <MaterialIcons name="downloading" size={64} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.loadingText}>
              Loading models...
            </Text>
          </View>
        ) : (
          <>
            {models.map((model, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.duration(300).delay(100 + index * 100)}
              >
                <Card variant="elevated" style={styles.modelCard}>
                  {/* Model Header */}
                  <View style={styles.modelHeader}>
                    <View style={styles.modelIcon}>
                      <MaterialIcons
                        name="psychology"
                        size={32}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.modelInfo}>
                      <Text variant="titleLarge" color="onSurface">
                        {model.name}
                      </Text>
                      {model.selected && (
                        <Chip
                          icon="check-circle"
                          textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 11 }}
                          style={[styles.selectedChip, { backgroundColor: theme.colors.primaryContainer }]}
                          compact
                        >
                          Active
                        </Chip>
                      )}
                    </View>
                  </View>

                  {/* Model Description */}
                  <Text
                    variant="bodyMedium"
                    color="onSurfaceVariant"
                    style={styles.modelDescription}
                  >
                    {model.description}
                  </Text>

                  {/* Download Progress */}
                  {model.downloadStatus?.downloading && (
                    <Surface variant="containerHigh" style={styles.progressContainer}>
                      <View style={styles.progressHeader}>
                        <Text variant="bodySmall" color="primary">
                          Downloading
                        </Text>
                        <Text variant="bodySmall" color="primary" style={styles.progressPercentage}>
                          {Math.round((model.downloadStatus?.progress || 0) * 100)}%
                        </Text>
                      </View>
                      <PaperProgressBar
                        progress={model.downloadStatus?.progress || 0}
                        color={theme.colors.primary}
                        style={styles.progressBar}
                      />
                    </Surface>
                  )}

                  {/* Model Status */}
                  {model.downloadStatus?.completed && !model.selected && (
                    <Surface variant="containerHigh" style={styles.statusContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={theme.colors.tertiary}
                      />
                      <Text variant="bodySmall" color="onSurfaceVariant" style={styles.statusText}>
                        Downloaded and ready to use
                      </Text>
                    </Surface>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    {model.downloadStatus?.completed && (
                      <Button
                        variant={model.selected ? "tonal" : "filled"}
                        disabled={model.selected}
                        onPress={model.select}
                        icon={
                          <Ionicons
                            name={model.selected ? "checkmark-circle" : "radio-button-off"}
                            size={20}
                            color={
                              model.selected
                                ? theme.colors.onSecondaryContainer
                                : theme.colors.onPrimary
                            }
                          />
                        }
                        style={styles.actionButton}
                      >
                        {model.selected ? "Selected" : "Select"}
                      </Button>
                    )}

                    {!model.downloadStatus?.completed && (
                      <Button
                        variant="filled"
                        disabled={model.downloadStatus?.downloading}
                        loading={model.downloadStatus?.downloading}
                        onPress={async () => {
                          if (model.download) {
                            await model.download();
                          }
                        }}
                        icon={
                          !model.downloadStatus?.downloading ? (
                            <Ionicons
                              name="download-outline"
                              size={20}
                              color={theme.colors.onPrimary}
                            />
                          ) : undefined
                        }
                        style={styles.actionButton}
                      >
                        {model.downloadStatus?.downloading ? "Downloading..." : "Download"}
                      </Button>
                    )}

                    {model.delete && !model.no_delete && !model.selected && (
                      <Button
                        variant="outlined"
                        onPress={model.delete}
                        icon={
                          <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                        }
                        textStyle={{ color: theme.colors.error }}
                        style={[styles.deleteButton, { borderColor: theme.colors.error }]}
                      >
                        Delete
                      </Button>
                    )}
                  </View>
                </Card>
              </Animated.View>
            ))}
          </>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 200,
  },
  loadingText: {
    marginTop: 16,
  },
  modelCard: {
    padding: 20,
    marginBottom: 16,
  },
  modelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modelIcon: {
    marginRight: 16,
  },
  modelInfo: {
    flex: 1,
    gap: 8,
  },
  selectedChip: {
    alignSelf: 'flex-start',
  },
  modelDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressPercentage: {
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
  bottomSpacer: {
    height: 24,
  },
});
