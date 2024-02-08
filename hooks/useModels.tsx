import { useCallback, useEffect, useState } from "react";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { modelPath } from "../utils/models";

export const ModelsMeta = [
  /*{
    name: "whisper-small-yue",
    downloadUrl:
      "https://huggingface.co/wcyat/whisper-small-yue/resolve/main/ggml/ggml-model-q5_0.bin?download=true",
    description:
      "Performs well with short audios. Long audios may result in chaotic output. (datasets: common-voice/yue)",
  },*/
  {
    name: "whisper-small-yue-mdcc",
    downloadUrl:
      "https://huggingface.co/safecantonese/ggml-models/resolve/main/whisper-small-yue-mdcc.bin?download=true",
    description:
      "Performs well with short and long audios. May omit punctuations. (datasets: common-voice/yue, mdcc)",
    downloadStatus: {
      completed: true,
      path: modelPath["whisper-small-yue-mdcc"],
    },
    no_delete: true,
    filter: (text: string) => {
      return text
        .replace(/\(CC字幕製作.*\)/g, "")
        .replace(/by bwd6/g, "")
        .replace(/謝謝大家[收|觀]看.*/g, "")
        .replace(/\(.*\)/g, "")
        .replace(/^拜拜$/, "")
        .replace(/^謝謝$/, "");
    },
  },
  /*{
    name: "whisper-small-yue-hk",
    downloadUrl:
      "https://huggingface.co/safecantonese/ggml-models/resolve/main/whisper-small-yue-hk.bin?download=true",
    description:
      "Performs well with short audios. Long audios may result in chaotic output. (datasets: common-voice/yue, common-voice/zh-hk)",
    downloadStatus: {
      completed: true,
      path: modelPath["whisper-small-yue-hk"],
    },
    no_delete: true,
    filter: (text: string) => {
      return text*/
      //  .replace(/謝謝大家[收|觀]看.*/g, "")
      //  .replace(/謝謝[收|觀]看.*/g, "")
      //  .replace(/你怎麼會這樣做呢\?/g, "")
      //  .replace(/我看你還沒進去嗎\?/g, "")
      //  .replace(/\(.*\)/g, "");
    // },
  // },
  {
    name: "whisper-small-yue-full",
    downloadUrl:
      "https://huggingface.co/safecantonese/ggml-models/resolve/main/whisper-small-yue-full.bin?download=true",
    description:
      "Specialized in transcribing pure Cantonese voice. Voice with English embedded will result in chaotic output. (datasets: common-voice/yue using train,validation,other)",
    downloadStatus: {
      completed: true,
      path: modelPath["whisper-small-yue-full"],
    },
    no_delete: true,
    filter: (text: string) => {
      return text
        .replace(/[多|謝]謝大家[收|觀][看|睇].*/g, "")
        .replace(/[多|謝]謝[收|觀][看|睇].*/g, "")
        .replace(/\(.*\)/g, "");
    },
  },
  {
    name: "whisper-base-yue-hk-mdcc",
    downloadUrl:
      "https://huggingface.co/safecantonese/ggml-models/resolve/main/whisper-base-yue-hk-mdcc.bin?download=true",
    description:
      "Faster at the cost of reduced performance. (datasets: common-voice/yue, common-voice/zh-hk, mdcc)",
    downloadStatus: {
      completed: true,
      path: modelPath["whisper-base-yue-hk-mdcc"],
    },
    no_delete: true,
    filter: (text: string) => {
      return text
        .replace(/你別再問我了.*/g, "")
        .replace(/請問歷史上有否.*/g, "")
        .replace(/請問.*嗎(\?)/g, "")
        .replace(/請問.*呢(\?)/g, "")
        .replace(/請.*吧(\?)/g, "")
        .replace(/\(.*\)/g, "")
        .replace(/^祝$/, "");
      // .replace(/梁國雄議員/g, "");
    },
  },
  /*{
    name: "whisper-base-yue-mdcc",
    downloadUrl:
      "https://huggingface.co/safecantonese/ggml-models/resolve/main/whisper-base-yue-mdcc.bin?download=true",
    description:
      "Faster at the cost of reduced performance. (datasets: common-voice/yue, mdcc)",
    downloadStatus: {
      completed: true,
      path: require("../assets/models/whisper-base-yue-mdcc.bin"),
    },
    no_delete: true,
    filter: (text: string) => {
      return text
        .replace(/請問我一個問題是你做的嗎\?/g, "")
        .replace(/請問我會不會有問題呢\?/g, "")
        .replace(/\(.*\)/g, "");
    },
  },*/
  /*{
    name: "whisper-small-yue-hk-mdcc",
    downloadUrl:
      "https://huggingface.co/safecantonese/ggml-models/resolve/main/whisper-small-yue-hk-mdcc.bin?download=true",
    description:
      "Performs well with long audios. May omit punctuations. (datasets: common-voice/yue, common-voice/zh-hk, mdcc)",
  },*/
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
  no_delete?: boolean;
  selected?: boolean;
  download?: () => Promise<void>;
  delete?: () => Promise<void>;
  select?: () => Promise<void>;
  filter?: (text: string) => string;
}

export default function useModels() {
  const [models, setModels] = useState<Model[] | null>(null);

  useEffect(() => {
    (async () => {
      if (!models) {
        let initModels =
          (JSON.parse((await AsyncStorage.getItem("models")) || "null") as
            | Model[]
            | null) || ModelsMeta;

        initModels = ModelsMeta.map((v) => {
          return {
            ...initModels.find((m) => m.name === v.name),
            ...v,
          };
        });

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
              downloadUrl: metadata.downloadUrl,
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
    if (models && !models.every((model) => model.select)) {
      setModels(addFunctions());
    }
  }, [models]);

  useEffect(() => {
    if (models && !models.find((v) => v.selected)) {
      models.find((v) => v.downloadStatus?.completed)?.select?.();
    }
  }, [models]);

  const addFunctions = useCallback(() => {
    return (
      models?.map((model, index) => {
        model.download = async () => {
          const path =
            model.downloadStatus?.path || `models/${model.name}.bin`;
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
        model.delete = model.no_delete
          ? undefined
          : async () => {
              if (model.downloadStatus?.path) {
                try {
                  await RNFS.unlink(model.downloadStatus?.path);
                } catch {}
                delete models[index].downloadStatus;
                delete models[index].selected;
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

  return models;
}
