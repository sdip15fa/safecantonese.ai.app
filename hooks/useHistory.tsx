import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { TranscribeResult } from "whisper.rn";

export interface HistoryItem {
  id: string;
  sampleFilePath: string;
  shareData?: string;
  date: Date;
  result?: TranscribeResult;
  pending?: boolean;
  model: string;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[] | null>(null);

  useEffect(() => {
    if (history) {
      AsyncStorage.setItem("history", JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    (async () => {
      if (!history) {
        let initHistory = JSON.parse(
          (await AsyncStorage.getItem("history")) || "[]"
        ) as HistoryItem[];
        initHistory = initHistory.filter((v) => !v.pending);
        initHistory = initHistory
          .map((v) => {
            return {
              ...v,
              date: new Date(v.date),
            };
          })
          .sort((a, b) => {
            return b.date.getTime() - a.date.getTime();
          });

        setHistory(initHistory);
      }
    })();
  }, []);

  return { history, setHistory };
}
