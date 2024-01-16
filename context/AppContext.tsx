import { createContext } from "react";
import { HistoryItem, useHistory } from "../hooks/useHistory";
import { TranscribeNewSegmentsResult, TranscribeResult } from "whisper.rn";
import useModels, { Model } from "../hooks/useModels";
import useShareIntent from "../hooks/useShareIntent";
//import { useTranscribe } from "../hooks/useTranscribe";

interface AppContextInterface {
  history: {
    history: HistoryItem[] | null;
    setHistory: React.Dispatch<React.SetStateAction<HistoryItem[] | null>>;
  };
  /*transcribe: {
    transcribe:
      | ((sampleFilePath: string, shareData?: string) => Promise<void>)
      | null;
    result: TranscribeResult | null;
    transcribing: boolean;
    setTranscribing: React.Dispatch<React.SetStateAction<boolean>>;
    segments: TranscribeNewSegmentsResult | null;
    progress: number;
  };*/
  models: Model[] | null;
  shareIntent: {
    data: string | null;
    mimetype: string | null;
    extraData?: object;
  };
}

export const AppContext = createContext<AppContextInterface>(
  null as unknown as AppContextInterface
);

export default function AppContextProvider(props: {
  children?: React.ReactNode | React.ReactNode[];
}) {
  const shareIntent = useShareIntent();
  const models = useModels();
  //  const transcribe = useTranscribe();
  const history = useHistory();
  return (
    <AppContext.Provider
      value={{
        shareIntent,
        models,
        history,
        //transcribe
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
