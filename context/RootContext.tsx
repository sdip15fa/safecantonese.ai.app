import { createContext } from "react";
import useModels, { Model } from "../hooks/useModels";
import { HistoryItem, useHistory } from "../hooks/useHistory";

interface RootContextInterface {
  models: Model[] | null;
  history: {
    history: HistoryItem[] | null;
    setHistory: React.Dispatch<React.SetStateAction<HistoryItem[] | null>>;
  };
}

export const RootContext = createContext<RootContextInterface>(
  null as unknown as RootContextInterface
);

export default function RootContextProvider(props: {
  children?: React.ReactNode | React.ReactNode[];
}) {
  const models = useModels();
  const history = useHistory();

  return (
    <RootContext.Provider
      value={{
        models,
        history,
      }}
    >
      {props.children}
    </RootContext.Provider>
  );
}
