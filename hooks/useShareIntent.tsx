import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import Constants from "expo-constants";

import * as ReceiveSharingIntent from "react-native-receive-sharing-intent";

export interface ReceiveIntent {
  weblink: string;
  text: string;
  filePath: string;
  contentUri?: string;
  mimeType: string;
  fileName: string;
}

export type Intent =
  {
      uri: string;
      mimeType: string;
      fileName: string;
    }

export const getShareIntentAsync = async () => {
  return new Promise<Intent | null>((resolve, reject) => {
    ReceiveSharingIntent.default.getReceivedFiles(
      (data: ReceiveIntent[]) => {
        const intent = data[0];
        //if (intent.weblink || intent.text) {
//          const link = intent.weblink || intent.text || "";
  //        console.debug("useShareIntent[text/url]", link);
    //      resolve({ text: JSON.stringify(link) });
        //} else
         if (intent.filePath) {
          console.debug("useShareIntent[file]", {
            uri: intent.contentUri || intent.filePath,
            mimeType: intent.mimeType,
            fileName: intent.fileName,
          });
          resolve({
            uri: intent.contentUri || intent.filePath,
            mimeType: intent.mimeType,
            fileName: intent.fileName,
          });
        } else {
          console.warn("useShareIntent[get] share type not handled", data);
          reject(null);
        }
      },
      (err: Error) => {
        console.error("useShareIntent[get] error", err);
        reject(null);
      },
      Constants.expoConfig?.scheme as string | undefined
    );
  });
};

export const clearShareIntent = () => {
  ReceiveSharingIntent.default?.clearReceivedFiles();
};

export default function useShareIntent() {
  const appState = useRef(AppState.currentState);
  const [shareIntent, setShareIntent] = useState<Intent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshShareIntent = () =>
    getShareIntentAsync()
      .then(setShareIntent)
      .catch((err) => setError("shareIntent error"));

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        console.debug("useShareIntent[active] refresh intent");
        refreshShareIntent();
      } else if (
        appState.current === "active" &&
        ["inactive", "background"].includes(nextAppState)
      ) {
        console.debug("useShareIntent[to-background] reset intent");
        setShareIntent(null);
      }

      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    console.debug("useShareIntent[mount]", Constants.expoConfig?.scheme);
    refreshShareIntent();
    return clearShareIntent;
  }, []);

  console.debug("useShareIntent[render]", shareIntent);

  return {
    shareIntent,
    resetShareIntent: () => setShareIntent(null),
    error,
  };
}
