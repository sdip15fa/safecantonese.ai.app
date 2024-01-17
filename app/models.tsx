import React, { useContext } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Card,
  Colors,
  ProgressBar,
  Text,
  View,
} from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../context/AppContext";
import Icon from "@expo/vector-icons/Ionicons";

export default function Models() {
  const { models } = useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ paddingHorizontal: 24 }}>
        {!models ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {models.map((model, index) => {
              return (
                <Card
                  key={index}
                  flex
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
                  <View
                    flex
                    style={{
                      margin: 10,
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    {model.downloadStatus?.completed && (
                      <Button
                        label={model.selected ? "Selected" : "Select"}
                        onPress={model.select}
                        style={{ marginHorizontal: 5 }}
                        disabled={model.selected}
                        iconSource={(props) => (
                          <Icon
                            name="checkmark-circle"
                            style={{ marginRight: 5, color: Colors.white }}
                            size={18}
                            {...props}
                          />
                        )}
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
                        iconSource={(props) => (
                          <Icon
                            name="download"
                            style={{ marginRight: 5, color: Colors.white }}
                            size={18}
                            {...props}
                          />
                        )}
                      />
                    ) : (
                      <Button
                        label="Delete"
                        onPress={model.delete}
                        style={{ marginHorizontal: 5 }}
                        backgroundColor={Colors.$iconDanger}
                        iconSource={(props) => (
                          <Icon
                            name="trash"
                            style={{ marginRight: 5, color: Colors.white }}
                            size={16}
                            {...props}
                          />
                        )}
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
