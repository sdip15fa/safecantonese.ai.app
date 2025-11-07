/**
 * Settings Screen
 * User preferences and app configuration
 */

import React from 'react';
import { ScrollView, StyleSheet, View, Switch } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import { Surface, Text, Card } from '../components/themed';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

  const handleThemeModeChange = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <Surface variant="container" style={styles.headerCard}>
        <Icon name="settings" size={48} color={theme.colors.primary} />
        <Text variant="headlineSmall" color="onSurface" style={styles.headerTitle}>
          Settings
        </Text>
        <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.headerSubtitle}>
          Customize your app experience
        </Text>
      </Surface>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" color="primary" style={styles.sectionTitle}>
          Appearance
        </Text>

        <Card variant="outlined" style={styles.card}>
          <List.Section>
            <List.Subheader style={{ color: theme.colors.onSurfaceVariant }}>
              Theme Mode
            </List.Subheader>

            <List.Item
              title="Light"
              description="Use light theme"
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="white-balance-sunny"
                  color={theme.colors.primary}
                />
              )}
              right={() => (
                <Switch
                  value={themeMode === 'light'}
                  onValueChange={() => handleThemeModeChange('light')}
                  trackColor={{
                    false: theme.colors.surfaceVariant,
                    true: theme.colors.primaryContainer,
                  }}
                  thumbColor={
                    themeMode === 'light'
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
              )}
            />

            <Divider />

            <List.Item
              title="Dark"
              description="Use dark theme"
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="moon-waning-crescent"
                  color={theme.colors.primary}
                />
              )}
              right={() => (
                <Switch
                  value={themeMode === 'dark'}
                  onValueChange={() => handleThemeModeChange('dark')}
                  trackColor={{
                    false: theme.colors.surfaceVariant,
                    true: theme.colors.primaryContainer,
                  }}
                  thumbColor={
                    themeMode === 'dark'
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
              )}
            />

            <Divider />

            <List.Item
              title="System Default"
              description="Follow system theme settings"
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="brightness-auto"
                  color={theme.colors.primary}
                />
              )}
              right={() => (
                <Switch
                  value={themeMode === 'auto'}
                  onValueChange={() => handleThemeModeChange('auto')}
                  trackColor={{
                    false: theme.colors.surfaceVariant,
                    true: theme.colors.primaryContainer,
                  }}
                  thumbColor={
                    themeMode === 'auto'
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
              )}
            />
          </List.Section>
        </Card>
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" color="primary" style={styles.sectionTitle}>
          Privacy
        </Text>

        <Card variant="outlined" style={styles.card}>
          <List.Item
            title="On-device Processing"
            description="All transcriptions are processed locally on your device. Audio files never leave your phone."
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            descriptionNumberOfLines={3}
            left={(props) => (
              <List.Icon
                {...props}
                icon="shield-check"
                color={theme.colors.primary}
              />
            )}
          />
        </Card>
      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" color="primary" style={styles.sectionTitle}>
          Information
        </Text>

        <Card variant="outlined" style={styles.card}>
          <List.Item
            title="App Version"
            description="1.8.4"
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            left={(props) => (
              <List.Icon {...props} icon="information" color={theme.colors.primary} />
            )}
          />
          <Divider />
          <List.Item
            title="License"
            description="GPL-3.0-or-later"
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
            left={(props) => (
              <List.Icon {...props} icon="license" color={theme.colors.primary} />
            )}
          />
        </Card>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  headerCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    overflow: 'hidden',
  },
  bottomSpacer: {
    height: 24,
  },
});
