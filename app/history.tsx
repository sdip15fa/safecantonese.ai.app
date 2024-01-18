import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Colors, Text, View } from "react-native-ui-lib";
import { FlatList, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import humanizeDuration from "humanize-duration";
import { AppContext } from "../context/AppContext";
import * as Clipboard from "expo-clipboard";
import Icon from "@expo/vector-icons/Ionicons";
import { Searchbar } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function Page() {
  const { history, setHistory } = useContext(AppContext).history;
  const [filtered, setFiltered] = useState(history);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    setRefresh(!refresh);
  }, [history]);

  useEffect(() => {
    if (history) {
      if (search) {
        setFiltered([
          ...history.filter((v) => v.result?.result.includes(search)),
        ]);
      } else {
        setFiltered([...history]);
      }
      setRefresh(!refresh)
    }
  }, [search, history]);

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search here..."
        onChangeText={setSearch}
        value={search}
        style={{ marginHorizontal: 20, marginBottom: 10 }}
      />
      {!history ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filtered}
          extraData={refresh}
          nestedScrollEnabled
          keyExtractor={(item) => item.id}
          style={{ marginBottom: tabBarHeight + 20 }}
          renderItem={({ item }) =>
            item.pending ? (
              <View />
            ) : (
              <Card
                flex
                style={{
                  margin: 8,
                  marginHorizontal: 30,
                }}
                enableBlur
              >
                <Card.Section
                  content={[
                    {
                      text: `${
                        humanizeDuration(
                          new Date().getTime() - item.date?.getTime?.() || 0
                        ).split(",")[0]
                      } ago`,
                      text60: true,
                    },
                  ]}
                  style={{ margin: 10 }}
                />
                <Card.Section
                  content={[
                    {
                      text: `Model: ${item.model}`,
                      text70: true,
                    },
                  ]}
                  style={{ marginHorizontal: 10, marginVertical: 5 }}
                />
                <Card.Section
                  content={[
                    {
                      text: item.result?.result,
                      text70: true,
                    },
                  ]}
                  style={{ marginTop: 5, marginHorizontal: 10 }}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    margin: 10,
                  }}
                >
                  <Button
                    label="Copy"
                    onPress={() => {
                      if (item.result?.result) {
                        Clipboard.setStringAsync(item.result?.result);
                      }
                    }}
                    style={{ marginRight: 10 }}
                    iconSource={(props) => (
                      <Icon
                        name="copy"
                        style={{ marginRight: 5, color: Colors.white }}
                        size={14}
                        {...props}
                      />
                    )}
                  />
                  <Button
                    label="Delete"
                    onPress={() => {
                      setHistory([
                        ...history.filter((record) => record.id !== item.id),
                      ]);
                    }}
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
                </View>
              </Card>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //alignItems: "center",
    //paddingHorizontal: 24,
    //margin: 20,
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
