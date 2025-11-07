/**
 * History Screen - Transcription Records
 * Revamped with Material Design 3
 */

import React, { useContext, useEffect, useState } from "react";
import { FlatList, Share, StyleSheet, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar, Chip, Menu, Divider, IconButton } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import humanizeDuration from "humanize-duration";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppContext } from "../context/AppContext";
import { useTheme } from "../theme/ThemeContext";
import { Surface, Text, Card, Button } from "../components/themed";

export default function Page() {
  const { theme } = useTheme();
  const { history, setHistory } = useContext(AppContext).history;
  const [filtered, setFiltered] = useState(history);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    setRefresh(!refresh);
  }, [history]);

  useEffect(() => {
    if (history) {
      if (search) {
        setFiltered([
          ...history.filter((v) =>
            search
              .split(" ")
              .map((s) => s.trim())
              .filter(Boolean)
              .some(
                (s) => v.result?.result.includes(s) || v.fileName?.includes(s)
              )
          ),
        ]);
      } else {
        setFiltered([...history]);
      }
      setRefresh(!refresh);
    }
  }, [search, history]);

  const exportToJSON = async () => {
    try {
      const exportData = history?.map(item => ({
        id: item.id,
        date: item.date,
        fileName: item.fileName,
        model: item.model,
        result: item.result?.result,
        shareData: item.shareData,
      }));

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileUri = `${FileSystem.documentDirectory}transcription_history_${Date.now()}.json`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString);
      await Share.share({
        title: 'Export Transcription History',
        message: 'Transcription History (JSON)',
        url: fileUri,
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export history to JSON');
    }
    setMenuVisible(false);
  };

  const exportToTXT = async () => {
    try {
      const textContent = history?.map((item, index) => {
        const timestamp = item.date ? new Date(item.date).toLocaleString() : 'Unknown';
        return `[${index + 1}] ${timestamp}\nModel: ${item.model}\nFile: ${item.fileName || 'Unknown'}\n\n${item.result?.result}\n\n${'='.repeat(50)}\n`;
      }).join('\n');

      const fileUri = `${FileSystem.documentDirectory}transcription_history_${Date.now()}.txt`;

      await FileSystem.writeAsStringAsync(fileUri, textContent || '');
      await Share.share({
        title: 'Export Transcription History',
        message: 'Transcription History (TXT)',
        url: fileUri,
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export history to TXT');
    }
    setMenuVisible(false);
  };

  const clearAllHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all transcription records? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => setHistory([]),
        },
      ]
    );
    setMenuVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with Search and Menu */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search transcriptions..."
          onChangeText={setSearch}
          value={search}
          style={[styles.searchBar, { backgroundColor: theme.colors.surfaceContainer }]}
          iconColor={theme.colors.onSurfaceVariant}
          inputStyle={{ color: theme.colors.onSurface }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              iconColor={theme.colors.onSurface}
              onPress={() => setMenuVisible(true)}
            />
          }
          contentStyle={{ backgroundColor: theme.colors.surface }}
        >
          <Menu.Item
            onPress={exportToJSON}
            title="Export as JSON"
            leadingIcon="code-json"
            titleStyle={{ color: theme.colors.onSurface }}
          />
          <Menu.Item
            onPress={exportToTXT}
            title="Export as TXT"
            leadingIcon="text-box"
            titleStyle={{ color: theme.colors.onSurface }}
          />
          <Divider />
          <Menu.Item
            onPress={clearAllHistory}
            title="Clear All"
            leadingIcon="delete-sweep"
            titleStyle={{ color: theme.colors.error }}
          />
        </Menu>
      </View>

      {/* Stats */}
      {filtered && filtered.length > 0 && (
        <Surface variant="container" style={styles.statsContainer}>
          <Text variant="bodyMedium" color="onSurfaceVariant">
            {filtered.length} {filtered.length === 1 ? 'record' : 'records'} found
          </Text>
        </Surface>
      )}

      {/* History List */}
      {!history ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="history" size={64} color={theme.colors.onSurfaceVariant} />
          <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.loadingText}>
            Loading...
          </Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="history" size={64} color={theme.colors.onSurfaceVariant} />
          <Text variant="titleMedium" color="onSurface" style={styles.emptyTitle}>
            No Transcriptions Yet
          </Text>
          <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.emptySubtitle}>
            Your transcription history will appear here
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={64} color={theme.colors.onSurfaceVariant} />
          <Text variant="titleMedium" color="onSurface" style={styles.emptyTitle}>
            No Results Found
          </Text>
          <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.emptySubtitle}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          extraData={refresh}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + 16 }]}
          renderItem={({ item, index }) =>
            item.pending ? null : (
              <Animated.View entering={FadeInDown.duration(300).delay(index * 50)}>
                <Card variant="elevated" style={styles.historyCard}>
                  {/* Time Badge */}
                  <View style={styles.cardHeader}>
                    <Chip
                      icon="clock-outline"
                      textStyle={{ color: theme.colors.onSurfaceVariant }}
                      style={{ backgroundColor: theme.colors.surfaceContainerHigh }}
                    >
                      {humanizeDuration(
                        new Date().getTime() - item.date?.getTime?.() || 0
                      )
                        .split(",")[0]
                        .replace(/^(\d+)\.\d+ seconds$/, "$1 seconds")} ago
                    </Chip>
                  </View>

                  {/* Metadata Chips */}
                  <View style={styles.chipsContainer}>
                    <Chip
                      icon="brain"
                      textStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 12 }}
                      style={{ backgroundColor: theme.colors.primaryContainer }}
                    >
                      {item.model}
                    </Chip>

                    {item.shareData ? (
                      <Chip
                        icon="share-variant"
                        textStyle={{ color: theme.colors.onTertiaryContainer, fontSize: 12 }}
                        style={{ backgroundColor: theme.colors.tertiaryContainer }}
                      >
                        {item.shareData.replace("content://", "").split("/")[0]}
                      </Chip>
                    ) : (
                      <Chip
                        icon="file-music"
                        textStyle={{ color: theme.colors.onSecondaryContainer, fontSize: 12 }}
                        style={{ backgroundColor: theme.colors.secondaryContainer }}
                        compact
                      >
                        {item.fileName}
                      </Chip>
                    )}
                  </View>

                  {/* Transcription Text */}
                  <Surface variant="containerLowest" style={styles.textContainer}>
                    <Text variant="bodyMedium" color="onSurface" numberOfLines={4}>
                      {item.result?.result}
                    </Text>
                  </Surface>

                  {/* Action Buttons */}
                  <View style={styles.actionRow}>
                    <Button
                      variant="text"
                      size="small"
                      onPress={() => {
                        if (item.result?.result) {
                          Clipboard.setStringAsync(item.result?.result);
                        }
                      }}
                      icon={<Ionicons name="copy-outline" size={16} color={theme.colors.primary} />}
                    >
                      Copy
                    </Button>

                    <Button
                      variant="text"
                      size="small"
                      onPress={() => {
                        if (item.result)
                          Share.share({
                            message: item.result.result,
                          });
                      }}
                      icon={<Ionicons name="share-outline" size={16} color={theme.colors.primary} />}
                    >
                      Share
                    </Button>

                    <Button
                      variant="text"
                      size="small"
                      onPress={() => {
                        Alert.alert(
                          'Delete Record',
                          'Are you sure you want to delete this transcription?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: () => {
                                setHistory([
                                  ...history.filter((record) => record.id !== item.id),
                                ]);
                              },
                            },
                          ]
                        );
                      }}
                      icon={<Ionicons name="trash-outline" size={16} color={theme.colors.error} />}
                      textStyle={{ color: theme.colors.error }}
                    >
                      Delete
                    </Button>
                  </View>
                </Card>
              </Animated.View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    elevation: 0,
  },
  statsContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  emptyTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  historyCard: {
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  textContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
});
