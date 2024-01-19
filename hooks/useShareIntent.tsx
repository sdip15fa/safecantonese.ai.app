import { useCallback, useEffect, useState } from "react";
import ShareMenu from "react-native-share-menu";

export interface ShareData {
  mimeType: string;
  data: string | string[];
  extraData?: object | undefined;
}

export default function useShareIntent() {
  const [sharedData, setSharedData] = useState<string | null>(null);
  const [sharedMimeType, setSharedMimeType] = useState<string | null>(null);
  const [extraData, setExtraData] = useState<object | undefined>(undefined);

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
        setExtraData(extraData);
      }
      // You can receive extra data from your custom Share View
    }
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
    ShareMenu.addNewShareListener(handleShare);
  }, []);

  return {
    data: sharedData,
    mimetype: sharedMimeType,
    extraData,
  };
}
