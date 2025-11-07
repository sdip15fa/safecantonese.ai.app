/**
 * Audio Player Component
 * Revamped with Material Design 3
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { AVPlaybackStatus, Audio } from "expo-av";
import { IconButton } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeContext";
import { Surface, Text } from "./themed";

interface AudioPlayerProps {
  audioUri: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUri }) => {
  const { theme } = useTheme();
  const sound = useRef<Audio.Sound | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        if (status.durationMillis) setDuration(status.durationMillis);
      }

      if ("didJustFinish" in status && status.didJustFinish) {
        setPlaying(false);
        sound.current?.stopAsync();
        setPosition(0);
      }
    },
    [sound.current]
  );

  const playPause = useCallback(async () => {
    if (isPlaying) {
      await sound.current?.pauseAsync();
    } else {
      await sound.current?.playAsync();
    }

    setPlaying(!isPlaying);
  }, [sound.current, isPlaying]);

  const onSliderValueChange = useCallback(
    (value: number) => {
      setPosition(value);
      sound.current?.setPositionAsync(value);
    },
    [sound.current]
  );

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (sound.current) {
      sound.current.stopAsync();
      setPlaying(false);
    }
    const loadAudio = async () => {
      const s = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      sound.current = s.sound;
    };

    loadAudio();
  }, [audioUri]);

  return (
    <Surface variant="containerHigh" style={styles.container}>
      {/* Player Controls */}
      <View style={styles.controlsRow}>
        <IconButton
          icon={isPlaying ? "pause" : "play-arrow"}
          size={32}
          iconColor={theme.colors.primary}
          containerColor={theme.colors.primaryContainer}
          onPress={playPause}
        />

        <View style={styles.timeContainer}>
          <Text variant="bodySmall" color="onSurface" style={styles.timeText}>
            {formatTime(position)}
          </Text>
          <Text variant="bodySmall" color="onSurfaceVariant" style={styles.timeSeparator}>
            /
          </Text>
          <Text variant="bodySmall" color="onSurfaceVariant" style={styles.timeText}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>

      {/* Progress Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          value={position}
          minimumValue={0}
          maximumValue={duration || 1}
          onValueChange={onSliderValueChange}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.surfaceVariant}
          thumbTintColor={theme.colors.primary}
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 4,
  },
  timeText: {
    fontVariant: ['tabular-nums'],
  },
  timeSeparator: {
    marginHorizontal: 4,
  },
  sliderContainer: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default AudioPlayer;
