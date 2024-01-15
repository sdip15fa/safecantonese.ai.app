import { initWhisper } from "whisper.rn";
import * as FileSystem from "expo-file-system";
import useModelDownload from "./useDownloadModel";

export function useTranscribe() {
  useModelDownload();
  return async function transcribe(sampleFilePath: string): Promise<string> {
    const filePath = `${FileSystem.documentDirectory}ggml-model-q5_0.bin`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (!fileInfo.exists) {
      throw "Model downloading. Try again later.";
    }

    const options = { language: "zh" };

    const whisperContext = await initWhisper({
      filePath,
    });
    const { stop, promise } = whisperContext.transcribe(
      sampleFilePath,
      options
    );

    const { result } = await promise;

    return result;

    // result: (The inference text result from audio file)
  };
}
