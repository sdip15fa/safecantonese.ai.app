import { TranscribeFileOptions, initWhisper } from "whisper.rn";
import * as FileSystem from "expo-file-system";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import useModels from "./useModels";
import { useCallback, useState } from "react";

export function useTranscribe() {
  const models = useModels();
  const [segments, setSegMents] = useState([]);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [transcribing, setTranscribing] = useState(false);

  const transcribe = useCallback(
    async (sampleFilePath: string) => {
      console.log("models", models);
      while (!models) {
        (await new Promise((resolve) => setTimeout(resolve, 50))) as any;
      }
      console.log("models", models);
      const model =
        models.find((m) => m.selected) ||
        models.find((m) => m.downloadStatus?.completed);

      if (!model) {
        throw "No model available!";
      }

      const options: TranscribeFileOptions = {
        language: "zh",
        onProgress: (progress: number) => {
          console.log("progress: ", progress);
        },
        onNewSegments: (segment) => {
          console.log("new segment", segment);
        },
      };

      console.log("converting to 16kHz wav");

      const splitFilePath = sampleFilePath.split(".");
      splitFilePath.pop();
      const newFilePath = splitFilePath.join(".") + ".wav";

      console.log("running ffmpeg");
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

      console.log("start init model");
      const whisperContext = await initWhisper({
        filePath: model.downloadStatus?.path,
      });
      console.log("start transcribe");
      const { stop, promise } = whisperContext.transcribe(newFilePath, options);

      const results = await promise;
      console.log("result: ", JSON.stringify(results));

      return results.result;

      // result: (The inference text result from audio file)
    },
    [models]
  );
  return transcribe;
}
