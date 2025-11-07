/**
 * About Screen - App Information
 * Revamped with Material Design 3
 */

import { Linking, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { List, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from "../theme/ThemeContext";
import { Surface, Text, Card } from "../components/themed";

export default function Page() {
  const { theme } = useTheme();

  const LinkItem = ({ icon, title, description, url }: { icon: string; title: string; description?: string; url: string }) => (
    <>
      <List.Item
        title={title}
        description={description}
        onPress={() => Linking.openURL(url)}
        titleStyle={{ color: theme.colors.primary }}
        descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
        left={(props) => <List.Icon {...props} icon={icon} color={theme.colors.primary} />}
        right={(props) => <List.Icon {...props} icon="open-in-new" color={theme.colors.onSurfaceVariant} />}
      />
      <Divider />
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Surface variant="container" style={styles.headerSection}>
            <MaterialIcons name="info" size={56} color={theme.colors.primary} />
            <Text variant="headlineMedium" color="onSurface" style={styles.headerTitle}>
              Safecantonese.ai
            </Text>
            <Text variant="titleSmall" color="onSurfaceVariant" style={styles.version}>
              Version 1.8.4
            </Text>
          </Surface>
        </Animated.View>

        {/* Description Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Card variant="elevated" style={styles.card}>
            <Text variant="titleMedium" color="onSurface" style={styles.sectionTitle}>
              About This App
            </Text>
            <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.description}>
              This app was made with the aim of bringing safer AI Cantonese transcription to the general public, backed by Whisper speech-to-text models developed by OpenAI and fine-tuned by wcyat. Your audio files are transcribed right in your device without ever leaving it.
            </Text>
          </Card>
        </Animated.View>

        {/* Author & Contact */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Card variant="outlined" style={styles.card}>
            <Text variant="titleMedium" color="primary" style={styles.cardHeader}>
              Author & Contact
            </Text>
            <List.Section>
              <LinkItem
                icon="account"
                title="wcyat"
                description="Developer"
                url="https://wcyat.me"
              />
              <LinkItem
                icon="send"
                title="Telegram Group"
                description="Join the community"
                url="https://t.me/safecantoneseai"
              />
              <LinkItem
                icon="email"
                title="wcyat@wcyat.me"
                description="Email support"
                url="mailto:wcyat@wcyat.me"
              />
            </List.Section>
          </Card>
        </Animated.View>

        {/* Source & Legal */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <Card variant="outlined" style={styles.card}>
            <Text variant="titleMedium" color="primary" style={styles.cardHeader}>
              Source Code & Legal
            </Text>
            <List.Section>
              <LinkItem
                icon="github"
                title="GitHub Repository"
                description="View the source code"
                url="https://github.com/sdip15fa/safecantonese.ai.app"
              />
              <LinkItem
                icon="tag"
                title="Release Notes"
                description="Version 1.8.4"
                url="https://github.com/sdip15fa/safecantonese.ai.app/releases/tag/1.8.4"
              />
              <LinkItem
                icon="license"
                title="License"
                description="GPL-3.0-or-later"
                url="https://github.com/sdip15fa/safecantonese.ai.app/blob/1.8.4/LICENSE.md"
              />
              <LinkItem
                icon="book-open"
                title="Third-party Licenses"
                description="Open source attributions"
                url="https://github.com/sdip15fa/safecantonese.ai.app/blob/1.8.4/third-party-licenses.txt"
              />
              <LinkItem
                icon="shield-check"
                title="Privacy Policy"
                description="How we protect your data"
                url="https://github.com/sdip15fa/safecantonese.ai.app/blob/master/privacy_policy.md"
              />
            </List.Section>
          </Card>
        </Animated.View>

        {/* Attribution */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <Card variant="outlined" style={styles.card}>
            <Text variant="titleMedium" color="primary" style={styles.cardHeader}>
              Attribution
            </Text>
            <List.Section>
              <LinkItem
                icon="image"
                title="App Icon"
                description="Artificial intelligence icons by Eucalyp - Flaticon"
                url="https://www.flaticon.com/free-icons/artificial-intelligence"
              />
            </List.Section>
          </Card>
        </Animated.View>

        {/* Copyright */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)}>
          <Surface variant="containerHigh" style={styles.copyrightCard}>
            <Text variant="bodySmall" color="onSurfaceVariant" style={styles.copyright}>
              Copyright © Wong Chun Yat (wcyat) 2024-present
            </Text>
          </Surface>
        </Animated.View>

        {/* Disclaimer */}
        <Animated.View entering={FadeInDown.duration(400).delay(600)}>
          <Card variant="outlined" style={styles.card}>
            <View style={styles.disclaimerHeader}>
              <MaterialIcons name="warning" size={20} color={theme.colors.error} />
              <Text variant="titleSmall" color="error" style={styles.disclaimerTitle}>
                Disclaimer
              </Text>
            </View>
            <Text variant="bodySmall" color="onSurfaceVariant" style={styles.disclaimerText}>
              THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
            </Text>
            <Text variant="bodySmall" color="onSurfaceVariant" style={styles.disclaimerText}>
              THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU. SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION.
            </Text>
          </Card>
        </Animated.View>

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
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  version: {
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 22,
  },
  cardHeader: {
    marginBottom: 8,
  },
  copyrightCard: {
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  copyright: {
    textAlign: 'center',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  disclaimerTitle: {
    fontWeight: '600',
  },
  disclaimerText: {
    lineHeight: 18,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 24,
  },
});
