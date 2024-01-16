import { useCallback, useEffect, useState } from "react";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export const ModelsMeta = [
  {
    name: "whisper-small-yue",
    downloadUrl:
      "https://huggingface.co/wcyat/whisper-small-yue/resolve/main/ggml/ggml-model-q5_0.bin?download=true",
    description:
      "Performs well with short audios. Long audios may result in chaotic output. (datasets: common-voice/yue)",
  },
  {
    name: "whisper-small-yue-mdcc",
    downloadUrl:
      "https://huggingface.co/wcyat/whisper-small-yue-mdcc/resolve/main/ggml/ggml-model-q5_0.bin?download=true",
    description:
      "Performs well with short and long audios. May omit punctuations. (datasets: common-voice/yue, mdcc)",
  },
  {
    name: "whisper-small-yue-hk",
    downloadUrl:
      "https://huggingface.co/wcyat/whisper-small-yue-hk-retrained/resolve/main/ggml/ggml-model-q5_0.bin?download=true",
    description:
      "Performs well with short audios. Long audios may result in chaotic output. (datasets: common-voice/yue, common-voice/zh-hk)",
  },
  {
    name: "whisper-small-yue-hk-mdcc",
    downloadUrl:
      "https://huggingface.co/wcyat/whisper-small-yue-hk-mdcc-retrained/resolve/main/ggml/ggml-model-q5_0.bin?download=true",
    description:
      "Performs well with long audios. May omit punctuations. (datasets: common-voice/yue, common-voice/zh-hk, mdcc)",
  },
] as Model[];

export interface Model {
  name: string;
  downloadUrl: string;
  description: string;
  downloadStatus?: {
    completed?: boolean;
    progress?: number;
    downloading?: boolean;
    path?: string;
  };
  selected?: boolean;
  download?: () => Promise<void>;
  delete?: () => Promise<void>;
  select?: () => Promise<void>;
}

export default function useModels() {
  const modelsDir = `${FileSystem.documentDirectory}/models`;

  const [models, setModels] = useState<Model[] | null>(null);

  useEffect(() => {
    (async () => {
      if (!models) {
        const initModels =
          (JSON.parse((await AsyncStorage.getItem("models")) || "null") as
            | Model[]
            | null) || ModelsMeta;
        for (let i = 0; i < initModels.length; i++) {
          if (
            initModels[i].downloadStatus &&
            initModels[i].downloadStatus?.downloading
          ) {
            initModels[i].downloadStatus = {
              ...initModels[i].downloadStatus,
              downloading: false,
              progress: 0,
            };
          }
          const metadata = ModelsMeta.find(
            (v) => v.name === initModels[i].name
          );
          if (metadata) {
            initModels[i] = {
              ...initModels[i],
              description: metadata.description,
              downloadUrl: metadata.downloadUrl
            };
          }
        }

        setModels(initModels);
      }
    })();
  }, []);

  useEffect(() => {
    if (models) {
      let saveModels = [...models];
      saveModels.map((model) => {
        return Object.fromEntries(
          Object.entries(model).filter((v) => typeof v[1] !== "function")
        );
      });
      AsyncStorage.setItem("models", JSON.stringify(saveModels));
    }
  }, [models]);

  useEffect(() => {
    if (
      models &&
      !models.every(
        (model) => model.download && model.delete // && model.select
      )
    ) {
      setModels(addFunctions());
    }
  });

  const addFunctions = useCallback(() => {
    return (
      models?.map((model, index) => {
        model.download = async () => {
          const path =
            model.downloadStatus?.path || `${modelsDir}/${model.name}.bin`;
          const download = FileSystem.createDownloadResumable(
            model.downloadUrl,
            path,
            {},
            (downloadProgressEvent) => {
              const progress =
                downloadProgressEvent.totalBytesWritten /
                downloadProgressEvent.totalBytesExpectedToWrite;
              models[index].downloadStatus = {
                ...models[index].downloadStatus,
                progress,
              };
              setModels([...models]);
            }
          );
          models[index].downloadStatus = {
            ...models[index].downloadStatus,
            downloading: true,
          };
          setModels([...models]);
          await download.downloadAsync();
          models[index].downloadStatus = {
            ...models[index].downloadStatus,
            completed: true,
            path,
            downloading: false,
          };
          if (!models.find((m) => m.selected)) {
            models[index].selected = true;
          }
          setModels([...models]);
        };
        model.delete = async () => {
          if (model.downloadStatus?.path) {
            try {
              await RNFS.unlink(model.downloadStatus?.path);
            } catch {}
            delete models[index].downloadStatus;
            setModels([...models]);
          }
        };
        model.select = async () => {
          for (let i = 0; i < models.length; i++) {
            if (models[i].selected && i !== index) {
              models[i].selected = false;
            }
          }
          models[index].selected = true;
          setModels([...models]);
        };
        return model;
      }) || null
    );
  }, [models]);

  useEffect(() => {
    (async () => {
      if (!(await RNFS.exists(modelsDir))) {
        RNFS.mkdir(modelsDir);
      }
    })();
  });

  return models;
}
