import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import ShareMenu from "react-native-share-menu";

export interface ShareData {
  mimeType: string;
  data: string | string[];
  extraData?: object | undefined;
}

export default function useShareIntent() {
  const appState = useRef(AppState.currentState);
  const [shareIntent, setShareIntent] = useState<ShareData | null>(null);
  const [sharedData, setSharedData] = useState<string | null>(null);
  const [sharedMimeType, setSharedMimeType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleShare = useCallback((item?: ShareData) => {
    if (!item) {
      return;
    }
    if (item.data !== sharedData) {
      const { mimeType, data, extraData } = item;
      const newData = typeof data === "string" ? data : data[0];

      if (newData !== sharedData) {
        setSharedData(newData);
        setSharedMimeType(mimeType);
      }
      // You can receive extra data from your custom Share View
      console.log(extraData);
    }
  }, []);

  useEffect(() => {
    setInterval(() => {
      ShareMenu.getSharedText(handleShare);
    }, 100);
  });

  return {
    shareIntent: { data: sharedData, mimetype: sharedMimeType },
    resetShareIntent: () => setShareIntent(null),
    error,
  };
}
