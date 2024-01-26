import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dialog, Text, Colors } from "react-native-ui-lib";
import { View } from "react-native";
import { AppContext } from "../context/AppContext";
import { ProgressBar } from "react-native-paper";
import RNFS from "react-native-fs";

export default function ExtractModelsScreen(props: {
  children?: React.ReactNode;
}) {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const { obb, models } = useContext(AppContext);

  const obbFile = useMemo(
    () =>
      obb.sort(
        (a, b) =>
          Number(b.path.replace(/\D/g, "")) - Number(a.path.replace(/\D/g, ""))
      )[0],
    [obb]
  );

  function startExtraction() {
    if (obbFile?.extract) {
      setExtracting(true);
      setIsDialogVisible(true);
      obbFile.extract();
      setExtracting(false);
      setIsDialogVisible(true);
    }
  }

  useEffect(() => {
    console.log(obbFile)
    if (obbFile && !obbFile.extracted && !extracting && obbFile.extract) {
        console.log("extract (obb)")
      startExtraction();
    }
  }, [obbFile]);

  useEffect(() => {
    if (!extracting && models && obbFile?.extracted) {
      (async () => {
        for (const model of models) {
          if (
            model.downloadStatus?.path &&
            !(await RNFS.exists(`file://${model.downloadStatus?.path}`))
          ) {
            console.log("extract (models)")
            startExtraction();
          }
        }
      })();
    }
  }, [models]);

  if (!obbFile || obbFile.extracted) return props.children;

  return (
    <Dialog
      visible={isDialogVisible}
      onDismiss={() => setIsDialogVisible(false)}
      containerStyle={{ backgroundColor: Colors.white, borderRadius: 20 }}
    >
      <View style={{ margin: 20 }}>
        <Text text40>Extracting models...</Text>
        <ProgressBar
          style={{ marginTop: 10 }}
          indeterminate
          color={Colors.purple10}
        />
      </View>
    </Dialog>
  );
}
