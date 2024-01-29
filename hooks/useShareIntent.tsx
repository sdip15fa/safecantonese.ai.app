import { useCallback, useEffect, useState } from "react";
import ShareMenu from "react-native-share-menu";

export interface ShareIntent {
  mimeType: string;
  data: string;
  extraData?: object | undefined;
}

export interface ShareData {
  mimeType: string;
  data: string | string[];
  extraData?: object | undefined;
}


export default function useShareIntent() {
  const [shareIntent, setShareIntent] = useState<ShareIntent | null>(null);

  const handleShare = useCallback(
    (item?: ShareData) => {
      if (!item) {
        return;
      }
      if (item.data !== shareIntent?.data) {
        const { mimeType, data, extraData } = item;
        const newData = typeof data === "string" ? data : data[0];

        if (newData !== shareIntent?.data) {
          setShareIntent({
            data: newData,
            mimeType,
            extraData,
          });
        }
        // You can receive extra data from your custom Share View
      }
    },
    []
  );

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
    ShareMenu.addNewShareListener(handleShare);
  }, []);

  return { shareIntent, setShareIntent };
}
