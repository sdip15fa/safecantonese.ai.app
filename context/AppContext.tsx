import { createContext, useContext } from "react";
import { HistoryItem } from "../hooks/useHistory";
import { TranscribeNewSegmentsResult, TranscribeResult } from "whisper.rn";
import { Model } from "../hooks/useModels";
import useShareIntent, { ShareIntent } from "../hooks/useShareIntent";
import { RootContext } from "./RootContext";
import { useTranscribe } from "../hooks/useTranscribe";

interface AppContextInterface {
  history: {
    history: HistoryItem[] | null;
    setHistory: React.Dispatch<React.SetStateAction<HistoryItem[] | null>>;
  };
  transcribe: {
    transcribe:
      | ((
          sampleFilePath: string,
          fileName?: string,
          shareData?: string
        ) => Promise<TranscribeResult>)
      | null;
    result: TranscribeResult | null;
    transcribing: boolean;
    setTranscribing: React.Dispatch<React.SetStateAction<boolean>>;
    segments: TranscribeNewSegmentsResult | null;
    progress: number;
    stop: (() => Promise<void>) | null;
    inBackground: boolean;
  };
  models: Model[] | null;
  shareIntent: {
    shareIntent: ShareIntent | null;
    setShareIntent: React.Dispatch<React.SetStateAction<ShareIntent | null>>;
  };
}

export const AppContext = createContext<AppContextInterface>(
  null as unknown as AppContextInterface
);

export default function AppContextProvider(props: {
  children?: React.ReactNode | React.ReactNode[];
}) {
  const shareIntent = useShareIntent();
  const { models } = useContext(RootContext);
  const transcribe = useTranscribe();
  const { history } = useContext(RootContext);
  return (
    <AppContext.Provider
      value={{
        shareIntent,
        models,
        history,
        transcribe,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
