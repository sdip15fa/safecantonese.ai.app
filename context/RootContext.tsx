import { createContext } from "react";
import useModels, { Model } from "../hooks/useModels";
import { HistoryItem, useHistory } from "../hooks/useHistory";
import type { NotificationTriggerInput } from "expo-notifications";
import { useSendNotifications } from "../hooks/useSendNotifications";

interface RootContextInterface {
  models: Model[] | null;
  history: {
    history: HistoryItem[] | null;
    setHistory: React.Dispatch<React.SetStateAction<HistoryItem[] | null>>;
  };
  sendNotifications: (
    content: { title?: string; body: string },
    trigger?: NotificationTriggerInput | null
  ) => void;
}

export const RootContext = createContext<RootContextInterface>(
  null as unknown as RootContextInterface
);

export default function RootContextProvider(props: {
  children?: React.ReactNode | React.ReactNode[];
}) {
  const models = useModels();
  const history = useHistory();
  const sendNotifications = useSendNotifications();

  return (
    <RootContext.Provider
      value={{
        models,
        history,
        sendNotifications,
      }}
    >
      {props.children}
    </RootContext.Provider>
  );
}
