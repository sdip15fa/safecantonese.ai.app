import { createContext, useContext } from "react";
import { HistoryItem } from "../hooks/useHistory";
import { TranscribeNewSegmentsResult, TranscribeResult } from "whisper.rn";
import { Model } from "../hooks/useModels";
import useShareIntent from "../hooks/useShareIntent";
import { RootContext } from "./RootContext";
import { useTranscribe } from "../hooks/useTranscribe";
import useObb, { OBB } from "../hooks/useObb";

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
    data: string | null;
    mimetype: string | null;
    extraData?: object;
  };
  obb: OBB[];
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
  const obb = useObb();
  return (
    <AppContext.Provider
      value={{
        shareIntent,
        models,
        history,
        transcribe,
        obb
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
