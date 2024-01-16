import {
  TranscribeFileOptions,
  TranscribeNewSegmentsResult,
  TranscribeResult,
  initWhisper,
} from "whisper.rn";
import * as FileSystem from "expo-file-system";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import useModels from "./useModels";
import { useCallback, useState } from "react";

export function useTranscribe() {
  const models = useModels();
  const [segments, setSegMents] = useState<TranscribeNewSegmentsResult | null>(
    null
  );
  const [result, setResult] = useState<TranscribeResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [transcribing, setTranscribing] = useState(false);

  const transcribe = useCallback(
    async (sampleFilePath: string) => {
      while (!models) {
        (await new Promise((resolve) => setTimeout(resolve, 50))) as any;
      }

      setSegMents(null);
      setResult(null);
      setProgress(0);
      setTranscribing(true);

      const model =
        models.find((m) => m.selected) ||
        models.find((m) => m.downloadStatus?.completed);

      if (!model) {
        throw "No model available!";
      }

      const splitFilePath = sampleFilePath.split(".");
      splitFilePath.pop();
      const newFilePath = splitFilePath.join(".") + ".wav";

      try {
        await FFmpegKit.execute(
          `-i ${sampleFilePath} -acodec pcm_s16le -ac 1 -ar 16000 ${newFilePath}`
        );
        console.log(
          newFilePath,
          await FileSystem.getInfoAsync(`file://${newFilePath}`)
        );
      } catch {
        throw "ffmpeg failed";
      }

      if (!model.downloadStatus?.path) {
        throw "path undefined";
      }

      const options: TranscribeFileOptions = {
        language: "zh",
        onProgress: (progress: number) => {
          console.log(progress)
          setProgress(progress);
          
        },
        onNewSegments: (segments) => {
          setSegMents(segments);
        },
      };

      const whisperContext = await initWhisper({
        filePath: model.downloadStatus?.path,
      });
      const { stop, promise } = whisperContext.transcribe(newFilePath, options);

      const results = await promise;

      setResult(results);
      setTranscribing(false);

      // result: (The inference text result from audio file)
    },
    [models]
  );
  return { transcribe, result, transcribing, setTranscribing, segments, progress };
}
