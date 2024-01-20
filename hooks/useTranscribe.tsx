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
import { RootContext } from "../context/RootContext";
import RNFS from "react-native-fs";

export function useTranscribe() {
  const { models } = useContext(RootContext);
  const { history, setHistory } = useContext(RootContext).history;
  const [segments, setSegMents] = useState<TranscribeNewSegmentsResult | null>(
    null
  );
  const [result, setResult] = useState<TranscribeResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [stop, setStop] = useState<(() => Promise<void>) | null>(null);

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

      const newFilePath = `${RNFS.CachesDirectoryPath}/${uuid.v4()}.wav`;

      try {
        await FFmpegKit.execute(
          `-i ${sampleFilePath} -af "loudnorm,silenceremove=start_periods=1:start_threshold=-45dB:detection=peak,areverse,silenceremove=start_periods=1:start_threshold=-45dB:detection=peak,areverse" -acodec pcm_s16le -ac 1 -ar 16000 ${newFilePath}`
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
          setProgress(progress);
        },
        onNewSegments: (segments) => {
          segments.segments = segments.segments.map((v) => {
            if (model.filter) {
              v.text = model.filter(v.text);
            }
            return v;
          });
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

      setStop(() => async () => {
        await stop();
        setTranscribing(false);
        setResult(null);
        setSegMents(null);
        setProgress(0);
        setHistory([...history]);
      });

      const results = await promise;
      if (!results.isAborted) {
        if (model.filter) {
          results.segments = results.segments
            .map((v) => {
              if (model.filter) {
                v.text = model.filter(v.text).trim();
              }
              return v;
            })
            .filter(Boolean);
        }
        results.result = results.segments.map((v) => v.text).join("\n");
        setResult(results);
        setTranscribing(false);
        record.pending = false;
        record.result = results;

        // history isn't changed so just do it again
        setHistory([record, ...history]);
      }

      RNFS.unlink(newFilePath);

      // result: (The inference text result from audio file)
      return results;
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
    stop,
  };
}
