import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import RNFS from "react-native-fs";
import { unzip } from "react-native-zip-archive";
import VersionCheck from "react-native-version-check";
import { modelsDir } from "./useModels";

export interface OBB {
  path: string;
  extracted: boolean;
  extract?: () => Promise<void>;
}

export default function useObb() {
  const [obb, setObb] = useState<OBB[]>([]);

  useEffect(() => {
    const fetchObbFiles = async () => {
      try {
        const obbDirectory =
          RNFS.ExternalStorageDirectoryPath +
          "/Android/obb/" +
          VersionCheck.getPackageName() +
          "/";

        const files = await RNFS.readdir(`file://${obbDirectory}`);
        const obbFiles = files
          .filter((file) => file.endsWith(".obb"))
          .map((file) => obbDirectory + file);
        const obb: OBB[] = JSON.parse(
          (await AsyncStorage.getItem("obb")) || "[]"
        );

        setObb(
          obbFiles.map((file) => ({
            path: file,
            extracted: obb.find((v) => v.path === file)?.extracted || false,
            extract: async () => {
              if (!(await RNFS.exists(modelsDir))) {
                RNFS.mkdir(modelsDir);
              }
              await unzip(file, modelsDir);
              setObb(
                obb.map((v) => {
                  if (v.path === file) {
                    v.extracted = true;
                  } else {
                    v.extracted = false;
                  }
                  return v;
                })
              );
            },
          }))
        );
      } catch (err) {}
    };

    fetchObbFiles();
  }, []);

  useEffect(() => {
    if (obb.length)
      AsyncStorage.setItem(
        "obb",
        JSON.stringify(
          obb.map((v) => {
            delete v.extract;
            return v;
          })
        )
      );
  }, [obb]);

  return obb;
}
