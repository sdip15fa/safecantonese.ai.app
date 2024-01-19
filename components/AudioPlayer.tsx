import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Button, Slider, Text, Colors } from "react-native-ui-lib";
import { AVPlaybackStatus, Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

interface AudioPlayerProps {
  audioUri: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUri }) => {
  const sound = useRef<Audio.Sound | null>(null);
  const [isPlaying, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const sliderRef = useRef<Slider>(null);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        if (status.durationMillis) setDuration(status.durationMillis);
      }

      if ("didJustFinish" in status && status.didJustFinish) {
        setPlaying(false);
        sound.current?.stopAsync();
        sliderRef.current?.updateValue(0);
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

  useEffect(() => {
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
    <View flex padding-10>
      <View row centerV>
        <Button
          label={isPlaying ? "Pause" : "Play"}
          onPress={playPause}
          size="large"
          style={{ marginRight: 10 }}
          iconSource={(props) => (
            <MaterialIcons
              name={isPlaying ? "pause" : "play-arrow"}
              color={Colors.white}
              size={24}
              style={{ marginRight: 5 }}
              {...props}
            />
          )}
        />
        <Text text60 dark10>
          {`${Math.floor(position / 1000)}s / ${Math.floor(duration / 1000)}s`}
        </Text>
      </View>
      <Slider
        ref={sliderRef}
        value={position}
        minimumValue={0}
        maximumValue={duration || 1}
        onValueChange={onSliderValueChange}
        containerStyle={{ marginVertical: 10 }}
      />
    </View>
  );
};

export default AudioPlayer;
