import { TranscribeFileOptions, initWhisper } from "whisper.rn";
import * as FileSystem from "expo-file-system";
import useModelDownload from "./useDownloadModel";
import { FFmpegKit } from "ffmpeg-kit-react-native";

export function useTranscribe() {
  useModelDownload();
  return async function transcribe(sampleFilePath: string): Promise<string> {
    const modelPath = `${FileSystem.documentDirectory}ggml-model-q5_0.bin`;
    const modelInfo = await FileSystem.getInfoAsync(modelPath);

    if (!modelInfo.exists) {
      throw "Model downloading. Try again later.";
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
      console.log(newFilePath, await FileSystem.getInfoAsync(`file://${newFilePath}`));
    } catch {
      throw "ffmpeg failed";
    }

    console.log("start init model");
    const whisperContext = await initWhisper({
      filePath: modelPath,
    });
    console.log("start transcribe");
    const { stop, promise } = whisperContext.transcribe(
      newFilePath,
      options
    );

    const results = await promise;
    console.log("result: ", JSON.stringify(results));

    return results.result;

    // result: (The inference text result from audio file)
  };
}
