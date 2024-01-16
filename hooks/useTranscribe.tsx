import {
  TranscribeFileOptions,
  TranscribeNewSegmentsResult,
  TranscribeResult,
  initWhisper,
} from "whisper.rn";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import { useCallback, useContext, useState } from "react";
import { HistoryItem } from "./useHistory";
import uuid from "react-native-uuid";
import { AppContext } from "../context/AppContext";

export function useTranscribe() {
  const { models } = useContext(AppContext);
  const { history, setHistory } = useContext(AppContext).history;
  const [segments, setSegMents] = useState<TranscribeNewSegmentsResult | null>(
    null
  );
  const [result, setResult] = useState<TranscribeResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [transcribing, setTranscribing] = useState(false);

  const transcribe = useCallback(
    async (sampleFilePath: string, shareData?: string) => {
      while (!models || !history) {
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
        throw "No model available! Please download a model in the models tab.";
      }

      const splitFilePath = sampleFilePath.split(".");
      splitFilePath.pop();
      const newFilePath = splitFilePath.join(".") + ".wav";

      try {
        await FFmpegKit.execute(
          `-i ${sampleFilePath} -acodec pcm_s16le -ac 1 -ar 16000 ${newFilePath}`
        );
      } catch {
        throw "ffmpeg failed";
      }

      if (!model.downloadStatus?.path) {
        throw "path undefined";
      }

      const options: TranscribeFileOptions = {
        language: model.en_ok ? "en" : "zh",
        onProgress: (progress: number) => {
          setProgress(progress);
        },
        onNewSegments: (segments) => {
          setSegMents(segments);
        },
      };

      const whisperContext = await initWhisper({
        filePath: model.downloadStatus?.path,
      });

      const recordId = String(uuid.v4());
      const record: HistoryItem = {
        id: recordId,
        sampleFilePath,
        shareData,
        date: new Date(),
        pending: true,
        model: model.name,
      };

      setHistory([record, ...history]);

      const { stop, promise } = whisperContext.transcribe(newFilePath, options);

      const results = await promise;

      setResult(results);
      setTranscribing(false);
      record.pending = false;
      record.result = results;

      // history isn't changed so just do it again
      setHistory([record, ...history]);

      // result: (The inference text result from audio file)
    },
    [models, history, setHistory]
  );
  return {
    transcribe: models && history ? transcribe : null,
    result,
    transcribing,
    setTranscribing,
    segments,
    progress,
  };
}
