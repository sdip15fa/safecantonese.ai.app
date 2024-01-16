import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Card,
  Colors,
  ProgressBar,
  Text,
  View,
} from "react-native-ui-lib";
import useModels from "../hooks/useModels";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Models() {
  const models = useModels();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {!models ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {models.map((model, index) => {
              return (
                <Card
                  key={index}
                  flex
                  onPress={() => console.log("pressed")}
                  style={{
                    margin: 10,
                  }}
                  enableBlur
                >
                  <Card.Section
                    content={[{ text: model.name, text50: true }]}
                    style={{ marginTop: 10, marginHorizontal: 10 }}
                  />
                  <Card.Section
                    content={[{ text: model.description, text80: true }]}
                    style={{ marginVertical: 5, marginHorizontal: 10 }}
                  />
                  <ProgressBar
                    progress={Math.round(
                      (model.downloadStatus?.progress || 0) * 100
                    )}
                    progressColor={Colors.purple10}
                    style={{ margin: 10, height: 8 }}
                  />
                  <Text style={{ marginHorizontal: 10 }}>
                    {Math.round((model.downloadStatus?.progress || 0) * 100)}%
                  </Text>
                  <View flex style={{ margin: 10, flexDirection: "row" }}>
                    {model.downloadStatus?.completed && (
                      <Button
                        label={model.selected ? "Selected" : "Select"}
                        onPress={model.select}
                        style={{ marginHorizontal: 5 }}
                        disabled={model.selected}
                      />
                    )}
                    {!model.downloadStatus?.completed ? (
                      <Button
                        label={
                          model.downloadStatus?.downloading
                            ? "Downloading..."
                            : "Download"
                        }
                        onPress={async () => {
                          if (model.download) {
                            await model.download();
                          }
                        }}
                        disabled={model.downloadStatus?.downloading}
                        style={{ marginHorizontal: 5 }}
                      />
                    ) : (
                      <Button
                        label="Delete"
                        onPress={model.delete}
                        style={{ marginHorizontal: 5 }}
                      />
                    )}
                  </View>
                </Card>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    //    padding : 24,
    paddingHorizontal: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
