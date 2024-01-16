import { Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-ui-lib";

export default function Page() {
  return (
    <SafeAreaView style={{ flex: 1, margin: 10 }}>
      <ScrollView>
        <Text text40 style={{ margin: 5 }}>
          About
        </Text>
        <Text style={{ margin: 5 }}>
          This app was made with the aim of bring safer AI Cantonese
          transcription to the general public, backed by whisper speech-to-text
          models developed by OpenAI and fine-tuned by wcyat. Your audio files
          are transcribed right in your device without ever leaving it.
        </Text>
        <Text text40 style={{ margin: 5 }}>
          Source Code
        </Text>
        <Text
          style={{ color: "blue", margin: 5 }}
          onPress={() =>
            Linking.openURL("https://gitlab.com/wcyat/safecantonese.ai")
          }
        >
          https://gitlab.com/wcyat/safecantonese.ai
        </Text>
        <Text text40 style={{ margin: 5 }}>License</Text>
        <Text
          style={{ color: "blue", margin: 5 }}
          onPress={() =>
            Linking.openURL("https://gitlab.com/wcyat/safecantonese.ai/-/blob/master/LICENSE.md?ref_type=heads")
          }
        >
          GPL-3.0-or-later
        </Text>
        <Text text40 style={{ margin: 5 }}>
          Privacy Policy
        </Text>
        <Text style={{ margin: 5 }}>
          None of your audio files ever leave your device. We do not host a
          server and do not collect data of any kind. However, Internet
          connection is still required to download the models. When downloading
          the models, your personally identifiable information, such as your IP
          address, may be collected by Hugging Face Inc., where we host our
          models.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
